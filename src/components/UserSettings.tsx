
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Settings, User, Bell, Download } from 'lucide-react';

interface UserPreferences {
  autoSaveHistory: boolean;
  downloadAfterGeneration: boolean;
  maxHistoryItems: number;
  theme: 'light' | 'dark' | 'system';
}

const defaultPreferences: UserPreferences = {
  autoSaveHistory: true,
  downloadAfterGeneration: false,
  maxHistoryItems: 20,
  theme: 'system'
};

export function UserSettings() {
  const { user, isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserSettings();
      setDisplayName(user.name);
    }
  }, [isAuthenticated, user]);

  const loadUserSettings = () => {
    setIsLoading(true);
    try {
      const storageKey = `user-settings-${user?.id}`;
      const savedPreferences = localStorage.getItem(storageKey);
      if (savedPreferences) {
        setPreferences({...defaultPreferences, ...JSON.parse(savedPreferences)});
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
      toast.error('ไม่สามารถโหลดการตั้งค่าได้');
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserSettings = () => {
    try {
      const storageKey = `user-settings-${user?.id}`;
      localStorage.setItem(storageKey, JSON.stringify(preferences));
      toast.success('บันทึกการตั้งค่าเรียบร้อย');
    } catch (error) {
      console.error('Error saving user settings:', error);
      toast.error('ไม่สามารถบันทึกการตั้งค่าได้');
    }
  };

  const updateDisplayName = () => {
    try {
      if (!displayName.trim()) {
        toast.error('ไม่สามารถใช้ชื่อว่างได้');
        return;
      }

      // Get stored users
      const storedUsersJson = localStorage.getItem('ai-voice-users');
      const storedUsers = storedUsersJson ? JSON.parse(storedUsersJson) : [];
      
      // Find and update the current user
      const updatedUsers = storedUsers.map(u => {
        if (u.id === user?.id) {
          return {...u, name: displayName};
        }
        return u;
      });
      
      // Save updated users list
      localStorage.setItem('ai-voice-users', JSON.stringify(updatedUsers));
      
      // Update current session
      const currentUser = JSON.parse(localStorage.getItem('ai-voice-user') || '{}');
      currentUser.name = displayName;
      localStorage.setItem('ai-voice-user', JSON.stringify(currentUser));
      
      toast.success('อัปเดตชื่อแสดงผลสำเร็จ กรุณารีเฟรชหน้าเว็บเพื่อเปลี่ยนแปลงชื่อแสดงผลในแอป');
    } catch (error) {
      console.error('Error updating display name:', error);
      toast.error('ไม่สามารถอัปเดตชื่อแสดงผลได้');
    }
  };

  const clearAllData = () => {
    try {
      if (confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมด? การดำเนินการนี้ไม่สามารถเรียกคืนได้')) {
        // Clear history
        const historyKey = `voice-history-${user?.id}`;
        localStorage.removeItem(historyKey);
        
        // Clear settings
        const settingsKey = `user-settings-${user?.id}`;
        localStorage.removeItem(settingsKey);
        
        toast.success('ล้างข้อมูลทั้งหมดเรียบร้อย');
        
        // Reset to defaults
        setPreferences(defaultPreferences);
      }
    } catch (error) {
      console.error('Error clearing all data:', error);
      toast.error('ไม่สามารถล้างข้อมูลได้');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-muted-foreground">กำลังโหลดการตั้งค่า...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium flex items-center">
          <User className="mr-2 h-5 w-5" />
          ข้อมูลบัญชี
        </h3>
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="displayName">ชื่อที่แสดง</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="ชื่อที่แสดง"
              />
            </div>
            <Button onClick={updateDisplayName}>บันทึกชื่อ</Button>
          </div>
          
          <div className="pt-2">
            <Label className="text-muted-foreground">อีเมล</Label>
            <p>{user?.email}</p>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          ประวัติและการแจ้งเตือน
        </h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="autoSaveHistory" className="flex-1">บันทึกประวัติการพากษ์อัตโนมัติ</Label>
            <Switch
              id="autoSaveHistory"
              checked={preferences.autoSaveHistory}
              onCheckedChange={(checked) => 
                setPreferences({...preferences, autoSaveHistory: checked})
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="downloadAfterGeneration" className="flex-1">ดาวน์โหลดเสียงอัตโนมัติหลังสร้างเสร็จ</Label>
            <Switch
              id="downloadAfterGeneration"
              checked={preferences.downloadAfterGeneration}
              onCheckedChange={(checked) => 
                setPreferences({...preferences, downloadAfterGeneration: checked})
              }
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="maxHistoryItems">จำนวนประวัติการใช้งานสูงสุดที่จัดเก็บ</Label>
              <Input
                id="maxHistoryItems"
                type="number"
                min="5"
                max="100"
                value={preferences.maxHistoryItems}
                onChange={(e) => 
                  setPreferences({
                    ...preferences, 
                    maxHistoryItems: parseInt(e.target.value) || defaultPreferences.maxHistoryItems
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium flex items-center">
          <Download className="mr-2 h-5 w-5" />
          ข้อมูลและการสำรองข้อมูล
        </h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <Button onClick={clearAllData} variant="destructive">ล้างข้อมูลทั้งหมด</Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={saveUserSettings}>บันทึกการตั้งค่า</Button>
      </div>
    </div>
  );
}

export default UserSettings;
