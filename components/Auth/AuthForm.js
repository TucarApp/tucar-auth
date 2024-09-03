import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import InputField from "./InputField";
import AuthButton from "./AuthButton";
import UberButton from "./UberButton";
import Logo from "../LogoTucar/LogoTucar";
import { useAuthContext } from "./AuthProvider";
import VerificatonInput from "./VerificationInput";
import { GoogleLogin } from '@react-oauth/google';

// Contenedor para el formulario
const FormContainer = styled.div`
  width: 100%;
  max-width: 100%; /* Ancho completo en móviles */
  padding: 0 20px; /* Un padding lateral en móviles */

  @media (min-width: 768px) {
    max-width: 600px; /* Ajuste para tabletas */
    margin: 0 auto; /* Centrar en pantallas más grandes */
  }

  @media (min-width: 1440px) {
    max-width: 60%; /* O cualquier valor deseado para pantallas grandes */
  }
`;

// Función para obtener el código de país usando una API de geolocalización
const getCountryCode = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/'); // Servicio para obtener la ubicación
    const data = await response.json();
    return data.country_code;
  } catch (error) {
    console.error('Error obteniendo la geolocalización:', error);
    return null;
  }
};

// Función para establecer el prefijo telefónico según el país
const setPhonePrefix = async (setPhone) => {
  const countryCode = await getCountryCode();
  let prefix = '';

  if (countryCode === 'CR') {
    prefix = '+506 '; // Prefijo de Costa Rica
  } else if (countryCode === 'CL') {
    prefix = '+56 '; // Prefijo de Chile
  }

  setPhone(prefix);
};

