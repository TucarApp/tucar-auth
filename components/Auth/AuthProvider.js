// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import { useRouter } from 'next/router'; // Importamos useRouter para redireccionar
// import styled from 'styled-components';

// const AuthContext = createContext();

// const ThankYouPopup = styled.div`
//   position: fixed;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   background-color: white;
//   padding: 20px;
//   width: 300px;
//   border-radius: 8px;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
//   text-align: center;
//   z-index: 1000;
//   font-family: 'Poppins', sans-serif;
// `;

// const PopupText = styled.p`
//   font-size: 16px;
//   margin: 10px 0;
// `;

// export const AuthProvider = ({ children, state, ...props }) => {
//   const router = useRouter(); // Usamos useRouter para la redirección
//   const [currentStep, setCurrentStep] = useState(0);
//   const [emailOrPhone, setEmailOrPhone] = useState('');
//   const [firstname, setFirstname] = useState('');
//   const [lastname, setLastname] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [verificationCode, setVerificationCode] = useState('');
//   const [password, setPassword] = useState('');
//   const [googleClientId, setGoogleClientId] = useState('');
//   const [isGoogleFlow, setIsGoogleFlow] = useState(false);
//   const [response, setResponse] = useState(null);
//   const [errorMessage, setErrorMessage] = useState(''); // Manejo de errores centralizado
//   const [authSessionId, setAuthSessionId] = useState('');
//   const [udiFingerprint, setUdiFingerprint] = useState('unique-device-identifier'); // Cambia el valor según sea necesario

//   const [showThankYouPopup, setShowThankYouPopup] = useState(false); // Estado para controlar el popup




//   useEffect(() => {
//     if (props.authMethods) {
//       const googleMethod = props.authMethods.find(method => method.methodType === 'Google');
//       if (googleMethod && googleMethod.clientId) {
//         setGoogleClientId(googleMethod.clientId);
//       }
//     }
//   }, [props.authMethods]);

 
 

//   useEffect(() => {
//     const fetchAuthSessionId = async () => {
//       try {
//         const storedAuthSessionId = localStorage.getItem('authSessionId');
//         if (!storedAuthSessionId) {
//           console.error('authSessionId no está definido');
//           return;
//         }
//         setAuthSessionId(storedAuthSessionId); // Asegúrate de que este valor se está guardando
//       } catch (error) {
//         console.error('Error obteniendo authSessionId', error);
//       }
//     };
    
//     fetchAuthSessionId();
//   }, []); 
  
//   useEffect(() => {
//     if (authSessionId) {
//       const updateFingerprint = async () => {
//         try {
//           const response = await axios.patch('/api/v1/oauth/udi-fingerprint', {
//             authSessionId,
//             udiFingerprint
//           }, {
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             withCredentials: true
//           });

       
//         } catch (error) {
//           console.error('Error en la actualización del fingerprint', error);
//         }
//       };
      
//       updateFingerprint();
//     }
//   }, [authSessionId]);
  

//   useEffect(() => {
//     if (props.udiFingerprint) {
//       setCurrentStep(1);
//     }
//   }, [props.udiFingerprint]);

//   // Autocompletar los campos con los datos de la respuesta del servidor
//   useEffect(() => {
//     if (response && response.authData) {
//       const { email, phone, firstname, lastname } = response.authData;
//       if (email) setEmail(email);
//       if (phone) setPhone(phone);
//       if (firstname) setFirstname(firstname);
//       if (lastname) setLastname(lastname);
//     }
//   }, [response]);

//   // Limpiar errores al escribir en los campos
//   useEffect(() => {
//     if (emailOrPhone || firstname || lastname || email || phone || password || verificationCode) {
//       setErrorMessage(''); // Limpiar el mensaje de error
//     }
//   }, [emailOrPhone, firstname, lastname, email, phone, password, verificationCode]);

//   const reloadPage = () => {
//     setTimeout(() => {
//       window.location.reload();
//     }, 2500); // 2.5 segundos
//   };

