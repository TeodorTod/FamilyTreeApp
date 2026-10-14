import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateTesting } from '../../../shared/testing/translate-testing.providers';

import { FaqPageComponent } from './faq-page.component';

describe('FaqPageComponent', () => {
  let component: FaqPageComponent;
  let fixture: ComponentFixture<FaqPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqPageComponent],
      providers: [provideTranslateTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
