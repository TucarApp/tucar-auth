
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
  const [state, setState] = useState(''); // Inicializamos como vacío
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
   
    const responseType = searchParams.get('response_type');
    const clientId = searchParams.get('client_id');
    const redirectUri = searchParams.get('redirect_uri');
    const scope = searchParams.get('scope');
    const stateParam = searchParams.get('state'); // Capturamos el `state`

    if (stateParam) {
      setState(stateParam); // Actualizamos el valor de `state` si existe
    }

    if (responseType && clientId && redirectUri && scope && stateParam) {
     

      authorize(); // Llamar a authorize solo si se capturan todos los parámetros
    } else {
      
    }
  }, [searchParams]); // Asegurarse de que searchParams esté disponible

  const authorize = async () => {
    const isAppEnv = window.location.hostname.includes('.app');
    const baseUrl = isAppEnv 
      ? 'https://accounts.tucar.app/api/v1/oauth/authorize' 
      : 'https://accounts.tucar.dev/api/v1/oauth/authorize';
    // Capturar los parámetros de la URL o usar valores por defecto
    const responseType = searchParams.get('response_type') || 'code';
    const stateParam = searchParams.get('state') || state; // Usar el estado capturado
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
      state: stateParam, // Pasamos el estado dinámico aquí
      tenancy: tenancy
    };

    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${baseUrl}?${queryString}`;

   

    window.history.pushState(null, '', `/?${queryString}`);

    try {
      const response = await axios.get(fullUrl, {
        withCredentials: true
      });

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

      updateFingerprint(data.authSessionId);
    } catch (error) {
      console.error('Error en la autorización', error);
    }
  };

  const updateFingerprint = async (authSessionId) => {
    try {
      const response = await axios.patch('https://accounts.tucar.app/api/v1/oauth/udi-fingerprint', {
        authSessionId,
        udiFingerprint
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

     
      setCurrentStep(1);
    } catch (error) {
      console.error('Error en la actualización del fingerprint', error);
    }
  };

  const verifyAuthentication = async (authSessionId) => {
    try {
      const response = await axios.post('https://accounts.tucar.app/api/v1/oauth/verify-authentication', {
        authSessionId,
        udiFingerprint,
        state // Usamos el estado capturado de la URL o predeterminado
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
  
      const redirectUri = response.data?.redirectUri;
  
      // Redirigir en función del flujo de autenticación
      if (typeof window !== 'undefined') {
        localStorage.setItem("redirectUri", redirectUri);
        
        if (authFlow === 'sign_up') {
          router.push("/verify-up"); // Si es registro
        } else if (authFlow === 'sign_in') {
          router.push("/verify-in"); // Si es inicio de sesión
        }
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
      state={state} // Pasamos el estado como prop
    >
      <div className='max-w-screen-2xl mx-auto px-3 lg:px-[60px] pt-[20px]'>
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
//     const storedAuthSessionId = localStorage.getItem('authSessionId');
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

//       Actualizar fingerprint después de recibir authSessionId
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
//     try {
//       const response = await axios.post("/api/v1/oauth/verify-authentication", {
//         authSessionId,
//         udiFingerprint,
//         state,
//       },{
//         headers: {
//           "Content-Type": "application/json",
//         },
//         withCredentials: true,
//       });

//       console.log("Autenticación verificada:", response.data);
//       const redirectUri = response.data?.redirectUri;

//       if (redirectUri) {
//         Redirigir al `redirectUri` en lugar de /dashboard
//         router.push(redirectUri);
//       } else {
//         console.error("No se recibió un redirectUri, redirigiendo al /dashboard");
//         router.push("/dashboard");
//       }
//     } catch (error) {
//       console.error("Error en la verificación de la autenticación:", error);
//       setErrorMessage(error.response?.data?.errors || "Error en la verificación de la autenticación");
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












