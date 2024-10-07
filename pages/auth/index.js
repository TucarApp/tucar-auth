import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const Input = styled.input`
  width: 100%;
  height: 45px;
  flex: 1;
  border-radius: 4px;
  border: 1px solid var(--Blanco, #fff);
  background: var(--Blanco, #fff);
  box-shadow: 4px 4px 14px 0px #d9d9d9 inset,
    -4px -4px 9px 0px rgba(255, 255, 255, 0.88) inset;
  ::placeholder,
  ::-webkit-input-placeholder {
    color: #5b5d71;
  }
  :-ms-input-placeholder {
    color: red;
  }
  padding-left: 15px;
  margin-top: 15px;
`;

const Button = styled.button`
  display: inline-flex;
  padding: 18px 42px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  border: 1px solid var(--contorno-click-botn, #d6e3f3);
  background: var(
    --degradado2,
    linear-gradient(268deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 52.74%),
    linear-gradient(270deg, #50caff 0%, #0478ff 100%)
  );
  box-shadow: 4px 4px 20px 0px rgba(111, 140, 176, 0.41),
    -6px -6px 20px 0px #fff, 2px 2px 4px 0px rgba(114, 142, 171, 0.1);
  color: white;
  margin-top: 55px;
`;

const UberButton = styled.button`
  display: inline-flex;
  padding: 18px 42px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  border: 1px solid var(--contorno-click-botn, #d6e3f3);
  background: var(
    --degradado2,
    linear-gradient(268deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 52.74%),
    linear-gradient(270deg, #50caff 0%, #0478ff 100%)
  );
  box-shadow: 4px 4px 20px 0px rgba(111, 140, 176, 0.41),
    -6px -6px 20px 0px #fff, 2px 2px 4px 0px rgba(114, 142, 171, 0.1);
  color: white;
  margin-top: 55px;
`;