//   const determineNextStep = (authMethods, currentStep, authFlow) => {
//     const authMethod = authMethods.find(method => method.inUse);
//     const remainingSteps = authMethod?.steps.filter(step => !step.completed) || [];

//     if (remainingSteps.length > 0) {
//       const nextStepIndex = authMethod ? authMethod.steps.findIndex(step => !step.completed) : -1;
//       if (nextStepIndex !== -1) {
//         const stepIncrement = authFlow === 'sign_in' ? 2 : 1;
//         return nextStepIndex + stepIncrement;
//       }
//     }

//     return undefined; // Si no hay más pasos
//   };

//   // Función modificada para mostrar el popup de agradecimiento
//   const verifyAuthentication = async (authSessionId) => {
//     try {
//       const response = await axios.post('/api/v1/oauth/verify-authentication', {
//         authSessionId,
//         udiFingerprint, 
//         state          
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         withCredentials: true,
//       });
  
      
  
//       // Aquí obtenemos el redirectUri y redirigimos a él
//       const { redirectUri } = response.data;
//       if (redirectUri) {
//         router.push(redirectUri); // Redirigimos a la URL obtenida
//       } else {
//         setErrorMessage('No se encontró una URL de redirección.');
//       }
//     } catch (error) {
//       console.error('Error en la verificación de la autenticación:', error);
//       setErrorMessage('Error en la verificación de la autenticación');
//     }
//   };
  

//   const submitAuthentication = async (isFallback = false) => {
//     let authenticationActions = [];
  
//     // Fallback para regresar al paso anterior
//     if (isFallback) {
//       if (currentStep > 1) {
//         setCurrentStep(currentStep - 1);
//       }
//       return;
//     }
  
//     // Validación de campos en el paso 1
//     if (currentStep === 1) {
//       if (!emailOrPhone) {
//         setErrorMessage('Por favor, ingresa tu correo electrónico o número de teléfono');
//         return;
//       }
  
//       authenticationActions.push({
//         submitAction: 'resolve',
//         stepType: 'emailOrPhone',
//         value: emailOrPhone
//       });
//     }
  
//     // Validación de campos en el paso 2 (Registro)
//     else if (currentStep === 2) {
//       if (!firstname || !lastname || !email || !phone) {
//         setErrorMessage('Por favor, completa todos los campos.');
//         return;
//       }
  
//       authenticationActions.push(
//         {
//           submitAction: 'resolve',
//           stepType: 'firstname',
//           value: firstname
//         },
//         {
//           submitAction: 'resolve',
//           stepType: 'lastname',
//           value: lastname
//         },
//         {
//           submitAction: 'resolve',
//           stepType: 'email',
//           value: email
//         },
//         {
//           submitAction: 'resolve',
//           stepType: 'phone',
//           value: phone
//         }
//       );
//     }
  
//     // Validación de campos en el paso 3 (Código de verificación)
//     else if (currentStep === 3) {
//       if (!verificationCode) {
//         setErrorMessage('Por favor, ingresa el código de verificación.');
//         return;
//       }
  
//       authenticationActions.push({
//         submitAction: 'resolve',
//         stepType: 'verificationCode',
//         value: verificationCode
//       });
//     }
  
//     // Validación de campos en el paso 4 (Contraseña)
//     else if (currentStep === 4) {
//       if (!password) {
//         setErrorMessage('Por favor, ingresa tu contraseña.');
//         return;
//       }
  
//       authenticationActions.push({
//         submitAction: 'resolve',
//         stepType: 'password',
//         value: password
//       });
//     }
  
//     try {
//       const response = await axios.post('/api/v1/oauth/submit-authentication', {
//         authSessionId: props.authSessionId,
//         udiFingerprint: props.udiFingerprint,
//         methodType: 'EmailOrPhone',
//         authenticationActions
//       }, {
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         withCredentials: true
//       });
  
//       setResponse(response.data);
  
//       const availableAuthMethods = response.data.authMethods.map(method => method.methodType);
  
