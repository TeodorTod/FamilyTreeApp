import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaternalGrandparentsComponent } from './paternal-grandparents.component';
import { provideComponentTesting } from '../../../shared/testing/component-testing.providers';

describe('PaternalGrandparentsComponent', () => {
  let component: PaternalGrandparentsComponent;
  let fixture: ComponentFixture<PaternalGrandparentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaternalGrandparentsComponent],
      providers: provideComponentTesting(),
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaternalGrandparentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
