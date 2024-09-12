import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';

const AuthContext = createContext();

export const AuthProvider = ({ children, ...props }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [googleClientId, setGoogleClientId] = useState('');
  const [isGoogleFlow, setIsGoogleFlow] = useState(false);
  const [response, setResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); // Manejo de errores centralizado

  useEffect(() => {
    if (props.authMethods) {
      const googleMethod = props.authMethods.find(method => method.methodType === 'Google');
      if (googleMethod && googleMethod.clientId) {
        setGoogleClientId(googleMethod.clientId);
      }
    }
  }, [props.authMethods]);

  useEffect(() => {
    if (props.udiFingerprint) {
      setCurrentStep(1);
    }
  }, [props.udiFingerprint]);

  const determineNextStep = (authMethods, currentStep, authFlow) => {
    const authMethod = authMethods.find(method => method.inUse);
    const remainingSteps = authMethod?.steps.filter(step => !step.completed) || [];

    if (remainingSteps.length > 0) {
      const nextStepIndex = authMethod ? authMethod.steps.findIndex(step => !step.completed) : -1;
      if (nextStepIndex !== -1) {
        const stepIncrement = authFlow === 'sign_in' ? 2 : 1;
        return nextStepIndex + stepIncrement;
      }
    }

    return undefined; // Si no hay más pasos
  };

  useEffect(() => {
    const iniciarAutenticacion = async () => {
      try {
        setFingerprint(response.data);
        setFingerprintIsLoaded(true);

        // Aquí inicias automáticamente la autenticación
        await submitAuthentication();
      } catch (error) {
        console.error('Error en la autenticación:', error);
        setErrorMessage('Error en la autenticación');
      }
    };

    iniciarAutenticacion();
  }, []);

  const submitAuthentication = async () => {
    let authenticationActions = [];

    if (currentStep === 1) {
      if (!emailOrPhone) {
        setErrorMessage('Por favor, ingresa tu correo electrónico o número de teléfono');
        return;
      }

      authenticationActions.push({
        submitAction: 'resolve',
        stepType: 'emailOrPhone',
        value: emailOrPhone
      });
    } else if (currentStep === 2) {
      if (!firstname || !lastname || !email || !phone) {
        setErrorMessage('Por favor, completa todos los campos.');
        return;
      }

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
      if (!verificationCode) {
        setErrorMessage('Por favor, ingresa el código de verificación.');
        return;
      }

      authenticationActions.push({
        submitAction: 'resolve',
        stepType: 'verificationCode',
        value: verificationCode
      });
    } else if (currentStep === 4) {
      if (!password) {
        setErrorMessage('Por favor, ingresa tu contraseña.');
        return;
      }

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

      setResponse(response.data);

      const availableAuthMethods = response.data.authMethods.map(method => method.methodType);

      if (availableAuthMethods.length === 1 && availableAuthMethods.includes('Google')) {
        setCurrentStep(6);
      } else if (availableAuthMethods.length === 1 && availableAuthMethods.includes('Uber')) {
        setCurrentStep(5);
      } else {
        const nextStepIndex = determineNextStep(response.data.authMethods, currentStep, response.data.authFlow);
        if (nextStepIndex !== undefined) {
          setCurrentStep(nextStepIndex);
        } else {
          props.setCompleted(response.data.completed);
        }
      }

    } catch (error) {
      console.error('Error en la autenticación:', error.response ? error.response.data : error);
      const serverErrors = error.response?.data?.detail?.errors;

      if (serverErrors === "JWT session expired") {
        setErrorMessage('La sesión ha expirado. Por favor, vuelve a intentarlo.');
      } else if (serverErrors === "Invalid code") {
        setErrorMessage('Código inválido. Por favor, ingrésalo nuevamente.');
      } else {
        setErrorMessage(serverErrors || 'Error en la autenticación');
      }
    }
  };

  const submitAuthenticationGoogle = async () => {
    let authenticationActions = [];

    if (currentStep === 2 && props.authFlow === 'sign_up') {
      if (!firstname || !lastname || !email || !phone) {
        setErrorMessage('Todos los campos son obligatorios');
        return;
      }

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
    } else if (props.authFlow === 'sign_in' || currentStep === 3) {
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
        methodType: 'Google',
        authenticationActions
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      setResponse(response.data);

      const nextStep = determineNextStep(response.data.authMethods, currentStep, response.data.authFlow);

      if (nextStep !== undefined) {
        setCurrentStep(nextStep);
      } else {
        props.setCompleted(response.data.completed);
      }
    } catch (error) {
      if (error.response?.data?.detail?.errors === "JWT session expired") {
        setErrorMessage('La sesión ha expirado. Por favor, recargue la página e intente de nuevo.');
      } else {
        setErrorMessage(error.response?.data?.errors || 'Error en la autenticación');
      }
    }
  };

  const handleGoogleSuccess = async (response) => {
    const { credential } = response;

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
        value: credential
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

      setIsGoogleFlow(true);
      setResponse(response.data);

      if (response.data.authFlow === 'sign_up') {
        setCurrentStep(2);
      } else if (response.data.authFlow === 'sign_in') {
        const nextStep = determineNextStep(response.data.authMethods, currentStep, response.data.authFlow);

        if (nextStep !== undefined) {
          setCurrentStep(nextStep);
        } else {
          props.setCompleted(response.data.completed);
        }
      }

      props.setIsSubmitting(false);
    } catch (error) {
      console.error('Error en la autenticación con Google:', error);
      const errorMessage = error.response?.data?.errors || 'Error en la autenticación con Google';
      if (errorMessage.includes('User does not have Google account')) {
        setErrorMessage('No tienes cuenta de Google');
      } else {
        setErrorMessage(errorMessage);
      }
      props.setIsSubmitting(false);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Error al autenticar con Google:', error);
    setErrorMessage('No se pudo completar la autenticación con Google');
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

      setResponse(response.data);

      const availableAuthMethods = response.data.authMethods.map(method => method.methodType);
      if (availableAuthMethods.length === 1 && availableAuthMethods.includes('Uber')) {
        setCurrentStep(5);
      } else {
        await props.verifyAuthentication(storedAuthSessionId);
      }

    } catch (error) {
      console.error('Error en la autenticación con Uber:', error);

      const serverError = error.response?.data?.detail?.errors;
      const errorMessage = typeof serverError === 'string' && serverError.includes('User does not have Uber partner account')
        ? 'No tienes cuenta de Uber Driver. Por favor, crea una cuenta para continuar.'
        : serverError || 'Error en la autenticación con Uber';

      setErrorMessage(errorMessage);
    } finally {
      props.setIsSubmitting(false);
    }
  };

  const getCurrentStepType = () => {
    const authMethod = props.authMethods.find(method => method.inUse);
    const remainingSteps = authMethod?.steps.filter(step => !step.completed) || [];
    if (remainingSteps.length > 0) {
      return remainingSteps[0]?.stepType || [];
    }
    return [];
  };

  return (
    <AuthContext.Provider
      value={{
        currentStep,
        setCurrentStep,
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
        submitAuthentication,
        submitAuthenticationGoogle,
        handleGoogleSuccess,
        handleGoogleFailure,
        handleUberLogin,
        getCurrentStepType,
        googleClientId,
        isGoogleFlow,
        response,
        errorMessage, // Exponemos el mensaje de error
        setErrorMessage // Exponemos la función para cambiar el mensaje de error
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