//       if (availableAuthMethods.length === 1 && availableAuthMethods.includes('Google')) {
//         setCurrentStep(6);
//       } else if (availableAuthMethods.length === 1 && availableAuthMethods.includes('Uber')) {
//         setCurrentStep(5);
//       } else {
//         const nextStepIndex = determineNextStep(response.data.authMethods, currentStep, response.data.authFlow);
//         if (nextStepIndex !== undefined) {
//           setCurrentStep(nextStepIndex);
//         } else {
//           await verifyAuthentication(response.data.authSessionId);
//         }
//       }
  
//     } catch (error) {
//       console.error('Error en la autenticación:', error.response ? error.response.data : error);
//       const serverErrors = error.response?.data?.detail?.errors;
  
//       if (serverErrors.includes('phone')) {
//         setErrorMessage('Por favor completa el campo de número de teléfono');
//       } else if (serverErrors === "JWT session expired" || serverErrors === "Invalid JWT session") {
//         setErrorMessage('La sesión ha expirado o es inválida. Recargando...');
//         reloadPage();
//       } else if (serverErrors === "Internal server error") {
//         setErrorMessage('Ups, ocurrió un error. Recargando...');
//         reloadPage();
//       } else if (serverErrors === "Invalid code") {
//         setErrorMessage('Código inválido. Por favor, ingrésalo nuevamente.');
//       } else {
//         setErrorMessage(serverErrors || 'Error en la autenticación');
//       }
//     }
//   };
  

//   const submitAuthenticationGoogle = async () => {
//     let authenticationActions = [];

//     if (currentStep === 2 && props.authFlow === 'sign_up') {
//       if (!firstname || !lastname || !email || !phone) {
//         setErrorMessage('Todos los campos son obligatorios');
//         return;
//       }

//       authenticationActions.push(
//         {
//           submitAction: 'resolve',
//           stepType: 'firstname',
//           value: firstname
//         },
//         {
//           submitAction: 'resolve',
//           stepType: 'lastname',
//           value: lastname
//         },
//         {
//           submitAction: 'resolve',
//           stepType: 'email',
//           value: email
//         },
//         {
//           submitAction: 'resolve',
//           stepType: 'phone',
//           value: phone
//         }
//       );
//     } else if (props.authFlow === 'sign_in' || currentStep === 3) {
//       if (!verificationCode) {
//         setErrorMessage('Por favor, ingresa el código de verificación.');
//         return;
//       }

//       authenticationActions.push({
//         submitAction: 'resolve',
//         stepType: 'verificationCode',
//         value: verificationCode
//       });
//     }

//     try {
//       const response = await axios.post('/api/v1/oauth/submit-authentication', {
//         authSessionId: props.authSessionId,
//         udiFingerprint: props.udiFingerprint,
//         methodType: 'Google',
//         authenticationActions
//       }, {
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         withCredentials: true
//       });

//       setResponse(response.data);

//       const nextStep = determineNextStep(response.data.authMethods, currentStep, response.data.authFlow);

//       if (nextStep !== undefined) {
//         setCurrentStep(nextStep);
//       } else {
//         // Verificamos al completar el flujo
//         await verifyAuthentication(response.data.authSessionId);
//       }
//     } catch (error) {
//       const serverErrors = error.response?.data?.detail?.errors;
//       if (serverErrors.includes('phone')) {
//         setErrorMessage('Por favor completa el campo de número de teléfono');
//       } else if (serverErrors === "JWT session expired" || serverErrors === "Invalid JWT session") {
//         setErrorMessage('La sesión ha expirado o es inválida. Recargando...');
//         reloadPage();
//       } else if (serverErrors === "Internal server error") {
//         setErrorMessage('Ups, ocurrió un error. Recargando...');
//         reloadPage();
//       } else {
//         setErrorMessage(error.response?.data?.errors || 'Error en la autenticación');
//       }
//     }
//   };

//   const handleGoogleSuccess = async (response) => {
//     const { credential } = response;

