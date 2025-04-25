import { database } from '../../FirebaseConfig';
import { 
  ref, push, set, get, query, 
  orderByChild, equalTo, update, 
  remove, onValue, off,
  limitToLast, startAt, endAt
} from 'firebase/database';

export const followUser = async (currentUserId, targetUserId) => {
    try {
      if (currentUserId === targetUserId) return false;
  
      const currentUserRef = ref(database, `users/${currentUserId}/following`);
      const targetUserRef = ref(database, `users/${targetUserId}/followers`);
  
      await update(currentUserRef, {
        [targetUserId]: true
      });

      await update(targetUserRef, {
        [currentUserId]: true
      });
  
      return true;
    } catch (error) {
      console.error("Error following user:", error);
      return false;
    }
  };
  
  export const unfollowUser = async (currentUserId, targetUserId) => {
    try {
      const currentUserRef = ref(database, `users/${currentUserId}/following`);
      const targetUserRef = ref(database, `users/${targetUserId}/followers`);
  
      await update(currentUserRef, {
        [targetUserId]: null
      });
  
      await update(targetUserRef, {
        [currentUserId]: null
      });
  
      return true;
    } catch (error) {
      console.error("Error unfollowing user:", error);
      return false;
    }
  };
  
  export const isFollowing = async (currentUserId, targetUserId) => {
    try {
      const followingRef = ref(database, `users/${currentUserId}/following/${targetUserId}`);
      const snapshot = await get(followingRef);
      return snapshot.exists();
    } catch (error) {
      console.error("Error checking follow status:", error);
      return false;
    }
  };

  export const migrateUserData = async () => {
    try {
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      
      if (snapshot.exists()) {
        const users = snapshot.val();
        for (const userId in users) {
          const userRef = ref(database, `users/${userId}`);
          await update(userRef, {
            followers: users[userId].followers || {}, 
            following: users[userId].following || {},
            updatedAt: { '.sv': 'timestamp' }
          });
        }
        console.log("Migration completed successfully!");
      } else {
        console.log("No users found in the database.");
      }
    } catch (error) {
      console.error("Error migrating user data:", error);
    }
  };

export const getFollowings = async (userId) => {
  try {
    const followingrsRef = ref(database, `users/${userId}/following`);
    const snapshot = await get(followingrsRef);
    if (snapshot.exists()){
      return Object.keys(snapshot.val());
    }
    return [];
  } catch (err) {
    console.error(err)
    return [];
  }
}