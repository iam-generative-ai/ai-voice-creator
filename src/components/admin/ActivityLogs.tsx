
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

const ActivityLogs = () => {
  const { getUserActivities } = useAuth();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setIsLoading(true);
      const activitiesData = await getUserActivities();
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading activities:', error);
      toast.error('ไม่สามารถโหลดประวัติการใช้งานได้');
    } finally {
      setIsLoading(false);
    }
  };

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case 'login':
        return 'bg-blue-500/20 text-blue-600';
      case 'logout':
        return 'bg-gray-500/20 text-gray-600';
      case 'register':
        return 'bg-green-500/20 text-green-600';
      case 'voice-created':
        return 'bg-purple-500/20 text-purple-600';
      case 'account-blocked':
        return 'bg-red-500/20 text-red-600';
      case 'account-unblocked':
        return 'bg-amber-500/20 text-amber-600';
      default:
        return 'bg-gray-500/20 text-gray-600';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (filter === 'all') return matchesSearch;
    return matchesSearch && activity.action === filter;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="ค้นหาประวัติการใช้งาน..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="กรองตามประเภท" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="login">เข้าสู่ระบบ</SelectItem>
            <SelectItem value="logout">ออกจากระบบ</SelectItem>
            <SelectItem value="register">ลงทะเบียน</SelectItem>
            <SelectItem value="voice-created">สร้างเสียง</SelectItem>
            <SelectItem value="account-blocked">บล็อกบัญชี</SelectItem>
            <SelectItem value="account-unblocked">ปลดบล็อกบัญชี</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>เวลา</TableHead>
              <TableHead>ผู้ใช้งาน</TableHead>
              <TableHead>การกระทำ</TableHead>
              <TableHead>รายละเอียด</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <div className="flex justify-center">
                    <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredActivities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  ไม่พบประวัติการใช้งาน
                </TableCell>
              </TableRow>
            ) : (
              filteredActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(activity.timestamp).toLocaleString('th-TH')}
                  </TableCell>
                  <TableCell>{activity.userName}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full ${getActionBadgeClass(activity.action)}`}>
                      {activity.action === 'login' && 'เข้าสู่ระบบ'}
                      {activity.action === 'logout' && 'ออกจากระบบ'}
                      {activity.action === 'register' && 'ลงทะเบียน'}
                      {activity.action === 'voice-created' && 'สร้างเสียง'}
                      {activity.action === 'account-blocked' && 'บล็อกบัญชี'}
                      {activity.action === 'account-unblocked' && 'ปลดบล็อกบัญชี'}
                      {!['login', 'logout', 'register', 'voice-created', 'account-blocked', 'account-unblocked'].includes(activity.action) && activity.action}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {activity.details}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ActivityLogs;
