import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import Logo from '../components/LogoTucar/LogoTucar';
import LoadingScreen from '../components/Auth/LoadingScreen';
import { useGlobalAuthParams } from '../components/context/context';
import AuthDatasource from '../datasources/auth';
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

const Verify = () => {
  const authParams = useGlobalAuthParams();
  const [error, setError] = useState('');
  const [redirectUri, setRedirectUri] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const router = useRouter();

  const verifyAuthentication = async ({authSessionId, udiFingerprint, state}) => {
    try {
      const { redirectUri } = await AuthDatasource.verifyAuthentication(
        authSessionId,
        udiFingerprint,
        state,
      );
      setRedirectUri(redirectUri);
    } catch (error) {
      setError('Ups algo salió mal, por favor contacta a soporte');
      setRedirectUri('/');
    }
  };

  const handleImmediateRedirect = () => {
    router.push(redirectUri);
  };

  useEffect(() => {
    if (authParams) {
      verifyAuthentication(authParams);
    }
  }, [authParams]);

  useEffect(() => {}, [redirectUri, error]);

  useEffect(() => {
    if (redirectUri) {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
        if (secondsLeft <= 0) router.push(redirectUri);
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectUri, secondsLeft]);

  if (redirectUri === '') {
    return <LoadingScreen />;
  }

  return (
    <div className='text-[#5b5d71] text-[15px] font-Poppins font-normal flex justify-center items-center w-full'>
      <VerifyContainer>
        <div className='my-[15px]'>
          <Logo color="color" className="cursor-pointer" width={180} />
        </div>
          {error === '' ? null : (
            <div className="flex flex-col justify-center items-center">
              <p className="text-red-500 text-sm mt-5 font-Poppins font-light">
                {error}
              </p>
            </div>
          )}
          <p>Serás redirigido en {secondsLeft} segundos...</p>
          <AuthButton className='mb-[-px]'  onClick={handleImmediateRedirect}>
            Redirigir ahora
          </AuthButton>
      </VerifyContainer>
    </div>
  );

};

export default Verify;