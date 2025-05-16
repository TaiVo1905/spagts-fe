export interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string;
  roles: 'Admin' | 'Teacher' | 'Student';
}

export interface Class {
  id: number;
  title: string;
  name: string;
  imageUrl: string;
}

export interface Certificate {
  id: number;
  imageUrl: string;
  module: string;
  date: Date;
  description: string;
}