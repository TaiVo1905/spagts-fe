import React, { useEffect, useRef, useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import NotificationBadge from './NotificationBadge';
import NotificationDropdown from './NotificationDropdown';
import { useAuth } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../utils/useRole';
import axiosClient from '../services/axiosClient';

const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { role } = useRole();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll
  } = useNotifications(user?.id ? user.id.toString() : '');

  useEffect(() => {
          const handleClickOutside = (event: MouseEvent) => {
              if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                  setIsOpen(false);
              }
          };
  
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
              document.removeEventListener("mousedown", handleClickOutside);
          };
      }, [dropdownRef]);

  const handleNotificationClick = async (notification: any) => {
    const { commentableType, commentableId, fieldName, row, commentId, replyId } = notification.data;
    
    
    setIsOpen(false);
    
    
    markAsRead(notification.id);

    
    let studentId;
      console.log((commentableType === 'App\\Models\\InClassPlan'))

    if (commentableType === 'App\\Models\\SemesterGoal') {
      studentId = (await axiosClient.get(`semesterGoals/${commentableId}`)).data.data.studentId;
      console.log(1)

    } else if(commentableType === 'App\\Models\\WeeklyGoal') {
        studentId = (await axiosClient.get(`weekly-goals/${commentableId}`)).data.data.student_id;
        console.log(2)

    } else if(commentableType === 'App\\Models\\InClassPlan') {
        studentId = (await axiosClient.get(`in-class-plan/${commentableId}`)).data.data.student.id;
      console.log(3)

    } else if(commentableType === 'App\\Models\\SelfStudyPlan') {
        studentId = (await axiosClient.get(`self-study-plans/${commentableId}`)).data.data.student.id;
    }
    console.log(studentId)
    const basePath = role === 'Teacher' ? `/teacher/student/${studentId}` : '/student';
    
    
    let targetPath = '';
    if (commentableType === 'App\\Models\\SemesterGoal') {
      targetPath = `${basePath}/semester-goal`;
    } else if (commentableType === 'App\\Models\\WeeklyGoal' || commentableType === 'App\\Models\\SelfStudyPlan' || commentableType === 'App\\Models\\InClassPlan') {
      targetPath = `${basePath}/learning-journal/semester${notification.data.semester}`;
    }

    
    const queryParams = new URLSearchParams({
      highlight: 'true',
      field: fieldName,
      row: row.toString(),
      commentId: commentId || '',
      replyId: replyId || ''
    });

    
    navigate(`${targetPath}?${queryParams.toString()}`);
  };

  const handleMarkAsRead = (id: string) => {
    if (id === 'all') {
      markAllAsRead();
    } else {
      markAsRead(id);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <NotificationBadge 
        count={unreadCount} 
        onClick={() => setIsOpen(!isOpen)}
      />
      
      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onClearAll={clearAll}
          onNotificationClick={handleNotificationClick}
        />
      )}
    </div>
  );
};

export default NotificationBell;