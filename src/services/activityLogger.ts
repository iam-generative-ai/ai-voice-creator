
import { ActivityLog, User } from '@/types/auth';

export const logUserActivity = async (user: User | null, action: string, details: string): Promise<void> => {
  if (!user) return;
  
  try {
    // Get stored activities
    const storedActivitiesJson = localStorage.getItem('ai-voice-activities');
    const storedActivities: ActivityLog[] = storedActivitiesJson ? JSON.parse(storedActivitiesJson) : [];
    
    // Create new activity log
    const newActivity: ActivityLog = {
      id: 'activity-' + Date.now().toString(),
      userId: user.id,
      userName: user.name,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    
    // Add to stored activities
    storedActivities.push(newActivity);
    localStorage.setItem('ai-voice-activities', JSON.stringify(storedActivities));
    
    console.log("Activity logged:", newActivity);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

export const getUserActivitiesFromStorage = async (): Promise<ActivityLog[]> => {
  try {
    // Get stored activities
    const storedActivitiesJson = localStorage.getItem('ai-voice-activities');
    const storedActivities: ActivityLog[] = storedActivitiesJson ? JSON.parse(storedActivitiesJson) : [];
    
    // Return activities sorted by timestamp (newest first)
    return storedActivities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error('Error getting activities:', error);
    return [];
  }
};
