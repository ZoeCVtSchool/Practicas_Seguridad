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
import { AuthService, Group } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-group-management',
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
  templateUrl: './group-management.html',
  styleUrl: './group-management.css',
  providers: [MessageService],
})
export class GroupManagement implements OnInit {
  groups: Group[] = [];

  // Dialogs
  groupDialog: boolean = false;

  // Forms
  groupForm: FormGroup;

  // Edit mode
  editingGroup: Group | null = null;

  // Sidebar
  sidebarVisible: boolean = false;
  menuItems: any[] = [];

  constructor(
    private readonly authService: AuthService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadGroups();
    this.setupMenu();
  }

  loadGroups(): void {
    this.groups = this.authService.getGroups();
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

  // Group CRUD
  openNewGroup(): void {
    this.editingGroup = null;
    this.groupForm.reset();
    this.groupDialog = true;
  }

  editGroup(group: Group): void {
    this.editingGroup = group;
    this.groupForm.patchValue(group);
    this.groupDialog = true;
  }

  saveGroup(): void {
    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      return;
    }

    const groupData = this.groupForm.value;
    if (this.editingGroup) {
      groupData.id = this.editingGroup.id;
      groupData.users = this.editingGroup.users;
      this.authService.updateGroup(this.editingGroup.id, groupData);
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Grupo actualizado' });
    } else {
      groupData.users = [];
      this.authService.saveGroup(groupData);
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Grupo creado' });
    }
    this.groupDialog = false;
    this.loadGroups();
  }

  deleteGroup(group: Group): void {
    this.authService.deleteGroup(group.id);
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Group deleted' });
    this.loadGroups();
  }

  editProfile(): void {
    this.router.navigate(['/landing'], { queryParams: { editProfile: true } });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
