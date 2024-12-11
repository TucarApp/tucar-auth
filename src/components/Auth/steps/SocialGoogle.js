import { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

import AuthDatasource from '../../../datasources/auth';
import { submitAuthentication } from '../../../helpers/hooks';
import {
  useGlobalAuthParams,
  useGlobalAuthMethods,
  useGlobalRequestPayload,
  useGlobalDispatch,
} from '../../context/context';

function SocialGoogle() {
  const dispatcher = useGlobalDispatch();
  const authParams = useGlobalAuthParams();
  const authMethods = useGlobalAuthMethods();
  const requestPayload = useGlobalRequestPayload();
  const [googleClientId, setClientId] = useState('');
  const [inputError, setInputError] = useState('');

  const defaultErrorMessage = 'Ha ocurrido un error, por favor intenta de nuevo';

  useEffect(() => {
    if (authMethods) {
      const googleMethod = authMethods.find((method) => method.methodType === 'Google');
      if (googleMethod) {
        setClientId(googleMethod.clientId);
      }
    }
  }, [authMethods]);

  useEffect(() => {}, [authParams, requestPayload]);

  const updateGoogle = (payload) => {
    const {
      authSessionId,
      udiFingerprint,
    } = authParams;

    submitAuthentication(
      AuthDatasource.submitAuthentication,
      {
        authSessionId,
        udiFingerprint,
        methodType: 'Google',
        authenticationActions: [
          {
            submitAction: 'resolve',
            stepType: 'social',
            value: payload.credential,
          },
        ],
      },
      dispatcher,
    );
  }

  const onGoogleError = (_) => {
    setInputError(defaultErrorMessage);
  }

  return (
    <>
    <div className='flex justify-center items-center mt-5'>
      {googleClientId !== '' ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          <GoogleLogin
            onSuccess={updateGoogle}
            onError={onGoogleError}
            useOneTap
            text="continue_with"
            shape="square"
            size="large"
            width={315}
            logo_alignment="center"
            
          />
        </GoogleOAuthProvider>
      ) : (
        <></>
      )}
      <div className="flex flex-col justify-center items-center">
        {inputError === '' ? null : (
          <p className="text-red-500 text-sm mt-5 font-Poppins font-light">
            {inputError}
          </p>
        )}
      </div>
      </div>
    </>
  )
}

export default SocialGoogle;