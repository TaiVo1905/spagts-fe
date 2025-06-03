export interface User {
  id: number;
  name: string;
  email: string;
  imageUrl?: string;
  roles: 'Admin' | 'Teacher' | 'Student';
  created_at?: string;
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

// interface/Interface.ts
export interface Class {
  id: number;
  name: string;
  description?: string;
  teacher: User;
  students: User[];
}

export interface Notification {
  id: string;
  type: 'mention' | 'reply' | 'reaction' | 'deadline';
  message: string;
  title: string;
  data: {
    commentableType?: string;
    commentableId?: number;
    fieldName?: string;
    row?: number;
    commentId?: string;
    replyId?: string;
    record_id?: number;
    table_name?: string;
    due_date?: string;
  };
  read: boolean;
  created_at: string;
}

export interface NotificationBadgeProps {
  count: number;
  onClick: () => void;
}

export interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onNotificationClick: (notification: Notification) => void;
}

export interface InClassPlan {
  id?: number;
  module_id: number;
  date: string;
  lesson_learned: string;
  self_assessment: number;
  difficulties: string;
  plan_to_improve: string;
  problem_solved: boolean;
  student_id: number;
  semester: number;
}