import React, { useState, useEffect } from 'react';
import moduleService from '../services/moduleService';
import {classService} from '../services/classService';
import { Class } from '../interface/Interface';
import { useAuth } from '../store/AuthContext';
import axiosClient from '../services/axiosClient';
import { database } from '../services/firebaseService';
import { ref, set, remove } from 'firebase/database';
import { Modal, Form, Input, Checkbox, message, Button, Popconfirm } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubjectAdded: () => void;
  moduleToEdit?: {
    id: number;
    name: string;
    classIds: number[];
  };
}

const AddModuleModal: React.FC<Props> = ({ isOpen, onClose, onSubjectAdded, moduleToEdit }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassIds, setSelectedClassIds] = useState<number[]>([]);
  const [isFetchingClasses, setIsFetchingClasses] = useState(false);
  const {user} = useAuth();

  useEffect(() => {
    if (isOpen && user?.id) {
      const fetchClasses = async () => {
        setIsFetchingClasses(true);
        try {
          const data = (await classService.getUserClasses(user.id)).data;
          setClasses(data);
        } catch (err) {
          console.error('Failed to fetch classes:', err);
          message.error('Failed to load classes.');
        } finally {
          setIsFetchingClasses(false);
        }
      };
      fetchClasses();
    }
  }, [isOpen, user?.id]);

  useEffect(() => {
    if (moduleToEdit) {
      form.setFieldsValue({
        subjectName: moduleToEdit.name
      });
      setSelectedClassIds(moduleToEdit.classIds);
    } else {
      form.resetFields();
      setSelectedClassIds([]);
    }
  }, [moduleToEdit, form]);

  const handleClassSelection = (classId: number) => {
    setSelectedClassIds(prevSelectedIds =>
      prevSelectedIds.includes(classId)
        ? prevSelectedIds.filter(id => id !== classId)
        : [...prevSelectedIds, classId]
    );
  };

  const handleSubmit = async (values: { subjectName: string }) => {
    if (!user?.id) {
      message.error('User not authenticated');
      return;
    }

    if (selectedClassIds.length === 0) {
      message.error('Please select at least one class');
      return;
    }

    setIsLoading(true);
    try {
      if (moduleToEdit) {
        // Update existing module
        await moduleService.update(moduleToEdit.id, { 
          name: values.subjectName,
          teacher_id: user.id 
        });
        
        // Update class associations
        await moduleService.addClassesToModule(moduleToEdit.id, selectedClassIds);
        
        toast.success('Subject updated successfully');
      } else {
        // Create new module
        const newModule = (await moduleService.add({ 
          name: values.subjectName, 
          teacher_id: user.id 
        })).data;

        if (newModule.id) {
        await moduleService.addClassesToModule(newModule.id, selectedClassIds);
        const teacherResponse = await axiosClient.get(`/modules/${newModule.id}/users`, {
                params: { roles: 'Teacher' }
              });
        
              const teachers = teacherResponse.data?.data || [];
              
              await Promise.allSettled(
                teachers.map(async (teacher: any) => {
                  if (teacher?.id) {
                    const moduleTeacherRef = ref(database, `module_teachers/${newModule.id}/${teacher.id}`);
                    await set(moduleTeacherRef, true);
                  }
                })
              );
        }
        toast.success('Subject added successfully');
      }

      form.resetFields();
      setSelectedClassIds([]);
      onSubjectAdded();
      onClose();
    } catch (err) {
      console.error('Failed to add/update subject:', err);
      message.error('Failed to add/update subject. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!moduleToEdit?.id || !user?.id) return;

    try {
      setIsLoading(true);
      // Delete module from database
      await moduleService.delete(moduleToEdit.id);
      
      // Delete module from Firebase
      const moduleTeacherRef = ref(database, `module_teachers/${moduleToEdit.id}`);
      await remove(moduleTeacherRef);

      toast.success('Subject deleted successfully');
      onSubjectAdded();
      onClose();
    } catch (err) {
      console.error('Failed to delete subject:', err);
      message.error('Failed to delete subject. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={moduleToEdit ? "Edit Subject" : "Add New Subject"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        preserve={false}
      >
        <Form.Item
          name="subjectName"
          label="Subject name"
          rules={[{ required: true, message: 'Please enter subject name' }]}
        >
          <Input 
              placeholder="e.g. Mathematics, English, Science"
              disabled={isLoading || isFetchingClasses}
            />
        </Form.Item>

        <Form.Item 
          label="Link to Classes" 
          required
          validateStatus={selectedClassIds.length === 0 ? 'error' : ''}
          help={selectedClassIds.length === 0 ? 'Please select at least one class' : ''}
        >
            {isFetchingClasses ? (
              <p>Loading classes...</p>
          ) : classes.length > 0 ? (
            <div className="max-h-40 overflow-y-auto border rounded p-2">
                {classes.map(classItem => (
                <div key={classItem.id} className="mb-2">
                  <Checkbox
                      checked={selectedClassIds.includes(classItem.id)}
                      onChange={() => handleClassSelection(classItem.id)}
                      disabled={isLoading}
                  >
                      {classItem.name}
                  </Checkbox>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No classes available.</p>
          )}
        </Form.Item>

        <Form.Item>
          <div className="flex justify-between">
            {moduleToEdit && (
              <Popconfirm
                title="Delete Subject"
                description="Are you sure you want to delete this subject?"
                icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button danger loading={isLoading}>
                  Delete
                </Button>
              </Popconfirm>
            )}
            <div className="flex gap-2">
              <Button onClick={onClose} disabled={isLoading || isFetchingClasses}>
                Cancel
              </Button>
              <Button 
                type="primary"
                htmlType="submit"
                loading={isLoading}
                disabled={isLoading || isFetchingClasses || selectedClassIds.length === 0}
              >
                {moduleToEdit ? 'Update' : 'Create'} Subject
              </Button>
            </div>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddModuleModal; 