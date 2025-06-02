import TeacherCart from '../../components/TeacherCart';
import StudentCardList from '../../components/StudentCardList';
import FloatingActionButton from '../../components/FloatingActionButton';
import AddModuleModal from '../../components/AddModuleModal';
import SetDeadlineModal from '../../components/SetDeadlineModal';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const DashboardPage = () => {
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [isSetDeadlineModalOpen, setIsSetDeadlineModalOpen] = useState(false);
  const { moduleId } = useParams<{ moduleId: string }>();
  console.log(moduleId)

  const handleAddSubjectClick = () => {
    setIsAddSubjectModalOpen(true);
  };

  const handleSetDeadlineClick = () => {
    setIsSetDeadlineModalOpen(true);
  };

  const handleAddSubjectClose = () => {
    setIsAddSubjectModalOpen(false);
  };

  const handleSetDeadlineClose = () => {
    setIsSetDeadlineModalOpen(false);
  };

  const handleSubjectAdded = () => {
    // TODO: Refresh the subject list after adding a new subject
    console.log("Subject added successfully, refresh list.");
  };



  return (
    <div className="flex-1 p-6">
      <TeacherCart />
      <StudentCardList />

      <FloatingActionButton
        onAddSubjectClick={handleAddSubjectClick}
        onSetDeadlineClick={handleSetDeadlineClick}
      />

      <AddModuleModal
        isOpen={isAddSubjectModalOpen}
        onClose={handleAddSubjectClose}
        onSubjectAdded={handleSubjectAdded}
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