const GoogleButton = styled.button`
  display: inline-flex;
  padding: 18px 42px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  border: 1px solid var(--contorno-click-botn, #d6e3f3);
  background: var(
    --degradado2,
    linear-gradient(268deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 52.74%),
    linear-gradient(270deg, #50caff 0%, #0478ff 100%)
  );
  box-shadow: 4px 4px 20px 0px rgba(111, 140, 176, 0.41),
    -6px -6px 20px 0px #fff, 2px 2px 4px 0px rgba(114, 142, 171, 0.1);
  color: white;
  margin-top: 55px;
`;

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

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');

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

  const handleMessage = (event) => {
    if (event.data.code) {
      console.log('Código recibido de Uber:', event.data.code);
      if (!isSubmitting) {
        handleUberCallback(event.data.code);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isSubmitting]);

  const authorize = async () => {
    try {
      const response = await axios.get('/api/v1/oauth/authorize', {
        params: {
          response_type: 'code',
          client_id: 'QT6xCtFyNRNPSsopvf4gbSxhPgxuzV3at4JoSg0YG7s',
          redirect_uri: 'http://localhost:3000',
          scope: 'driver',
          state: 'random-state',
          tenancy: 'development'
        },
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

  useEffect(() => {
    console.log('authMethods actualizado:', authMethods);
  }, [authMethods]);

  const updateFingerprint = async (authSessionId) => {
    try {
      const response = await axios.patch('/api/v1/oauth/udi-fingerprint', {
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

  const submitAuthentication = async () => {
    let authenticationActions = [];
    if (currentStep === 1) {
      authenticationActions.push({
        submitAction: 'resolve',
        stepType: 'emailOrPhone',
        value: emailOrPhone
      });
    } else if (currentStep === 2) {
      authenticationActions.push(
        {
          submitAction: 'resolve',
          stepType: 'firstname',
          value: firstname
        },
        {
          submitAction: 'resolve',
          stepType: 'lastname',
          value: lastname
        },
        {
          submitAction: 'resolve',
          stepType: 'email',
          value: email
        },
        {
          submitAction: 'resolve',
          stepType: 'phone',
          value: phone
        }
      );
    } else if (currentStep === 3) {
      authenticationActions.push({
        submitAction: 'resolve',
        stepType: 'verificationCode',
        value: verificationCode
      });
    } else if (currentStep === 4) {
      authenticationActions.push({
        submitAction: 'resolve',
        stepType: 'password',
        value: password
      });
    }
  ////// ++++++++++=
    try {
      const response = await axios.post('/api/v1/oauth/submit-authentication', {
        authSessionId,
        udiFingerprint,
        methodType: 'EmailOrPhone',
        authenticationActions
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
  
      console.log('Autenticación enviada:', response.data);
  
      // Log authFlow
      console.log('AuthFlow:', response.data.authFlow);
  
      const authMethod = response.data.authMethods.find(method => method.methodType === 'EmailOrPhone');
      if (authMethod) {
        const step = authMethod?.steps?.find(step => step.completed === false);
        if (step === undefined) {
          authMethod.inUse = true;
        }
      }
      
      // Verificar si hay pasos incompletos
      const remainingSteps = authMethod ? authMethod.steps.filter(step => !step.completed) : [];
      console.log('Remaining Steps:', remainingSteps, 'base');
  
      if (remainingSteps.length > 0) {
        const nextStepIndex = authMethod ? authMethod.steps.findIndex(step => !step.completed) : -1;
        if (nextStepIndex !== -1) {
          // Sumar 1 si es que estoy en el signUp y 2 si estoy en el SignIn
          const stepIncrement = response.data.authFlow === 'sign_in' ? 2 : 1;
          setCurrentStep(nextStepIndex + stepIncrement);
        }
      } else {
        setCompleted(response.data.completed);
        console.log('Setting step', 5);
        setCurrentStep(5);
      }
    } catch (error) {
      console.error('Error en la autenticación:', error);
      setErrorMessage(error.response?.data?.errors || 'Error en la autenticación');
    }
  };

  const handleGoogleLogin = () => {
    const googleMethod = authMethods.find(method => method.methodType === 'Google');
    if (googleMethod) {
      console.log('Google Auth URL:', googleMethod.actionUrl);
      if (typeof window !== 'undefined') {
        const width = 600;
        const height = 700;
        const left = (window.innerWidth / 2) - (width / 2);
        const top = (window.innerHeight / 2) - (height / 2);
  
        const authWindow = window.open(
          googleMethod.actionUrl,
          'Google Login',
          `width=${width},height=${height},top=${top},left=${left}`
        );
  
        const authInterval = setInterval(() => {
          try {
            if (authWindow.location.href.includes('http://localhost:3000')) {
              clearInterval(authInterval);
              const urlParams = new URLSearchParams(authWindow.location.search);
              const code = urlParams.get('code');
              console.log('Código recibido de Google:', code);
              authWindow.close();
              handleGoogleCallback(code);
            }
          } catch (error) {
            // Puede que esto lance errores debido a restricciones de CORS, es esperado.
          }
        }, 1000);
      }
    } else {
      console.error('No se encontró el método de autenticación de Google');
    }
  };

  const handleGoogleCallback = async (code) => {
    setIsSubmitting(true);
    const storedAuthSessionId = localStorage.getItem('authSessionId');
    if (!storedAuthSessionId) {
      console.error('authSessionId no está definido');
      setIsSubmitting(false);
      return;
    }

    try {
      let authenticationActions = [];
      authenticationActions.push({
        submitAction: 'resolve',
        stepType: 'social',
        value: code
      });

      const response = await axios.post('/api/v1/oauth/submit-authentication', {
        authSessionId: storedAuthSessionId,
        udiFingerprint,
        methodType: 'Google',
        authenticationActions
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('Autenticación con Google completada:', response.data);

      await verifyAuthentication(storedAuthSessionId);

    } catch (error) {
      console.error('Error en la autenticación con Google:', error);
      const errorMessage = error.response?.data?.errors || 'Error en la autenticación con Google';
      if (errorMessage.includes('User does not have Google account')) {
        setErrorMessage('No tienes cuenta de Google');
      } else {
        setErrorMessage(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUberLogin = () => {
    const uberMethod = authMethods.find(method => method.methodType === 'Uber');
    if (uberMethod) {
      console.log('Uber Auth URL:', uberMethod.actionUrl);
      if (typeof window !== 'undefined') {
        const width = 600;
        const height = 700;
        const left = (window.innerWidth / 2) - (width / 2);
        const top = (window.innerHeight / 2) - (height / 2);

        window.open(
          uberMethod.actionUrl,
          'Uber Login',
          `width=${width},height=${height},top=${top},left=${left}`
        );
      }
    } else {
      console.error('No se encontró el método de autenticación de Uber');
    }
  };

  const handleUberCallback = async (code) => {
    setIsSubmitting(true);
    const storedAuthSessionId = localStorage.getItem('authSessionId');
    if (!storedAuthSessionId) {
      console.error('authSessionId no está definido');
      setIsSubmitting(false);
      return;
    }

    try {
      let authenticationActions = [];
      authenticationActions.push({
        submitAction: 'resolve',
        stepType: 'social',
        value: code
      });

      const response = await axios.post('/api/v1/oauth/submit-authentication', {
        authSessionId: storedAuthSessionId,
        udiFingerprint,
        methodType: 'Uber',
        authenticationActions
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('Autenticación con Uber completada:', response.data);

      await verifyAuthentication(storedAuthSessionId);

    } catch (error) {
      console.error('Error en la autenticación con Uber:', error);
      const errorMessage = error.response?.data?.errors || 'Error en la autenticación con Uber';
      if (errorMessage.includes('User does not have Uber partner account')) {
        setErrorMessage('No tienes cuenta de Uber Driver');
      } else {
        setErrorMessage(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyAuthentication = async (authSessionId) => {
    try {
      const response = await axios.post('/api/v1/oauth/verify-authentication', {
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
        window.location.href = 'http://localhost:3000';
      }
    } catch (error) {
      console.error('Error en la verificación de la autenticación:', error);
      setErrorMessage(error.response?.data?.errors || 'Error en la verificación de la autenticación');
    }
  };

  const getCurrentStepType = () => {
    const authMethod = authMethods.find(method => method.inUse);
    const remainingSteps = authMethod?.steps.filter(step => !step.completed) || [];
    console.log('Remaining Steps:', remainingSteps, 'getCurrentStepType');
    if (remainingSteps.length > 0) {
      return remainingSteps[0]?.stepType || [];
    }
    return [];
  };

  const renderAuthButtons = () => {
    return authMethods.map((method) => {
      if (method.methodType === 'Uber') {
        return <UberButton key={method.methodType} onClick={handleUberLogin}>Iniciar sesión con Uber</UberButton>;
      } else if (method.methodType === 'Google') {
        return <GoogleButton key={method.methodType} onClick={handleGoogleLogin}>Iniciar sesión con Google</GoogleButton>;
      } else {
        return null;
      }
    });
  };

  return (
    <div className='max-w-screen-2xl mx-auto px-3 lg:px-[60px] pt-[80px]'>
      <h1 className='text-center'>Flujo de Autenticación</h1>
      {errorMessage && (
        <div className="text-center py-5 bg-red-400 p-3">{errorMessage}</div>
      )}
      {!authSessionId ? (
        <button className='text-center' onClick={authorize}>Iniciar Autenticación</button>
      ) : (
        <div className='text-center'>
          <h2 className='text-center py-5 bg-green-400 p-3'>Autenticación Iniciada</h2>

          {currentStep === 0 && (
            <div>
              <p>Esperando que se cargue el fingerprint...</p>
            </div>
          )}

          {currentStep === 1 && authMethods.length === 1 && authMethods[0].methodType === 'Uber' ? (
            <div className='flex justify-center items-center mt-4'>
              <UberButton onClick={handleUberLogin}>Iniciar sesión con Uber</UberButton>
              {console.log('El método de autenticación es Uber')}
            </div>
          ) : (
            <>
              {currentStep === 1 && (
                <div className='flex flex-col justify-center items-center'>
                  <div className='w-full max-w-md'>
                    <Input
                      type="text"
                      className='text-black'
                      placeholder="Ingresa correo o número de teléfono"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                    />
                    <div className='flex justify-center items-center mt-4'>
                      <Button onClick={submitAuthentication}>Enviar Autenticación</Button>
                      {renderAuthButtons()}
                    </div> 
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <Input
                    type="text"
                    className='text-black'
                    placeholder="Nombre"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                  <Input
                    type="text"
                    className='text-black'
                    placeholder="Apellido"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                  />
                  <Input
                    type="email"
                    className='text-black'
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    type="text"
                    className='text-black'
                    placeholder="Teléfono"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Button onClick={submitAuthentication}>Registrarse</Button>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <Input
                    type="text"
                    className='text-black'
                    placeholder="Código de Verificación"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  <Button onClick={submitAuthentication}>Enviar Código de Verificación</Button>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <Input
                    type="password"
                    className='text-black'
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button onClick={submitAuthentication}>Enviar Autenticación</Button>
                </div>
              )}

              {currentStep >= 5 && (
                <div>
                  <p>Autenticación Completada</p>
                </div>
              )}

              {currentStep > 0 && currentStep < 5 && (
                <div>
                  <p>Paso siguiente: {getCurrentStepType().join(', ')}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Auth;
