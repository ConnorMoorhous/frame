import { Box, Flex, Image, VStack } from "@chakra-ui/react";
import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const AuthForm = () => {
	const [isLogin, setIsLogin] = useState(true);

	return (
		<>
			<Box borderRadius={8} fontWeight={600} backgroundColor={'#EEEEEE'} color={'#222831'} paddingY={12} paddingX={10}>
				<VStack spacing={4}>
					<Image src='/frame-black.png' h={24} cursor={"pointer"} alt='Frame' padding={2} mb={4} />
					{isLogin ? <Login /> : <Signup />}
				</VStack>
			</Box>

			<Box borderRadius={8} fontWeight={600} backgroundColor={'#EEEEEE'} color={'#222831'} padding={5}>
				<Flex alignItems={"center"} justifyContent={"center"}>
					<Box mx={2} fontSize={14}>
						{isLogin ? "Don't have an account?" : "Already have an account?"}
					</Box>
					<Box onClick={() => setIsLogin(!isLogin)} color={'#D65A31'} cursor={"pointer"}>
						{isLogin ? "Sign up" : "Log in"}
					</Box>
				</Flex>
			</Box>
		</>
	);
};

export default AuthForm;
