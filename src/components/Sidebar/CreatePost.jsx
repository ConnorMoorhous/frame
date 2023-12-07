import {
	Box,
	Button,
	CloseButton,
	Flex,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Textarea,
	Tooltip,
	useDisclosure,
} from "@chakra-ui/react";
import { CreatePostLogo } from "../../assets/constants";
import { BsFillImageFill } from "react-icons/bs";
import { useRef, useState } from "react";
import usePreviewImg from "../../hooks/usePreviewImg";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import usePostStore from "../../store/postStore";
import useUserProfileStore from "../../store/userProfileStore";
import { useLocation } from "react-router-dom";
import { uploadData, getUrl } from 'aws-amplify/storage';
import { generateClient } from "aws-amplify/api";
import { createPost } from "../../graphql/mutations";

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [caption, setCaption] = useState("");
    const imageRef = useRef(null);
    const { handlePreviewChange, previewImg, setPreviewImg } = usePreviewImg();
	const [selectedImage, setSelectedImage] = useState(null);
    const showToast = useShowToast();
    const authUser = useAuthStore((state) => state.user);
    const createPostStore = usePostStore((state) => state.createPost);
    const [isLoading, setIsLoading] = useState(false);
	const maxFileSizeInBytes = 2 * 1024 * 1024; // 2MB

	const randomId = function(length = 6) {
		return Math.random().toString(36).substring(2, length+2);
	  };
	
	  const createUniquePostId = function() {
		return `${randomId(8)}-${randomId(4)}-${randomId(4)}-${randomId(4)}-${randomId(12)}`;
	  }

	// Function to upload the profile picture to S3
	const uploadPostPicture = async (selectedFile, userId, postId) => {
		const fileName = `users/${userId}/posts/${postId}.jpeg`;
		const uploadResponse = await uploadData({
			key: fileName,
			data: selectedFile,
			options: {
				contentType: selectedFile.type,
				accessLevel: 'public'
			}
		});
		
		const uploadResult = await uploadResponse.result;

		return uploadResult.key;
	};

    const handlePostCreation = async () => {
        if (isLoading || !selectedImage) return;
        setIsLoading(true);

		const client = generateClient();

        try {
			if (!selectedImage) {
				showToast("Error", "Please select an image", "error")
				return
			}

			let postId = createUniquePostId();

			// Upload the image to S3
			const uploadedKey = await uploadPostPicture(selectedImage, authUser.uid, postId);
			let imageURL = await getUrl({
				key: uploadedKey,
				options: {
					accessLevel: 'public'
				},
			});

			imageURL = `https://${imageURL.url.hostname}${imageURL.url.pathname}`;

            // Create the post object
            const newPost = {
				id: postId,
                caption,
                imgURL : imageURL,
				likes: [],
				createdAt: new Date().toISOString(),
                createdBy: authUser.uid
            };

            // Save the post data in DynamoDB
			await client.graphql({ query: createPost, variables: { input: newPost } })

            await createPostStore(newPost);

            onClose();
            setCaption("");
            setSelectedImage(null);
			setPreviewImg(null);
            showToast("Success", "Post created successfully", "success");
        } catch (error) {
			console.log(error);
            showToast("Error", error.message, "error");
        } finally {
            setIsLoading(false);
        }
    };

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file && file.type.startsWith("image/")) {
			if (file.size > maxFileSizeInBytes) {
				showToast("Error", "File size must be less than 2MB", "error");
				setSelectedImage(null);
				return;
			}

			handlePreviewChange(file);
			setSelectedImage(file);
		}
	}

	return (
		<>
			<Tooltip
				hasArrow
				label={"Create"}
				placement='right'
				ml={1}
				openDelay={500}
				display={{ base: "block", md: "none" }}
			>
				<Flex
					alignItems={"center"}
					gap={4}
					_hover={{ bg: "whiteAlpha.400" }}
					borderRadius={6}
					p={2}
					ml={1}
					w={{ base: 10, md: "full" }}
					justifyContent={{ base: "center", md: "flex-start" }}
					onClick={onOpen}
				>
					<CreatePostLogo />
					<Box display={{ base: "none", md: "block" }} ml={2} fontWeight={600} >Frame It</Box>
				</Flex>
			</Tooltip>

			<Modal isOpen={isOpen} onClose={onClose} size='xl' isCentered={true}>
				<ModalOverlay />

				<ModalContent bg={"#222831"} borderRadius={'8px'} color={"#EEEEEE"} >
					<ModalHeader mt={8} fontSize={'30px'} textAlign={'center'}>Frame Your Moment</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={2}>
					
					<Flex justifyContent={'center'} mb={8}>
						<Input type='file' hidden ref={imageRef} onChange={handleImageChange} />
							{!selectedImage && (
								<BsFillImageFill
									onClick={() => imageRef.current.click()}
									style={{ marginTop: "15px", marginLeft: "5px", cursor: "pointer", color: '#EEEEEE'}}
									size={300} 
								/>
							)}
							
							{selectedImage && (
								<Flex mb={0} w={"full"} position={"relative"} justifyContent={"center"}>
									<Image src={previewImg} alt='Selected img' />
									<CloseButton
										position={"absolute"}
										top={2}
										right={2}
										onClick={() => {
											setSelectedImage(null);
										}}
									/>
								</Flex>
							)}
						</Flex>
						<Textarea color={"#EEEEEE"}
							placeholder='Give your frame a voice...'
							value={caption}
							onChange={(e) => setCaption(e.target.value)}
							borderRadius={"5px"}
							outline={"none"} resize={"none"} _focus={{ outline: "none" }}
						/>

						
					</ModalBody>

					<ModalFooter justifyContent={'center'}>
						<Button mr={3} onClick={handlePostCreation} isLoading={isLoading} backgroundColor={'#D65A31'} color={'#222831'}>
							Post
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default CreatePost;
