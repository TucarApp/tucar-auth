import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
    // Esperar hasta que todo haya cargado completamente antes de iniciar la autenticación
    const handleAuthorization = () => {
      authorize();
    };

    if (document.readyState === "complete") {
      handleAuthorization();
    } else {
      window.addEventListener("load", handleAuthorization);
    }

    return () => {
      window.removeEventListener("load", handleAuthorization);
    };
  }, []);


  const authorize = async () => {
    const baseUrl = 'https://tucar-auth-13535404425.us-central1.run.app/api/v1/oauth/authorize';
    const params = {
      response_type: 'code',
      client_id: 'QT6xCtFyNRNPSsopvf4gbSxhPgxuzV3at4JoSg0YG7s',
      redirect_uri: 'http://localhost:3000',
      scope: 'driver',
      state: 'random-state',
      tenancy: 'development'
    };
  
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${baseUrl}?${queryString}`;
    console.log('URL completa para autorización:', fullUrl);

    // Redirigir automáticamente a la URL construida
    window.history.pushState(null, '', `/?${queryString}`);

    try {
      const response = await axios.get(fullUrl, { withCredentials: true });

      if (response.status === 200) {
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

        updateFingerprint(data.authSessionId);
      } else {
        console.error('Error en la autorización: ', response.status);
      }
    } catch (error) {
      console.error('Error en la autorización:', error);
      setErrorMessage('Error al intentar autorizar. Verifique su conexión.');
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
        <div>
          <p>Cargando...</p>
          {errorMessage && (
            <div className="text-red-500 mt-2">
              {errorMessage}
            </div>
          )}
        </div>
      ) : (
        <AuthForm />
      )}
      </div>
    </AuthProvider>
  );
};

export default Auth;
