import { Avatar, Button, Divider, Flex, GridItem, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Comment from "../Comment/Comment";
import PostFooter from "../FeedPosts/PostFooter";
import useUserProfileStore from "../../store/userProfileStore";
import useAuthStore from "../../store/authStore";
import useShowToast from "../../hooks/useShowToast";
import { useState, useEffect } from "react";
import { remove } from 'aws-amplify/storage';
import usePostStore from "../../store/postStore";
import Caption from "../Comment/Caption";
import { generateClient } from "aws-amplify/api";
import { deletePost } from "../../graphql/mutations";
import { getCommentsByPost } from "../../graphql/queries";

const ProfilePost = ({ post }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const userProfile = useUserProfileStore((state) => state.userProfile);
    const authUser = useAuthStore((state) => state.user);
    const showToast = useShowToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const deletePostStore = usePostStore((state) => state.deletePost);
    const decrementPostsCount = useUserProfileStore((state) => state.deletePost);
	const likeCount = post.likes ? post.likes.length : 0;
	const [triggerEffect, setTriggerEffect] = useState(false);
	const [comments, setComments] = useState([]);
	const commentCount = comments ? comments.length : 0;

	useEffect(() => {
        const fetchComments = async () => {
            const client = generateClient();
            try {
                const response = await client.graphql({ query: getCommentsByPost, variables: { postId: post.id } });
                setComments(response.data.getCommentsByPost.items);
            } catch (error) {
                showToast("Error", "Failed to load comments", "error");
            }
        };

        if (isOpen) {
            fetchComments();
        }
    }, [isOpen, post.id, triggerEffect]);

    const handleDeletePost = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        if (isDeleting) return;

		const client = generateClient();

        setIsDeleting(true);
        try {
            // Delete the image from S3
            await remove(`users/${authUser.id}/posts/${post.id}.jpeg`);

            // Update the DynamoDB table to remove the post
            await client.graphql({ query: deletePost, variables: { input: { id: post.id } } });

            deletePostStore(post.id);
            decrementPostsCount(post.id);
            showToast("Success", "Post deleted successfully", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsDeleting(false);
        }
    };

	return (
		<>
			<GridItem
				cursor={"pointer"}
				borderRadius={4}
				overflow={"hidden"}
				border={"1px solid"}
				borderColor={"whiteAlpha.300"}
				position={"relative"}
				aspectRatio={1 / 1}
				onClick={onOpen}
			>
				<Flex
					opacity={0}
					_hover={{ opacity: 1 }}
					position={"absolute"}
					top={0}
					left={0}
					right={0}
					bottom={0}
					bg={"blackAlpha.700"}
					transition={"all 0.3s ease"}
					zIndex={1}
					justifyContent={"center"}
				>
					<Flex alignItems={"center"} justifyContent={"center"} gap={50}>
						<Flex>
							<AiFillHeart size={20} />
							<Text fontWeight={"bold"} ml={2}>
								{likeCount}
							</Text>
						</Flex>

						<Flex>
							<FaComment size={20} />
							<Text fontWeight={"bold"} ml={2}>
								{commentCount}
							</Text>
						</Flex>
					</Flex>
				</Flex>

				<Image src={post.imgURL} alt='profile post' w={"100%"} h={"100%"} objectFit={"cover"} />
			</GridItem>

			<Modal isOpen={isOpen} onClose={onClose} isCentered={true} size={{ base: "3xl", md: "5xl" }}>
				<ModalOverlay />
				<ModalContent borderRadius={8}>
					<ModalCloseButton color={'#EEEEEE'} />
					<ModalBody bg={"#222831"} color={'#EEEEEE'}  pb={5} borderRadius={8} padding={10}>
						<Flex
							gap='4'
							w={{ base: "90%", sm: "70%", md: "full" }}
							mx={"auto"}
							maxH={"90vh"}
							minH={"50vh"}
						>
							<Flex
								borderRadius={4}
								overflow={"hidden"}
								
								flex={1.5}
								justifyContent={"center"}
								alignItems={"center"}
							>
								<Image borderRadius={8} src={post.imgURL} alt='profile post' />
							</Flex>
							<Flex flex={1} flexDir={"column"} px={10} display={{ base: "none", md: "flex" }}>
								<Flex alignItems={"center"} justifyContent={"space-between"}>
									<Flex alignItems={"center"} gap={4}>
										<Avatar src={userProfile.profilePicURL} size={"sm"}/>
										<Text fontWeight={"bold"} fontSize={12}>
											{userProfile.username}
										</Text>
									</Flex>

									{authUser?.uid === userProfile.uid && (
										<Button
											size={"sm"}
											bg={"transparent"}
											_hover={{ bg: "whiteAlpha.300", color: "red.600" }}
											borderRadius={4}
											p={1}
											onClick={handleDeletePost}
											isLoading={isDeleting}
										>
											<MdDelete color="#D65A31" size={20} cursor='pointer' />
										</Button>
									)}
								</Flex>
								<Divider my={4} />

								<VStack w='full' alignItems={"start"} maxH={"350px"} overflowY={"auto"}>
									{post.caption && <Caption post={post} />}
									{comments.map((comment) => (
										<Comment key={comment.id} comment={comment} />
									))}
								</VStack>
								<Divider my={4} />

								<PostFooter setTriggerEffect={setTriggerEffect} isProfilePage={true} post={post} />
							</Flex>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ProfilePost;
