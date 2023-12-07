import { signIn } from 'aws-amplify/auth';
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import { generateClient } from 'aws-amplify/api';
import { getUserByEmail } from '../graphql/queries';

const useLogin = () => {
  const showToast = useShowToast();
  const loginUser = useAuthStore((state) => state.login);

  const client = generateClient();

  const login = async (inputs) => {
    if (!inputs.email || !inputs.password) {
      showToast("Error", "Please fill all the fields", "error");
      return;
    }

    const signInInputs = {
      username: inputs.email,
      password: inputs.password,
    }

    try {
      const { isSignedIn } = await signIn(signInInputs);

      if ( isSignedIn ) {
        const response = await client.graphql({ query: getUserByEmail, variables: { email: inputs.email } })
        const userInfo = response.data.getUserByEmail.items[0];
        localStorage.setItem("user-info", JSON.stringify(userInfo));
        loginUser(userInfo);
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };
  
  return { login };
};

export default useLogin;
