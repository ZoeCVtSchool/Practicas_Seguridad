import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService, Activity, Ticket } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ProgressBarModule,
    CardModule,
    MenubarModule,
    MenuModule,
    TableModule,
    TagModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    ToastModule
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
  providers: [MessageService],
})
export class Landing implements OnInit {
  currentUser: any = null;
  activities: Activity[] = [];
  tickets: Ticket[] = [];
  progressPercentage: number = 0;
  sidebarVisible: boolean = false;

  // profile editing
  profileDialog: boolean = false;
  profileForm: FormGroup;

  menuItems: any[] = [];

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      address: [''],
      dob: [''],
      phone: [''],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadData();
    this.loadProfile();
    this.setupMenu();

    // if we were routed here requesting profile edit
    this.router.routerState.root.queryParams.subscribe(params => {
      if (params['editProfile']) {
        this.editProfile();
      }
    });
  }

  loadData(): void {
    this.activities = this.authService.getActivities();
    this.tickets = this.authService.getTickets();
    this.progressPercentage = this.authService.getProgressPercentage();
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

  // Activities
  toggleActivity(activity: Activity): void {
    this.authService.updateActivity(activity.id, !activity.completed);
    this.loadData();
  }

  editProfile(): void {
    this.profileDialog = true;
  }

  loadProfile(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.profileForm.patchValue(this.currentUser);
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const updated = { ...this.profileForm.value };
    this.authService.updateUser(this.currentUser.email, updated);
    this.authService.setCurrentUser(updated);
    this.currentUser = updated;
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Perfil actualizado' });
    this.profileDialog = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (status) {
      case 'abierto':
        return 'info';
      case 'en proceso':
        return 'warn';
      case 'pendiente':
        return 'secondary';
      case 'resuelto':
        return 'success';
      case 'cerrado':
        return 'danger';
      default:
        return 'info';
    }
  }

  getTicketsByStatus(status: string): number {
    return this.tickets.filter(t => t.status === status).length;
  }

  getTicketsByStatusArray(status: string): any[] {
    return this.tickets.filter(t => t.status === status);
  }

  getTotalTickets(): number {
    return this.tickets.length;
  }
}
