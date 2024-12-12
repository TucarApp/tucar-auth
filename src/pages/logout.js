import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import AuthButton from '@/components/Auth/AuthButton';
import QueryParams from '@/components/Auth/QueryParams';
import LoadingScreen from '@/components/Auth/LoadingScreen';

const LogOutContainer = styled.div`
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

const Logout = () => {
  const router = useRouter();
  const queryParams = QueryParams();
  const [nextUri, setNextUri] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(2);
  const [error, setError] = useState('');

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await fetch(
          '/api/logout',
          {
            method: 'GET',
          }
        );

        if (response.status > 300) {
          setError('Ups algo salió mal');
          router.push(nextUri);
        } else {
          router.push(nextUri);
        }
      } catch (error) {
        setError('Ups algo salió mal');
        setNextUri('https://tucar.app');
      }
    };
    if (queryParams) {
      if (queryParams.toString() === '') {
        setNextUri('https://tucar.app');
      } else {
        setNextUri(`/?${queryParams.toString()}`);
      }
      logoutUser();
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, nextUri]);

  useEffect(() => {
    if (error !== '') {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push(nextUri);
          }
          return prev - 1;
        });
      }, 999);
      return () => clearInterval(timer);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, nextUri, secondsLeft]);

  const handleImmediateRedirect = () => {
    router.push(nextUri);
  };

  if (error !== '') {
    return (
      <div className="text-[#5b5d71] text-[15px] font-Poppins font-normal flex justify-center items-center w-full">
        <LogOutContainer>
          <div className="flex flex-col justify-center items-center">
            <p className="text-red-500 text-sm mt-5 font-Poppins font-light">
              {error}
            </p>
          </div>
          <p>Serás redirigido en {secondsLeft} segundos...</p>
          <AuthButton onClick={handleImmediateRedirect}>
            Redirigir ahora
          </AuthButton>
        </LogOutContainer>
      </div>
    );
  }

  return (
    <div className="text-[#5b5d71] text-[15px] font-Poppins font-normal flex justify-center items-center w-full">
      <LogOutContainer>
        <LoadingScreen />
      </LogOutContainer>
    </div>
  );
};

export default Logout;
