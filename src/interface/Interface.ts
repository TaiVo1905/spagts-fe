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