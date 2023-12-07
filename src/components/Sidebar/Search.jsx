import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Tooltip,
	useDisclosure,
} from "@chakra-ui/react";
import { SearchLogo } from "../../assets/constants";
import useSearchUser from "../../hooks/useSearchUser";
import { useRef } from "react";
import SuggestedUser from "../SuggestedUsers/SuggestedUser";

const Search = () => {
	const { isOpen, onOpen, onClose: baseOnClose } = useDisclosure();
	const searchRef = useRef(null);
	const { user, isLoading, getUserProfile, setUser, clearUser } = useSearchUser();

	const onClose = () => {
        clearUser(); 
        baseOnClose(); 
    };

	const handleSearchUser = (e) => {
		e.preventDefault();
		getUserProfile(searchRef.current.value);
	};

	return (
		<>
			<Tooltip
				hasArrow
				label={"Search"}
				placement='right'
				ml={1}
				openDelay={500}
				display={{ base: "block", md: "none" }}
			>
				<Flex
					alignItems={"center"}
					gap={6}
					_hover={{ bg: "whiteAlpha.400" }}
					borderRadius={6}
					p={2}
					ml={1}
					w={{ base: 10, md: "full" }}
					justifyContent={{ base: "center", md: "flex-start" }}
					onClick={onOpen}
				>
					<SearchLogo />
					<Box display={{ base: "none", md: "block" }} fontWeight={600}>Search</Box>
				</Flex>
			</Tooltip>

			<Modal isOpen={isOpen} onClose={onClose} motionPreset='slideInLeft' isCentered={true}>
				<ModalOverlay />
				<ModalContent bg={"#222831"} color={'#EEEEEE'} borderRadius={8} textAlign={'center'} maxW={"500px"} padding={5}>
					<ModalHeader fontSize={30}>Search For A User</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<form onSubmit={handleSearchUser}>
							<FormControl>
								<Input placeholder='Enter a username' ref={searchRef} />
							</FormControl>

							<Flex w={"full"} alignContent={"center"}>
								<Button type='submit' color={'#222831'} p={4} backgroundColor={"#D65A31"} ml={"auto"} size={"sm"} mt={5} isLoading={isLoading}>
									Search
								</Button>
							</Flex>
						</form>
						{user && <SuggestedUser user={user} setUser={setUser} />}
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default Search;