import {createContext, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {user: action.payload};
    case 'LOGOUT':
      return {user: null};
    case 'UPDATE_USER':
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const loadUser = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        dispatch({type: 'LOGIN', payload: JSON.parse(user)});
      }
    };
    loadUser();
  }, []);
  console.log('AuthContext state:  ', state);
  return (
    <AuthContext.Provider value={{...state, dispatch}}>
      {children}
    </AuthContext.Provider>
  );
};
