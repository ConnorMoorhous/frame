import { useEffect, useState } from "react";
import usePostStore from "../store/postStore";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { generateClient } from 'aws-amplify/api';
import { listPosts } from '../graphql/queries';

const useGetFeedPosts = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { posts, setPosts } = usePostStore();
    const authUser = useAuthStore((state) => state.user);
    const showToast = useShowToast();
    const client = generateClient();

    useEffect(() => {
        const getFeedPosts = async () => {
            setIsLoading(true);

            if (authUser.following.length === 0) {
                setIsLoading(false);
                setPosts([]);
                return;
            }

            try {
                const response = await client.graphql({ query: listPosts });
                const feedPosts = response.data.listPosts.items;

                feedPosts.sort((a, b) => b.createdAt - a.createdAt);
                setPosts(feedPosts);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setIsLoading(false);
            }
        };

        if (authUser) getFeedPosts();
    }, [authUser, showToast, setPosts]);

    return { isLoading, posts };
};

export default useGetFeedPosts;
