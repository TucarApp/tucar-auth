
import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

export const AuthDispatchContext = createContext(null);


export const useGlobalState = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a AppProvider');
  }
  return context;
}

export const useGlobalAuthParams = () => {
  const context = useContext(AuthContext);
  return context.authParams;
}

export const useGlobalCompleted = () => {
  const context = useContext(AuthContext);
  return context.completed;
}

export const useGlobalAuthFlow = () => {
  const context = useContext(AuthContext);
  return context.authFlow;
}

export const useGlobalAuthMethods = () => {
  const context = useContext(AuthContext);
  return context.authMethods;
}

export const useGlobalAuthData = () => {
  const context = useContext(AuthContext);
  return context.authData;
}

export const useGlobalRequestPayload = () => {
  const context = useContext(AuthContext);
  return context.requestPayload;
}

export const useGlobalAuthenticationError = () => {
  const context = useContext(AuthContext);
  return context.authenticationError;
}

export const useGlobalDispatch = () => {
  const context = useContext(AuthDispatchContext);
  if (!context) {
    throw new Error('useGlobalDispatch must be used within a AppProvider');
  }
  return context;
}
