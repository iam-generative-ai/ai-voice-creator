
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { History, Settings, Mic } from 'lucide-react';
import VoiceIframe from '@/components/VoiceIframe';
import VoiceHistory from '@/components/VoiceHistory';
import UserSettings from '@/components/UserSettings';

export const MainTabs = () => {
  return (
    <Card className="bg-card/70 backdrop-blur-sm border border-primary/10 shadow-lg animate-fade-in">
      <CardContent className="p-0">
        <Tabs defaultValue="voice-generator" className="w-full">
          <div className="p-4 border-b border-border/60">
            <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full">
              <TabsTrigger value="voice-generator" className="flex items-center">
                <Mic className="h-4 w-4 mr-2" />
                พากษ์เสียง
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center">
                <History className="h-4 w-4 mr-2" />
                ประวัติการใช้งาน
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                ตั้งค่า
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="voice-generator" className="p-4 pt-0 focus:outline-none">
            <VoiceIframe />
          </TabsContent>
          
          <TabsContent value="history" className="p-6 focus:outline-none">
            <VoiceHistory />
          </TabsContent>
          
          <TabsContent value="settings" className="p-6 focus:outline-none">
            <UserSettings />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

