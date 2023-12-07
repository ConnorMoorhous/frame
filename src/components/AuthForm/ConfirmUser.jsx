import React, { useState } from 'react';
import { Alert, AlertIcon, Box, Button, Input } from "@chakra-ui/react";
import useConfirmUser from '../../hooks/useConfirmUser';
import { autoSignIn } from 'aws-amplify/auth';

const ConfirmUser = ({ username, onConfirmed }) => {
  const [code, setCode] = useState('');
  const { confirmUser, isLoading, error } = useConfirmUser();

  const handleConfirm = async () => {
    console.log('username', username, 'code', code)
    const success = await confirmUser(username, code);
    if (success) {
      await autoSignIn();
      onConfirmed();
    }
  };

  return (
    <div>
      <Box mb={4}>
        We sent you a verification code to your email address.
        </Box>
      <Box mb={4}>
        Please enter it here to confirm your account.
      </Box>
      <Input
        placeholder='Verification Code'
        fontSize={16}
        fontWeight={600}
        mb={4}
        type='text'
        size={"sm"}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      {error && (
				<Alert status='error' fontSize={13} p={2} borderRadius={4}>
					<AlertIcon fontSize={12} />
					{error.message}
				</Alert>
			)}
      <Button
        w={"full"}
        colorScheme='blue'
        size={"sm"}
        fontSize={14}
        isLoading={isLoading}
        onClick={handleConfirm}
      >
        {isLoading ? 'Confirming...' : 'Confirm'}
      </Button>
    </div>
  );
};

export default ConfirmUser;
