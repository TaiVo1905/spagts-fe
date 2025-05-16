export interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string;
  roles: 'Admin' | 'Teacher' | 'Student';
  created_at: string;
}

export interface Class {
  id: number;
  teacher: User;
  name: string;
}

export interface Certificate {
  id: number;
  imageUrl: string;
  module: string;
  date: Date;
  description: string;
}