//     props.setIsSubmitting(true);
//     const storedAuthSessionId = localStorage.getItem('authSessionId');
//     if (!storedAuthSessionId) {
//       console.error('authSessionId no está definido');
//       props.setIsSubmitting(false);
//       return;
//     }

//     try {
//       let authenticationActions = [];
//       authenticationActions.push({
//         submitAction: 'resolve',
//         stepType: 'social',
//         value: credential
//       });

//       const response = await axios.post('/api/v1/oauth/submit-authentication', {
//         authSessionId: storedAuthSessionId,
//         udiFingerprint: props.udiFingerprint,
//         methodType: 'Google',
//         authenticationActions
//       }, {
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         withCredentials: true
//       });

//       setIsGoogleFlow(true);
//       setResponse(response.data);

//       // Autocompletar campos con la respuesta de Google
//       const { email, phone, firstname, lastname } = response.data.authData;
//       if (email) setEmail(email);
//       if (phone) setPhone(phone);
//       if (firstname) setFirstname(firstname);
//       if (lastname) setLastname(lastname);

//       if (response.data.authFlow === 'sign_up') {
//         setCurrentStep(2);
//       } else if (response.data.authFlow === 'sign_in') {
//         const nextStep = determineNextStep(response.data.authMethods, currentStep, response.data.authFlow);

//         if (nextStep !== undefined) {
//           setCurrentStep(nextStep);
//         } else {
//           // Verificamos al completar el flujo
//           await verifyAuthentication(response.data.authSessionId);
//         }
//       }

//       props.setIsSubmitting(false);
//     } catch (error) {
//       console.error('Error en la autenticación con Google:', error);
//       const errorMessage = error.response?.data?.errors || 'Error en la autenticación con Google';
//       if (errorMessage.includes('User does not have Google account')) {
//         setErrorMessage('No tienes cuenta de Google');
//       }
//       if (error.response?.data?.detail?.errors === "JWT session expired") {
//         setErrorMessage('La sesión ha expirado. Recargando...');
//         reloadPage();
//       } else {
//         setErrorMessage(error.response?.data?.errors || 'Error en la autenticación');
//       }

//       props.setIsSubmitting(false);
//     }
//   };

//   const handleGoogleFailure = (error) => {
//     console.error('Error al autenticar con Google:', error);
//     setErrorMessage('No se pudo completar la autenticación con Google');
//   };

//   const handleUberLogin = () => {
//     const uberMethod = props.authMethods.find(method => method.methodType === 'Uber');
//     if (uberMethod) {

//       if (typeof window !== 'undefined') {
//         const width = 600;
//         const height = 700;
//         const left = (window.innerWidth / 2) - (width / 2);
//         const top = (window.innerHeight / 2) - (height / 2);

//         const authWindow = window.open(
//           uberMethod.actionUrl,
//           'Uber Login',
//           `width=${width},height=${height},top=${top},left=${left}`
//         );

//         const authInterval = setInterval(() => {
//           try {
//             if (authWindow.closed) {
//               clearInterval(authInterval);
            
//               const authCode = new URLSearchParams(authWindow.location.search).get('code');
//               if (authCode) {
//                 handleUberCallback(authCode);
//               } else {
//                 console.error('No se recibió ningún código de autorización de Uber');
//               }
//             }
//           } catch (error) {
//             console.error('Error en la espera de cierre de la ventana de Uber:', error);
//           }
//         }, 1000);
//       }
//     } else {
//       console.error('No se encontró el método de autenticación de Uber');
//     }
//   };

//   const handleUberCallback = async (code) => {
//     props.setIsSubmitting(true);
//     const storedAuthSessionId = localStorage.getItem('authSessionId');
//     if (!storedAuthSessionId) {
//       console.error('authSessionId no está definido');
//       props.setIsSubmitting(false);
//       return;
//     }

//     try {
//       let authenticationActions = [];
//       authenticationActions.push({
//         submitAction: 'resolve',
//         stepType: 'social',
//         value: code
//       });

