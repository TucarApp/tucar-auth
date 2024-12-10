import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useRouter } from 'next/router';

// Importar los componentes de los pasos
import Firstname from "@/components/firstname";
import Lastname from "@/components/lastname";

// Definición de componentes estilizados
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

// Funciones auxiliares para autenticación
function checkCompleteness(authentication) {
  return authentication.completed;
}

function getAuthMethodInUse(authentication) {
  for (let authMethod of authentication.authMethods) {
    if (authMethod.inUse) {
      return [authMethod];
    }
  }
  return authentication.authMethods;
}

function searchFirstNonCompletedStep(steps) {
  for (let i = 0; i < steps.length; i++) {
    if (!steps[i].completed) {
      return i;
    }
  }
  return -1;
}

function getRenderStep(stepTypes) {
  const stepComponents = [];
  for (let stepType of stepTypes) {
    if (stepType === "firstname") {
      stepComponents.push(Firstname);
    } else if (stepType === "lastname") {
      stepComponents.push(Lastname);
    }
    // Agregar otros componentes de pasos según sea necesario
  }
  return stepComponents;
}

function getStepsAuthMethods(authMethods) {
  let authMethodsRenderData = [];
  for (let authMethod of authMethods) {
    let notCompletedStepIndex = searchFirstNonCompletedStep(authMethod.steps);
    if (notCompletedStepIndex !== -1) {
      let step = authMethod.steps[notCompletedStepIndex];
      let componentStep = getRenderStep(step.stepType);
      authMethodsRenderData.push({
        authMethod: authMethod,
        step: componentStep,
      });
    }
  }
  return authMethodsRenderData;
}

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
      setCurrentStep(currentStep + 1);
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
      
      if (response.data.authFlow === 'sign_in') {
        console.log('Correo o teléfono ya registrado. Redireccionando...');
        setAuthMethods(getAuthMethodInUse(response.data));
        verifyAuthentication(authSessionId);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Error en la autenticación:', error);
      setErrorMessage(error.response?.data?.errors || 'Error en la autenticación');
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

  const handleGoogleLogin = () => {
    const googleMethod = authMethods.find(method => method.methodType === 'Google');
    if (googleMethod) {
      console.log('Google Auth URL:', googleMethod.actionUrl);
      if (typeof window !== 'undefined') {
        const width = 600;
        const height = 700;
        const left = (window.innerWidth / 2) - (width / 2);
        const top = (window.innerHeight / 2) - (height / 2);

        window.open(
          googleMethod.actionUrl,
          'Google Login',
          `width=${width},height=${height},top=${top},left=${left}`
        );
      }
    } else {
      console.error('No se encontró el método de autenticación de Google');
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
      
      // Verificar autenticación después de la autenticación con Uber
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
      
      // Verificar autenticación después de la autenticación con Google
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
    if (authMethods.length > 0 && currentStep < authMethods[0].steps.length) {
      return authMethods[0].steps[currentStep].stepType;
    }
    return [];
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
                  <UberButton onClick={handleUberLogin}>Iniciar sesión con Uber</UberButton>
                  <GoogleButton onClick={handleGoogleLogin}>Iniciar sesión con Google</GoogleButton>
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
                placeholder="Telefono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button onClick={submitAuthentication}>Enviar Autenticación</button>
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
              <button onClick={submitAuthentication}>Enviar Código de Verificación</button>
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
              <button onClick={submitAuthentication}>Enviar Autenticación</button>
            </div>
          )}
  
          {currentStep === 5 && (
            <button onClick={() => verifyAuthentication(authSessionId)}>Verificar Autenticación</button>
          )}
  
          {currentStep > 5 && getCurrentStepType().length > 0 && (
            <div>
              <p>Paso siguiente: {getCurrentStepType().join(" o ")}</p>
              <button onClick={() => setCurrentStep(currentStep + 1)}>Siguiente Paso</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Auth;
