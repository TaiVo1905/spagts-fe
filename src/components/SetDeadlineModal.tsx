import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Button, Form, DatePicker, message } from 'antd';
import { useAuth } from '../store/AuthContext';
import { ref, set, push } from 'firebase/database';
import { database } from '../services/firebaseService';
import dayjs from 'dayjs';
import axiosClient from '../services/axiosClient';
import toast from 'react-hot-toast';

interface SetDeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: number;
}

const SetDeadlineModal: React.FC<SetDeadlineModalProps> = ({
  isOpen,
  onClose,
  moduleId,
}) => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [moduleName, setModuleName] = useState('');

  // Fetch module name
  const fetchModuleName = useCallback(async () => {
    if (!moduleId) return;
    
    try {
      const response = await axiosClient.get(`/modules/${moduleId}`);
      if (response.data && response.data.data) {
        setModuleName(response.data.data.name);
      }
    } catch (error) {
      console.error('Error fetching module name:', error);
      message.error('Failed to load module information');
    }
  }, [moduleId]);

  useEffect(() => {
    if (isOpen && moduleId) {
      fetchModuleName();
    }
  }, [isOpen, moduleId, fetchModuleName]);

  const handleSubmit = async (values: { deadline: dayjs.Dayjs }) => {
    if (!user || !moduleId) {
      message.error('Missing required information');
      return;
    }

    setLoading(true);
    try {
      const deadline = values.deadline.toISOString();
      
      // Get all students in this module
      const studentResponse = await axiosClient.get(`/modules/${moduleId}/users`, {
        params: { roles: 'Student' },
      });

      if (!studentResponse.data || !studentResponse.data.data) {
        message.warning('No students found in this module');
        return;
      }

      const students = studentResponse.data.data;
      if (students.length === 0) {
        message.warning('No students found in this module');
        return;
      }

      // Get module name
      const currentModuleName = moduleName || 'this module';

      // Process all students in parallel
      const results = await Promise.allSettled(
        students.map(async (student: any) => {
          if (!student || !student.id) return;

          // Set deadline for student
          const userDeadlineRef = ref(database, `user_module_deadlines/${student.id}/${moduleId}`);
          await set(userDeadlineRef, {
            deadline,
            module_id: moduleId,
            module_name: currentModuleName,
            set_by: user.id,
            set_at: new Date().toISOString()
          });

          // Create notification for student
          const notificationsRef = ref(database, `notifications/${student.id}`);
          const newNotificationRef = push(notificationsRef);
          await set(newNotificationRef, {
            title: 'Semester Goal Deadline Set',
            message: `You need to create a semester goal for ${currentModuleName} before ${dayjs(deadline).format('MMMM D, YYYY HH:mm')}.`,
            type: 'deadline_set',
            module_id: moduleId,
            module_name: currentModuleName,
            due_date: deadline,
            created_at: new Date().toISOString(),
            read: false
          });
        })
      );

      // Count successful operations
      const successful = results.filter(result => result.status === 'fulfilled').length;
      
      if (successful > 0) {
        toast.success(`Deadlines set for ${successful} students in ${currentModuleName}`);
        onClose();
        form.resetFields();
      } else {
        message.error('Failed to set any deadlines');
      }
    } catch (error) {
      console.error('Error setting deadlines:', error);
      message.error('Failed to set deadlines. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Set Semester Goal Deadline for ${moduleName || 'Module'}`}
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
          name="deadline"
          label="Deadline"
          rules={[{ 
            required: true, 
            message: 'Please select a deadline' 
          }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: '100%' }}
            disabledDate={(current) => current && current < dayjs().startOf('day')}
          />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Set Deadline
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SetDeadlineModal;