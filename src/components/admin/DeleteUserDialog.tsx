
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user';

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  onDeleteUser: (userId: string) => Promise<boolean>;
}

export const DeleteUserDialog = ({ 
  open, 
  onOpenChange, 
  selectedUser, 
  onDeleteUser 
}: DeleteUserDialogProps) => {
  
  const handleDelete = async () => {
    if (!selectedUser) return;
    
    const success = await onDeleteUser(selectedUser.id);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ยืนยันการลบผู้ใช้งาน</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>คุณต้องการลบผู้ใช้งาน <strong>{selectedUser?.name}</strong> ใช่หรือไม่?</p>
          <p className="text-sm text-muted-foreground mt-2">การกระทำนี้ไม่สามารถย้อนกลับได้</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>ยกเลิก</Button>
          <Button variant="destructive" onClick={handleDelete}>ลบผู้ใช้งาน</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
