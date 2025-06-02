
import React, { useState, useEffect } from 'react';
import { Class, User } from '../../interface/Interface';
import userService from '../../services/userService';
import { classService } from '../../services/classService';
import { classUserService } from '../../services/classUserService';

interface AddClassFormProps {
  onSuccess?: () => void;
  isEdit: boolean;
  initialState: Class;
}

const AddClassForm: React.FC<AddClassFormProps> = ({ onSuccess, isEdit = false, initialState }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  useEffect(() => {
    setForm(initialState);
    if (isEdit && initialState.id) {
      fetchClassUsers(initialState.id);
    }
  }, [initialState]);

  const fetchClassUsers = async (classId: number) => {
    try {
      const users = await classUserService.getClassUsers(classId);
      setSelectedUsers(users.data.data.map((user: User) => user.id));
    } catch (err) {
      console.error('Error fetching class users:', err);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getUsers(1, 10000);
        const teacherUsers = response.data.data.filter((user: User) => user.roles === 'Teacher');
        const studentUsers = response.data.data.filter((user: User) => user.roles === 'Student');
        setTeachers(teacherUsers);
        setStudents(studentUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'teacher_id') {
      const selectedTeacher = teachers.find(t => t.id === Number(value));
      if (selectedTeacher) {
        setForm({ ...form, teacher: selectedTeacher });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const handleSubmitClassInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isEdit) {
        await classService.update({
          class_id: form.id,
          teacher_id: form.teacher.id,
          name: form.name
        });
        setStep(2);
      } else {
        // For new class, just proceed to step 2
        setStep(2);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUsers = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let classId = form.id;
      
      // Nếu tạo mới thì tạo lớp trước
      if (!isEdit) {
        const newClass = (await classService.add({
          teacher_id: form.teacher.id,
          name: form.name
        })).data;
        classId = newClass.id;
      }

      // Tách user thành 2 nhóm
      const selectedTeacherIds = teachers
        .filter(t => selectedUsers.includes(t.id))
        .map(t => t.id);
      const selectedStudentIds = students
        .filter(s => selectedUsers.includes(s.id))
        .map(s => s.id);

      // Gọi API đúng chuẩn backend
      await classService.updateClassMembers(classId, {
        student_ids: selectedStudentIds,
        teacher_ids: selectedTeacherIds
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={step === 1 ? handleSubmitClassInfo : handleSubmitUsers} className="space-y-4">
      {step === 1 ? (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Teacher</label>
            <select
              name="teacher_id"
              value={form.teacher?.id || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value="">Select a teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Class Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </>
      ) : (
        <div className="max-h-[60vh] overflow-y-auto">
          <h3 className="font-medium mb-4">Add Users to Class</h3>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">Teachers</h4>
            <div className="space-y-2">
              {teachers.map(teacher => (
                <div key={teacher.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`teacher-${teacher.id}`}
                    checked={selectedUsers.includes(teacher.id)}
                    onChange={() => handleUserSelection(teacher.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`teacher-${teacher.id}`} className="flex items-center">
                    <span className="font-medium">#{teacher.id}</span>
                    <span className="ml-2">{teacher.name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Students</h4>
            <div className="space-y-2">
              {students.map(student => (
                <div key={student.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`student-${student.id}`}
                    checked={selectedUsers.includes(student.id)}
                    onChange={() => handleUserSelection(student.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`student-${student.id}`} className="flex items-center">
                    <span className="font-medium">#{student.id}</span>
                    <span className="ml-2">{student.name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && <div className="text-red-500 text-sm">{error}</div>}
      
      <div className="flex justify-between pt-4">
        {step === 2 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Back
          </button>
        )}
        
        <div className="ml-auto">
          {step === 1 ? (
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Next'}
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Save Class'}
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default AddClassForm;