import TeacherCart from '../../components/TeacherCart';
import StudentCardList from '../../components/StudentCardList';
import FloatingActionButton from '../../components/FloatingActionButton';
import AddModuleModal from '../../components/AddModuleModal';
import SetDeadlineModal from '../../components/SetDeadlineModal';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moduleService, { Module } from '../../services/moduleService';
import { useAuth } from '../../store/AuthContext';
import { Button, Popconfirm, message, Modal } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const DashboardPage = () => {
  const { moduleId } = useParams();
  const { user } = useAuth();
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [isSetDeadlineModalOpen, setIsSetDeadlineModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | undefined>();
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchModules();
    }
  }, [user?.id]);

  const fetchModules = async () => {
    if (!user?.id) return;
    
    try {
      const response = await moduleService.getUserModules(user.id);
      setModules(response.data);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  const handleEdit = async (moduleId: number) => {
    try {
      // Fetch module details
      const response = await moduleService.get(moduleId);
      const moduleData = response.data;
      
      // Fetch class IDs for this module
      const classResponse = await moduleService.getModuleClasses(moduleId);
      const classIds = classResponse.data.map((c: any) => c.id);
      
      setSelectedModule({
        id: moduleData.id,
        name: moduleData.name,
        classIds: classIds
      });
      setIsAddSubjectModalOpen(true);
    } catch (error) {
      console.error("Error fetching module details:", error);
      message.error("Failed to load module details");
    }
  };

  const handleDelete = async (moduleId: number) => {
    if (!user?.id) return;

    try {
      await moduleService.delete(moduleId);
      message.success("Module deleted successfully");
      fetchModules();
    } catch (error) {
      console.error("Error deleting module:", error);
      message.error("Failed to delete module");
    }
  };

  const handleAddSubjectClick = () => {
    setIsListModalOpen(true);
  };

  const handleSetDeadlineClick = () => {
    setIsSetDeadlineModalOpen(true);
  };

  const handleAddSubjectClose = () => {
    setIsAddSubjectModalOpen(false);
    setSelectedModule(undefined);
  };

  const handleSetDeadlineClose = () => {
    setIsSetDeadlineModalOpen(false);
  };

  const handleSubjectAdded = () => {
    fetchModules();
    setIsAddSubjectModalOpen(false);
    setSelectedModule(undefined);
  };

  return (
    <div className="flex-1 p-6">
      <TeacherCart modules={modules} />
      <StudentCardList />

      <FloatingActionButton
        onAddSubjectClick={handleAddSubjectClick}
        onSetDeadlineClick={handleSetDeadlineClick}
      />

      <Modal
        title={
          <div className="flex justify-start items-center">
            <span>Module List</span>
            <Button 
              type="dashed" 
              icon={<PlusOutlined />}
              onClick={() => setIsAddSubjectModalOpen(true)}
              className='ml-2'
            >
            </Button>
          </div>
        }
        open={isListModalOpen}
        onCancel={() => setIsListModalOpen(false)}
        footer={null}
        width={800}
      >
        <div className="space-y-2">
          {modules.map((module) => (
            <div key={module.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <span className="text-gray-800">{module.name}</span>
              <div className="flex gap-2">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => module.id && handleEdit(module.id)}
                />
                <Popconfirm
                  title="Delete Module"
                  description="Are you sure you want to delete this module?"
                  onConfirm={() => module.id && handleDelete(module.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <AddModuleModal
        isOpen={isAddSubjectModalOpen}
        onClose={handleAddSubjectClose}
        onSubjectAdded={handleSubjectAdded}
        moduleToEdit={selectedModule}
      />

      <SetDeadlineModal
        isOpen={isSetDeadlineModalOpen}
        onClose={handleSetDeadlineClose}
        moduleId={Number(moduleId)}
      />
    </div>
  );
};

export default DashboardPage;
