import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../features/auth/services/auth.service';
import { SHARED_ANGULAR_IMPORTS } from '../../../shared/imports/shared-angular-imports';
import { SHARED_PRIMENG_IMPORTS } from '../../../shared/imports/shared-primeng-imports';
import { CONSTANTS } from '../../../shared/constants/constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [...SHARED_ANGULAR_IMPORTS, ...SHARED_PRIMENG_IMPORTS],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  CONSTANTS = CONSTANTS;

  private auth = inject(AuthService);
  private router = inject(Router);
  public translate = inject(TranslateService);

  isLoggedIn = this.auth.getTokenSignal();

  private readonly hiddenRoutes = ['/auth/login', '/auth/register'];
  mobileMenuVisible = false;
  showProfileMenu = false;
  shouldShowNavbar(): boolean {
    return !this.hiddenRoutes.includes(this.router.url);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
    this.mobileMenuVisible = false;
  }

  navigate(path: string): void {
    this.router.navigate([path]);
    this.mobileMenuVisible = false;
  }

  settingsItems = [
    {
      label: this.translate.instant(CONSTANTS.AUTH_ACCOUNT_SETTINGS),
      icon: 'pi pi-user-edit',
      command: () => this.router.navigate([CONSTANTS.ROUTES.SETTINGS.ACCOUNT]),
    },
    {
      label: this.translate.instant(CONSTANTS.AUTH_SUBSCRIPTION_SETTINGS),
      icon: 'pi pi-credit-card',
      command: () =>
        this.router.navigate([CONSTANTS.ROUTES.SETTINGS.SUBSCRIPTION]),
    },
    {
      label: this.translate.instant(CONSTANTS.AUTH_PRIVACY_SETTINGS),
      icon: 'pi pi-lock',
      command: () => this.router.navigate([CONSTANTS.ROUTES.SETTINGS.PRIVACY]),
    },
  ];
}
