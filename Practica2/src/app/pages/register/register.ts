import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, ToastModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  providers: [MessageService],
})
export class Register {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private messageService: MessageService, private authService: AuthService) {
    this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],

        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
          ],
        ],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            this.specialCharValidator(),
          ],
        ],

        confirm: ['', Validators.required],

        fullName: ['', Validators.required],

        address: ['', Validators.required],

        dob: ['', [Validators.required, this.ageValidator(18)]],

        phone: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[0-9]{10}$/),
          ],
        ],
      },
      { validators: this.matchPasswords('password', 'confirm') }
    );
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formData = this.registerForm.value;
    const newUser = {
      username: formData.username,
      email: formData.email,
      fullName: formData.fullName,
      address: formData.address,
      dob: formData.dob,
      phone: formData.phone,
      password: formData.password,
    };

    // Guardar usuario
    this.authService.saveUser(newUser);
    console.log('Usuario registrado:', newUser);
    
    this.messageService.add({
      severity: 'success',
      summary: '¡Éxito!',
      detail: 'Cuenta creada correctamente. Redirigiendo al login...',
      life: 3000,
    });

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  }

  private matchPasswords(password: string, confirm: string): ValidatorFn {
    return (group: AbstractControl) => {
      const pass = group.get(password)?.value;
      const conf = group.get(confirm)?.value;
      return pass === conf ? null : { mismatch: true };
    };
  }

  private specialCharValidator(): ValidatorFn {
    const pattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    return (control: AbstractControl) => {
      if (!control.value) return null;
      return pattern.test(control.value) ? null : { specialChar: true };
    };
  }

  private ageValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return null;

      const dob = new Date(control.value);
      const today = new Date();

      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        age--;
      }

      return age >= minAge ? null : { tooYoung: true };
    };
  }

  // Métodos para restringir entrada solo a números en el campo de teléfono
  onPhoneInput(event: any): void {
    const input = event.target;
    const value = input.value;

    // Remover cualquier caracter que no sea número
    const numericValue = value.replace(/\D/g, '');

    // Limitar a 10 dígitos
    if (numericValue.length > 10) {
      input.value = numericValue.substring(0, 10);
    } else {
      input.value = numericValue;
    }

    // Actualizar el form control
    this.registerForm.get('phone')?.setValue(input.value);
  }

  onPhoneKeyPress(event: KeyboardEvent): void {
    // Permitir teclas de control (backspace, delete, tab, escape, enter, etc.)
    const controlKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ];

    if (controlKeys.includes(event.key)) {
      return;
    }

    // Solo permitir números
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }
}