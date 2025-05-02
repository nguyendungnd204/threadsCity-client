import { database } from '../../FirebaseConfig';
import { 
  ref, push, set, get, query, 
  orderByChild, equalTo, update, 
  remove, onValue, off,
  limitToLast, startAt, endAt
} from 'firebase/database';
import { getUserById } from './userService';

export const followUser = async (currentUserId, targetUserId) => {
    try {
      if (currentUserId === targetUserId) return false;
  
      const currentUserRef = ref(database, `users/${currentUserId}/following`);
      const targetUserRef = ref(database, `users/${targetUserId}/followers`);
  
      const followData = {
        Status: true,
        createdAt: { '.sv': 'timestamp' }
      }
      await update(currentUserRef, {
        [targetUserId]: followData
      });

      await update(targetUserRef, {
        [currentUserId]: followData
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
      return snapshot.exists() && snapshot.val().Status === true;
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

          const follower = users[userId].followers || {};
          const following = users[userId].following || {};

          console.log('follower', follower);
          console.log('following', following);

          const updFollower = {};
          const updFollowing = {};

          for (const followerId in follower){
            if (follower[followerId].Status === true) {
              updFollower[followerId] = {
                Status: true,
                createdAt: follower[followerId].createdAt || { '.sv': 'timestamp' }
              };
            } else if (typeof follower[followerId] === 'object') {
                 updFollower[followerId] = follower[followerId];
            };
          }
          for (const followingId in following){
            if (following[followingId].Status === true) {
              updFollowing[followingId] = {
                Status: true,
                createdAt: following[followingId].createdAt || { '.sv': 'timestamp' }
              };
            } else if (typeof following[followingId] === 'object') {
                 updFollowing[followingId] = following[followingId];
            };
          }
          await update(userRef, {
            followers: updFollower, 
            following: updFollowing,
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
      const followings = snapshot.val();
      const result = Object.keys(followings)
            .filter((id) => followings[id]?.Status === true)
            .map((id) => ({
              followingId: id,
              createdAt: followings[id]?.createdAt || 0
            }))
      return result;
    }
    return [];
  } catch (err) {
    console.error(err)
    return [];
  }
}

export const getFollowers = async (userId) => {
  try {
    const followersRef = ref(database, `users/${userId}/followers`);
    const snapshot = await get(followersRef);
    if (snapshot.exists()){
      const followers = snapshot.val();
      return Object.keys(followers)
            .filter((id) => followers[id]?.Status === true)
            .map((id) => {
              return {
                followerId: id,
                createdAt: followers[id].createdAt || { '.sv': 'timestamp' }
              };
            });
    }
    return [];
  } catch (err) {
    console.error(err)
    return [];
  }
}

export const getUserFollowersProfile = async (userId) => {
  try{
      if (userId){
        const followers = await getFollowers(userId);
      const profile = await Promise.all(
        followers.map((item) => getUserById(item.followerId))
      );
      const result = profile.flat();
      return result;
    }
    return [];
  } catch (err) {
    console.error(err)
    return [];
  }
} 