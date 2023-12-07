import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCommentsByPost } from '../graphql/queries'; // Adjust this import as per your queries

const useGetCommentsByPost = (postId) => {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            if (!postId) return;
            setIsLoading(true);

            try {
                const client = generateClient();
                const response = await client.graphql({ query: getCommentsByPost, variables: { postId } });
                setComments(response.data.getCommentsByPost.items);
            } catch (error) {
                console.error('Error fetching comments:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();
    }, [postId]);

    return { comments, isLoading };
};

export default useGetCommentsByPost;