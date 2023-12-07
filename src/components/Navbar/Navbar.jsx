import { Button, Container, Flex, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<Container maxW={"container.lg"} my={4}>
			<Flex w={"full"} justifyContent={{ base: "center", sm: "space-between" }} alignItems={"center"}>
				<Image src='/frame.png' h={20} display={{ base: "none", sm: "block" }} cursor={"pointer"} />
				<Flex gap={4}>
					<Link to='/auth'>
						<Button backgroundColor={'#EEEEEE'} _hover={{ color: "white", backgroundColor: "#D65A31" }} size={"sm"}>
							Login
						</Button>
					</Link>
					<Link to='/auth'>
						<Button backgroundColor={'#D65A31'} _hover={{ color: "#222831", backgroundColor: "#EEEEEE" }} size={"sm"}>
							Signup
						</Button>
					</Link>
				</Flex>
			</Flex>
		</Container>
	);
};

export default Navbar;
