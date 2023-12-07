import { useState } from "react";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import { generateClient } from 'aws-amplify/api';
import { createComment } from '../graphql/mutations';

const usePostComment = () => {
    const [isCommenting, setIsCommenting] = useState(false);
    const showToast = useShowToast();
    const authUser = useAuthStore((state) => state.user);

    const handlePostComment = async (postId, commentText) => {
        if (isCommenting || !authUser) return;
        setIsCommenting(true);

        try {
            const client = generateClient();
            const newCommentInput = {
                comment: commentText,
                createdBy: authUser.uid,
                createdAt: new Date().toISOString(),
                postId: postId,
            };

            // Create the new comment
            await client.graphql({ query: createComment, variables: { input: newCommentInput } });

            showToast("Success", "Comment added successfully", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsCommenting(false);
        }
    };

    return { isCommenting, handlePostComment };
};

export default usePostComment;
