import { signUp } from 'aws-amplify/auth';
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import { generateClient } from 'aws-amplify/api';
import { createUser } from '../graphql/mutations'; 
import { getUserByUsername } from '../graphql/queries';

const useSignUpWithEmailAndPassword = () => {
  const showToast = useShowToast();
  const loginUser = useAuthStore((state) => state.login);

  const client = generateClient();

  const signup = async (inputs) => {
    if (!inputs.email || !inputs.password || !inputs.username || !inputs.fullName) {
      showToast("Error", "Please fill all the fields", "error");
      return;
    }

    try {
      // Check if username already exists in DynamoDB
      const usernameData = await client.graphql({ query: getUserByUsername, variables: { username: inputs.username } });
      if (usernameData.data.getUserByUsername.items.length > 0) {
          showToast("Error", "Username already exists", "error");
          return;
      }

      // Sign up with Cognito
      const { userId } = await signUp({
        username: inputs.email,
        password: inputs.password,
        options: {
          autoSignIn: true,
        }
      });

      // Setup the user object
      const newUser = {
        uid: userId,
        email: inputs.email,
        username: inputs.username,
        fullName: inputs.fullName,
        profilePicURL: "",
        bio: "",
        createdAt: new Date().toISOString(),
        followers: [],
        following: [],
        posts: [],
      }

      // Create a new user in DynamoDB
      await client.graphql({ query: createUser, variables: { input: newUser }});

      localStorage.setItem("user-info", JSON.stringify(newUser));
      loginUser(newUser);

      return inputs.email;
    } catch (error) {
      showToast("Error", error.message, "error");
      return null;
    }
  };

  return { signup };
};

export default useSignUpWithEmailAndPassword;
