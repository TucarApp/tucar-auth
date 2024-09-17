import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthContext } from '../components/Auth/AuthProvider'; // Asegúrate de importar el contexto adecuado
import axios from 'axios';

const Verify = () => {
  const { authSessionId, udiFingerprint, state } = useAuthContext() || {};
  const router = useRouter();

  useEffect(() => {
    if (authSessionId && udiFingerprint && state) {
      console.log('Valores en Verify:', { authSessionId, udiFingerprint, state });

      const verifyAuthentication = async () => {
        try {
          const response = await axios.post('/api/v1/oauth/verify-authentication', {
            authSessionId,
            udiFingerprint,
            state,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          });

          console.log('Autenticación verificada:', response.data);
          router.push('/dashboard');
        } catch (error) {
          console.error('Error en la verificación de la autenticación:', error);
        }
      };

      verifyAuthentication();
    } else {
      console.error('Faltan valores importantes para la verificación:', { authSessionId, udiFingerprint, state });
    }
  }, [authSessionId, udiFingerprint, state]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-black">
      <h1 className="text-2xl font-bold">Gracias por registrarte!</h1>
      <p>Estamos verificando tu autenticación...</p>
    </div>
  );
};

export default Verify;
