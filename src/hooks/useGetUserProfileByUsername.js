import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";
import { generateClient } from 'aws-amplify/api';
import { getUserByUsername } from '../graphql/queries';

const useGetUserProfileByUsername = (username) => {
    const [isLoading, setIsLoading] = useState(true);
    const showToast = useShowToast();
    const userProfile = useUserProfileStore((state) => state.userProfile);
	const setUserProfile = useUserProfileStore((state) => state.setUserProfile);

    const client = generateClient();

    useEffect(() => {
        const getUserProfile = async () => {
            setIsLoading(true);

            try {
                const response = await client.graphql({ query: getUserByUsername, variables: { username: username } });

                const userData = response.data.getUserByUsername.items;

                if (userData.length === 0) {
                    setUserProfile(null);
                } else {
                    setUserProfile(userData[0]);
                }

            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setIsLoading(false);
            }
        };

        if (username) getUserProfile();
    }, [username, showToast, setUserProfile]);

    return { isLoading, userProfile };
};

export default useGetUserProfileByUsername;
