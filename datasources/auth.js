const AuthDatasource = {
  async authorize(responseType, clientId, redirectUri, scope, state, tenancy) {
    const queryParams = {
      response_type: responseType,
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
      state,
      tenancy,
    };
    const response = await fetch(
      `/api/v1/oauth/authorize/?${new URLSearchParams(queryParams)}`,
      {
        method: 'GET',
    });
    if (response.status !== 200) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.detail?.errors? errorResponse.detail.errors : 'default');
    }
    return response.json();
  },
  async updateUdiFingerprint(authSessionId, udiFingerprint) {
    const response = await fetch(
      `/api/v1/oauth/udi-fingerprint`,
      {
        method: 'PATCH',
        body: JSON.stringify({ authSessionId, udiFingerprint }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status > 300) {
      throw new Error('default');
    }
  },
  async submitAuthentication(authSessionId, udiFingerprint, methodType, authenticationActions) {
    const response = await fetch(
      `/api/v1/oauth/submit-authentication`,
      {
        method: 'POST',
        body: JSON.stringify({ authSessionId, udiFingerprint, methodType, authenticationActions }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status > 300) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.detail?.errors? errorResponse.detail.errors : 'default');
    }
    return response.json();
  },
  async verifyAuthentication(authSessionId, udiFingerprint, state) {
    const response = await fetch(
      `/api/v1/oauth/verify-authentication`,
      {
        method: 'POST',
        body: JSON.stringify({ authSessionId, udiFingerprint, state }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status > 300) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.detail?.errors? errorResponse.detail.errors : 'default');
    }
    return response.json();
  }
};

export default AuthDatasource;