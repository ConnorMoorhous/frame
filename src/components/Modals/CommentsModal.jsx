import {
	Button,
	Flex,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import Comment from "../Comment/Comment";
import usePostComment from "../../hooks/usePostComment";
import { useEffect, useRef, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { getCommentsByPost } from "../../graphql/queries";
import useShowToast from "../../hooks/useShowToast";

const CommentsModal = ({ isOpen, onClose, post }) => {
	const { handlePostComment, isCommenting } = usePostComment();
	const [comments, setComments] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const commentRef = useRef(null);
	const commentsContainerRef = useRef(null);
	const showToast = useShowToast();

	const handleSubmitComment = async (e) => {
		e.preventDefault();
		await handlePostComment(post.id, commentRef.current.value);
		commentRef.current.value = "";
	};

	useEffect(() => {
		const fetchComments = async () => {
            const client = generateClient();
            try {
				setIsLoading(true);
                const response = await client.graphql({ query: getCommentsByPost, variables: { postId: post.id } });
                setComments(response.data.getCommentsByPost.items);
				setIsLoading(false);
            } catch (error) {
                showToast("Error", "Failed to load comments", "error");
            }
        };

		const scrollToBottom = () => {
			commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
		};
		if (isOpen) {
			fetchComments();
			setTimeout(() => {
				scrollToBottom();
			}, 100);
		}
	}, [isOpen, isCommenting]);

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered={true} motionPreset='slideInLeft'>
			<ModalOverlay />
			<ModalContent bg={"#222831"} color={'#EEEEEE'}  maxW={"400px"}>
				<ModalHeader>Comments</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
					<Flex
						mb={4}
						gap={4}
						flexDir={"column"}
						maxH={"250px"}
						overflowY={"auto"}
						ref={commentsContainerRef}
					>
						{isLoading ? (
                    		<p>Loading comments...</p>
							) : (
								comments.map((comment, idx) => (
									<Comment key={idx} comment={comment} />
								))
							)}
					</Flex>
					<form onSubmit={handleSubmitComment} style={{ marginTop: "2rem" }}>
						<Input placeholder='Comment' size={"sm"} ref={commentRef} />
						<Flex w={"full"} justifyContent={"flex-end"}>
							<Button type='submit' ml={"auto"} backgroundColor={"#D65A31"} size={"sm"} my={4} isLoading={isCommenting}>
								Post
							</Button>
						</Flex>
					</form>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default CommentsModal;