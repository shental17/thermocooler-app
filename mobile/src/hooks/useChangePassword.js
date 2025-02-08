import {useState} from 'react';
import {useAuthContext} from './useAuthContext';

export const useChangePassword = () => {
  const {user} = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const {dispatch} = useAuthContext();

  const changePassword = async (password, newPassword, confirmNewPassword) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      console.log(
        'Updating user password:',
        password,
        newPassword,
        confirmNewPassword,
      );
      const token = user.token;

      console.log('Token:', token);
      const response = await fetch(
        'http://localhost:4000/api/profile/change-password',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Add the token for authentication
          },
          body: JSON.stringify({password, newPassword, confirmNewPassword}),
        },
      );

      console.log('Response:', response);

      const json = await response.json();

      console.log('Json:', json);
      if (!response.ok) {
        setIsLoading(false);
        setError(json.errors || 'An error occurred. Please try again.');
        console.log('Response is not okay: ', error);
        return;
      }

      // Update the auth context with the new user data
      dispatch({type: 'UPDATE_USER', payload: json.user});

      console.log('User updated successfully:', json.user);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      setIsLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  return {changePassword, isLoading, error, isSuccess};
};
