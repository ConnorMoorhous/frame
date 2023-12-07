import { useEffect, useState } from "react";
import usePostStore from "../store/postStore";
import useShowToast from "./useShowToast";
import { generateClient } from 'aws-amplify/api';
import { getPostsByUser } from '../graphql/queries';
import useUserProfileStore from "../store/userProfileStore";

const useGetUserPosts = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { posts, setPosts } = usePostStore();
    const showToast = useShowToast();
    const userProfile = useUserProfileStore((state) => state.userProfile);

    useEffect(() => {
        const getPosts = async () => {
            if (!userProfile) return;
            setIsLoading(true);
            setPosts([]);

            try {
                const client = generateClient();
                const variables = { createdBy: userProfile.uid };
                const data = await client.graphql({ query: getPostsByUser, variables });
                const userPosts = data.data.getPostsByUser.items;

                userPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setPosts(userPosts);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setIsLoading(false);
            }
        };

        getPosts();
    }, [userProfile]);

    return { posts, isLoading };
};

export default useGetUserPosts;
