
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  isAdmin: boolean;
  createdAt: string;
}

const UserManagement = () => {
  const { getAllUsers, addUser, removeUser, blockUser, unblockUser, makeAdmin, removeAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    isAdmin: false
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('ไม่สามารถโหลดข้อมูลผู้ใช้งานได้');
    }
  };

  const handleAddUser = async () => {
    try {
      if (!newUser.name || !newUser.email || !newUser.password) {
        toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
      }

      await addUser(newUser.email, newUser.password, newUser.name, newUser.isAdmin);
      toast.success('เพิ่มผู้ใช้งานสำเร็จ');
      setIsAddUserOpen(false);
      setNewUser({ name: '', email: '', password: '', isAdmin: false });
      loadUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('ไม่สามารถเพิ่มผู้ใช้งานได้');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await removeUser(selectedUser.id);
      toast.success('ลบผู้ใช้งานสำเร็จ');
      setIsDeleteDialogOpen(false);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('ไม่สามารถลบผู้ใช้งานได้');
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
    } catch (error) {
      console.error('Error toggling block status:', error);
      toast.error('ไม่สามารถเปลี่ยนสถานะผู้ใช้งานได้');
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
    } catch (error) {
      console.error('Error toggling admin status:', error);
      toast.error('ไม่สามารถเปลี่ยนสิทธิ์ผู้ใช้งานได้');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อ</TableHead>
              <TableHead>อีเมล</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead>วันที่สร้าง</TableHead>
              <TableHead className="text-right">การจัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  ไม่พบข้อมูลผู้ใช้งาน
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {user.isBlocked ? (
                        <span className="bg-destructive/20 text-destructive text-xs px-2 py-1 rounded-full">บล็อค</span>
                      ) : (
                        <span className="bg-green-500/20 text-green-600 text-xs px-2 py-1 rounded-full">ปกติ</span>
                      )}
                      {user.isAdmin && (
                        <span className="bg-blue-500/20 text-blue-600 text-xs px-2 py-1 rounded-full">ผู้ดูแล</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString('th-TH')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleAdmin(user)}
                      >
                        {user.isAdmin ? 'ถอดถอนสิทธิ์ผู้ดูแล' : 'ให้สิทธิ์ผู้ดูแล'}
                      </Button>
                      <Button 
                        variant={user.isBlocked ? "default" : "outline"} 
                        size="sm"
                        onClick={() => handleToggleBlock(user)}
                      >
                        {user.isBlocked ? 'ปลดบล็อค' : 'บล็อค'}
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        ลบ
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มผู้ใช้งานใหม่</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">ชื่อผู้ใช้งาน</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAdmin"
                checked={newUser.isAdmin}
                onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="isAdmin">เป็นผู้ดูแลระบบ</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleAddUser}>เพิ่มผู้ใช้งาน</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการลบผู้ใช้งาน</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>คุณต้องการลบผู้ใช้งาน <strong>{selectedUser?.name}</strong> ใช่หรือไม่?</p>
            <p className="text-sm text-muted-foreground mt-2">การกระทำนี้ไม่สามารถย้อนกลับได้</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>ยกเลิก</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>ลบผู้ใช้งาน</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
