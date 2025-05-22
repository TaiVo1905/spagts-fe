import React from 'react';

type Student = {
  id: number;
  name: string;
  avatar: string;
  updatedAt: string;
  status: string;
  overdue: string;
  difficulty: string;
  activityDays: number[]; // e.g. [2, 3, 6]
};

const students: Student[] = [
  {
    id: 1,
    name: "Name’s student",
    avatar: "https://i.pinimg.com/736x/31/10/b7/3110b71e8101934deb3e79081adb127d.jpg",
    updatedAt: "1 hour ago",
    status: "Stable",
    overdue: "0/8",
    difficulty: "Intermediate",
    activityDays: [2, 3, 6],
  },
  {
    id: 2,
    name: "Name’s student",
    avatar: "https://i.pinimg.com/736x/19/c5/ed/19c5ed369bd4a0e6c9e9697fa7910641.jpg",
    updatedAt: "3 hours ago",
    status: "Warning",
    overdue: "2/8",
    difficulty: "Advanced",
    activityDays: [3],
  },
  {
    id: 3,
    name: "Name’s student",
    avatar: "https://i.pinimg.com/736x/77/d2/1f/77d21fc5ea3690f5c62a7ddfb3d39c40.jpg",
    updatedAt: "5 hours ago",
    status: "At Risk",
    overdue: "5/8",
    difficulty: "Unknown",
    activityDays: [],
  },
];

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
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
            status
          )}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-4 text-gray-700 space-y-1 text-sm">
        <p>
          Weekly overdue: <span className="font-semibold">{overdue}</span>
        </p>
        <p>
          The nearest difficulty: <span className="font-medium">{difficulty}</span>
        </p>
      </div>

      <div className="mt-4 border-t pt-3">
        <p className="font-semibold text-gray-800 mb-1">Activity</p>
        <div className="grid grid-cols-7 text-center text-gray-400 text-xs">
          {daysOfWeek.map((day, index) => (
            <div key={index}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 text-center mt-1 text-sm font-medium">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div key={day}>
              {activityDays.includes(day) ? (
                <div className="bg-blue-100 text-blue-600 w-6 h-6 mx-auto rounded-full flex items-center justify-center">
                  {day}
                </div>
              ) : (
                <div>{day}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StudentCardList: React.FC = () => {
  return (
    <div className="flex gap-6 p-6">
      {students.map((student) => (
        <StudentCard key={student.id} {...student} />
      ))}
    </div>
  );
};

export default StudentCardList;
