import {useState} from 'react';
import {useAuthContext} from './useAuthContext';

export const useThermocoolerList = () => {
  const {user} = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [allThermocoolerData, setAllThermocoolerData] = useState(null);

  const API_URL = 'http://localhost:4000/api/thermocooler';

  const getAllThermocooler = async () => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const token = user.token;

      console.log('Token:', token);
      const response = await fetch(`${API_URL}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add the token for authentication
        },
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error || 'An error occurred. Please try again.');
        console.log('Response is not okay: ', error);
        return;
      }
      setAllThermocoolerData(json);
      console.log('All Thermocooler Data:', json);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      setIsLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  const addThermocooler = async (name, esp32Address) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const token = user.token;

      console.log('Token:', token);
      const response = await fetch(`${API_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add the token for authentication
        },
        body: JSON.stringify({name, esp32Address}),
      });

      const json = await response.json();
      console.log('Response:', json);

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error || 'An error occurred. Please try again.');
        console.log('Response is not okay: ', error);
        return;
      }
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      setIsLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  const deleteThermocooler = async thermocoolerId => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const token = user.token;

      const response = await fetch(`${API_URL}/${thermocoolerId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add the token for authentication
        },
      });

      const json = await response.json();
      console.log('Response:', json);

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error || 'An error occurred. Please try again.');
        console.log('Response is not okay: ', error);
        return;
      }
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      setIsLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  return {
    getAllThermocooler,
    addThermocooler,
    deleteThermocooler,
    allThermocoolerData,
    isLoading,
    error,
    isSuccess,
  };
};
