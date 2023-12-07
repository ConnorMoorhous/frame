import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { uploadData, getUrl } from 'aws-amplify/storage'; 
import useUserProfileStore from "../store/userProfileStore";
import { updateUser } from "../graphql/mutations";
import { generateClient } from 'aws-amplify/api';
import { getUserByUsername } from '../graphql/queries';

const useEditProfile = () => {
	const [isUpdating, setIsUpdating] = useState(false);

	const authUser = useAuthStore((state) => state.user);
	const setAuthUser = useAuthStore((state) => state.setUser);
	const setUserProfile = useUserProfileStore((state) => state.setUserProfile);
	const client = generateClient();
	const showToast = useShowToast();

	// Function to upload the profile picture to S3
	const uploadProfilePicture = async (selectedFile, userId) => {
		const fileName = `profile/${userId}/${selectedFile.name}`;

		const uploadResponse = await uploadData({
			key: fileName,
			data: selectedFile,
			options: {
				contentType: selectedFile.type,
				accessLevel: 'public'
			}
		});
		
		const uploadResult = await uploadResponse.result;

		return uploadResult.key;
	};
	
	const editProfile = async (inputs, selectedFile) => {
		if (isUpdating || !authUser) return;
		setIsUpdating(true);
	  
		try {
			// Check if username already exists in DynamoDB
			if (inputs.username && inputs.username !== authUser.username) {
				const usernameData = await client.graphql({ query: getUserByUsername, variables: { username: inputs.username } });
				if (usernameData.data.getUserByUsername.items.length > 0) {
					showToast("Error", "Username already exists", "error");
					return;
				}
			}

			let profilePicURL = authUser.profilePicURL;
		
			if (selectedFile) {
				// Upload new profile picture and get URL
				const uploadedKey = await uploadProfilePicture(selectedFile, authUser.uid);
				profilePicURL = await getUrl({
					key: uploadedKey,
					options: {
						accessLevel: 'public'
					},
				});

				profilePicURL = `https://${profilePicURL.url.hostname}${profilePicURL.url.pathname}`;
			}
		
			const updatedUser = {
				...authUser,
				fullName: inputs.fullName || authUser.fullName,
				username: inputs.username || authUser.username,
				bio: inputs.bio || authUser.bio,
				profilePicURL: profilePicURL
			};

			delete updatedUser.updatedAt;
			delete updatedUser.__typename;

			// Update the user in DynamoDB
			await client.graphql({ query: updateUser, variables: { input: updatedUser } });

			localStorage.setItem("user-info", JSON.stringify(updatedUser));
			setAuthUser(updatedUser);
			setUserProfile(updatedUser);
			showToast("Success", "Profile updated successfully", "success");
		} catch (error) {
		  showToast("Error", error.message, "error");
		} finally {
		  setIsUpdating(false);
		}
	  };

	return { editProfile, isUpdating };
};

export default useEditProfile;
