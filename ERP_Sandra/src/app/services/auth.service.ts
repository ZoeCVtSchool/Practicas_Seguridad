import { Injectable } from '@angular/core';

export interface User {
  username: string;
  email: string;
  fullName: string;
  address: string;
  dob: string;
  phone: string;
  password: string;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  users: User[];
}

export interface Activity {
  id: number;
  name: string;
  completed: boolean;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'abierto' | 'en proceso' | 'pendiente' | 'resuelto' | 'cerrado';
  createdDate: string;
  assignedTo: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USERS_KEY = 'registered_users';
  private readonly GROUPS_KEY = 'groups';
  private readonly ACTIVITIES_KEY = 'activities';
  private readonly CURRENT_USER_KEY = 'current_user';
  private readonly TICKETS_KEY = 'tickets';

  constructor() {}

  // User methods
  saveUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  getUsers(): User[] {
    const data = localStorage.getItem(this.USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  updateUser(email: string, updatedUser: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.email === email);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
  }

  deleteUser(email: string): void {
    const users = this.getUsers().filter(u => u.email !== email);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  validateLogin(email: string, password: string): boolean {
    const users = this.getUsers();
    return users.some((user) => user.email === email && user.password === password);
  }

  getUserByEmail(email: string): User | undefined {
    const users = this.getUsers();
    return users.find((user) => user.email === email);
  }

  setCurrentUser(user: User): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(this.CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // Group methods
  saveGroup(group: Group): void {
    const groups = this.getGroups();
    group.id = groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1;
    groups.push(group);
    localStorage.setItem(this.GROUPS_KEY, JSON.stringify(groups));
  }

  getGroups(): Group[] {
    const data = localStorage.getItem(this.GROUPS_KEY);
    return data ? JSON.parse(data) : [];
  }

  updateGroup(id: number, updatedGroup: Group): void {
    const groups = this.getGroups();
    const index = groups.findIndex(g => g.id === id);
    if (index !== -1) {
      groups[index] = updatedGroup;
      localStorage.setItem(this.GROUPS_KEY, JSON.stringify(groups));
    }
  }

  deleteGroup(id: number): void {
    const groups = this.getGroups().filter(g => g.id !== id);
    localStorage.setItem(this.GROUPS_KEY, JSON.stringify(groups));
  }

  // Activity methods
  getActivities(): Activity[] {
    const data = localStorage.getItem(this.ACTIVITIES_KEY);
    return data ? JSON.parse(data) : [
      { id: 1, name: 'Revisar usuarios', completed: false },
      { id: 2, name: 'Gestionar grupos', completed: false },
      { id: 3, name: 'Actualizar perfil', completed: false },
      { id: 4, name: 'Configurar sistema', completed: false },
    ];
  }

  updateActivity(id: number, completed: boolean): void {
    const activities = this.getActivities();
    const index = activities.findIndex(a => a.id === id);
    if (index !== -1) {
      activities[index].completed = completed;
      localStorage.setItem(this.ACTIVITIES_KEY, JSON.stringify(activities));
    }
  }

  getProgressPercentage(): number {
    const activities = this.getActivities();
    const completed = activities.filter(a => a.completed).length;
    return activities.length > 0 ? Math.round((completed / activities.length) * 100) : 0;
  }

  // Ticket methods
  saveTicket(ticket: Ticket): void {
    const tickets = this.getTickets();
    ticket.id = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1;
    tickets.push(ticket);
    localStorage.setItem(this.TICKETS_KEY, JSON.stringify(tickets));
  }

  getTickets(): Ticket[] {
    const data = localStorage.getItem(this.TICKETS_KEY);
    return data ? JSON.parse(data) : [
      { id: 1, title: 'Configurar base de datos', description: 'Configurar conexión a la BD', status: 'abierto', createdDate: '2025-03-10', assignedTo: 'Admin' },
      { id: 2, title: 'Implementar login', description: 'Sistema de autenticación', status: 'en proceso', createdDate: '2025-03-09', assignedTo: 'Developer' },
      { id: 3, title: 'Crear gestión de usuarios', description: 'Módulo de usuarios', status: 'en proceso', createdDate: '2025-03-08', assignedTo: 'Developer' },
      { id: 4, title: 'Validación de formularios', description: 'Agregar validaciones', status: 'pendiente', createdDate: '2025-03-07', assignedTo: 'QA' },
      { id: 5, title: 'Testing de seguridad', description: 'Pruebas de seguridad', status: 'resuelto', createdDate: '2025-03-05', assignedTo: 'QA' },
      { id: 6, title: 'Documentación API', description: 'Documentar endpoints', status: 'cerrado', createdDate: '2025-03-01', assignedTo: 'Tech Writer' }
    ];
  }

  updateTicket(id: number, updatedTicket: Ticket): void {
    const tickets = this.getTickets();
    const index = tickets.findIndex(t => t.id === id);
    if (index !== -1) {
      tickets[index] = updatedTicket;
      localStorage.setItem(this.TICKETS_KEY, JSON.stringify(tickets));
    }
  }

  deleteTicket(id: number): void {
    const tickets = this.getTickets().filter(t => t.id !== id);
    localStorage.setItem(this.TICKETS_KEY, JSON.stringify(tickets));
  }
}
