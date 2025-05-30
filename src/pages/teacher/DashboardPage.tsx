import TeacherCart from '../../components/TeacherCart';
import StudentCardList from '../../components/StudentCardList';
import FloatingActionButton from '../../components/FloatingActionButton';
import AddModuleModal from '../../components/AddModuleModal';
import SetDeadlineModal from '../../components/SetDeadlineModal';
import React, { useState } from 'react';

const DashboardPage = () => {
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [isSetDeadlineModalOpen, setIsSetDeadlineModalOpen] = useState(false);

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

  const handleDeadlineSet = (datetime: string) => {
    // TODO: Implement logic to save the deadline for the goal
    console.log("Deadline set for goal:", datetime);
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
        onDeadlineSet={handleDeadlineSet}
      />
    </div>
  );
};
export default DashboardPage;
