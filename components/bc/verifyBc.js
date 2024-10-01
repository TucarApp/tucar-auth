import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Logo from '../components/LogoTucar/LogoTucar'
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

const RedirectButton = styled.button`
  padding: 10px 20px;
  margin-top: 20px;
  background-color: #0057b8;
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
        router.push(redirectUri); 
      }, 4000);

      return () => {
        clearInterval(timer);
        clearTimeout(redirectTimeout);
      };
    }
  }, [redirectUri, router]);

  const handleImmediateRedirect = () => {
    if (redirectUri) {
      router.push(redirectUri);
    }
  };

  return (
    <div className='text-[#5b5d71] text-[15px] font-Poppins font-normal flex justify-center items-center w-full'>

      <VerifyContainer>
        <div className='my-[15px]'>
          <Logo color="color" className="cursor-pointer" width={180} />
        </div>
        <h1>Verificando autenticación...</h1>
        {redirectUri ? (
          <>
            <p>Serás redirigido en {secondsLeft} segundos...</p>
            <AuthButton className='mb-[-px]'  onClick={handleImmediateRedirect}>
              Redirigir ahora
            </AuthButton>
          </>
        ) : (
          <p>Error al obtener la URL de redirección.</p>
        )}
      </VerifyContainer>
    </div>
  );

};

export default Verify;
