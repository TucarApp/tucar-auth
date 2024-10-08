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

const VerifyIn = () => {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      router.push('/dashboard');  // Aquí rediriges a la página que quieras después de sign_in
    }, 4000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, [router]);

  const handleImmediateRedirect = () => {
    router.push('/dashboard');  // Redirigir inmediatamente
  };

  return (
    <VerifyContainer>
      <div className='my-[15px]'>
        <Logo color="color" className="cursor-pointer" width={180} />
      </div>
      <h1>Verificación completa (Inicio de sesión)</h1>
      <p>Serás redirigido en {secondsLeft} segundos...</p>
      <AuthButton onClick={handleImmediateRedirect}>
        Redirigir ahora
      </AuthButton>
    </VerifyContainer>
  );
};

export default VerifyIn;
