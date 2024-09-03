import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';

const AuthContext = createContext();


////KKK

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


  useEffect(() => {
    if (props.authMethods) {
      const googleMethod = props.authMethods.find(method => method.methodType === 'Google');
      if (googleMethod && googleMethod.clientId) {
        setGoogleClientId(googleMethod.clientId);
      }
    }
    console.log(googleClientId);
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
        // Manejar error si es necesario
      }
    };

    iniciarAutenticacion();
  }, []);

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

      const availableAuthMethods = response.data.authMethods.map(method => method.methodType);
      console.log('AuthMethods disponibles:', availableAuthMethods);

      setResponse(response.data);

      if (availableAuthMethods.length === 1 && availableAuthMethods.includes('Google')) {
        console.log("Solo Google está disponible, cambiando currentStep a 6");
        setCurrentStep(6);
      } else if (availableAuthMethods.length === 1 && availableAuthMethods.includes('Uber')) {
        console.log("Solo Uber está disponible, cambiando currentStep a 5");
        setCurrentStep(5);
      } else {
        const nextStepIndex = determineNextStep(response.data.authMethods, currentStep, response.data.authFlow);
        if (nextStepIndex !== undefined) {
          setCurrentStep(nextStepIndex);
        } else {
          props.setCompleted(response.data.completed);
          console.log('Todos los pasos completados');
        }
      }

    } catch (error) {
      console.error('Error en la autenticación:', error);
      props.setErrorMessage(error.response?.data?.errors || 'Error en la autenticación');
    }
  };

  const submitAuthenticationGoogle = async () => {
    let authenticationActions = [];

    if (currentStep === 2 && props.authFlow === 'sign_up') {
      if (!firstname || !lastname || !email || !phone) {
        props.setErrorMessage('Todos los campos son obligatorios');
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

      console.log('Autenticación con Google enviada:', response.data);

      setResponse(response.data);

      const nextStep = determineNextStep(response.data.authMethods, currentStep, response.data.authFlow);

      if (nextStep !== undefined) {
        setCurrentStep(nextStep);
      } else {
        props.setCompleted(response.data.completed);
        console.log('Todos los pasos completos. Verificando...');
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

      console.log('Autenticación con Google completada:', response.data);

      setIsGoogleFlow(true); // Indica que estamos en el flujo de Google
      setResponse(response.data);

      if (response.data.authFlow === 'sign_up') {
        setCurrentStep(2); // Actualizamos al siguiente paso para ingresar firstname, lastname, etc.
      } else if (response.data.authFlow === 'sign_in') {
        const nextStep = determineNextStep(response.data.authMethods, currentStep, response.data.authFlow);

        if (nextStep !== undefined) {
          setCurrentStep(nextStep);
        } else {
          props.setCompleted(response.data.completed);
          console.log('Autenticación completada con Google.');
        }
      }

      props.setIsSubmitting(false);
    } catch (error) {
      console.error('Error en la autenticación con Google:', error);
      const errorMessage = error.response?.data?.errors || 'Error en la autenticación con Google';
      if (errorMessage.includes('User does not have Google account')) {
        props.setErrorMessage('No tienes cuenta de Google');
      } else {
        props.setErrorMessage(errorMessage);
      }
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
