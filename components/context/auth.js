/*
  This file is used to store the initial context for the AuthContext.
  This is used to store the initial values for the AuthContext.
  initialAuthContext is an object that contains the initial values for the AuthContext
  with the following properties:
  authParams: {
    clientId: 'your-client-id',
    redirectUri: 'your-redirect-uri',
    scope: 'your-scope',
    responseType: 'code',
    state: 'your-state',
    tenancy: 'your-tenancy',
    authSessionId: "auth-id",
    udiFingerPrint: "udi-finger-print",
  },
  completed: false,
  authFlow: "sign-in | sign_up,
  authMethods: [],
  authData: [],
  requestPayload: [],
  authenticationError: ',
*/

const initialAuthContext = {
  authParams: null,
  completed: false,
  authFlow: null,
  authMethods: [],
  authData: {},
  requestPayload: [],
  authenticationError: '',
}

export default initialAuthContext;