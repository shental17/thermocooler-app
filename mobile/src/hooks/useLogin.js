import {useState} from 'react';
import {useAuthContext} from './useAuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLogin = () => {
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const {dispatch} = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError({});

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
      });
      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(
          json.error.errors || {
            general: json.error.message,
          },
        );
        return;
      }

      console.log('Saving user to AsyncStorage:', json);

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
    } catch (error) {
      setIsLoading(false);
      setError({general: 'A catch error occurred. Please try again.'});
    }
  };

  return {login, isLoading, error};
};
