
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useUserManagement() {
  const { getAllUsers, addUser, removeUser, blockUser, unblockUser, makeAdmin, removeAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('ไม่สามารถโหลดข้อมูลผู้ใช้งานได้');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async (userData: { name: string; email: string; password: string; isAdmin: boolean }) => {
    try {
      if (!userData.name || !userData.email || !userData.password) {
        toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
        return false;
      }

      await addUser(userData.email, userData.password, userData.name, userData.isAdmin);
      toast.success('เพิ่มผู้ใช้งานสำเร็จ');
      loadUsers();
      return true;
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('ไม่สามารถเพิ่มผู้ใช้งานได้');
      return false;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await removeUser(userId);
      toast.success('ลบผู้ใช้งานสำเร็จ');
      loadUsers();
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('ไม่สามารถลบผู้ใช้งานได้');
      return false;
    }
  };

  const handleToggleBlock = async (user: User) => {
    try {
      if (user.isBlocked) {
        await unblockUser(user.id);
        toast.success(`ปลดบล็อคผู้ใช้ ${user.name} สำเร็จ`);
      } else {
        await blockUser(user.id);
        toast.success(`บล็อคผู้ใช้ ${user.name} สำเร็จ`);
      }
      loadUsers();
      return true;
    } catch (error) {
      console.error('Error toggling block status:', error);
      toast.error('ไม่สามารถเปลี่ยนสถานะผู้ใช้งานได้');
      return false;
    }
  };

  const handleToggleAdmin = async (user: User) => {
    try {
      if (user.isAdmin) {
        await removeAdmin(user.id);
        toast.success(`ถอดถอนสิทธิ์ผู้ดูแลของ ${user.name} สำเร็จ`);
      } else {
        await makeAdmin(user.id);
        toast.success(`เพิ่มสิทธิ์ผู้ดูแลให้ ${user.name} สำเร็จ`);
      }
      loadUsers();
      return true;
    } catch (error) {
      console.error('Error toggling admin status:', error);
      toast.error('ไม่สามารถเปลี่ยนสิทธิ์ผู้ใช้งานได้');
      return false;
    }
  };

  return {
    users,
    isLoading,
    loadUsers,
    handleAddUser,
    handleDeleteUser,
    handleToggleBlock,
    handleToggleAdmin
  };
}
