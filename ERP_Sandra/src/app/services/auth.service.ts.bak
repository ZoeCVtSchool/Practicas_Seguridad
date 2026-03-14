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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USERS_KEY = 'registered_users';

  constructor() {}

  saveUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  getUsers(): User[] {
    const data = localStorage.getItem(this.USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  validateLogin(email: string, password: string): boolean {
    const users = this.getUsers();
    return users.some((user) => user.email === email && user.password === password);
  }

  getUserByEmail(email: string): User | undefined {
    const users = this.getUsers();
    return users.find((user) => user.email === email);
  }
}