//       const response = await axios.post('/api/v1/oauth/submit-authentication', {
//         authSessionId: storedAuthSessionId,
//         udiFingerprint: props.udiFingerprint,
//         methodType: 'Uber',
//         authenticationActions
//       }, {
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         withCredentials: true
//       });

//       setResponse(response.data);

//       const availableAuthMethods = response.data.authMethods.map(method => method.methodType);
//       if (availableAuthMethods.length === 1 && availableAuthMethods.includes('Uber')) {
//         setCurrentStep(5);
//       } else {
//         // Verificamos al completar el flujo
//         await verifyAuthentication(response.data.authSessionId);
//       }

//     } catch (error) {
//       console.error('Error en la autenticación con Uber:', error);

//       const serverError = error.response?.data?.detail?.errors;

//       if (serverError === "Internal server error") {
//         setErrorMessage('Ups, ocurrió un error. Por favor, recarga la página e intenta de nuevo.');
//       } else if (serverError === "JWT session expired" || serverError === "Invalid JWT session") {
//         setErrorMessage('La sesión ha expirado o es inválida. Recargando...');
//         reloadPage();
//       } else {
//         setErrorMessage('Error en la autenticación con Uber.');
//       }
//     } finally {
//       props.setIsSubmitting(false);
//     }
//   };

//   const getCurrentStepType = () => {
//     const authMethod = props.authMethods.find(method => method.inUse);
//     const remainingSteps = authMethod?.steps.filter(step => !step.completed) || [];
//     if (remainingSteps.length > 0) {
//       return remainingSteps[0]?.stepType || [];
//     }
//     return [];
//   };

//   return (
//     <AuthContext.Provider
//     value={{
//       currentStep,
//       setCurrentStep,
//       authSessionId,   // Asegúrate de que authSessionId esté aquí
//       udiFingerprint,  // Asegúrate de que udiFingerprint esté aquí
//       state,           // Asegúrate de que state esté aquí
//       authMethods: props.authMethods,
//       emailOrPhone,
//       firstname,
//       lastname,
//       email,
//       phone,
//       verificationCode,
//       password,
//       setEmailOrPhone,
//       setFirstname,
//       setLastname,
//       setEmail,
//       setPhone,
//       setVerificationCode,
//       setPassword,
//       submitAuthentication,
//       submitAuthenticationGoogle,
//       handleGoogleSuccess,
//       handleGoogleFailure,
//       handleUberLogin,
//       getCurrentStepType,
//       googleClientId,
//       isGoogleFlow,
//       response,
//       errorMessage,
//       setErrorMessage
//     }}
//   >
//     {googleClientId ? (
//       <GoogleOAuthProvider clientId={googleClientId}>
//         {children}
//       </GoogleOAuthProvider>
//     ) : (
//       children
//     )}

//     {showThankYouPopup && (
//       <ThankYouPopup>
//       <PopupText>¡Gracias por registrarte!</PopupText>
//       <PopupText>Serás redirigido en unos segundos...</PopupText>
//     </ThankYouPopup>
//     )}
//   </AuthContext.Provider>
  
//   );
// };

// export const useAuthContext = () => {
//   return useContext(AuthContext);
// };

// export default AuthProvider;

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const AuthContext = createContext();

const ThankYouPopup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  width: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  z-index: 1000;
  font-family: 'Poppins', sans-serif;
`;

const PopupText = styled.p`
  font-size: 16px;
  margin: 10px 0;
