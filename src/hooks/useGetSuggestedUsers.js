import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { generateClient } from 'aws-amplify/api';
import { listUsers } from '../graphql/queries';

const useGetSuggestedUsers = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const authUser = useAuthStore((state) => state.user);
    const showToast = useShowToast();

    useEffect(() => {
        const getSuggestedUsers = async () => {
            setIsLoading(true);
            try {
                const client = generateClient();
                const data = await client.graphql({ query: listUsers });
                const allUsers = data.data.listUsers.items;

                const filteredUsers = allUsers
                    .filter(user => user.uid !== authUser.uid && !authUser.following.includes(user.uid))
                    .slice(0, 3);

                setSuggestedUsers(filteredUsers);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setIsLoading(false);
            }
        };

        if (authUser) {
            getSuggestedUsers();
        } else {
            setSuggestedUsers([]);
            setIsLoading(false);
        }
    }, [authUser?.uid, authUser?.following]);

    return { suggestedUsers, isLoading };
};

export default useGetSuggestedUsers;
