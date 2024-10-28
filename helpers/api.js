import axios from 'axios';

const API_URL = 'https://accounts.tucar.app/api/v1/oauth/authorize';

const authorize = async ({
    responseType,
    clientId,
    redirectUri,
    scope,
    state,
    tenancy
}) => {

    // Usar el valor dinámico de `state`
    const params = {
        response_type: responseType,
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: scope,
        state: state, // Aquí usamos el estado `state` dinámico
        tenancy: tenancy ? tenancy : 'production'
    };

    try {
        const response = await axios.get(
            API_URL,
            {
                withCredentials: true,
                params
            }
        );

        const data = response.data;
      

        if (data.authMethods && data.authMethods.length > 0) {
            setAuthMethods(data.authMethods);
        } else {
            console.error('authMethods no está presente en la respuesta o está vacío');
        }

        setAuthSessionId(data.authSessionId);
        localStorage.setItem('authSessionId', data.authSessionId);
        setAuthFlow(data.authFlow);
        setCompleted(data.completed);
        setAuthData(data.authData);

        // Actualizar fingerprint después de recibir authSessionId
        updateFingerprint(data.authSessionId);
    } catch (error) {
        console.error('Error en la autorización', error);
    }
};
