import React, { useState, useEffect } from "react";
import styled from "styled-components";
import InputField from "./InputField";
import AuthButton from "./AuthButton";
import UberButton from "./UberButton";
import Logo from "../LogoTucar/LogoTucar";
import { useAuthContext } from "./AuthProvider";
import VerificatonInput from "./VerificationInput";
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
  } = useAuthContext();

  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [code3, setCode3] = useState("");
  const [code4, setCode4] = useState("");
  const [inputError, setInputError] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState(""); // Advertencia de contraseña

  // Limpiar el error cuando el usuario comience a escribir en email o teléfono
  useEffect(() => {
    if (emailOrPhone) {
      setInputError(""); // Limpiar el error si hay cambios en el input
    }
  }, [emailOrPhone]);

  // Limpiar el error cuando el usuario comience a escribir el código de verificación
  useEffect(() => {
    if (code1 || code2 || code3 || code4) {
      setInputError(false);
      setErrorMessage(""); // Limpiar el mensaje de error cuando el código se introduce correctamente
    }
  }, [code1, code2, code3, code4]);

  // Autocompletar el prefijo de teléfono al cargar el componente
  useEffect(() => {
    setPhonePrefix(setPhone);
  }, [setPhone]);

  useEffect(() => {
    const completeCode = `${code1}${code2}${code3}${code4}`;
    setVerificationCode(completeCode);

    // Si los 4 campos están completos, hacer el submit automáticamente
    if (completeCode.length === 4) {
      setTimeout(() => {
        handleVerificationSubmit();
      }, 1500); // Tiempo adicional para asegurarse de que se capturen los 4 inputs
    }
  }, [code1, code2, code3, code4, setVerificationCode]);

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
    const formattedValue = inputValue.replace(
      /(\+56|\+506)\s?/g,
      (match) => `${match.trim()} `
    );
    setPhone(formattedValue);
  };

  const handleVerificationSubmit = () => {
    if (code1 && code2 && code3 && code4) {
      setInputError(false);
      setErrorMessage(""); // Limpiar el error al hacer submit
      if (isGoogleFlow) {
        submitAuthenticationGoogle();
      } else {
        submitAuthentication();
      }
    } else {
      setInputError(true);
    }
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
        setInputError("Por favor, completa el campo o inicia sesión con Google o Uber.");
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

  return (
    <div className="text-center">
      {currentStep === 0 && (
        <div>
          <p>Esperando que se cargue el fingerprint...</p>
        </div>
      )}

      {currentStep === 1 && (
        <FormContainer>
          <div className="flex flex-col items-center mt-[80px] pantallapc:mt-[180px]">
            <div>
              <div className="flex justify-center">
                <Logo color="color" className="cursor-pointer" width={180} />
              </div>
              <h1 className="font-Poppins font-medium text-[16px] text-[#0057b8] mt-[30px]">
                ¡Bienvenido de vuelta!
              </h1>
            </div>
            <div className="pantallapc:w-[345px] w-[355px]">
              <p className="text-[#5B5D71] font-Poppins text-[14px] font-medium text-start pt-[25px] mb-[-10px]">
                Ingresa correo o número de teléfono
              </p>
              <InputField
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value.toLowerCase())} // Convertir a minúsculas
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

                <div className="flex items-center justify-center my-8 w-[61%]">
                  <div className="flex-grow border-t-2 border-[#0057b8]"></div>
                  <div className="mx-4">
                    <div className="text-[#5B5D71] font-Poppins font-bold">O</div>
                  </div>
                  <div className="flex-grow border-t-2 border-[#0057b8]"></div>
                </div>
                <div className="flex flex-col gap-y-[15px]">
                  <UberButton onClick={handleUberLogin}>
                    <img src="uberlog.png" alt="Uber Logo" width={18} className="ml-[px]" />
                    <span className="font-Poppins font-normal">Continuar con Uber</span>
                  </UberButton>
                  {googleClientId && (
                    <div className="flex justify-center">
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
            <div className="flex gap-x-[25px] lg:w-[350px]">
              <VerificatonInput
                id="input1"
                type="text"
                maxLength={1}
                value={code1}
                onChange={handleInputChange(setCode1, "input2")}
                pattern="\d*"
                className={`font-Poppins font-medium ${inputError ? "border-red-500" : ""}`}
              />
              <VerificatonInput
                id="input2"
                type="text"
                maxLength={1}
                value={code2}
                onChange={handleInputChange(setCode2, "input3")}
                pattern="\d*"
                className={`font-Poppins font-medium ${inputError ? "border-red-500" : ""}`}
              />
              <VerificatonInput
                id="input3"
                type="text"
                maxLength={1}
                value={code3}
                onChange={handleInputChange(setCode3, "input4")}
                pattern="\d*"
                className={`font-Poppins font-medium ${inputError ? "border-red-500" : ""}`}
              />
              <VerificatonInput
                id="input4"
                type="text"
                maxLength={1}
                value={code4}
                onChange={handleInputChange(setCode4, null)} // Null para el último campo
                pattern="\d*"
                className={`font-Poppins font-medium ${inputError ? "border-red-500" : ""}`}
              />
            </div>

            {inputError && (
              <div className="text-red-500 mt-2">*Por favor completa todos los campos.</div>
            )}

            {errorMessage && (
              <div className="text-red-500 mt-2">{errorMessage}</div>
            )}

            <AuthButton onClick={handleVerificationSubmit}>
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
                  setErrorMessage(''); // Limpiar el mensaje de error cuando el usuario escribe
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
                <img src="uberlog.png" alt="Uber Logo" width={18} className="ml-[-15px]" />
                <span className="font-Poppins font-normal">Continuar con Uber</span>
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
            <div className="flex justify-center items-center mt-[25px] mb-[35px] p-[250px]">
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
