import { useState, useEffect } from 'react';
import Image from 'next/image';
import styled from 'styled-components';

import AuthDatasource from '../../../datasources/auth';
import { submitAuthentication } from '../../../helpers/hooks';
import {
  useGlobalAuthParams,
  useGlobalAuthMethods,
  useGlobalRequestPayload,
  useGlobalDispatch,
} from '../../context/context';


const UberButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 355px;
  padding: 12px 0px;
  gap: 12px;
  border-radius: 10px;
  background: #000;
  color: #fff;
  font-weight: bold;
  font-family: 'Poppins', sans-serif;
  box-shadow: 2px 2px 4px 0px rgba(114, 142, 171, 0.10),
              -6px -6px 20px 0px #FFF,
              4px 4px 20px 0px rgba(111, 140, 176, 0.41);
`;

function SocialUber() {
  const dispatcher = useGlobalDispatch();
  const authParams = useGlobalAuthParams();
  const authMethods = useGlobalAuthMethods();
  const requestPayload = useGlobalRequestPayload();
  const [uberActionUrl, setUberActionUrl] = useState('');
  const [inputError, setInputError] = useState('');

  const defaultErrorMessage = 'Ha ocurrido un error, por favor intenta de nuevo';

  useEffect(() => {
    if (authMethods) {
      const uberMethod = authMethods.find((method) => method.methodType === 'Uber');
      if (uberMethod) {
        setUberActionUrl(uberMethod.actionUrl);
      }
    }
  }, [authMethods]);

  const updateUber = (uberCode) => {
    const {
      authSessionId,
      udiFingerprint,
    } = authParams;

    submitAuthentication(
      AuthDatasource.submitAuthentication,
      {
        authSessionId,
        udiFingerprint,
        methodType: 'Uber',
        authenticationActions: [
          {
            submitAction: 'resolve',
            stepType: 'social',
            value: uberCode,
          },
        ],
      },
      dispatcher,
    );
  }

  const clickUberButton = () => {
    if (typeof window !== 'undefined') {
      const width = 600;
      const height = 700;
      const left = (window.innerWidth / 2) - (width / 2);
      const top = (window.innerHeight / 2) - (height / 2);

      const authWindow = window.open(
        uberActionUrl,
        'Uber Login',
        `width=${width},height=${height},top=${top},left=${left}`
      );

      const authInterval = setInterval(() => {
        try {
          if (authWindow.closed) {
            clearInterval(authInterval);
            const authCode = localStorage.getItem('uberCode');
            if (authCode) {
              updateUber(authCode);
              localStorage.removeItem('uberCode');
            } else {
              setInputError(defaultErrorMessage);
            }
          }
        } catch (error) {
          setInputError(defaultErrorMessage);
        }
      }, 1000); // 1000ms = 1s
    }
  }

  return (
    <>
      <UberButton onClick={clickUberButton} className="w-full">
        <div className="flex justify-center items-center gap-x-2">
          <Image
            src="/uberlog.png"
            alt="Uber Logo"
            width={18}
            height={18}
            className="ml-[px]"
          />
          <span className="font-Poppins font-normal">
            Continuar con Uber
          </span>
        </div>
      </UberButton>
      <div className="flex flex-col justify-center items-center">
        {inputError === '' ? null : (
          <p className="text-red-500 text-sm mt-5 font-Poppins font-light">
            {inputError}
          </p>
        )}
      </div>
    </>
  )
}

export default SocialUber;