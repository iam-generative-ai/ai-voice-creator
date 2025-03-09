
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { History, Play, Download, Delete } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface VoiceHistoryItem {
  id: string;
  userId: string;
  text: string;
  ssml: string;
  createdAt: string;
  voice?: string;
}

export function VoiceHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<VoiceHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [user?.id]);

  const loadHistory = () => {
    setIsLoading(true);
    try {
      // Load history from localStorage
      const storageKey = `voice-history-${user?.id}`;
      const savedHistory = localStorage.getItem(storageKey);
      const parsedHistory = savedHistory ? JSON.parse(savedHistory) : [];
      
      // Sort by date (newest first)
      const sortedHistory = parsedHistory.sort((a: VoiceHistoryItem, b: VoiceHistoryItem) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setHistory(sortedHistory);
    } catch (error) {
      console.error('Error loading voice history:', error);
      toast.error('ไม่สามารถโหลดประวัติการใช้งานได้');
    } finally {
      setIsLoading(false);
    }
  };

  const playVoice = (item: VoiceHistoryItem) => {
    try {
      // Find the iframe and send a message to play this SSML
      const iframe = document.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          action: 'setSSML',
          content: item.ssml
        }, '*');
        
        // Switch to the voice generator tab
        const voiceTab = document.querySelector('[data-state="inactive"][value="voice-generator"]');
        if (voiceTab) {
          (voiceTab as HTMLElement).click();
        }
        
        toast.success('โหลดข้อความสำเร็จ กรุณากดปุ่มเล่นเสียงในแท็บพากษ์เสียง');
      }
    } catch (error) {
      console.error('Error playing voice:', error);
      toast.error('ไม่สามารถเล่นเสียงได้');
    }
  };

  const deleteHistoryItem = (id: string) => {
    try {
      const storageKey = `voice-history-${user?.id}`;
      const updatedHistory = history.filter(item => item.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
      toast.success('ลบรายการเรียบร้อย');
    } catch (error) {
      console.error('Error deleting history item:', error);
      toast.error('ไม่สามารถลบรายการได้');
    }
  };

  const clearAllHistory = () => {
    try {
      if (confirm('คุณต้องการลบประวัติการใช้งานทั้งหมดใช่หรือไม่?')) {
        const storageKey = `voice-history-${user?.id}`;
        localStorage.removeItem(storageKey);
        setHistory([]);
        toast.success('ลบประวัติทั้งหมดเรียบร้อย');
      }
    } catch (error) {
      console.error('Error clearing history:', error);
      toast.error('ไม่สามารถลบประวัติได้');
    }
  };

  // Format the date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-muted-foreground">กำลังโหลดประวัติการใช้งาน...</p>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <History className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-medium mb-2">ไม่พบประวัติการใช้งาน</h3>
        <p className="text-muted-foreground mb-4">เมื่อคุณพากษ์เสียง ประวัติจะแสดงที่นี่</p>
        <Button 
          variant="outline"
          onClick={() => {
            // Switch to voice generator tab
            const voiceTab = document.querySelector('[data-state="inactive"][value="voice-generator"]');
            if (voiceTab) {
              (voiceTab as HTMLElement).click();
            }
          }}
        >
          เริ่มพากษ์เสียง
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">ประวัติการพากษ์เสียง</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={clearAllHistory}
        >
          ลบประวัติทั้งหมด
        </Button>
      </div>

      <div className="space-y-4">
        {history.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col space-y-3">
                <div className="text-sm text-muted-foreground">
                  {formatDate(item.createdAt)}
                </div>
                
                <p className="line-clamp-2">{item.text}</p>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => playVoice(item)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    เล่นเสียง
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => deleteHistoryItem(item.id)}
                  >
                    <Delete className="h-4 w-4 mr-2" />
                    ลบ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default VoiceHistory;
