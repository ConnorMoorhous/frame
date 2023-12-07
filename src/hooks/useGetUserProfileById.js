import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import { generateClient } from 'aws-amplify/api';
import { getUser } from '../graphql/queries';

const useGetUserProfileById = (userId) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const showToast = useShowToast();

    const client = generateClient();

    useEffect(() => {
        const getUserProfile = async () => {
            setIsLoading(true);
            setUserProfile(null);

            try {
                const response = await client.graphql({ query: getUser, variables: { uid: userId } });

                const userData = response.data.getUser;
            
                if (!userData) {
                    setUserProfile(null);
                }
                else {
                    setUserProfile(userData);
                }
            } catch (error) {
                console.log(error);
                showToast("Error", error.message, "error");
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) getUserProfile();
    }, [userId, showToast]);

    return { isLoading, userProfile, setUserProfile };
};

export default useGetUserProfileById;
