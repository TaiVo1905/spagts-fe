import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

type Student = {
  id: number;
  name: string;
  avatar: string;
  updatedAt: string;
  status: string;
  overdue: string;
  difficulty: string;
  activityDays: number[];
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Stable":
      return "bg-green-600 text-white";
    case "Warning":
      return "bg-yellow-600 text-white";
    case "At Risk":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-600 text-white";
  }
};

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

const StudentCard: React.FC<Student> = ({
  name,
  avatar,
  updatedAt,
  status,
  overdue,
  difficulty,
  activityDays,
}) => {
  const now = new Date();
  const currentDay = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - currentDay);
  
  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  return (
    <div className="w-[300px] bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-sm font-sans">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={avatar}
            alt="Avatar"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <p className="text-base font-semibold text-black">{name}</p>
            <p className="text-xs text-gray-400 mt-1">Last updated: {updatedAt}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      <div className="mt-4 text-gray-700 space-y-1 text-sm">
        <p>Weekly overdue: <span className="font-semibold">{overdue}</span></p>
        <p>The nearest difficulty: <span className="font-medium">{difficulty}</span></p>
      </div>

      <div className="mt-4 border-t pt-3">
        <p className="font-semibold text-gray-800 mb-1">Activity</p>
        <div className="grid grid-cols-7 text-center text-gray-400 text-xs">
          {daysOfWeek.map((day, index) => (
            <div key={index}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 text-center mt-1 text-sm font-medium">
          {weekDates.map((date, index) => {
            const dayOfMonth = date.getDate();
            const isActiveDay = activityDays.includes(index + 1);
            
            return (
              <div key={index}>
                {isActiveDay ? (
                  <div className="bg-blue-100 text-blue-600 w-6 h-6 mx-auto rounded-full flex items-center justify-center">
                    {dayOfMonth}
                  </div>
                ) : (
                  <div>{dayOfMonth}</div>
                )}
              </div>
            );
          })}
        </div>
        <div className="text-xs text-center text-gray-500 mt-1">
          {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
        </div>
      </div>
    </div>
  );
};

const formatDate = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${day}/${month}`;
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

const StudentCardList: React.FC = () => {
  const { moduleName } = useParams<{ moduleName: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [
          { data: { data: studentsData } },
          { data: { data: selfStudyData } },
          { data: { data: inClassData } },
          { data: { data: activityLogs } }
        ] = await Promise.all([
          axios.get(`/api/v1/users?module=${moduleName}`, {
            params: { roles: 'Student' },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('/api/v1/self-study-plans', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('/api/v1/in-class-plan', {
            params: { module: moduleName },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('/api/v1/activityLog', {
            params: { 
              table_name: ['self_study_plan', 'in_class_plan'],
              per_page: 1000
            },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const processedStudents = studentsData.map((student: any) => {
          const studentSelfStudies = selfStudyData.filter((ss: any) => (ss.student.id === student.id && ss.module.name === moduleName));
          const studentInClasses = inClassData.filter((ic: any) => (ic.student.id === student.id && ic.module.name === moduleName));
          const allRecords = [...studentSelfStudies, ...studentInClasses];
          
          const studentActivityLogs = activityLogs.filter((log: any) => 
            log.user_id === student.id && 
            ['updated', 'created'].includes(log.action) &&
            ['self_study_plan', 'in_class_plan'].includes(log.table_name)
          );

          
          const calculateOverdue = (records: any[], type: string) => {
            return records.filter(record => {
              if (!record.date) return false;
              
              const dueDate = new Date(record.date);
              dueDate.setHours(dueDate.getHours() + 26);
              
              
              const recordLogs = studentActivityLogs.filter(
                (log: any) => log.record_id === record.id && log.table_name === type
              );
              
              
              const hasUpdateBeforeDue = recordLogs.some((log: any) => {
                const logDate = new Date(log.created_at);
                return logDate <= dueDate;
              });
              
              
              const isEmptyRecord = type === 'self_study_plan' 
                ? !record.lesson_learned 
                : !record.lesson_learned;
              
              
              if (!hasUpdateBeforeDue) {
                
                return true;
              } else {
                
                return isEmptyRecord;
              }
            }).length;
          };

          const overdueSelfStudy = calculateOverdue(studentSelfStudies, 'self_study_plan');
          const overdueInClass = calculateOverdue(studentInClasses, 'in_class_plan');
          const overdueTasks = overdueSelfStudy + overdueInClass;
          const totalTasks = studentSelfStudies.length + studentInClasses.length;
          
          
          const overduePercentage = totalTasks > 0 ? (overdueTasks / totalTasks) * 100 : 0;
          let status = "Stable";
          if (overduePercentage > 50) status = "At Risk";
          else if (overduePercentage > 20) status = "Warning";

          
          const activityDays = studentActivityLogs
            .filter((log: any) => new Date(log.created_at) >= startOfWeek)
            .map((log: any) => new Date(log.created_at).getDay() + 1);
          
          const uniqueActivityDays = [...new Set(activityDays)];

          
          let difficulty = "Unknown";
          if (allRecords.length > 0) {
            const latestRecord = allRecords[0];
            difficulty = latestRecord.difficulties || latestRecord.note || "Unknown";
            if (difficulty.length > 20) difficulty = difficulty.substring(0, 20) + '...';
          }
          
          return {
            id: student.id,
            name: student.name,
            avatar: student.imageUrl,
            updatedAt: allRecords.length > 0 ? formatTimeAgo(allRecords[0].updated_at) : 'Never',
            status,
            overdue: `${overdueTasks}/${totalTasks}`,
            difficulty,
            activityDays: uniqueActivityDays,
          };
        });
        
        setStudents(processedStudents);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, [moduleName]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="flex gap-6 p-6 flex-wrap">
      {students.map((student) => (
        <StudentCard key={student.id} {...student} />
      ))}
    </div>
  );
};

export default StudentCardList;