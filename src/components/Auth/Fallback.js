import { useEffect } from 'react'
import Image from 'next/image';
import styled from "styled-components";
import AuthButton from './AuthButton';

import {
  useGlobalDispatch,
  useGlobalAuthParams,
  useGlobalAuthMethods
} from '../context/context';
import AuthDatasource from '../../datasources/auth';
import { submitAuthentication } from '../../helpers/hooks';

const Buttonback = styled.div`
  display: flex;
  justify-content: start;
`;

function Fallback() {
  const dispatcher = useGlobalDispatch();
  const authParams = useGlobalAuthParams();
  const authMethods = useGlobalAuthMethods();

  const getMethodType = () => {
    for (let i in authMethods) {
      let authMethod = authMethods[i];
      if (authMethod.inUse) {
        return authMethod.methodType;
      }
    }
    return 'EmailOrPhone';
  }

  const getStepType = (methodType) => {
    switch (methodType) {
      case 'Google':
        return 'social';
      case 'Uber':
        return 'social';
      default:
        return 'emailOrPhone';
    }
  }

  const callFallback = () => {

    const {
      authSessionId,
      udiFingerprint,
    } = authParams;

    const methodType = getMethodType();
    const stepType = getStepType(methodType)

    submitAuthentication(
      AuthDatasource.submitAuthentication,
      {
        authSessionId,
        udiFingerprint,
        methodType,
        authenticationActions: [
          {
            submitAction: 'fallback',
            stepType: stepType,
            value: 'fallback'
          }
        ],
      },
      dispatcher
    )
  }

  useEffect(() => {}, [authMethods, authParams, dispatcher]);

  return (
    <AuthButton width='155px' onClick={callFallback}  className="font-semibold text-[16px] font-Poppins">
        Volver
    </AuthButton>
  )
}

export default Fallback