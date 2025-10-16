import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit() {
    this.error = '';
    if (this.form.invalid) return;
    this.loading = true;

    this.auth.login(this.form.value as any).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/orders']); // ruta protegida
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.errors?.credentials?.[0] ?? 'Credenciales inválidas';
      }
    });
  }
}
