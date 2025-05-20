import React, { useState, useEffect } from 'react';
import { Class, User } from '../../interface/Interface';
import userService from '../../services/userService';
import { classService } from '../../services/classService';

interface AddClassFormProps {
  onSuccess?: () => void;
  isEdit: boolean;
  initialState: Class;
}

const AddClassForm: React.FC<AddClassFormProps> = ({ onSuccess, isEdit = false, initialState }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<User[]>([]);

  useEffect(() => {
    setForm(initialState);
  }, [initialState]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await userService.getUsers(1, 10000);
        const teacherUsers = response.data.data.filter((user: User) => user.roles === 'Teacher');
        setTeachers(teacherUsers);
      } catch (err) {
        console.error('Error fetching teachers:', err);
        setError('Failed to load teachers');
      }
    };
    fetchTeachers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'teacher_id') {
      // Tìm object teacher theo id
      const selectedTeacher = teachers.find(t => t.id === Number(value));
      if (selectedTeacher) {
        setForm({ ...form, teacher: selectedTeacher });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      } else {
        await classService.add({
          teacher_id: form.teacher.id,
          name: form.name
        });
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Add class failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-60 mt-2"
      >
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
};

export default AddClassForm;