const AuthForm = () => {
  const {
    currentStep,
    authMethods,
    emailOrPhone,
    firstname,
    lastname,
    email,
    phone,
    password,
    setEmailOrPhone,
    setFirstname,
    setLastname,
    setEmail,
    setPhone,
    setVerificationCode,
    setPassword,
    submitAuthentication,
    submitAuthenticationGoogle,
    handleGoogleSuccess,
    handleGoogleFailure,
    handleUberLogin,
    getCurrentStepType,
    googleClientId,
    isGoogleFlow,
    setCurrentStep,
    response,
  } = useAuthContext();

  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [code3, setCode3] = useState("");
  const [code4, setCode4] = useState("");
  const [error, setError] = useState(false);
  const [showUberButton, setShowUberButton] = useState(false);
  const [showAuthError, setShowAuthError] = useState(false);

  // Autocompletar el prefijo de teléfono al cargar el componente
  useEffect(() => {
    setPhonePrefix(setPhone);
  }, [setPhone]);

  useEffect(() => {
    const completeCode = `${code1}${code2}${code3}${code4}`;
    setVerificationCode(completeCode);
  }, [code1, code2, code3, code4, setVerificationCode]);

  useEffect(() => {
    console.log('dentro del useEffect', response);
    if (response && response.authMethods) {
      const availableMethods = response.authMethods.map(method => method.methodType);
  
      console.log("Estos son los métodos disponibles:", availableMethods);
  
      if (response.authFlow === 'sign_up' && response.authData) {
        const { email, phone, firstname, lastname } = response.authData;
        if (email) setEmail(email);
        if (phone) setPhone(phone);
        if (firstname) setFirstname(firstname);
        if (lastname) setLastname(lastname);
      }
  
      if (response.authFlow === 'sign_in') {
        const googleMethod = response.authMethods.find(method => method.methodType === "Google");
        const uberMethod = response.authMethods.find(method => method.methodType === "Uber");
  
        if (googleMethod && availableMethods.length === 1 && googleMethod.steps.some(step => step.stepType.includes('social') && !step.completed)) {
          console.log("Solo Google está disponible, cambiando currentStep a 6");
          setCurrentStep(6);
        } else if (uberMethod && availableMethods.length === 1) {
          console.log("Solo Uber está disponible, cambiando currentStep a 5");
          setCurrentStep(5);
        }
      }
    }
  }, [response, setCurrentStep]);

  const handleInputChange = (setCode, nextInputId) => (e) => {
    const value = e.target.value.replace(/\D/, ""); // Permitir solo números
    setCode(value);
    if (value && nextInputId) {
      const nextInput = document.getElementById(nextInputId);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handlePhoneChange = (e) => {
    const inputValue = e.target.value;
    // Asegurar que el espacio después del prefijo esté presente
    const formattedValue = inputValue.replace(/(\+56|\+506)\s?/g, (match) => `${match.trim()} `);
    setPhone(formattedValue);
  };

  const handleVerificationSubmit = () => {
    if (code1 && code2 && code3 && code4) {
      setError(false);
      setShowAuthError(false); // Ocultar el error si la verificación es correcta
      if (isGoogleFlow) {
        submitAuthenticationGoogle();
      } else {
        submitAuthentication();
      }
    } else {
      setError(true);
      setShowAuthError(true); 
    }
  };

  const handleSubmit = async () => {
    if (isGoogleFlow) {
      await submitAuthenticationGoogle();
    } else {
      await submitAuthentication();
    }
  };

  return (
    <div className="text-center">
      {currentStep === 0 && (
        <div>
          <p>Esperando que se cargue el fingerprint...</p>
        </div>
      )}

      {currentStep === 1 && showUberButton ? (
        <div className="flex justify-center items-center mt-4">
          <AuthButton onClick={handleUberLogin}>Iniciar sesión con Uber</AuthButton>
        </div>
      ) : (
        <FormContainer>
          {currentStep === 1 && (
            <div className="flex flex-col items-center">
              <div>
                <div className="flex justify-center">
                  <Logo color="color" className="cursor-pointer" width={180} />
                </div>
                <h1 className="font-Poppins font-medium text-[16px] text-[#0057b8] mt-[30px]">
                  ¡Bienvenido de vuelta!
                </h1>
              </div>
              <div className="w-full max-w-md">
                <p className="text-[#5B5D71] font-Poppins text-[14px] font-medium text-start pt-[25px] mb-[-10px]">
                  Ingresa correo o número de teléfono
                </p>
                <InputField
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                />
                <div className="flex flex-col justify-center items-center">
                  <AuthButton
                    onClick={handleSubmit}
                    className="font-semibold text-[16px] font-Poppins"
                  >
                    Continuar
                  </AuthButton>

                  <div className="flex items-center justify-center my-8 w-[61%]">
                    <div className="flex-grow border-t-2 border-[#0057b8]"></div>
                    <div className="mx-4">
                      <div className="text-[#5B5D71] font-Poppins font-bold">
                        O
                      </div>
                    </div>
                    <div className="flex-grow border-t-2 border-[#0057b8]"></div>
                  </div>
                  <div className="flex flex-col gap-y-[15px]">
                    <UberButton onClick={handleUberLogin}>
                      <img
                        src="uberlog.png"
                        alt="Uber Logo"
                        width={18}
                        className="ml-[-15px]"
                      />
                      <span className="font-Poppins font-normal">
                        Continuar con Uber
                      </span>
                    </UberButton>
                    {googleClientId && (
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleFailure}
                        useOneTap
                        text="continue_with"
                        shape="pill"
                        size="large"
                      />
                    )}
                  </div>
                  <div>
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
            </div>
          )}

          {currentStep === 2 && (
            <div className="pt-[60px] ">
              <div>
              <div className="flex justify-start">
                <p className="text-[28px] font-semibold text-[#0057b8]">
                  ¡Hola!
                </p>
              </div>
              <div className="flex justify-start">
                <p className="text-[16px] font-Poppins font-semibold text-[#0057b8]">
                  Regístrate para comenzar
                </p>
              </div>
              <div className="pt-[20px]">
                <p className="flex justify-start text-[14px] font-medium font-Poppins text-[#5b5d71] mb-[-5px]">
                  Nombre
                </p>
                <InputField
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </div>
              <div className="mt-5">
                <p className="flex justify-start text-[14px] font-medium font-Poppins text-[#5b5d71] mb-[-5px]">
                  Apellido
                </p>
                <InputField
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>
              <div className="mt-5">
                <p className="flex justify-start text-[14px] font-medium font-Poppins text-[#5b5d71] mb-[-5px]">
                  Correo electrónico
                </p>
                <InputField
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mt-5">
                <p className="flex justify-start text-[14px] font-medium font-Poppins text-[#5b5d71] mb-[-5px]">
                  Teléfono
                </p>
                <InputField
                  type="text"
                  value={phone}
                  onChange={handlePhoneChange}
                />
              </div>
              <AuthButton onClick={handleSubmit}>
                <p className="font-Poppins font-medium text-[#5b5d71]">Continuar</p>
              </AuthButton>
            </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="pt-[60px] lg:flex lg:flex-col lg:items-center">
              <div className="flex flex-col items-start">
                <p className="text-[28px] text-left font-Poppins font-semibold text-[#0057b8]">
                  Código de <span className="block">verificación</span>
                </p>
              </div>
              <div className="flex justify-start">
                <p className="text-[16px] font-Poppins font-medium text-[#0057b8] text-left">
                  Ingresa el código que hemos enviado al número de teléfono
                </p>
              </div>
              <div className="flex gap-x-[25px] lg:w-[500px]">
                <VerificatonInput
                  id="input1"
                  type="text"
                  maxLength={1}
                  value={code1}
                  onChange={handleInputChange(setCode1, "input2")}
                  pattern="\d*"
                  className={`font-Poppins font-medium ${showAuthError ? 'border-red-500' : ''}`}
                />
                <VerificatonInput
                  id="input2"
                  type="text"
                  maxLength={1}
                  value={code2}
                  onChange={handleInputChange(setCode2, "input3")}
                  pattern="\d*"
                  className={`font-Poppins font-medium ${showAuthError ? 'border-red-500' : ''}`}
                />
                <VerificatonInput
                  id="input3"
                  type="text"
                  maxLength={1}
                  value={code3}
                  onChange={handleInputChange(setCode3, "input4")}
                  pattern="\d*"
                  className={`font-Poppins font-medium ${showAuthError ? 'border-red-500' : ''}`}
                />
                <VerificatonInput
                  id="input4"
                  type="text"
                  maxLength={1}
                  value={code4}
                  onChange={handleInputChange(setCode4, null)}
                  pattern="\d*"
                  className={`font-Poppins font-medium ${showAuthError ? 'border-red-500' : ''}`}
                />
              </div>

              {showAuthError && (
                <div className="text-red-500 mt-2">
                  *El código ingresado no corresponde. Por favor, vuelve a intentarlo.
                </div>
              )}

              <AuthButton onClick={handleVerificationSubmit}>
                <p className="font-Poppins font-medium">Continuar</p>
              </AuthButton>
            </div>
          )}

          {currentStep === 4 && (
            <div className="pt-[60px]">
              <div className="flex justify-start">
                <p className="text-[28px] text-left font-Poppins font-semibold text-[#0057b8]">
                  Ingresa tu <span className="block">Contraseña</span>
                </p>
              </div>
              <div className="mt-5">
                <p className="font-Poppins font-medium text-[14px] text-[#5b5d71] mb-[-10px] text-start">Ingresar Contraseña</p>
                <InputField
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <AuthButton onClick={handleSubmit}>
                  <p className="font-Poppins font-medium">Registrarse</p>
                </AuthButton>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="pt-[60px]">
              <div className="flex justify-start">
                <p className="text-[28px] text-left font-Poppins font-semibold text-[#0057b8]">
                  Inicia sesión con tu  <span className="block">cuenta de Uber</span>
                </p>
              </div>
              {currentStep === 5 && (
                <div>
                  <div className="flex justify-center items-center mt-4">
                    <UberButton onClick={handleUberLogin}>
                      <img
                        src="uberlog.png"
                        alt="Uber Logo"
                        width={18}
                        className="ml-[-15px]"
                      />
                      <span className="font-Poppins font-normal">
                        Continuar con Uber
                      </span>
                    </UberButton>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 6 && (
            <div className="pt-[60px]">
              <div className="flex justify-start">
                <p className="text-[28px] text-left font-Poppins font-semibold text-[#0057b8]">
                  Inicia sesión con tu <span className="block">cuenta de Google</span>
                </p>
              </div>
              <div className="flex justify-center items-center mt-4">
                {googleClientId && (
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                    useOneTap
                    text="continue_with"
                    shape="pill"
                    size="large"
                  />
                )}
              </div>
            </div>
          )}
        </FormContainer>
      )}
    </div>
  );
};

export default AuthForm;
