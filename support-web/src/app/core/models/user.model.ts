export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  phone?: string;
  company?: string;
}

export interface IAuthResponse {
  access_token: string;
  user: IUser;
}

export class User implements IUser {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  phone?: string;
  company?: string;

  constructor(data: Partial<IUser> = {}) {
    this._id = data._id || '';
    this.email = data.email || '';
    this.name = data.name || '';
    this.role = data.role || UserRole.USER;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.phone = data.phone;
    this.company = data.company;
  }

  hasRole(role: UserRole): boolean {
    return this.role === role;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  static fromObject (data: any): User {
    return new User({
      _id: data._id || data.id,
      email: data.email,
      name: data.name,
      role: data.role || UserRole.USER,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : undefined,
      phone: data.phone,
      company: data.company
    });
  }

  toJSON(): IUser {
    return {
      _id: this._id,
      email: this.email,
      name: this.name,
      role: this.role,
      isActive: this.isActive,
      ...(this.createdAt && { createdAt: this.createdAt }),
      ...(this.updatedAt && { updatedAt: this.updatedAt }),
      ...(this.phone && { phone: this.phone }),
      ...(this.company && { company: this.company })
    }
  }
}

export type AuthResponse = {
  access_token: string;
  user: User;
}