import React, { useState } from 'react';
import userService from '../../services/userService';

interface ImportUserFormProps {
  onSuccess?: () => void;
}

const ImportUserForm: React.FC<ImportUserFormProps> = ({ onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const res = await userService.downloadTemplate();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'user_import_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Download template failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await userService.importUsers(file);
      setSuccess('Import successful');
      setFile(null);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-2">
        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="bg-gray-100 hover:bg-sky-100 text-sky-600 font-medium px-4 py-2 rounded-lg border border-sky-400 transition-colors"
        >
          Download Template
        </button>
      </div>
      <div>
        <input
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <button
        type="submit"
        disabled={loading || !file}
        className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-60 mt-2"
      >
        {loading ? 'Importing...' : 'Import'}
      </button>
    </form>
  );
};

export default ImportUserForm; 