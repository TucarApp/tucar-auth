import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuthContext } from '../components/Auth/AuthProvider';

const VerifyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f4f8;
  color: #333;
  font-family: 'Poppins', sans-serif;
`;

const RedirectButton = styled.button`
  padding: 10px 20px;
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Verify = () => {
  const router = useRouter();
  const { authSessionId, udiFingerprint, state, verifyAuthentication } = useAuthContext();
  const [isVerifying, setIsVerifying] = useState(true); // Controlar si estamos verificando
  const [errorMessage, setErrorMessage] = useState('');
  const [redirectUri, setRedirectUri] = useState(''); // Estado para almacenar la URL de redirección
  const [secondsLeft, setSecondsLeft] = useState(6); // Estado para el temporizador de 6 segundos

  useEffect(() => {
    const handleVerifyAuthentication = async () => {
      try {
        const response = await verifyAuthentication(authSessionId);
        const redirectUri = response?.redirectUri;

        if (redirectUri) {
          setRedirectUri(redirectUri);
          setIsVerifying(false);
        } else {
          setErrorMessage('No se encontró una URL de redirección.');
        }
      } catch (error) {
        setErrorMessage('Error en la verificación de la autenticación.');
        console.error(error);
      }
    };

    if (authSessionId && udiFingerprint && state) {
      handleVerifyAuthentication();
    }
  }, [authSessionId, udiFingerprint, state, verifyAuthentication]);

  useEffect(() => {
    if (!isVerifying && redirectUri) {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);

      const redirectTimeout = setTimeout(() => {
        router.push(redirectUri);
      }, 6000);

      return () => {
        clearInterval(timer);
        clearTimeout(redirectTimeout);
      };
    }
  }, [isVerifying, redirectUri, router]);

  const handleImmediateRedirect = () => {
    if (redirectUri) {
      router.push(redirectUri);
    }
  };

  return (
    <VerifyContainer>
      <h1>Verificando autenticación...</h1>
      {isVerifying ? (
        <p>Por favor espera, estamos procesando tu solicitud.</p>
      ) : (
        <>
          <p>¡Gracias por registrarte! Serás redirigido en {secondsLeft} segundos...</p>
          <RedirectButton onClick={handleImmediateRedirect}>
            Redirigir ahora
          </RedirectButton>
        </>
      )}
      {errorMessage && <p>{errorMessage}</p>}
    </VerifyContainer>
  );
};

export async function getServerSideProps() {
  return { props: {} };
}

export default Verify;
