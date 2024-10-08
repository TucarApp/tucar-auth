import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Logo from '../components/LogoTucar/LogoTucar';
import AuthButton from '@/components/Auth/AuthButton';

const VerifyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f0f4f8;
  color: #5b5d71;
  font-family: 'Poppins', sans-serif;
`;

const VerifyUp = () => {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [redirectUri, setRedirectUri] = useState('');

  useEffect(() => {
    const uri = localStorage.getItem('redirectUri');
    if (uri) {
      setRedirectUri(uri);
    } else {
      console.error('No se encontró una URL de redirección.');
    }
  }, []);

  useEffect(() => {
    if (redirectUri) {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);

      const redirectTimeout = setTimeout(() => {
        router.push(redirectUri);  // Aquí rediriges a la URL guardada en localStorage
      }, 4000);

      return () => {
        clearInterval(timer);
        clearTimeout(redirectTimeout);
      };
    }
  }, [redirectUri, router]);

  const handleImmediateRedirect = () => {
    router.push(redirectUri);  // Redirigir inmediatamente
  };

  return (
    <VerifyContainer>
      <div className='my-[15px]'>
        <Logo color="color" className="cursor-pointer" width={180} />
      </div>
      <h1>Verificación completa (Registro)</h1>
      {redirectUri ? (
        <>
          <p>Serás redirigido en {secondsLeft} segundos...</p>
          <AuthButton onClick={handleImmediateRedirect}>
            Redirigir ahora
          </AuthButton>
        </>
      ) : (
        <p>Error al obtener la URL de redirección.</p>
      )}
    </VerifyContainer>
  );
};

export default VerifyUp;
