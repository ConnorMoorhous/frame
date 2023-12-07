import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useUserProfileStore from "../store/userProfileStore";
import useShowToast from "./useShowToast";
import { generateClient } from 'aws-amplify/api';
import { getUser } from '../graphql/queries';
import { updateUser } from '../graphql/mutations';

const useFollowUser = (userId) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const authUser = useAuthStore((state) => state.user);
    const { setUserProfile } = useUserProfileStore();
    const showToast = useShowToast();

    const client = generateClient();

    const handleFollowUser = async () => {
        setIsUpdating(true);

        try {
            const action = isFollowing ? 'UNFOLLOW' : 'FOLLOW';
            
            // Fetch current data of the users involved
            const getUserDataResponse = await client.graphql({ query: getUser, variables: { uid: authUser.uid } });
            const getTargetUserDataResponse = await client.graphql({ query: getUser, variables: { uid: userId } });

            const currentUserData = getUserDataResponse.data.getUser;
            const targetUserData = getTargetUserDataResponse.data.getUser;
            
            // Remove fields we can't use in the mutation
            delete currentUserData.updatedAt;
            delete currentUserData.__typename;
            delete targetUserData.updatedAt;
            delete targetUserData.__typename;

            let updatedCurrentUser, updatedTargetUser;
            
            // Update the followers/following arrays
            if (action === 'FOLLOW') {
            // Following a user
            updatedCurrentUser = { ...currentUserData, following: [...currentUserData.following, userId] };
            updatedTargetUser = { ...targetUserData, followers: [...targetUserData.followers, authUser.uid] };
            } else {
            // Unfollowing a user
            updatedCurrentUser = { ...currentUserData, following: currentUserData.following.filter(id => id !== userId) };
            updatedTargetUser = { ...targetUserData, followers: targetUserData.followers.filter(id => id !== authUser.uid) };
            }

            // Update the users with the new data
            const response1 = await client.graphql({ query: updateUser, variables: { input: updatedCurrentUser } });
            console.log(response1);
            const response2 = await client.graphql({ query: updateUser, variables: { input: updatedTargetUser } });
            console.log(response2);

            setUserProfile(updatedTargetUser);
            localStorage.setItem("user-info", JSON.stringify(updatedCurrentUser));

            setIsFollowing(!isFollowing);
        } catch (error) {
            showToast("Error", error.message, "error");
            console.log(error)
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        if (authUser) {
            setIsFollowing(authUser.following.includes(userId));
        }
    }, [authUser, userId]);

    return { isUpdating, isFollowing, handleFollowUser };
};

export default useFollowUser;
