import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { ClassUserManagementModal } from '../components/ClassUserManagementModal';

const ClassManagementPage: React.FC = () => {
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    const [isUserManagementModalVisible, setIsUserManagementModalVisible] = useState(false);

    const handleManageUsers = (classId: number) => {
        setSelectedClassId(classId);
        setIsUserManagementModalVisible(true);
    };

    const columns = [
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button onClick={() => handleEdit(record)}>Sửa</Button>
                    <Button onClick={() => handleManageUsers(record.id)}>Quản lý thành viên</Button>
                    <Button danger onClick={() => handleDelete(record.id)}>Xóa</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <ClassUserManagementModal
                visible={isUserManagementModalVisible}
                onClose={() => {
                    setIsUserManagementModalVisible(false);
                    setSelectedClassId(null);
                }}
                classId={selectedClassId || 0}
                onSuccess={fetchClasses}
            />
        </div>
    );
};

export default ClassManagementPage; 