import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordReinitialisationComponent } from './password-reinitialisation.component';
import { LoginService } from '../../shared/login.service';
import { NotificationService } from '../../shared/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('PasswordReinitialisationComponent', () => {
  let component: PasswordReinitialisationComponent;
  let fixture: ComponentFixture<PasswordReinitialisationComponent>;

  let loginService: LoginService
  let notificationService: NotificationService
  let router: Router
  let route: ActivatedRoute

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordReinitialisationComponent],
      providers: [
        LoginService,
        NotificationService,
        Router,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {get: () => "test-token"}
            }
          }
        }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordReinitialisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    loginService = TestBed.inject(LoginService)
    notificationService = TestBed.inject(NotificationService)
    router = TestBed.inject(Router)
    route = TestBed.inject(ActivatedRoute)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
