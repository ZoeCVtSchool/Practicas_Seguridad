import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    CardModule,
    MenuModule,
    ReactiveFormsModule,
    ToastModule
  ],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
  providers: [MessageService],
})
export class UserManagement implements OnInit {
  users: User[] = [];

  // Dialogs
  userDialog: boolean = false;

  // Forms
  userForm: FormGroup;

  // Edit mode
  editingUser: User | null = null;

  // Sidebar
  sidebarVisible: boolean = false;
  menuItems: any[] = [];

  constructor(
    private readonly authService: AuthService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      address: [''],
      dob: [''],
      phone: [''],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.setupMenu();
  }

  loadUsers(): void {
    this.users = this.authService.getUsers();
  }

  setupMenu(): void {
    this.menuItems = [
      {
        label: 'Panel de Control',
        icon: 'pi pi-home',
        command: () => {
          this.router.navigate(['/landing']);
          this.sidebarVisible = false;
        }
      },
      {
        label: 'Gestión',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Panel de Control',
            icon: 'pi pi-home',
            command: () => {
              this.router.navigate(['/landing']);
              this.sidebarVisible = false;
            }
          },
          {
            label: 'Usuarios',
            icon: 'pi pi-users',
            command: () => {
              this.router.navigate(['/user-management']);
              this.sidebarVisible = false;
            }
          },
          {
            label: 'Grupos',
            icon: 'pi pi-sitemap',
            command: () => {
              this.router.navigate(['/group-management']);
              this.sidebarVisible = false;
            }
          }
        ]
      },
      {
        label: 'Perfil',
        icon: 'pi pi-user',
        command: () => {
          this.editProfile();
          this.sidebarVisible = false;
        }
      }
    ];
  }

  // User CRUD
  openNewUser(): void {
    this.editingUser = null;
    this.userForm.reset();
    this.userDialog = true;
  }

  editUser(user: User): void {
    this.editingUser = user;
    this.userForm.patchValue(user);
    this.userDialog = true;
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const userData = this.userForm.value;
    if (this.editingUser) {
      this.authService.updateUser(this.editingUser.email, userData);
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado' });
    } else {
      this.authService.saveUser(userData);
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado' });
    }
    this.userDialog = false;
    this.loadUsers();
  }

  deleteUser(user: User): void {
    this.authService.deleteUser(user.email);
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User deleted' });
    this.loadUsers();
  }

  editProfile(): void {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Profile editing functionality coming soon' });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
