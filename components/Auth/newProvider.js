import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';

const AuthContext = createContext();

export const AuthProvider = ({ children, ...props }) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [googleClientId, setGoogleClientId] = useState('');

  useEffect(() => {
    if (props.authMethods) {
      const googleMethod = props.authMethods.find(method => method.methodType === 'Google');
      if (googleMethod && googleMethod.clientId) {
        setGoogleClientId(googleMethod.clientId);
      }
    }
    console.log(googleClientId);
  }, [props.authMethods]);

  // Esta es la función que no se debe tocar (para Tucar)
  const submitAuthentication = async () => {
    let authenticationActions = [];
    if (props.currentStep === 1) {
      authenticationActions.push({
        submitAction: 'resolve',
        stepType: 'emailOrPhone',
        value: emailOrPhone
      });
    } else if (props.currentStep === 2) {
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
    } else if (props.currentStep === 3) {
      authenticationActions.push({
        submitAction: 'resolve',
        stepType: 'verificationCode',
        value: verificationCode
      });
    } else if (props.currentStep === 4) {
      authenticationActions.push({
        submitAction: 'resolve',
        stepType: 'password',
        value: password
      });
    }

    try {
      const response = await axios.post('/api/v1/oauth/submit-authentication', {
        authSessionId: props.authSessionId,
        udiFingerprint: props.udiFingerprint,
        methodType: 'EmailOrPhone',
        authenticationActions
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('Autenticación enviada:', response.data);

      const authMethodInUse = response.data.authMethods.find(method => method.inUse);
      if (authMethodInUse) {
        console.log('authMethod en uso:', authMethodInUse.name);
      } else {
        console.log('Ningún authMethod está en uso.');
      }

      const authMethod = response.data.authMethods.find(method => method.methodType === 'EmailOrPhone');
      if (authMethod) {
        const step = authMethod?.steps?.find(step => step.completed === false);
        if (step === undefined) {
          authMethod.inUse = true;
        }
      }

      const remainingSteps = authMethod ? authMethod.steps.filter(step => !step.completed) : [];
      console.log('Remaining Steps:', remainingSteps, 'base');

      if (remainingSteps.length > 0) {
        const nextStepIndex = authMethod ? authMethod.steps.findIndex(step => !step.completed) : -1;
        if (nextStepIndex !== -1) {
          const stepIncrement = response.data.authFlow === 'sign_in' ? 2 : 1;
          props.setCurrentStep(nextStepIndex + stepIncrement);
        }
      } else {
        props.setCompleted(response.data.completed);
        console.log('Setting step', 5);
        props.setCurrentStep(5);
      }
    } catch (error) {
      console.error('Error en la autenticación:', error);
      props.setErrorMessage(error.response?.data?.errors || 'Error en la autenticación');
    }
  };

  // Nueva función específica para Google
  //this
  const submitAuthenticationGoogle = async () => {
    let authenticationActions = [];

    if (props.currentStep === 1) {
      if (props.authFlow === 'sign_up') {
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
      }
    } else if (props.currentStep === 2 || props.authFlow === 'sign_in') {
      authenticationActions.push({
        submitAction: 'resolve',
        stepType: 'verificationCode',
        value: verificationCode
      });
    }

    try {
      const response = await axios.post('/api/v1/oauth/submit-authentication', {
        authSessionId: props.authSessionId,
        udiFingerprint: props.udiFingerprint,
        methodType: 'Google',  // Usamos Google como método
        authenticationActions
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('Autenticación con Google enviada:', response.data);

      const nextStep = determineNextStep(response.data.authMethods, props.currentStep, response.data.authFlow);

      if (nextStep !== undefined) {
        props.setCurrentStep(nextStep);
      } else {
        props.setCompleted(response.data.completed);
        console.log('Todos los pasos completos. Verificando...');
        // Aquí puedes añadir la lógica para el verify si fuera necesario
      }
    } catch (error) {
      console.error('Error en la autenticación con Google:', error);
      props.setErrorMessage(error.response?.data?.errors || 'Error en la autenticación');
    }
  };

  const handleGoogleSuccess = async (response) => {
    const { credential } = response;
    console.log('Código recibido de Google:', credential);

    props.setIsSubmitting(true);
    const storedAuthSessionId = localStorage.getItem('authSessionId');
    if (!storedAuthSessionId) {
      console.error('authSessionId no está definido');
      props.setIsSubmitting(false);
      return;
    }

    try {
      let authenticationActions = [];
      authenticationActions.push({
        submitAction: 'resolve',
        stepType: 'social',
        value: credential  // Aquí enviamos el credential en lugar de code
      });

      const response = await axios.post('/api/v1/oauth/submit-authentication', {
        authSessionId: storedAuthSessionId,
        udiFingerprint: props.udiFingerprint,
        methodType: 'Google',
        authenticationActions
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('Autenticación con Google completada:', response.data);

      // Activamos la lógica para continuar con los siguientes pasos
      await submitAuthenticationGoogle();
    } catch (error) {
      console.error('Error en la autenticación con Google:', error);
      const errorMessage = error.response?.data?.errors || 'Error en la autenticación con Google';
      if (errorMessage.includes('User does not have Google account')) {
        props.setErrorMessage('No tienes cuenta de Google');
      } else {
        props.setErrorMessage(errorMessage);
      }
    } finally {
      props.setIsSubmitting(false);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Error al autenticar con Google:', error);
    props.setErrorMessage('No se pudo completar la autenticación con Google');
  };

  const handleUberLogin = () => {
    const uberMethod = props.authMethods.find(method => method.methodType === 'Uber');
    if (uberMethod) {
      console.log('Uber Auth URL:', uberMethod.actionUrl);
      if (typeof window !== 'undefined') {
        const width = 600;
        const height = 700;
        const left = (window.innerWidth / 2) - (width / 2);
        const top = (window.innerHeight / 2) - (height / 2);

        const authWindow = window.open(
          uberMethod.actionUrl,
          'Uber Login',
          `width=${width},height=${height},top=${top},left=${left}`
        );

        const authInterval = setInterval(() => {
          try {
            if (authWindow.closed) {
              clearInterval(authInterval);
              console.log('La ventana de Uber se cerró. Procediendo con submit-authentication.');
              const authCode = new URLSearchParams(authWindow.location.search).get('code');
              if (authCode) {
                handleUberCallback(authCode);  
              } else {
                console.error('No se recibió ningún código de autorización de Uber');
              }
            }
          } catch (error) {
            console.error('Error en la espera de cierre de la ventana de Uber:', error);
          }
        }, 1000);
      }
    } else {
      console.error('No se encontró el método de autenticación de Uber');
    }
  };

  const handleUberCallback = async (code) => {
    props.setIsSubmitting(true);
    const storedAuthSessionId = localStorage.getItem('authSessionId');
    if (!storedAuthSessionId) {
      console.error('authSessionId no está definido');
      props.setIsSubmitting(false);
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
        udiFingerprint: props.udiFingerprint,
        methodType: 'Uber',
        authenticationActions
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('Autenticación con Uber completada:', response.data);

      await props.verifyAuthentication(storedAuthSessionId);

    } catch (error) {
      console.error('Error en la autenticación con Uber:', error);
      
      const serverError = error.response?.data?.detail?.errors;
      console.log(serverError, '');
      const errorMessage = typeof serverError === 'string' && serverError.includes('User does not have Uber partner account')
        ? 'No tienes cuenta de Uber Driver. Por favor, crea una cuenta para continuar.'
        : serverError || 'Error en la autenticación con Uber';

      props.setErrorMessage(errorMessage);
    } finally {
      props.setIsSubmitting(false);
    }
  };

  const getCurrentStepType = () => {
    const authMethod = props.authMethods.find(method => method.inUse);
    const remainingSteps = authMethod?.steps.filter(step => !step.completed) || [];
    console.log('Remaining Steps:', remainingSteps, 'getCurrentStepType');
    if (remainingSteps.length > 0) {
      return remainingSteps[0]?.stepType || [];
    }
    return [];
  };

  return (
    <AuthContext.Provider
      value={{
        currentStep: props.currentStep,
        authMethods: props.authMethods,
        emailOrPhone,
        firstname,
        lastname,
        email,
        phone,
        verificationCode,
        password,
        setEmailOrPhone,
        setFirstname,
        setLastname,
        setEmail,
        setPhone,
        setVerificationCode,
        setPassword,
        submitAuthentication,  // Función original para Tucar
        submitAuthenticationGoogle,  // Nueva función específica para Google
        handleGoogleSuccess,
        handleGoogleFailure,
        handleUberLogin,
        getCurrentStepType,
        googleClientId,
      }}
    >
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          {children}
        </GoogleOAuthProvider>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
