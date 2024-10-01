// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { useSearchParams } from 'next/navigation';
// import axios from 'axios';
// import AuthForm from './AuthForm';
// import AuthProvider from './AuthProvider';

// const Auth = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams(); // Captura los parámetros de la URL
//   const [authSessionId, setAuthSessionId] = useState('');
//   const [authFlow, setAuthFlow] = useState('');
//   const [completed, setCompleted] = useState(false);
//   const [authData, setAuthData] = useState({});
//   const [authMethods, setAuthMethods] = useState([]);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [udiFingerprint, setUdiFingerprint] = useState('unique-device-identifier');
//   const [state, setState] = useState(''); // Inicializamos sin valor
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   // Verificar autenticación si existe authSessionId
//   useEffect(() => {
//     // Verifica si estamos en el cliente antes de acceder a localStorage
//     if (typeof window !== 'undefined') {
//       const storedAuthSessionId = localStorage.getItem('authSessionId');
//       if (storedAuthSessionId && completed) {
//         verifyAuthentication(storedAuthSessionId);
//       }
//     }
//   }, [completed]);

//   useEffect(() => {
//     console.log('currentStep actualizado:', currentStep);
//   }, [currentStep]);

//   // Capturar los parámetros de la URL y autorizar solo cuando estén presentes
//   useEffect(() => {
//     const responseType = searchParams.get('response_type');
//     const clientId = searchParams.get('client_id');
//     const redirectUri = searchParams.get('redirect_uri');
//     const scope = searchParams.get('scope');
//     const stateParam = searchParams.get('state'); // Capturar el valor de `state` desde la URL

//     if (stateParam) {
//       setState(stateParam); 
//       // Verifica si estamos en el cliente antes de acceder a localStorage
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('state', stateParam); // Guardamos el state en localStorage para persistencia
//       }
//     }

//     if (responseType && clientId && redirectUri && scope && stateParam) {
//       console.log('Parámetros capturados desde la URL:', {
//         response_type: responseType,
//         client_id: clientId,
//         redirect_uri: redirectUri,
//         scope: scope,
//         state: stateParam, // Usar `stateParam` en los logs
//       });

//       authorize(responseType, clientId, redirectUri, scope, stateParam); // Llamamos a authorize con los parámetros
//     } else {
//       console.log('Esperando los parámetros en la URL...');
//     }
//   }, [searchParams]);

//   // Función para la autorización inicial
//   const authorize = async (responseType, clientId, redirectUri, scope, stateParam) => {
//     const baseUrl = 'https://accounts.tucar.app/api/v1/oauth/authorize';

//     const tenancy = searchParams.get('tenancy') || 'production';

//     const params = {
//       response_type: responseType,
//       client_id: clientId,
//       redirect_uri: redirectUri,
//       scope: scope,
//       state: stateParam, // Usamos el `stateParam` que capturamos dinámicamente
//       tenancy: tenancy
//     };

//     const queryString = new URLSearchParams(params).toString();
//     const fullUrl = `${baseUrl}?${queryString}`;

//     console.log(params, 'estos son los parámetros capturados');
//     console.log('URL completa para autorización:', fullUrl);

//     try {
//       const response = await axios.get(fullUrl, {
//         withCredentials: true
//       });

//       const data = response.data;
//       console.log('Respuesta completa del servidor:', data);

//       if (data.authMethods && data.authMethods.length > 0) {
//         setAuthMethods(data.authMethods);
//       } else {
//         console.error('authMethods no está presente en la respuesta o está vacío');
//       }

//       setAuthSessionId(data.authSessionId);
//       // Verifica si estamos en el cliente antes de acceder a localStorage
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('authSessionId', data.authSessionId);
//       }
//       setAuthFlow(data.authFlow);
//       setCompleted(data.completed);
//       setAuthData(data.authData);

//       // Actualizar fingerprint después de recibir authSessionId
//       updateFingerprint(data.authSessionId);
//     } catch (error) {
//       console.error('Error en la autorización', error);
//     }
//   };

//   // Actualizar el fingerprint después de la autorización
//   const updateFingerprint = async (authSessionId) => {
//     try {
//       const response = await axios.patch('https://accounts.tucar.app/api/v1/oauth/udi-fingerprint', {
//         authSessionId,
//         udiFingerprint
//       }, {
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         withCredentials: true
//       });

