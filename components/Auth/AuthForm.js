import React, { useState, useEffect } from "react";
import styled from "styled-components";
import InputField from "./InputField";
import AuthButton from "./AuthButton";
import UberButton from "./UberButton";
import Logo from "../LogoTucar/LogoTucar";
import { useAuthContext } from "./AuthProvider";
import VerificationCodeInput from "./VerificationCodeInput"; // Cambiado a VerificationCodeInput
import { GoogleLogin } from "@react-oauth/google";

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
    const response = await fetch("https://ipapi.co/json/"); // Servicio para obtener la ubicación
    const data = await response.json();
    return data.country_code;
  } catch (error) {
    console.error("Error obteniendo la geolocalización:", error);
    return null;
  }
};

// Función para establecer el prefijo telefónico según el país
const setPhonePrefix = async (setPhone) => {
  const countryCode = await getCountryCode();
  let prefix = "";

  if (countryCode === "CR") {
    prefix = "+506 "; // Prefijo de Costa Rica
  } else if (countryCode === "CL") {
    prefix = "+56 "; // Prefijo de Chile
  }

  setPhone(prefix);
};

const AuthForm = () => {
  const {
    currentStep,
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
    googleClientId,
    isGoogleFlow,
    errorMessage,
    setErrorMessage,
    authMethods, // Recibir authMethods para mostrar los botones según los métodos disponibles
  } = useAuthContext();

  const [inputError, setInputError] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState(""); // Advertencia de contraseña

  // Limpiar el error cuando el usuario comience a escribir en email o teléfono
  useEffect(() => {
    if (emailOrPhone) {
      setInputError(""); // Limpiar el error si hay cambios en el input
    }
  }, [emailOrPhone]);

  // Autocompletar el prefijo de teléfono al cargar el componente
  useEffect(() => {
    setPhonePrefix(setPhone);
  }, [setPhone]);

  const handleVerificationSubmit = (completeCode) => {
    setVerificationCode(completeCode);

    if (isGoogleFlow) {
      submitAuthenticationGoogle();
    } else {
      submitAuthentication();
    }
  };

  const handlePhoneChange = (e) => {
    const inputValue = e.target.value;
    const formattedValue = inputValue.replace(
      /(\+56|\+506)\s?/g,
      (match) => `${match.trim()} `
    );
    setPhone(formattedValue);
  };

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;

    // Validación de contraseña con mensaje de advertencia
    if (currentStep === 4) {
      if (!passwordRegex.test(password)) {
        setPasswordWarning(
          "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un símbolo especial."
        );
        return;
      } else {
        setPasswordWarning(""); // Limpiar la advertencia si la validación es correcta
      }
    }

    // Si el flujo es de Google, omitir la validación de emailOrPhone
    if (!isGoogleFlow) {
      if (!emailOrPhone) {
        setInputError(
          "Por favor, completa el campo o inicia sesión con Google o Uber."
        );
        return;
      }

      if (!emailRegex.test(emailOrPhone)) {
        setInputError("Por favor, ingresa un correo electrónico válido.");
        return;
      }

      setInputError(""); // Limpiar el error si la validación es correcta
    }

    try {
      if (isGoogleFlow) {
        await submitAuthenticationGoogle();
      } else {
        await submitAuthentication();
      }
    } catch (error) {
      console.log("Error completo:", error.response?.data);
      setInputError("Error en la autenticación. Por favor, inténtalo de nuevo.");
    }
  };

  // Verificamos qué métodos de autenticación están disponibles en authMethods
  const googleMethod = authMethods.find((method) => method.name === "Google");
  const tucarMethod = authMethods.find((method) => method.name === "Tucar");
  const uberMethod = authMethods.find((method) => method.name === "Uber");

  return (
    <div className="text-center">
      {currentStep === 0 && (
        <div>
          <p>Esperando que se cargue el fingerprint...</p>
        </div>
      )}

      {currentStep === 1 && (
        <FormContainer>
        <div className="flex flex-col items-center mt-[20px] pantallapc:mt-[160px]">
          <div>
            <div className="flex justify-center">
              <Logo color="color" className="cursor-pointer" width={180} />
            </div>
            <h1 className="font-Poppins font-medium text-[16px] text-[#0057b8] mt-[30px]">
              ¡Bienvenido de vuelta!
            </h1>
          </div>
          <div className="pantallapc:w-[345px] w-[355px]">
      
            {/* Mostrar el campo de emailOrPhone solo si Tucar está disponible */}
            {tucarMethod && (
              <>
                <p className="text-[#5B5D71] font-Poppins text-[14px] font-medium text-start pt-[25px] mb-[-10px]">
                  Ingresa correo o número de teléfono
                </p>
                <InputField
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) =>
                    setEmailOrPhone(e.target.value.toLowerCase())
                  } // Convertir a minúsculas
                />
                <div className="flex flex-col justify-center items-center">
                  {(inputError || errorMessage) && (
                    <p className="text-red-500 text-sm mt-5 font-Poppins font-light">
                      {inputError || errorMessage}
                    </p>
                  )}
                  <AuthButton
                    onClick={handleSubmit}
                    className="font-semibold text-[16px] font-Poppins"
                  >
                    Continuar
                  </AuthButton>
                </div>
              </>
            )}
      
            {/* Mostrar solo Google o Uber */}
            {(googleMethod || uberMethod) && (
              <div className="flex flex-col items-center justify-center w-full">
                <div className="flex items-center justify-center my-8 w-[61%]">
                  <div className="flex-grow border-t-2 border-[#0057b8]"></div>
                  <div className="mx-4">
                    <div className="text-[#5B5D71] font-Poppins font-bold">O</div>
                  </div>
                  <div className="flex-grow border-t-2 border-[#0057b8]"></div>
                </div>
      
                <div className="flex flex-col items-center gap-y-[15px]">
                  {uberMethod && (
                    <UberButton onClick={handleUberLogin} className="w-full">
                      <div className="flex justify-center items-center gap-x-2">
                        <img
                          src="uberlog.png"
                          alt="Uber Logo"
                          width={18}
                          className="ml-[px]"
                        />
                        <span className="font-Poppins font-normal">
                          Continuar con Uber
                        </span>
                      </div>
                    </UberButton>
                  )}
      
                  {googleMethod && googleClientId && (
                    <div className="flex justify-center w-full">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleFailure}
                        useOneTap
                        text="continue_with"
                        shape="rectangular"
                        width={350}
                        size="large"
                        logo_alignment="center"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
      
            {/* Texto sobre términos y condiciones */}
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
      </FormContainer>
      
      )}

      {currentStep === 2 && (
        <div className=" w-full h-full flex justify-center items-center mt-[80px] pantallapc:mt-[110px]">
          <div className="w-[355px]">
            <div className="flex justify-start">
              <p className="text-[28px] font-semibold text-[#0057b8]">¡Hola!</p>
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
                onChange={(e) => setEmail(e.target.value.toLowerCase())} // Convertir a minúsculas
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
            {errorMessage && (
              <p className="text-red-500 text-sm mt-5 font-Poppins font-light">
                {errorMessage}
              </p>
            )}
            <AuthButton onClick={handleSubmit}>
              <p className="font-Poppins font-medium text-[#5b5d71]">Continuar</p>
            </AuthButton>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="w-full h-full flex justify-center items-center mt-[80px] pantallapc:mt-[110px]">
          <div className="w-[355px]">
            <div className="flex flex-col items-start">
              <p className="text-[28px] text-left font-Poppins font-semibold text-[#0057b8]">
                Código de <span className="">verificación</span>
              </p>
            </div>
            <div className="flex justify-start">
              <p className="text-[16px] font-Poppins font-medium text-[#0057b8] text-left">
                Ingresa el código que hemos enviado al número de teléfono
              </p>
            </div>

            {/* Integramos el nuevo componente de VerificationCodeInput */}
            <VerificationCodeInput
              submitVerificationCode={handleVerificationSubmit}
              isLoading={false} // Cambia este valor si tienes un estado de carga
            />

            {inputError && (
              <div className="text-red-500 mt-2">
                *Por favor completa todos los campos.
              </div>
            )}

            {errorMessage && (
              <div className="text-red-500 mt-2">{errorMessage}</div>
            )}

            <AuthButton onClick={() => handleVerificationSubmit()}>
              <p className="font-Poppins font-medium">Continuar</p>
            </AuthButton>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="w-full h-full flex justify-center items-center mt-[80px] pantallapc:mt-[110px]">
          <div className="w-[350px]">
            <div className="flex justify-start">
              <p className="text-[28px] text-center font-Poppins font-semibold text-[#0057b8]">
                Ingresa tu <span className="">Contraseña</span>
              </p>
            </div>
            <div className="mt-5">
              <p className="font-Poppins font-medium text-[14px] text-[#5b5d71] mb-[-10px] text-start">
                Ingresar Contraseña
              </p>
              <InputField
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(""); // Limpiar el mensaje de error cuando el usuario escribe
                }}
              />
              {errorMessage && (
                <div className="text-red-500 mt-2">{errorMessage}</div>
              )}
              {passwordWarning && (
                <div className="text-red-500 mt-2">{passwordWarning}</div>
              )}
              <AuthButton onClick={handleSubmit}>
                <p className="font-Poppins font-medium">Registrarse</p>
              </AuthButton>
            </div>
          </div>
        </div>
      )}

      {currentStep === 5 && (
        <div className="w-full h-full flex justify-center items-center mt-[80px] pantallapc:mt-[110px]">
          <div className="w-[355px]">
            <div className="flex justify-center">
              <p className="text-[28px] text-left font-Poppins font-semibold text-[#0057b8]">
                Inicia sesión con tu{" "}
                <span className="block">cuenta de Uber</span>
              </p>
            </div>
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
        </div>
      )}

      {currentStep === 6 && (
        <div className="w-full h-full flex justify-center items-center mt-[80px] pantallapc:mt-[110px]">
          <div className="w-[350px]">
            <div className="flex justify-center">
              <p className="text-[28px] text-left font-Poppins font-semibold text-[#0057b8]">
                Inicia sesión con tu{" "}
                <span className="block">cuenta de Google</span>
              </p>
            </div>
            <div className="flex justify-center items-center mt-4">
              {googleClientId && (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                  useOneTap
                  text="continue_with"
                  shape="square"
                  size="large"
                  width={330}
                  logo_alignment="center"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
