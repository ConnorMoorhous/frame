import { Avatar, Button, Flex, Text } from "@chakra-ui/react";
import useLogout from "../../hooks/useLogout";
import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";

const SuggestedHeader = () => {
	const { handleLogout, isLoggingOut } = useLogout();
	const authUser = useAuthStore((state) => state.user);

	if (!authUser) return null;

	return (
		<Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
			<Flex alignItems={"center"} gap={4}>
				<Link to={`${authUser.username}`}>
					<Avatar size={"lg"} src={authUser.profilePicURL} />
				</Link>
				<Link to={`${authUser.username}`}>
					<Text fontSize={12} fontWeight={"bold"}>
						{authUser.username}
					</Text>
				</Link>
			</Flex>
			<Button
				size={"xs"}
				background={"transparent"}
				_hover={{ background: "transparent", color: "#993d1e" }}
				fontSize={14}
				fontWeight={"medium"}
				color={"#D65A31"}
				onClick={handleLogout}
				isLoading={isLoggingOut}
				cursor={"pointer"}
			>
				Log out
			</Button>
		</Flex>
	);
};

export default SuggestedHeader;
