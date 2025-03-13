
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUserManagement } from '@/hooks/useUserManagement';
import { UsersTable } from './UsersTable';
import { AddUserDialog } from './AddUserDialog';
import { DeleteUserDialog } from './DeleteUserDialog';
import { User } from '@/types/user';

const UserManagement = () => {
  const { 
    users, 
    handleAddUser, 
    handleDeleteUser, 
    handleToggleBlock, 
    handleToggleAdmin 
  } = useUserManagement();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="ค้นหาผู้ใช้งาน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
        </div>
        <Button onClick={() => setIsAddUserOpen(true)}>เพิ่มผู้ใช้งานใหม่</Button>
      </div>

      <UsersTable
        users={users}
        searchTerm={searchTerm}
        onDeleteClick={handleDeleteClick}
        onToggleBlock={handleToggleBlock}
        onToggleAdmin={handleToggleAdmin}
      />

      <AddUserDialog
        open={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onAddUser={handleAddUser}
      />

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        selectedUser={selectedUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default UserManagement;
