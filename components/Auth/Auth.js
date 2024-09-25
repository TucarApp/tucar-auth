import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import AuthForm from './AuthForm';
import AuthProvider from './AuthProvider';

const Auth = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Captura los parámetros de la URL
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

  // Verificar autenticación si existe authSessionId
  useEffect(() => {
    const storedAuthSessionId = localStorage.getItem('authSessionId');
    if (storedAuthSessionId && completed) {
      verifyAuthentication(storedAuthSessionId);
    }
  }, [completed]);

  useEffect(() => {
    console.log('currentStep actualizado:', currentStep);
  }, [currentStep]);

  // Capturar los parámetros de la URL y autorizar
  useEffect(() => {
    // Capturar los parámetros solo si están presentes
    const responseType = searchParams.get('response_type');
    const clientId = searchParams.get('client_id');
    const redirectUri = searchParams.get('redirect_uri');
    const scope = searchParams.get('scope');
    const stateParam = searchParams.get('state');

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
  }, [searchParams]);

  // Función para la autorización inicial
  const authorize = async () => {
    const baseUrl = 'https://tucar-auth-13535404425.us-central1.run.app/api/v1/oauth/authorize';

    // Capturar los parámetros de la URL o usar valores por defecto
    const responseType = searchParams.get('response_type') || 'code';
    const stateParam = searchParams.get('state') || 'random-state';
    const clientId = searchParams.get('client_id') || 'QT6xCtFyNRNPSsopvf4gbSxhPgxuzV3at4JoSg0YG7s';
    const redirectUri = searchParams.get('redirect_uri') || 'driverapp://auth';
    const scope = searchParams.get('scope') || 'driver';
    const tenancy = 'production';

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

  // Actualizar el fingerprint después de la autorización
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

  // Verificar autenticación con redirección dinámica
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
      const redirectUri = response.data?.redirectUri;
  
      if (redirectUri) {
        // Guarda el redirectUri en localStorage y redirige a /verify para mostrar la pantalla de verificación
        localStorage.setItem('redirectUri', redirectUri);
        router.push('/verify');  // Redirige a la pantalla de verificación
      } else {
        console.error("No se recibió un redirectUri.");
        setErrorMessage("Error: No se recibió una URL de redirección.");
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
      <div className="max-w-screen-2xl mx-auto px-3 lg:px-[60px] pt-[20px]">
        {errorMessage && (
          <div className="text-center py-5 bg-red-400 p-3">{errorMessage}</div>
        )}
        {!authSessionId ? (
         <div className='w-full h-screen flex justify-center items-center'>
         <div className="flex flex-row gap-2">
           <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
           <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
           <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
         </div>
       </div>
       
        ) : (
          <AuthForm />
        )}
      </div>
    </AuthProvider>
  );
};

export default Auth;


// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import axios from "axios";
// import AuthForm from "./AuthForm";
// import AuthProvider from "./AuthProvider";
// import Logo from "../LogoTucar/LogoTucar";

// const Auth = () => {
//   const router = useRouter();
//   const [authSessionId, setAuthSessionId] = useState("");
//   const [authFlow, setAuthFlow] = useState("");
//   const [completed, setCompleted] = useState(false);
//   const [authData, setAuthData] = useState({});
//   const [authMethods, setAuthMethods] = useState([]);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [udiFingerprint, setUdiFingerprint] = useState("unique-device-identifier");
//   const [state, setState] = useState("random-state");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     const storedAuthSessionId = localStorage.getItem("authSessionId");
//     if (storedAuthSessionId && completed) {
//       verifyAuthentication(storedAuthSessionId);
//     }
//   }, [completed]);

//   useEffect(() => {
//     console.log("currentStep actualizado:", currentStep);
//   }, [currentStep]);

//   const authorize = async () => {
//     try {
//       const response = await axios.get("/api/v1/oauth/authorize", {
//         params: {
//           response_type: "code",
//           client_id: "QT6xCtFyNRNPSsopvf4gbSxhPgxuzV3at4JoSg0YG7s",
//           redirect_uri: "http://localhost:3000",
//           scope: "driver",
//           state: "random-state",
//           tenancy: "development",
//         },
//         withCredentials: true,
//       });

