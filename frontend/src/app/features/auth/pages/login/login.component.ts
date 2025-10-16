import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { SessionService } from '../../../../core/services/session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly session = inject(SessionService);

  loading = false;
  error = '';
  private subscription?: Subscription;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  ngOnInit(): void {
    if (this.auth.isLogged() && this.session.snapshot) {
      this.router.navigate(['/orders']);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  submit(): void {
    this.error = '';
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/orders';

    this.subscription = this.auth.login(this.form.value as { email: string; password: string }).subscribe({
      next: () => {
        this.loading = false;
        console.log('submit', this.form.value);
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.errors?.credentials?.[0] ?? 'Credenciales invalidas';
      }
    });
  }
}
