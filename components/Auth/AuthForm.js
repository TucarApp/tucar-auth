import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";

import Email from './steps/Email';
import EmailOrPhone from './steps/EmailOrPhone';
import Firstname from './steps/Firstname';
import Lastname from './steps/Lastname';
import Password from './steps/Password';
import Phone from './steps/Phone';
import SocialGoogle from './steps/SocialGoogle';
import SocialUber from './steps/SocialUber';
import VerificationCode from './steps/VerificationCode';
import AuthButton from './AuthButton';
import Fallback from "./Fallback";
import {
  useGlobalAuthParams,
  useGlobalAuthMethods,
  useGlobalRequestPayload,
  useGlobalAuthFlow,
  useGlobalAuthenticationError,
  useGlobalDispatch,
} from '../context/context';
import AuthDatasource from '../../datasources/auth';
import { submitAuthentication } from '../../helpers/hooks';

// Contenedor para el formulario
const FormContainer = styled.div`
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

function filterAuthMethods(authMethods) {
  const methodsToRender = {
    principalAuthMethod: null,
    secondaryAuthMethods: []
  }
  
  const inUseAuthMethod = authMethods.filter(authMethod => authMethod.inUse);
  if (inUseAuthMethod.length === 0) {
    if (authMethods.length > 0) {
      methodsToRender.principalAuthMethod = authMethods[0];
    }
  } else {
    methodsToRender.principalAuthMethod = inUseAuthMethod[0];
    return methodsToRender;
  }

  if (methodsToRender.principalAuthMethod === null) return methodsToRender;
  methodsToRender.secondaryAuthMethods = authMethods.filter(
    authMethod => !authMethod.inUse && methodsToRender.principalAuthMethod.methodType !== authMethod.methodType
  );
  return methodsToRender;
}

function filterStepComponents(methodsToRender, authFlow, continueAuth) {
  const stepsToRender = {
    principalAuthMethod: [],
    secondaryAuthMethods: []
  }

  if (methodsToRender.principalAuthMethod === null) return stepsToRender;
  const principalAuthMethodSteps = methodsToRender.principalAuthMethod.steps.filter(
    step => step.flows.includes(authFlow) && !step.completed
  );
  stepsToRender.principalAuthMethod = getStepComponent(principalAuthMethodSteps, methodsToRender.principalAuthMethod.methodType, continueAuth);

  for (let i in methodsToRender.secondaryAuthMethods) {
    let secondaryAuthMethod = methodsToRender.secondaryAuthMethods[i];
    let secondaryAuthMethodSteps = secondaryAuthMethod.steps.filter(
      step => step.flows.includes(authFlow) && !step.completed
    );
    stepsToRender.secondaryAuthMethods.push(getStepComponent(secondaryAuthMethodSteps, secondaryAuthMethod.methodType, continueAuth));
  };

  return stepsToRender;
}

function getStepComponent(steps, methodType, continueAuth) {
  if (steps.length === 0) {
    return [];
  }
  const stepTypes = steps[0].stepType;
  const stepsToRender = [];

  let needContinueButton = false;
  for (let i in stepTypes) {
    let stepType = stepTypes[i];
    if (stepType === 'emailOrPhone') {
      needContinueButton = true;
      stepsToRender.push(<EmailOrPhone />);
    } else if (stepType === 'email') {
      needContinueButton = true;
      stepsToRender.push(<Email />);
    } else if (stepType === 'firstname') {
      needContinueButton = true;
      stepsToRender.push(<Firstname />);
    } else if (stepType === 'lastname') {
      needContinueButton = true;
      stepsToRender.push(<Lastname />);
    } else if (stepType === 'password') {
      needContinueButton = true;
      stepsToRender.push(<Password />);
    } else if (stepType === 'phone') {
      needContinueButton = true;
      stepsToRender.push(<Phone />);
    } else if (stepType === 'social' && methodType === 'Google') {
      stepsToRender.push(<SocialGoogle />);
    } else if (stepType === 'social' && methodType === 'Uber') {
      stepsToRender.push(<SocialUber />);
    } else if (stepType === 'verificationCode') {
      needContinueButton = true;
      stepsToRender.push(<VerificationCode />);
    }
  }
  if (needContinueButton) {
    stepsToRender.push(
      <div className="flex flex-col justify-center items-center">
        <AuthButton
          onClick={() => continueAuth(methodType)}
          className="font-semibold text-[16px] font-Poppins"
        >
          Continuar
        </AuthButton>
      </div>
    );
  }
  return stepsToRender;
}

const AuthForm = () => {
  const dispatcher = useGlobalDispatch();
  const authParams = useGlobalAuthParams();
  const authFlow = useGlobalAuthFlow();
  const authMethods = useGlobalAuthMethods();
  const requestPayload = useGlobalRequestPayload();
  const authenticationError = useGlobalAuthenticationError();
  const [hasFallback, setHasFallback] = useState(false);
  const [stepsToRender, setStepsToRender] = useState({
    principalAuthMethod: [],
    secondaryAuthMethods: []
  });

  const continueAuth = useCallback((methodType) => {
    const {
      authSessionId,
      udiFingerprint,
    } = authParams;

    console.log(requestPayload)
    submitAuthentication(
      AuthDatasource.submitAuthentication,
      {
        authSessionId,
        udiFingerprint,
        methodType,
        authenticationActions: requestPayload,
      },
      dispatcher
    );
  }, [authParams, requestPayload, dispatcher]);

  useEffect(() => {
    const methodsToRender = filterAuthMethods(authMethods);
    if (methodsToRender.principalAuthMethod) {
      if (methodsToRender.principalAuthMethod.inUse) {
        setHasFallback(true);
      } else {
        setHasFallback(false);
      }
    }

    const stepsToRender = filterStepComponents(methodsToRender, authFlow, continueAuth);
    setStepsToRender(stepsToRender);
  }, [authFlow, authMethods, continueAuth]);

  useEffect(() => {}, [hasFallback, stepsToRender, authenticationError]);

  if (authMethods.length === 0) {
    return (
      <FormContainer>
        <div className="flex items-center justify-center my-8">
          <div className="flex-grow border-t-2 border-[#0057b8]"></div>
          <div className="mx-4">
            <div className="text-[#5B5D71] font-Poppins font-bold">O</div>
          </div>
          <div className="flex-grow border-t-2 border-[#0057b8]"></div>
        </div>
      </FormContainer>
    );
  }
  
  return (
    <FormContainer>
      {hasFallback ? <Fallback/> : <></>}
      {
        stepsToRender.principalAuthMethod.map((step, index) => (
          <div key={index}>
            {step}
          </div>
        ))
      }
      <div className="flex flex-col justify-center items-center">
        {authenticationError === '' ? null : (
          <p className="text-red-500 text-sm mt-5 font-Poppins font-light">
            {authenticationError}
          </p>
        )}
      </div>
      <div className="flex items-center justify-center my-8">
        <div className="flex-grow border-t-2 border-[#0057b8]"></div>
        <div className="mx-4">
          <div className="text-[#5B5D71] font-Poppins font-bold">O</div>
        </div>
        <div className="flex-grow border-t-2 border-[#0057b8]"></div>
      </div>
      {
        stepsToRender.secondaryAuthMethods.map((steps, index) => (
          <div key={index}>
            {steps.map((step, secondIndex) => (
              <div key={secondIndex}>
                {step}
              </div>
            ))}
          </div>
        ))
      }
    </FormContainer>
  );
};

export default AuthForm;