//       const data = response?.data; // Verificar si data está definido
//       if (!data) {
//         console.error("Error: La respuesta del servidor no contiene datos.");
//         return;
//       }

//       console.log("Respuesta completa del servidor:", data);

//       if (data.authMethods && data.authMethods.length > 0) {
//         setAuthMethods(data.authMethods);
//       } else {
//         console.error("authMethods no está presente en la respuesta o está vacío");
//       }

//       if (data.authSessionId) {
//         setAuthSessionId(data.authSessionId);
//         localStorage.setItem("authSessionId", data.authSessionId); // Guardar en localStorage
//       } else {
//         console.error("authSessionId no está definido en la respuesta.");
//       }

//       setAuthFlow(data.authFlow);
//       setCompleted(data.completed);
//       setAuthData(data.authData);

//       // Actualizar fingerprint después de recibir authSessionId
//       updateFingerprint(data.authSessionId);
//     } catch (error) {
//       console.error("Error en la autorización", error);
//     }
//   };

//   const updateFingerprint = async (authSessionId) => {
//     try {
//       const response = await axios.patch(
//         "/api/v1/oauth/udi-fingerprint",
//         {
//           authSessionId,
//           udiFingerprint,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );

//       console.log("Fingerprint actualizado:", response.data);
//       setCurrentStep(1);
//     } catch (error) {
//       console.error("Error en la actualización del fingerprint", error);
//     }
//   };

//   const verifyAuthentication = async (authSessionId) => {
//     if (isVerifying) return; // Si ya estamos verificando, no hacemos más solicitudes.
//     setIsVerifying(true); // Marcamos que la verificación ha comenzado.
  
//     try {
//       const response = await axios.post("/api/v1/oauth/verify-authentication", {
//         authSessionId,
//         udiFingerprint,
//         state,
//       }, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         withCredentials: true,
//       });
  
//       console.log("Autenticación verificada:", response.data);
//       const redirectUri = response.data?.redirectUri;
  
//       if (redirectUri) {
//         // Guarda el redirectUri en localStorage o usa otra forma para pasarlo
//         localStorage.setItem("redirectUri", redirectUri);
//         router.push("/verify");
//       } else {
//         console.error("No se recibió un redirectUri.");
//       }
//     } catch (error) {
//       console.error("Error en la verificación de la autenticación:", error);
//       setErrorMessage(error.response?.data?.errors || "Error en la verificación de la autenticación");
//     } finally {
//       setIsVerifying(false); // Restablecemos el estado cuando la verificación termina.
//     }
//   };
  

//   return (
//     <AuthProvider
//       currentStep={currentStep}
//       setCurrentStep={setCurrentStep}
//       authSessionId={authSessionId}
//       udiFingerprint={udiFingerprint}
//       authMethods={authMethods}
//       setAuthMethods={setAuthMethods}
//       authFlow={authFlow}
//       setAuthFlow={setAuthFlow}
//       completed={completed}
//       setCompleted={setCompleted}
//       authData={authData}
//       setAuthData={setAuthData}
//       isSubmitting={isSubmitting}
//       setIsSubmitting={setIsSubmitting}
//       errorMessage={errorMessage}
//       setErrorMessage={setErrorMessage}
//       verifyAuthentication={verifyAuthentication}
//     >
//       <div className="max-w-screen-2xl mx-auto px-3 lg:px-[60px] pt-[20px]">
//         {errorMessage && (
//           <div className="text-center py-5 bg-red-400 p-3">{errorMessage}</div>
//         )}
//         {!authSessionId ? (
//           <button className="text-center" onClick={authorize}>
//             Iniciar Autenticación
//           </button>
//         ) : (
//           <AuthForm />
//         )}
//       </div>
//     </AuthProvider>
//   );
// };

// export default Auth;




