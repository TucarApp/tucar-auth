import React, { useReducer } from 'react';
import { AuthContext, AuthDispatchContext } from './context';
import initialAuthContext from './auth';
import AuthReducer from './reducer';

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialAuthContext);

  return (
    <AuthContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
};

export default AppProvider;