//       console.log('Fingerprint actualizado:', response.data);
//       setCurrentStep(1);
//     } catch (error) {
//       console.error('Error en la actualización del fingerprint', error);
//     }
//   };

  // // Verificar autenticación con redirección dinámica
  // const verifyAuthentication = async (authSessionId) => {
  //   let storedState = state;
  //   // Verifica si estamos en el cliente antes de acceder a localStorage
  //   if (typeof window !== 'undefined') {
  //     storedState = localStorage.getItem('state'); // Obtenemos el state desde localStorage si existe
  //   }

  //   try {
  //     const response = await axios.post('https://accounts.tucar.app/api/v1/oauth/verify-authentication', {
  //       authSessionId,
  //       udiFingerprint,
  //       state: storedState // Usamos el `state` almacenado en localStorage si es necesario
  //     }, {
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       withCredentials: true
  //     });

  //     console.log('Autenticación verificada:', response.data);
  //     const redirectUri = response.data?.redirectUri;

  //     if (redirectUri) {
  //       // Detectar si estamos en un dispositivo Android o en la web
  //       const userAgent = window.navigator.userAgent.toLowerCase();
  //       const isAndroid = userAgent.includes("android");

  //       if (isAndroid) {
  //         // En Android usamos Deep Link con window.location.href
  //         console.log("Redirigiendo en Android con Deep Link:", redirectUri);
  //         window.location.href = redirectUri;
  //       } else {
  //         // En la web (Next.js) usamos router.push para manejar la redirección interna
  //         console.log("Redirigiendo en la web con Next.js:", redirectUri);
  //         router.push(redirectUri);
  //       }
  //     } else {
  //       console.error("No se recibió un redirectUri.");
  //       setErrorMessage("Error: No se recibió una URL de redirección.");
  //     }
  //   } catch (error) {
  //     console.error('Error en la verificación de la autenticación:', error);
  //     setErrorMessage(error.response?.data?.errors || 'Error en la verificación de la autenticación');
  //   }
  // };

//   return (
//     <AuthProvider
//       currentStep={currentStep}
//       setCurrentStep={setCurrentStep}
//       authSessionId={authSessionId}
//       udiFingerprint={udiFingerprint}
//       state={state} // Aseguramos que se pase el estado `state`
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
//          <div className='w-full h-screen flex justify-center items-center'>
//          <div className="flex flex-row gap-2">
//            <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
//            <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
//            <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
//          </div>
//        </div>
       
//         ) : (
//           <AuthForm />
//         )}
//       </div>
//     </AuthProvider>
//   );
// };

// export default Auth;

// Funciona ========
 
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { useSearchParams } from 'next/navigation';
// import axios from 'axios';
// import AuthForm from './AuthForm';
// import AuthProvider from './AuthProvider';

// const Auth = () => {
//   const router = useRouter();
//   const [authSessionId, setAuthSessionId] = useState('');
//   const [authFlow, setAuthFlow] = useState('');
//   const [completed, setCompleted] = useState(false);
//   const [authData, setAuthData] = useState({});
//   const [authMethods, setAuthMethods] = useState([]);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [udiFingerprint, setUdiFingerprint] = useState('unique-device-identifier');
//   const [state, setState] = useState('random-state');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   const searchParams = useSearchParams(); // Captura los parámetros de la URL

//   useEffect(() => {
//     const storedAuthSessionId = localStorage.getItem('authSessionId');
//     if (storedAuthSessionId && completed) {
//       verifyAuthentication(storedAuthSessionId);
//     }
//   }, [completed]);

//   useEffect(() => {
//     console.log('currentStep actualizado:', currentStep);
//   }, [currentStep]);

//   useEffect(() => {
//     // Capturar los parámetros solo si están presentes
//     const responseType = searchParams.get('response_type');
//     const clientId = searchParams.get('client_id');
//     const redirectUri = searchParams.get('redirect_uri');
//     const scope = searchParams.get('scope');
//     const stateParam = searchParams.get('state');

//     // Aca vemos si los parámetros están presentes en la URL
//     if (!responseType || !clientId || !redirectUri || !scope || !stateParam) {
//       console.log('No hay suficientes parámetros en la URL, redirigiendo...');
//       // Redirigir a una página específica o mostrar un mensaje

//     }

//     if (responseType && clientId && redirectUri && scope && stateParam) {
//       console.log('Parámetros capturados desde la URL:', {
//         response_type: responseType,
//         client_id: clientId,
//         redirect_uri: redirectUri,
//         scope: scope,
//         state: stateParam,
//       });

//       authorize(); // Llamar a authorize solo si se capturan todos los parámetros
//     } else {
//       console.log('Esperando los parámetros en la URL...');
//     }
//   }, [searchParams]); // Asegurarse de que searchParams esté disponible

//   const authorize = async () => {
//     const baseUrl = 'https://accounts.tucar.app/api/v1/oauth/authorize';

//     // Capturar los parámetros de la URL o usar valores por defecto
//     const responseType = searchParams.get('response_type') || 'code';
//     const stateParam = searchParams.get('state') || 'random-state'; // Usar el estado desde la URL o uno por defecto
//     const clientId = searchParams.get('client_id') || 'QT6xCtFyNRNPSsopvf4gbSxhPgxuzV3at4JoSg0YG7s';
//     const redirectUri = searchParams.get('redirect_uri') || 'http://localhost:3000';
//     const scope = searchParams.get('scope') || 'driver';
//     const tenancy = 'production'; // Hardcodeado a 'production'

