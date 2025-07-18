import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_ANGULAR_IMPORTS } from '../../../shared/imports/shared-angular-imports';
import { SHARED_PRIMENG_IMPORTS } from '../../../shared/imports/shared-primeng-imports';
import { FamilyService } from '../../../core/services/family.service';
import { FamilyStateService } from '../../../core/services/family-state.service';
import { FamilyMember } from '../../../shared/models/family-member.model';
import { Roles } from '../../../shared/enums/roles.enum';
import { Gender } from '../../../shared/enums/gender.enum';
import { CONSTANTS } from '../../../shared/constants/constants';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-owner',
  imports: [...SHARED_ANGULAR_IMPORTS, ...SHARED_PRIMENG_IMPORTS],
  templateUrl: './owner.component.html',
  styleUrl: './owner.component.scss',
})
export class OwnerComponent implements OnInit {
  CONSTANTS = CONSTANTS;
  private familyService = inject(FamilyService);
  private router = inject(Router);
  private familyState = inject(FamilyStateService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  hasExistingRecord = false;
  photoUrl = signal<string | null>(null);
  apiUrl = environment.apiUrl;

  genderOptions = [
    {
      label: this.translate.instant(CONSTANTS.GENDER_MALE),
      value: Gender.MALE,
    },
    {
      label: this.translate.instant(CONSTANTS.GENDER_FEMALE),
      value: Gender.FEMALE,
    },
    {
      label: this.translate.instant(CONSTANTS.GENDER_OTHER),
      value: Gender.OTHER,
    },
  ];

  form = this.familyService.createFamilyMemberForm();

  ngOnInit(): void {
    this.familyService
      .getFamilyMemberByRole(Roles.OWNER)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((self) => {
        if (self) {
          this.hasExistingRecord = true;

          const patchData = {
            ...self,
            dob: self.dob ? new Date(self.dob) : null,
            dod: self.dod ? new Date(self.dod) : null,
          };

          this.form.patchValue(patchData);
          this.photoUrl.set(self.photoUrl || null);
          this.familyState.owner.set(self);
        }
      });
  }

  onPhotoUpload(event: any) {
    const file = event.files[0];
    this.familyService
      .uploadPhoto(file)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.photoUrl.set(res.url);
      });
  }

  next() {
    if (this.form.invalid) return;

    const raw = this.form.value;

    const memberData: FamilyMember = {
      firstName: raw.firstName ?? '',
      middleName: raw.middleName ?? '',
      lastName: raw.lastName ?? '',
      gender: raw.gender ?? '',
      dob: raw.dob instanceof Date ? raw.dob.toISOString() : '',
      dod: raw.dod instanceof Date ? raw.dod.toISOString() : undefined,
      photoUrl: this.photoUrl() ?? '',
      isAlive: true,
      role: Roles.OWNER,
    };

    const save$ = this.hasExistingRecord
      ? this.familyService.updateMemberByRole(Roles.OWNER, memberData)
      : this.familyService.createMemberByRole(Roles.OWNER, memberData);

    save$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.familyState.owner.set(memberData);
      this.router.navigate([CONSTANTS.ROUTES.ONBOARDING.MOTHER]);
    });
  }

  onPhotoClear() {
    this.photoUrl.set(null);
  }
}
