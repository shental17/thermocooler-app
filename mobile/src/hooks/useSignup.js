import {useState} from 'react';
import {useAuthContext} from './useAuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useSignup = () => {
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const {dispatch} = useAuthContext();

  const signup = async (username, email, password, confirmPassword) => {
    setIsLoading(true);
    setError({});
    setIsSuccess(false);

    try {
      const response = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, email, password, confirmPassword}),
      });
      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error.errors);
        return;
      }

      // Save the user to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(json))
        .then(() => {
          console.log('User saved to AsyncStorage');
        })
        .catch(error => {
          console.error('Error saving user to AsyncStorage:', error);
          setError({
            general:
              'An error occurred while saving user data. Please try again.',
          });
          setIsLoading(false);
          return;
        });

      // Update the auth context
      dispatch({type: 'LOGIN', payload: json});

      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      setIsLoading(false);
      setError({general: 'An error occurred. Please try again.'});
    }
  };

  return {signup, isLoading, error, isSuccess};
};
