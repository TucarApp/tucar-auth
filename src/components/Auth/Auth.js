import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from "styled-components";

import Logo from "../LogoTucar/LogoTucar";
import AuthForm from './AuthForm';
import LoadingScreen from './LoadingScreen';
import QueryParams from './QueryParams';
import UdiFingerprint from './UdiFingerprint';
import AuthDatasource from '../../datasources/auth';
import {
  useGlobalDispatch,
  useGlobalAuthParams,
  useGlobalCompleted,
  useGlobalAuthFlow,
} from '../context/context';
import { authorize } from '../../helpers/hooks';

const AuthContainer = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 0 20px;

  @media (min-width: 768px) {
    max-width: 600px;
    margin: 0 auto;
  }

  @media (min-width: 1440px) {
    max-width: 60%;
  }
`;

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

const Auth = () => {
  const authParams = useGlobalAuthParams();
  const completed = useGlobalCompleted();
  const authFlow = useGlobalAuthFlow();
  const dispatch = useGlobalDispatch();
  const router = useRouter();
  const queryParams = QueryParams();
  const udiFingerprint = UdiFingerprint();

  if (completed) {
    router.push('/verify');
  }
  
  useEffect(() => {
    if (queryParams && udiFingerprint) {
      const authorizeParams = {
        responseType: APP_ENV === 'development' ? process.env.RESPONSE_TYPE : queryParams.get('response_type'),
        clientId: APP_ENV === 'development' ? process.env.CLIENT_ID : queryParams.get('client_id'),
        redirectUri: APP_ENV === 'development' ? process.env.REDIRECT_URI : queryParams.get('redirect_uri'),
        scope: APP_ENV === 'development' ? process.env.SCOPE : queryParams.get('scope'),
        state: APP_ENV === 'development' ? process.env.STATE : queryParams.get('state'),
        tenancy: APP_ENV === 'development' ? process.env.TENANCY : queryParams.get('tenancy'),
        udiFingerprint,
      };
      authorize(
        AuthDatasource.authorize,
        AuthDatasource.updateUdiFingerprint,
        {
          ...authorizeParams,
          udiFingerprint
        },
        dispatch,
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, udiFingerprint]);

  if (!authParams || !authFlow) {
    return <LoadingScreen />;
  }

  return (
    <AuthContainer>
      <div className="flex flex-col items-center mt-[20px]">
        <div className="flex justify-center">
          <Logo color="color" className="cursor-pointer" width={180} />
        </div>
        <h1 className="font-Poppins font-medium text-[16px] text-[#0057b8] mt-[30px]">
          ¡Bienvenido a Tucar!
        </h1>
        <div className=" w-[355px]">
          <div className="text-center">
            <AuthForm />
            <p className="text-[#5B5D71] font-Poppins font-normal text-[13px] mx-5 mt-[25px]">
              Al continuar, aceptas nuestros{" "}
              <a
                href="https://tucar.app/terminos-condiciones"
                className="underline"
              >
                términos y condiciones
              </a>
              , además de recibir llamadas, mensajes de WhatsApp o SMS,
              incluso por medios automatizados de TUCAR y sus filiales
              en el número proporcionado.
            </p>
          </div>
        </div>
      </div>
    </AuthContainer>
  );
};

export default Auth;