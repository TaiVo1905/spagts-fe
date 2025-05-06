import React from 'react';
import '../styles/StudentGoal.css';

const StudentGoal: React.FC = () => {
  const lessons = [
    {
      date: '04/04/2025',
      time: 'IT English 2',
      name: 'My Lesson Content',
      email: 'Self Assessment Content',
      description: '01/04/2025',
    },
    {
      date: '04/04/2025',
      time: 'IT English 2',
      name: 'My Lesson Content',
      email: 'Self Assessment Content',
      description: '01/04/2025',
    },
    {
      date: '04/04/2025',
      time: 'IT English 2',
      name: 'My Lesson Content',
      email: 'Self Assessment Content',
      description: '01/04/2025',
    }
  ];

  const headers = ['Date', 'Time', 'Name', 'Email', 'Description'];

  return (
    <div className="table-container">
      <table className="lesson-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className={`col-${index === 0 || index === 1 ? '240' : index === 2 ? '400' : index === 3 ? '300' : '400'}`}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson, index) => (
            <tr key={index}>
              <td className="col-240">{lesson.date}</td>
              <td className="col-240">{lesson.time}</td>
              <td className="col-400">{lesson.name}</td>
              <td className="col-300">{lesson.email}</td>
              <td className="col-400">{lesson.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentGoal;