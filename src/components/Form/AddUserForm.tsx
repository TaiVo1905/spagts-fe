import React, { useState } from 'react';
import userService, { AddUserPayload } from '../../services/userService';

interface AddUserFormProps {
  onSuccess?: () => void;
}

const initialState: AddUserPayload = {
  name: '',
  email: '',
  roles: 'Student',
  password: '',
  password_confirmation: '',
};

const AddUserForm: React.FC<AddUserFormProps> = ({ onSuccess }) => {
  const [form, setForm] = useState<AddUserPayload>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await userService.addUser(form);
      setForm(initialState);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Add user failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Roles</label>
        <select name="roles" value={form.roles} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400">
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
          <option value="Admin">Admin</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Confirm Password</label>
        <input name="password_confirmation" type="password" value={form.password_confirmation} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" disabled={loading} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-60 mt-2">{loading ? 'Saving...' : 'Save'}</button>
    </form>
  );
};

export default AddUserForm; 