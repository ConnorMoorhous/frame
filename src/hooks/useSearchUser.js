import { useState } from "react";
import useShowToast from "./useShowToast";
import { getUserByUsername } from "../graphql/queries";
import { generateClient } from 'aws-amplify/api';

const useSearchUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const showToast = useShowToast();

    const clearUser = () => {
        setUser(null); 
    };

    const getUserProfile = async (username) => {
        setIsLoading(true);
        setUser(null);

        try {
            const client = generateClient();
            const response = await client.graphql({ query: getUserByUsername, variables: { username } });
            
            const data = response.data.getUserByUsername.items;
            
            if (data === 0) {
                showToast("Error", "User not found", "error");
            } else {
                setUser(data[0]);
            }
        } catch (error) {
            showToast("Error", error.message, "error");
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, getUserProfile, user, setUser, clearUser };
};

export default useSearchUser;