`;

export const AuthProvider = ({ children, state, ...props }) => {
  const router = useRouter();
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
  const [errorMessage, setErrorMessage] = useState('');
  const [authSessionId, setAuthSessionId] = useState('');
  const [udiFingerprint, setUdiFingerprint] = useState('unique-device-identifier');
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);

  useEffect(() => {
    if (props.authMethods) {
      const googleMethod = props.authMethods.find(method => method.methodType === 'Google');
      if (googleMethod && googleMethod.clientId) {
        setGoogleClientId(googleMethod.clientId);
      }
    }
  }, [props.authMethods]);

  useEffect(() => {
    const fetchAuthSessionId = async () => {
      try {
        const storedAuthSessionId = localStorage.getItem('authSessionId');
        if (!storedAuthSessionId) {
          console.error('authSessionId no está definido');
          return;
        }
        setAuthSessionId(storedAuthSessionId);
      } catch (error) {
        console.error('Error obteniendo authSessionId', error);
      }
    };
    fetchAuthSessionId();
  }, []);

  useEffect(() => {
    if (authSessionId) {
      const updateFingerprint = async () => {
        try {
          await axios.patch('/api/v1/oauth/udi-fingerprint', {
            authSessionId,
            udiFingerprint
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
          });
        } catch (error) {
          console.error('Error en la actualización del fingerprint', error);
        }
      };
      updateFingerprint();
    }
  }, [authSessionId]);

  useEffect(() => {
    if (props.udiFingerprint) {
      setCurrentStep(1);
    }
  }, [props.udiFingerprint]);

  useEffect(() => {
    if (response && response.authData) {
      const { email, phone, firstname, lastname } = response.authData;
      if (email) setEmail(email);
      if (phone) setPhone(phone);
      if (firstname) setFirstname(firstname);
      if (lastname) setLastname(lastname);
    }
  }, [response]);

  useEffect(() => {
    if (emailOrPhone || firstname || lastname || email || phone || password || verificationCode) {
      setErrorMessage('');
    }
  }, [emailOrPhone, firstname, lastname, email, phone, password, verificationCode]);

  const reloadPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 2500);
  };

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
    return undefined;
  };

  const verifyAuthentication = async (authSessionId) => {
    try {
      const response = await axios.post('/api/v1/oauth/verify-authentication', {
        authSessionId,
        udiFingerprint,
        state
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      const { redirectUri } = response.data;
      if (redirectUri) {
        router.push(redirectUri);
      } else {
        setErrorMessage('No se encontró una URL de redirección.');
      }
    } catch (error) {
      console.error('Error en la verificación de la autenticación:', error);
      setErrorMessage('Error en la verificación de la autenticación');
    }
  };

  const submitAuthentication = async (isFallback = false) => {
    let authenticationActions = [];

    if (isFallback) {
      authenticationActions.push({
        submitAction: 'fallback',
        stepType: 'emailOrPhone', // O el stepType del paso actual
        value: emailOrPhone // O el valor correspondiente al paso actual
      });

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
        setCurrentStep(1); // Retrocedemos al paso 1 en la UI después del fallback
      } catch (error) {
        console.error('Error en el fallback de autenticación:', error.response ? error.response.data : error);
        setErrorMessage('Error en el fallback de autenticación.');
      }
      return;
    }

    // Lógica normal para avanzar pasos
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
        { submitAction: 'resolve', stepType: 'firstname', value: firstname },
        { submitAction: 'resolve', stepType: 'lastname', value: lastname },
        { submitAction: 'resolve', stepType: 'email', value: email },
        { submitAction: 'resolve', stepType: 'phone', value: phone }
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
          await verifyAuthentication(response.data.authSessionId);
        }
      }
    } catch (error) {
      console.error('Error en la autenticación:', error.response ? error.response.data : error);
      const serverErrors = error.response?.data?.detail?.errors;
    
      if (serverErrors.includes("There's a problem with your account. Please contact support")) {
        setErrorMessage('Hay un problema con tu cuenta. Por favor, contacta a soporte.');
      } else if (serverErrors.includes('phone')) {
        setErrorMessage('Por favor completa el campo de número de teléfono');
      } else if (serverErrors === "JWT session expired" || serverErrors === "Invalid JWT session") {
        setErrorMessage('La sesión ha expirado o es inválida. Recargando...');
        reloadPage();
      } else if (serverErrors === "Internal server error") {
        setErrorMessage('Ups, ocurrió un error. Recargando...');
        reloadPage();
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
        { submitAction: 'resolve', stepType: 'firstname', value: firstname },
        { submitAction: 'resolve', stepType: 'lastname', value: lastname },
        { submitAction: 'resolve', stepType: 'email', value: email },
        { submitAction: 'resolve', stepType: 'phone', value: phone }
      );
    } else if (props.authFlow === 'sign_in' || currentStep === 3) {
      if (!verificationCode) {
        setErrorMessage('Por favor, ingresa el código de verificación.');
        return;
      }

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
        await verifyAuthentication(response.data.authSessionId);
      }
    } catch (error) {
      const serverErrors = error.response?.data?.detail?.errors;

      if (serverErrors && serverErrors.includes("There's a problem with your account. Please contact support")) {
        setErrorMessage("Hay un problema con tu cuenta. Por favor, contacta a soporte.");
      } else if (serverErrors && serverErrors.includes('phone')) {
        setErrorMessage('Por favor completa el campo de número de teléfono');
      } else if (serverErrors === "JWT session expired" || serverErrors === "Invalid JWT session") {
        setErrorMessage('La sesión ha expirado o es inválida. Recargando...');
        reloadPage();
      } else if (serverErrors === "Internal server error") {
        setErrorMessage('Ups, ocurrió un error. Recargando...');
        reloadPage();
      } else {
        setErrorMessage(serverErrors || 'Error en la autenticación');
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

      const { email, phone, firstname, lastname } = response.data.authData;
      if (email) setEmail(email);
      if (phone) setPhone(phone);
      if (firstname) setFirstname(firstname);
      if (lastname) setLastname(lastname);

      if (response.data.authFlow === 'sign_up') {
        setCurrentStep(2);
      } else if (response.data.authFlow === 'sign_in') {
        const nextStep = determineNextStep(response.data.authMethods, currentStep, response.data.authFlow);
        if (nextStep !== undefined) {
          setCurrentStep(nextStep);
        } else {
          await verifyAuthentication(response.data.authSessionId);
        }
      }

      props.setIsSubmitting(false);
    } catch (error) {
      console.error('Error en la autenticación con Google:', error);
      const serverErrors = error.response?.data?.detail?.errors;

      if (serverErrors && serverErrors.includes("There's a problem with your account. Please contact support")) {
        setErrorMessage("Hay un problema con tu cuenta. Por favor, contacta a soporte.");
      } else if (serverErrors && serverErrors.includes('User does not have Google account')) {
        setErrorMessage('No tienes cuenta de Google');
      } else if (serverErrors === "JWT session expired" || serverErrors === "Invalid JWT session") {
        setErrorMessage('La sesión ha expirado o es inválida. Recargando...');
        reloadPage();
      } else if (serverErrors === "Internal server error") {
        setErrorMessage('Ups, ocurrió un error. Recargando...');
        reloadPage();
      } else {
        setErrorMessage(serverErrors || 'Error en la autenticación');
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
        await verifyAuthentication(response.data.authSessionId);
      }

    } catch (error) {
      console.error('Error en la autenticación con Uber:', error);
      const serverError = error.response?.data?.detail?.errors;
      if (serverError === "Internal server error") {
        setErrorMessage('Ups, ocurrió un error. Por favor, recarga la página e intenta de nuevo.');
      } else if (serverError === "JWT session expired" || serverError === "Invalid JWT session") {
        setErrorMessage('La sesión ha expirado o es inválida. Recargando...');
        reloadPage();
      } else {
        setErrorMessage('Error en la autenticación con Uber.');
      }
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
        authSessionId,
        udiFingerprint,
        state,
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
        errorMessage,
        setErrorMessage
      }}
    >
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          {children}
        </GoogleOAuthProvider>
      ) : (
        children
      )}

      {showThankYouPopup && (
        <ThankYouPopup>
          <PopupText>¡Gracias por registrarte!</PopupText>
          <PopupText>Serás redirigido en unos segundos...</PopupText>
        </ThankYouPopup>
      )}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthProvider;


