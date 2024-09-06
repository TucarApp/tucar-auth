import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import AuthForm from './AuthForm';
import AuthProvider from './AuthProvider';

const Auth = () => {
  const router = useRouter();
  const [authSessionId, setAuthSessionId] = useState('');
  const [authFlow, setAuthFlow] = useState('');
  const [completed, setCompleted] = useState(false);
  const [authData, setAuthData] = useState({});
  const [authMethods, setAuthMethods] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [udiFingerprint, setUdiFingerprint] = useState('unique-device-identifier');
  const [state, setState] = useState('random-state');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const searchParams = useSearchParams(); // Captura los parámetros de la URL

  useEffect(() => {
    const storedAuthSessionId = localStorage.getItem('authSessionId');
    if (storedAuthSessionId && completed) {
      verifyAuthentication(storedAuthSessionId);
    }
  }, [completed]);

  useEffect(() => {
    console.log('currentStep actualizado:', currentStep);
  }, [currentStep]);

  useEffect(() => {
    // Capturar los parámetros solo si están presentes
    const responseType = searchParams.get('response_type');
    const clientId = searchParams.get('client_id');
    const redirectUri = searchParams.get('redirect_uri');
    const scope = searchParams.get('scope');
    const stateParam = searchParams.get('state');

    // Aca vemos si los parámetros están presentes en la URL
    if (!responseType || !clientId || !redirectUri || !scope || !stateParam) {
      console.log('No hay suficientes parámetros en la URL, redirigiendo...');
      // Redirigir a una página específica o mostrar un mensaje
      // Puedes redirigir a una página de error o al inicio
      return;
    }

    if (responseType && clientId && redirectUri && scope && stateParam) {
      console.log('Parámetros capturados desde la URL:', {
        response_type: responseType,
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: scope,
        state: stateParam,
      });

      authorize(); // Llamar a authorize solo si se capturan todos los parámetros
    } else {
      console.log('Esperando los parámetros en la URL...');
    }
  }, [searchParams]); // Asegurarse de que searchParams esté disponible

  const authorize = async () => {
    const baseUrl = 'https://tucar-auth-13535404425.us-central1.run.app/api/v1/oauth/authorize';

    // Capturar los parámetros de la URL o usar valores por defecto
    const responseType = searchParams.get('response_type') || 'code';
    const stateParam = searchParams.get('state') || 'random-state'; // Usar el estado desde la URL o uno por defecto
    const clientId = searchParams.get('client_id') || 'QT6xCtFyNRNPSsopvf4gbSxhPgxuzV3at4JoSg0YG7s';
    const redirectUri = searchParams.get('redirect_uri') || 'http://localhost:3000'; 
    const scope = searchParams.get('scope') || 'driver';
    const tenancy = 'production'; // Hardcodeado a 'production'

    // Parámetros que se deben enviar en la solicitud
    const params = {
      response_type: responseType,
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scope,
      state: stateParam,
      tenancy: tenancy
    };

    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${baseUrl}?${queryString}`;

    console.log('URL completa para autorización:', fullUrl);

    // Redirigir automáticamente a la URL construida
    window.history.pushState(null, '', `/?${queryString}`);

    try {
      const response = await axios.get(fullUrl, {
        withCredentials: true
      });
  
      const data = response.data;
      console.log('Respuesta completa del servidor:', data);
  
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

  const updateFingerprint = async (authSessionId) => {
    try {
      const response = await axios.patch('https://tucar-auth-13535404425.us-central1.run.app/api/v1/oauth/udi-fingerprint', {
        authSessionId,
        udiFingerprint
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('Fingerprint actualizado:', response.data);
      setCurrentStep(1);
    } catch (error) {
      console.error('Error en la actualización del fingerprint', error);
    }
  };

  const verifyAuthentication = async (authSessionId) => {
    try {
      const response = await axios.post('https://tucar-auth-13535404425.us-central1.run.app/api/v1/oauth/verify-authentication', {
        authSessionId,
        udiFingerprint,
        state
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('Autenticación verificada:', response.data);
      if (typeof window !== 'undefined') {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error en la verificación de la autenticación:', error);
      setErrorMessage(error.response?.data?.errors || 'Error en la verificación de la autenticación');
    }
  };

  return (
    <AuthProvider
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      authSessionId={authSessionId}
      udiFingerprint={udiFingerprint}
      authMethods={authMethods}
      setAuthMethods={setAuthMethods}
      authFlow={authFlow}
      setAuthFlow={setAuthFlow}
      completed={completed}
      setCompleted={setCompleted}
      authData={authData}
      setAuthData={setAuthData}
      isSubmitting={isSubmitting}
      setIsSubmitting={setIsSubmitting}
      errorMessage={errorMessage}
      setErrorMessage={setErrorMessage}
      verifyAuthentication={verifyAuthentication}
    >
      <div className='max-w-screen-2xl mx-auto px-3 lg:px-[60px] pt-[20px]'>
        {errorMessage && (
          <div className="text-center py-5 bg-red-400 p-3">{errorMessage}</div>
        )}
        {!authSessionId ? (
          <p>Cargando...</p> // Indicador de carga mientras se obtiene el authSessionId
        ) : (
          <AuthForm />
        )}
      </div>
    </AuthProvider>
  );
};

export default Auth;
