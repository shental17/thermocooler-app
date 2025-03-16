import {useState} from 'react';
import {useAuthContext} from './useAuthContext';

export const useEnergyUsage = () => {
  const {user} = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [electricityTariff, setElectricityTariff] = useState(null);
  const [todayEnergy, setTodayEnergy] = useState(null);
  const [dailyEnergy, setDailyEnergy] = useState({});
  const [monthlyEnergy, setMonthlyEnergy] = useState(null);

  const API_URL = 'http://localhost:4000/api/energy';

  const getElectricityTariff = async () => {
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
      console.log('Response json: ' + json);
      setElectricityTariff(json.electricityTariff);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      setIsLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  const updateElectricityTariff = async electricityTariff => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const token = user.token;

      console.log('Token:', token);
      const response = await fetch(`${API_URL}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add the token for authentication
        },
        body: JSON.stringify({electricityTariff}),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error || 'An error occurred. Please try again.');
        console.log('Response is not okay: ', error);
        return;
      }
      setElectricityTariff(electricityTariff);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      setIsLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  const getEnergyUsage = async () => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const token = user.token;

      console.log('Token:', token);
      const response = await fetch(`${API_URL}/usage`, {
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
      setTodayEnergy(json.dailyEnergy || 0);
      setDailyEnergy(json.weeklyEnergy);
      setMonthlyEnergy(json.monthlyEnergy);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      setIsLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  return {
    getElectricityTariff,
    updateElectricityTariff,
    getEnergyUsage,
    electricityTariff,
    todayEnergy,
    dailyEnergy,
    monthlyEnergy,
    isLoading,
    error,
    isSuccess,
  };
};
