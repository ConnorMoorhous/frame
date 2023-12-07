import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Alert, AlertIcon, Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import useSignUpWithEmailAndPassword from "../../hooks/useSignUpWithEmailAndPassword";
import ConfirmUser from "./ConfirmUser"; 

const Signup = () => {
	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
    const { loading, error, signup } = useSignUpWithEmailAndPassword();
    const [isConfirming, setIsConfirming] = useState(false);
	const [signedUpEmail, setSignedUpEmail] = useState("");

    const handleSignUp = async () => {
        const email = await signup(inputs);
        if (email) {
			setSignedUpEmail(email);
            setIsConfirming(true);
        }
    };

	if (isConfirming) {
        return (
			<ConfirmUser 
				username={signedUpEmail} 
				onConfirmed={() => {setIsConfirming(false)}} 
			/>
		);
    }

	return (
		<>
			<Input
				placeholder='Email'
				fontSize={16}
				fontWeight={600}
				type='email'
				size={"sm"}
				value={inputs.email}
				onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
			/>
			<Input
				placeholder='Username'
				fontSize={16}
				fontWeight={600}
				type='text'
				size={"sm"}
				value={inputs.username}
				onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
			/>
			<Input
				placeholder='Full Name'
				fontSize={16}
				fontWeight={600}
				type='text'
				size={"sm"}
				value={inputs.fullName}
				onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
			/>
			<InputGroup>
				<Input
					placeholder='Password'
					fontSize={16}
					fontWeight={600}
					type={showPassword ? "text" : "password"}
					value={inputs.password}
					size={"sm"}
					onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
				/>
				<InputRightElement h='full'>
					<Button variant={"ghost"} size={"sm"} onClick={() => setShowPassword(!showPassword)}>
						{showPassword ? <ViewIcon /> : <ViewOffIcon />}
					</Button>
				</InputRightElement>
			</InputGroup>

			{error && (
				<Alert status='error' fontSize={13} p={2} borderRadius={4}>
					<AlertIcon fontSize={12} />
					{error.message}
				</Alert>
			)}

			<Button
				w={"full"}
				colorScheme='orange'
				size={"sm"}
				fontSize={14}
				isLoading={loading}
				onClick={handleSignUp}
			>
				Sign Up
			</Button>
		</>
	);
};

export default Signup;
