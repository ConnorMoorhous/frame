import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { generateClient} from 'aws-amplify/api';
import { updatePost } from '../graphql/mutations';

const useLikePost = (post) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const authUser = useAuthStore((state) => state.user);
    const [likes, setLikes] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(post.likes.includes(authUser?.uid));
    const showToast = useShowToast();
    const client = generateClient();

    const handleLikePost = async () => {
        if (isUpdating || !authUser) return;
        setIsUpdating(true);

        const updatedLikes = isLiked 
            ? post.likes.filter(uid => uid !== authUser.uid)
            : [...post.likes, authUser.uid];

        try {
            const input = {
                id: post.id,
                likes: updatedLikes
            };
            await client.graphql({query: updatePost, variables: { input }});

            setIsLiked(!isLiked);
            isLiked ? setLikes(likes - 1) : setLikes(likes + 1);
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsUpdating(false);
        }
    };

    return { isLiked, likes, handleLikePost, isUpdating };
};

export default useLikePost;
