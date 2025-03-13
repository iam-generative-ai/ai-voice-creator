
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AddUserFormData {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUser: (userData: AddUserFormData) => Promise<boolean>;
}

export const AddUserDialog = ({ open, onOpenChange, onAddUser }: AddUserDialogProps) => {
  const [userData, setUserData] = useState<AddUserFormData>({
    name: '',
    email: '',
    password: '',
    isAdmin: false
  });

  const handleSubmit = async () => {
    const success = await onAddUser(userData);
    if (success) {
      setUserData({ name: '', email: '', password: '', isAdmin: false });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>เพิ่มผู้ใช้งานใหม่</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">ชื่อผู้ใช้งาน</Label>
            <Input
              id="name"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">อีเมล</Label>
            <Input
              id="email"
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">รหัสผ่าน</Label>
            <Input
              id="password"
              type="password"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isAdmin"
              checked={userData.isAdmin}
              onChange={(e) => setUserData({ ...userData, isAdmin: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="isAdmin">เป็นผู้ดูแลระบบ</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>ยกเลิก</Button>
          <Button onClick={handleSubmit}>เพิ่มผู้ใช้งาน</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
