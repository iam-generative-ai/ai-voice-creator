
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user';

interface UsersTableProps {
  users: User[];
  searchTerm: string;
  onDeleteClick: (user: User) => void;
  onToggleBlock: (user: User) => void;
  onToggleAdmin: (user: User) => void;
}

export const UsersTable = ({ 
  users, 
  searchTerm, 
  onDeleteClick, 
  onToggleBlock, 
  onToggleAdmin 
}: UsersTableProps) => {
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
                      onClick={() => onToggleAdmin(user)}
                    >
                      {user.isAdmin ? 'ถอดถอนสิทธิ์ผู้ดูแล' : 'ให้สิทธิ์ผู้ดูแล'}
                    </Button>
                    <Button 
                      variant={user.isBlocked ? "default" : "outline"} 
                      size="sm"
                      onClick={() => onToggleBlock(user)}
                    >
                      {user.isBlocked ? 'ปลดบล็อค' : 'บล็อค'}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => onDeleteClick(user)}
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
  );
};
