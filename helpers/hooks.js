

export const authorize = async (
  authorizeCaller,
  udiFingerPrintCaller,
  {
    responseType,
    clientId,
    redirectUri,
    scope,
    state,
    tenancy,
    udiFingerprint,
  },
  dispatcher,
) => {
  try {
    const {
      authSessionId,
      authFlow,
      completed,
      authData,
      authMethods,
    } = await authorizeCaller(
      responseType,
      clientId,
      redirectUri,
      scope,
      state,
      tenancy,
    );

    await udiFingerPrintCaller(authSessionId, udiFingerprint);

    dispatcher({
      type: 'authParam',
      payload: {
        responseType,
        clientId,
        redirectUri,
        scope,
        state,
        tenancy,
        authSessionId,
        udiFingerprint,
      },
    });
    dispatcher({
      type: 'completed',
      payload: {
        completed,
      },
    });
    dispatcher({
      type: 'authFlow',
      payload: {
        authFlow,
      },
    });
    dispatcher({
      type: 'authMethods',
      payload: authMethods,
    });
    dispatcher({
      type: 'authData',
      payload: authData,
    });
    dispatcher({
      type: 'authenticationError',
      payload: '',
    });
  } catch (error) {
    dispatcher({
      type: 'authenticationError',
      payload: error?.message || 'default',
    });
  }
};

export const submitAuthentication = async (
  authCalluer,
  {
    authSessionId,
    udiFingerprint,
    methodType,
    authenticationActions
  },
  dispatcher,
) => {
  try {
    const {
      authFlow,
      authData,
      authMethods,
      completed
    } = await authCalluer(
      authSessionId,
      udiFingerprint,
      methodType,
      authenticationActions
    )
    dispatcher({
      type: 'completed',
      payload: {
        completed,
      },
    });
    dispatcher({
      type: 'authFlow',
      payload: {
        authFlow,
      },
    });
    dispatcher({
      type: 'authMethods',
      payload: authMethods,
    });
    dispatcher({
      type: 'authData',
      payload: authData,
    });
    dispatcher({
      type: 'requestPayload',
      payload: {
        stepType: 'clean'
      },
    })
    dispatcher({
      type: 'authenticationError',
      payload: '',
    });
  } catch (error) {
    dispatcher({
      type: 'authenticationError',
      payload: error?.message || 'default',
    });
  }
};
