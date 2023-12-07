import { useState } from 'react';
import { confirmSignUp} from 'aws-amplify/auth';

const useConfirmUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const confirmUser = async (username, code) => {
    setIsLoading(true);
    try {
      const { isSignUpComplete } = await confirmSignUp({ 
        username, 
        confirmationCode: code 
      });

      setIsLoading(false);

      return isSignUpComplete;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      return false;
    }
  };

  return {
    confirmUser,
    isLoading,
    error,
  };
};

export default useConfirmUser;