//     // Parámetros que se deben enviar en la solicitud
//     const params = {
//       response_type: responseType,
//       client_id: clientId,
//       redirect_uri: redirectUri,
//       scope: scope,
//       state: stateParam,
//       tenancy: tenancy
//     };

//     const queryString = new URLSearchParams(params).toString();
//     const fullUrl = `${baseUrl}?${queryString}`;

//     console.log('URL completa para autorización:', fullUrl);

//     // Redirigir automáticamente a la URL construida
//     window.history.pushState(null, '', `/?${queryString}`);

//     try {
//       const response = await axios.get(fullUrl, {
//         withCredentials: true
//       });

//       const data = response.data;
//       console.log('Respuesta completa del servidor:', data);

//       if (data.authMethods && data.authMethods.length > 0) {
//         setAuthMethods(data.authMethods);
//       } else {
//         console.error('authMethods no está presente en la respuesta o está vacío');
//       }

//       setAuthSessionId(data.authSessionId);
//       localStorage.setItem('authSessionId', data.authSessionId);
//       setAuthFlow(data.authFlow);
//       setCompleted(data.completed);
//       setAuthData(data.authData);

//       // Actualizar fingerprint después de recibir authSessionId
//       updateFingerprint(data.authSessionId);
//     } catch (error) {
//       console.error('Error en la autorización', error);
//     }
//   };

//   const updateFingerprint = async (authSessionId) => {
//     try {
//       const response = await axios.patch('https://accounts.tucar.app/api/v1/oauth/udi-fingerprint', {
//         authSessionId,
//         udiFingerprint
//       }, {
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         withCredentials: true
//       });

//       console.log('Fingerprint actualizado:', response.data);
//       setCurrentStep(1);
//     } catch (error) {
//       console.error('Error en la actualización del fingerprint', error);
//     }
//   };

//   const verifyAuthentication = async (authSessionId) => {
//     try {
//       const response = await axios.post('https://accounts.tucar.app/api/v1/oauth/verify-authentication', {
//         authSessionId,
//         udiFingerprint,
//         state
//       }, {
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         withCredentials: true
//       });
  
//       console.log('Autenticación verificada:', response.data);
  
//       // Obtenemos el redirectUri de la respuesta
//       const redirectUri = response.data?.redirectUri;
  
//       if (typeof window !== 'undefined' && redirectUri) {
//         // Detectar si estamos en un dispositivo Android o en la web
//         const userAgent = window.navigator.userAgent.toLowerCase();
//         const isAndroid = userAgent.includes("android");
  
//         if (isAndroid) {
//           // En Android usamos Deep Link con window.location.href
//           console.log("Redirigiendo en Android con Deep Link:", redirectUri);
//           window.location.href = redirectUri;
//         } else {
//           // En la web (Next.js) usamos router.push para manejar la redirección interna
//           console.log("Redirigiendo en la web con Next.js:", redirectUri);
//           router.push(redirectUri);
//         }
//       } else {
//         console.error("No se recibió un redirectUri.");
//         setErrorMessage("Error: No se recibió una URL de redirección.");
//       }
//     } catch (error) {
//       console.error('Error en la verificación de la autenticación:', error);
//       setErrorMessage(error.response?.data?.errors || 'Error en la verificación de la autenticación');
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
//       <div className='max-w-screen-2xl mx-auto px-3 lg:px-[60px] pt-[20px]'>
//         {errorMessage && (
//           <div className="text-center py-5 bg-red-400 p-3">{errorMessage}</div>
//         )}
//         {!authSessionId ? (
//           <p>Cargando...</p> // Indicador de carga mientras se obtiene el authSessionId
//         ) : (
//           <AuthForm />
//         )}
//       </div>
//     </AuthProvider>
//   );
// };

// export default Auth;



//



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
    console.log('currentStep actualizado:', currentStep);
  }, [currentStep]);

  useEffect(() => {
    // Capturar los parámetros solo si están presentes
    const responseType = searchParams.get('response_type');
    const clientId = searchParams.get('client_id');
    const redirectUri = searchParams.get('redirect_uri');
    const scope = searchParams.get('scope');
    const stateParam = searchParams.get('state'); // Capturamos el `state`

    if (stateParam) {
      setState(stateParam); // Actualizamos el valor de `state` si existe
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
    const baseUrl = 'https://accounts.tucar.app/api/v1/oauth/authorize';

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

    console.log('URL completa para autorización:', fullUrl);

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

      console.log('Fingerprint actualizado:', response.data);
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

      console.log('Autenticación verificada:', response.data);
      const redirectUri = response.data?.redirectUri;

      if (typeof window !== 'undefined' && redirectUri) {
        localStorage.setItem("redirectUri", redirectUri);
        router.push("/verify");
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

//       const data = response?.data; 
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

//       console.log(redirectUri, 'ESTOOOOOOPOPOPOPOOPPO')
  
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




