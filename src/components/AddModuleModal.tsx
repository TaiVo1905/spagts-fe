import React, { useState, useEffect } from 'react';
import moduleService from '../services/moduleService';
import {classService} from '../services/classService';
import { Class } from '../interface/Interface';
import { useAuth } from '../store/AuthContext';
import axiosClient from '../services/axiosClient';
import { database } from '../services/firebaseService';
import { ref, set } from 'firebase/database';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubjectAdded: () => void;
}

const AddModuleModal: React.FC<Props> = ({ isOpen, onClose, onSubjectAdded }) => {
  const [subjectName, setSubjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassIds, setSelectedClassIds] = useState<number[]>([]);
  const [isFetchingClasses, setIsFetchingClasses] = useState(false);
  const [fetchClassesError, setFetchClassesError] = useState<string | null>(null);
  const {user} = useAuth();

  useEffect(() => {
    if (isOpen) {
      const fetchClasses = async () => {
        setIsFetchingClasses(true);
        setFetchClassesError(null);
        try {
          const data = (await classService.getUserClasses(user.id)).data;
          setClasses(data);
        } catch (err) {
          console.error('Failed to fetch classes:', err);
          setFetchClassesError('Failed to load classes.');
        } finally {
          setIsFetchingClasses(false);
        }
      };
      fetchClasses();
    }
  }, [isOpen]);

  const handleClassSelection = (classId: number) => {
    setSelectedClassIds(prevSelectedIds =>
      prevSelectedIds.includes(classId)
        ? prevSelectedIds.filter(id => id !== classId)
        : [...prevSelectedIds, classId]
    );
    console.log(selectedClassIds)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) {
      setError('Subject name cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const newModule = (await moduleService.add({ name: subjectName, teacher_id: user.id })).data;

      if (selectedClassIds.length > 0 && newModule.id) {
        await moduleService.addClassesToModule(newModule.id, selectedClassIds);
        const teacherResponse = await axiosClient.get(`/modules/${newModule.id}/users`, {
                params: { roles: 'Teacher' }
              });
        
              const teachers = teacherResponse.data?.data || [];
              
              // Add teachers to module_teachers reference
              console.log(teachers)
              await Promise.allSettled(
                teachers.map(async (teacher: any) => {
                  if (teacher?.id) {
                    const moduleTeacherRef = ref(database, `module_teachers/${newModule.id}/${teacher.id}`);
                    await set(moduleTeacherRef, true);
                  }
                })
              );
      }

      setSubjectName('');
      setSelectedClassIds([]);
      onSubjectAdded();
      onClose();
    } catch (err) {
      console.error('Failed to add subject or link classes:', err);
      setError('Failed to add subject or link classes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 border-l-4 border-blue-500 pl-2">Add New Subject</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="subjectName" className="block text-gray-700 text-sm font-bold mb-2">Subject name</label>
            <input
              type="text"
              id="subjectName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="e.g. Mathematics, English, Science"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              disabled={isLoading || isFetchingClasses}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Link to Classes (Optional)</label>
            {isFetchingClasses ? (
              <p>Loading classes...</p>
            ) : fetchClassesError ? (
              <p className="text-red-500 text-xs italic">{fetchClassesError}</p>
            ) : (classes.length > 0 ? (
              <div className="border rounded p-2 max-h-40 overflow-y-auto">
                {classes.map(classItem => (
                  <div key={classItem.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`class-${classItem.id}`}
                      checked={selectedClassIds.includes(classItem.id)}
                      onChange={() => handleClassSelection(classItem.id)}
                      className="mr-2 leading-tight"
                      disabled={isLoading}
                    />
                    <label htmlFor={`class-${classItem.id}`} className="text-gray-700 text-sm">
                      {classItem.name}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No classes available.</p>
            ))
            }
          </div>

          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${(isLoading || isFetchingClasses) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading || isFetchingClasses}
            >
              {isLoading ? 'Adding...' : 'Create Subject'}
            </button>
            <button
              type="button"
              className="inline-block align-baseline font-bold text-sm text-gray-500 hover:text-gray-800"
              onClick={onClose}
              disabled={isLoading || isFetchingClasses}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModuleModal; 