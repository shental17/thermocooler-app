import {useState} from 'react';
import {useAuthContext} from './useAuthContext';

export const useThermocooler = () => {
  const {user} = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [thermocoolerData, setThermocoolerData] = useState(null);

  const API_URL = 'http://localhost:4000/api/thermocooler';

  const getThermocooler = async thermocoolerId => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const token = user.token;

      console.log('Token:', token);
      const response = await fetch(`${API_URL}/${thermocoolerId}`, {
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
      setThermocoolerData(json);
      console.log('Thermocooler Data:', json);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      setIsLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  const updatePowerState = async (thermocoolerId, powerState) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const token = user.token;

      console.log('Token:', token);
      console.log('Power State:', powerState);
      const response = await fetch(`${API_URL}/${thermocoolerId}/power`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add the token for authentication
        },
        body: JSON.stringify({powerState}),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error || 'An error occurred. Please try again.');
        console.log('Response is not okay: ', error);
        return;
      }
      setThermocoolerData(prev => ({...prev, powerState}));
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      setIsLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  const updateFanSpeed = async (thermocoolerId, fanSpeed) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    console.log('Fan Speed:', fanSpeed);

    try {
      const token = user.token;

      const response = await fetch(`${API_URL}/${thermocoolerId}/fan-speed`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add the token for authentication
        },
        body: JSON.stringify({fanSpeed}),
      });

      const json = await response.json();
      console.log('Response:', json);

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error || 'An error occurred. Please try again.');
        console.log('Response is not okay: ', error);
        return;
      }
      setThermocoolerData(prev => ({...prev, fanSpeed}));
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      setIsLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  const updateSetTemperature = async (thermocoolerId, setTemperature) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const token = user.token;

      const response = await fetch(
        `${API_URL}/${thermocoolerId}/set-temperature`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Add the token for authentication
          },
          body: JSON.stringify({setTemperature}),
        },
      );

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error || 'An error occurred. Please try again.');
        console.log('Response is not okay: ', error);
        return;
      }
      setThermocoolerData(prev => ({...prev, setTemperature}));
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      setIsLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  return {
    getThermocooler,
    updatePowerState,
    updateSetTemperature,
    updateFanSpeed,
    thermocoolerData,
    isLoading,
    error,
    isSuccess,
  };
};
