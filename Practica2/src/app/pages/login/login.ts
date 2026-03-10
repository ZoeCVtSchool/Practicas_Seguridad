import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, ToastModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  providers: [MessageService],
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private readonly fb: FormBuilder, private readonly router: Router, private readonly authService: AuthService, private readonly messageService: MessageService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    console.log('onSubmit called');
    this.errorMessage = null;
    if (this.loginForm.invalid) {
      console.log('Form is invalid');
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;
    console.log('Login attempt:', { username, password });

    // Validar contra usuarios registrados
    const isValid = this.authService.validateLogin(username, password);
    console.log('Validation result:', isValid);

    if (isValid) {
      console.log('Login successful, navigating to landing...');
      this.messageService.add({
        severity: 'success',
        summary: '¡Bienvenido!',
        detail: 'Acceso concedido. Entrando al sistema...',
        life: 2000,
      });

      // Navegar inmediatamente
      this.router.navigate(['/landing']);
    } else {
      console.log('Login failed');
      this.errorMessage = 'Usuario o contraseña incorrectos';
    }
  }
}

