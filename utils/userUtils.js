// User utility functions for profile management and gamification
const UserUtils = {
  // Calculate user level based on stars
  getUserLevel: (stars) => {
    if (stars >= 100) return { level: 'Мастер актерского дела', color: 'text-purple-600' };
    if (stars >= 50) return { level: 'Опытный актер', color: 'text-blue-600' };
    if (stars >= 20) return { level: 'Развивающийся актер', color: 'text-green-600' };
    return { level: 'Начинающий актер', color: 'text-gray-600' };
  },

  // Calculate stars needed for next level
  getStarsToNextLevel: (currentStars) => {
    if (currentStars < 20) return 20 - currentStars;
    if (currentStars < 50) return 50 - currentStars;
    if (currentStars < 100) return 100 - currentStars;
    return 0;
  },

  // Award stars for completing exercises
  awardStars: async (userId, exerciseType, difficulty) => {
    let starsEarned = 1;
    
    // Bonus stars based on difficulty
    if (difficulty === 'intermediate') starsEarned = 2;
    if (difficulty === 'advanced') starsEarned = 3;
    
    try {
      // Get current user profile
      const profiles = await trickleListObjects('user_profile', 1, true);
      const userProfile = profiles.items.find(p => p.objectData.userId === userId);
      
      if (userProfile) {
        const newStars = (userProfile.objectData.stars || 0) + starsEarned;
        await trickleUpdateObject('user_profile', userProfile.objectId, {
          ...userProfile.objectData,
          stars: newStars
        });
        return starsEarned;
      }
    } catch (error) {
      console.error('Ошибка начисления звезд:', error);
    }
    return 0;
  },

  // Check if user can afford reward
  canAffordReward: (userStars, rewardCost) => {
    return userStars >= rewardCost;
  },

  // Format notification preferences
  formatNotificationPreferences: (notifications, reminderTime) => {
    return JSON.stringify({
      notifications: notifications,
      reminderTime: reminderTime,
      lastReminder: null
    });
  },

  // Check if reminder should be sent
  shouldSendReminder: (preferences) => {
    try {
      const prefs = JSON.parse(preferences);
      if (!prefs.notifications) return false;
      
      const now = new Date();
      const reminderTime = prefs.reminderTime;
      const [hours, minutes] = reminderTime.split(':');
      
      const reminderDateTime = new Date();
      reminderDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // Check if it's time for reminder and hasn't been sent today
      const lastReminder = prefs.lastReminder ? new Date(prefs.lastReminder) : null;
      const today = new Date().toDateString();
      
      return Math.abs(now - reminderDateTime) < 30 * 60 * 1000 && // Within 30 minutes
             (!lastReminder || lastReminder.toDateString() !== today);
    } catch (error) {
      console.error('Ошибка проверки напоминания:', error);
      return false;
    }
  }
};
