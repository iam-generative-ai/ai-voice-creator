
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function VoiceIframe() {
  const { user } = useAuth();
  // Watch for iframe load events to handle errors
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const loadIframe = () => {
    setIframeLoaded(false);
    setIframeError(false);
    setRetryCount(prev => prev + 1);
  };

  // Initialize the iframe with example content to prevent SSML empty errors
  useEffect(() => {
    const initializeIframe = () => {
      if (iframeLoaded) {
        try {
          const iframe = document.querySelector('iframe');
          if (iframe && iframe.contentWindow) {
            // Add a small delay to ensure the iframe is fully loaded and initialized
            setTimeout(() => {
              // Post a message to iframe to set initial SSML content
              iframe.contentWindow.postMessage({
                action: 'setSSML',
                content: '<speak>สวัสดีครับ ยินดีต้อนรับสู่เครื่องมือพากษ์เสียง AI</speak>'
              }, '*');
            }, 2000);
          }
        } catch (error) {
          console.error('Error initializing iframe:', error);
        }
      }
    };

    initializeIframe();
  }, [iframeLoaded]);

  // Listen for messages from iframe and track history
  useEffect(() => {
    // Check user preferences for auto-save
    const getUserPreferences = () => {
      try {
        const storageKey = `user-settings-${user?.id}`;
        const savedPreferences = localStorage.getItem(storageKey);
        if (savedPreferences) {
          return JSON.parse(savedPreferences);
        }
        return { autoSaveHistory: true, maxHistoryItems: 20 };
      } catch (error) {
        console.error('Error loading preferences:', error);
        return { autoSaveHistory: true, maxHistoryItems: 20 };
      }
    };

    // Save to history
    const saveToHistory = (text, ssml, voice) => {
      try {
        // Only save if user preferences allow it
        const preferences = getUserPreferences();
        if (!preferences.autoSaveHistory) return;
        
        const historyKey = `voice-history-${user?.id}`;
        const savedHistory = localStorage.getItem(historyKey);
        const parsedHistory = savedHistory ? JSON.parse(savedHistory) : [];
        
        // Create new history item
        const newItem = {
          id: `voice-${Date.now()}`,
          userId: user?.id,
          text: text || 'ข้อความไม่ระบุ',
          ssml: ssml,
          createdAt: new Date().toISOString(),
          voice: voice || 'default'
        };
        
        // Add new item to history
        let updatedHistory = [newItem, ...parsedHistory];
        
        // Limit history size
        if (updatedHistory.length > preferences.maxHistoryItems) {
          updatedHistory = updatedHistory.slice(0, preferences.maxHistoryItems);
        }
        
        // Save updated history
        localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Error saving to history:', error);
      }
    };

    const handleMessage = (event) => {
      // Check if message is from our iframe
      if (event.data) {
        if (event.data.type === 'ssml-error') {
          console.warn('SSML error received from iframe:', event.data);
          toast.error('พบข้อผิดพลาดกับเนื้อหา SSML กรุณาตรวจสอบข้อความของคุณ');
        } 
        else if (event.data.type === 'voice-generated') {
          // Track successful voice generation
          console.log('Voice generated successfully:', event.data);
          toast.success('สร้างเสียงพากษ์สำเร็จ');
          
          // Save to history if authorized
          if (user) {
            saveToHistory(
              event.data.text || event.data.plainText, 
              event.data.ssml, 
              event.data.voice
            );
          }
          
          // Check for auto-download preference
          const preferences = getUserPreferences();
          if (preferences.downloadAfterGeneration) {
            // Trigger download if enabled (actual download handled by iframe)
            const iframe = document.querySelector('iframe');
            if (iframe && iframe.contentWindow) {
              iframe.contentWindow.postMessage({
                action: 'downloadAudio'
              }, '*');
            }
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!iframeLoaded) {
        setIframeError(true);
        console.error("Iframe failed to load within timeout period");
      }
    }, 15000); // Increased timeout to 15 seconds

    return () => clearTimeout(timer);
  }, [iframeLoaded, retryCount]);

  return (
    <div className="w-full h-full min-h-[500px] relative rounded-lg overflow-hidden">
      {iframeError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted p-4 rounded-lg">
          <p className="text-muted-foreground mb-4">ไม่สามารถโหลดเครื่องมือได้ กรุณาลองใหม่อีกครั้ง</p>
          <Button onClick={loadIframe}>ลองใหม่</Button>
        </div>
      ) : !iframeLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
            <p className="text-muted-foreground">กำลังโหลดเครื่องมือ AI พากษ์เสียง...</p>
          </div>
        </div>
      )}
      <iframe 
        key={`iframe-${retryCount}`}
        src="https://speechsynthesis.online/"
        className={`w-full h-full min-h-[500px] border-0 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
        title="AI Voice Generator"
        allow="microphone; clipboard-write; clipboard-read; download"
        sandbox="allow-same-origin allow-scripts allow-forms allow-downloads allow-popups"
        onLoad={() => {
          console.log("Iframe loaded successfully");
          setIframeLoaded(true);
        }}
        onError={() => {
          console.error("Error loading iframe");
          setIframeError(true);
        }}
      />
    </div>
  );
}

export default VoiceIframe;
