import React, { useEffect, useState } from 'react';
import { User } from '../interface/Interface';
import { classService } from '../services/classService';
import userService from '../services/userService';
import toast from 'react-hot-toast';
import { classUserService } from '../services/classUserService';

interface ClassUsersModalProps {
  classId: number;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ClassUsersModal: React.FC<ClassUsersModalProps> = ({ classId, open, onClose, onSuccess }) => {
  const [students, setStudents] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, classId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [membersResponse, allUsersResponse] = await Promise.all([
        classUserService.getClassUsers(classId),
        userService.getUsers(1, 10000)
      ]);
      
      const allUsers = allUsersResponse.data;
      const allClassUsers = membersResponse.data;
      setStudents(allUsers.filter((user: User) => user.roles === 'Student'));
      setTeachers(allUsers.filter((user: User) => user.roles === 'Teacher'));
      
      setSelectedStudents(allClassUsers.students.map((user: User) => user.id));
      setSelectedTeachers(allClassUsers.teachers.map((user: User) => user.id));
    } catch (err: any) {
      toast.error(err.message || 'Không thể tải danh sách người dùng');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentToggle = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const handleTeacherToggle = (teacherId: number) => {
    setSelectedTeachers(prev => 
      prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId) 
        : [...prev, teacherId]
    );
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (selectedStudents.length === 0 || selectedTeachers.length === 0) {
        toast.error('Vui lòng chọn ít nhất một học sinh và một giáo viên');
        return;
      }

      await classUserService.addUsersToClass(classId, {
         ...selectedStudents, ...selectedTeachers
      });

      toast.success('Cập nhật thành viên lớp học thành công');
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Quản lý thành viên lớp học</h2>
        </div>
        
        <div className="p-4">
          {loading && !students.length && !teachers.length ? (
            <p>Đang tải...</p>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="font-medium mb-2">Giáo viên</h3>
                {teachers.map((teacher: User) => (
                  <div key={teacher.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={selectedTeachers.includes(teacher.id)}
                      onChange={() => handleTeacherToggle(teacher.id)}
                      className="mr-2"
                    />
                    <span>{teacher.name}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">Học sinh</h3>
                {students.map((student: User) => (
                  <div key={student.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleStudentToggle(student.id)}
                      className="mr-2"
                    />
                    <span>{student.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassUsersModal;