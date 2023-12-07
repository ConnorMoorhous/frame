import { Avatar, Box, Button, Flex, VStack } from "@chakra-ui/react";
import useFollowUser from "../../hooks/useFollowUser";
import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const SuggestedUser = ({ user }) => {
	const { isFollowing, isUpdating, handleFollowUser } = useFollowUser(user.uid);
	const authUser = useAuthStore((state) => state.user);
	const [localUser, setLocalUser] = useState(user); 

	useEffect(() => {
        setLocalUser({
            ...localUser,
            followers: isFollowing
                ? [...localUser.followers, authUser.uid]
                : localUser.followers.filter((uid) => uid !== authUser.uid),
        });
    }, [isFollowing]); 

    const onFollowUser = async () => {
        await handleFollowUser(); 
    };

	return (
		<Flex justifyContent={"space-between"} alignItems={"center"} w={"full"} mt={10}>
			<Flex alignItems={"center"} gap={2}>
				<Link to={`/${localUser.username}`}>
					<Avatar src={localUser.profilePicURL} size={"md"} />
				</Link>
				<VStack spacing={2} alignItems={"flex-start"}>
					<Link to={`/${localUser.username}`}>
						<Box fontSize={12} fontWeight={"bold"}>
							{localUser.fullName}
						</Box>
					</Link>
					<Box fontSize={11} color={"gray.500"}>
						{localUser.followers.length} followers
					</Box>
				</VStack>
			</Flex>
			{authUser?.uid !== localUser.uid && (
				<Button
					fontSize={14}
					bg={"transparent"}
					p={0}
					h={"max-content"}
					fontWeight={"medium"}
					color={"#EEEEEE"}
					_hover={{ color: "#D65A31" }}
					cursor={"pointer"}
					onClick={onFollowUser}
					isLoading={isUpdating}
				>
					{isFollowing ? "Unfollow" : "Follow"}
				</Button>
			)}
		</Flex>
	);
};

export default SuggestedUser;
