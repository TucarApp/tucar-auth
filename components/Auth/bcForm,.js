import { useState, useEffect } from "react";
import InputField from "./InputField";
import AuthButton from "./AuthButton";
import UberButton from "./UberButton";
import Logo from "../LogoTucar/LogoTucar";
import { useAuthContext } from "./AuthProvider";
import VerificatonInput from "./VerificationInput";
import { GoogleLogin } from '@react-oauth/google';

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
    handleGoogleLogin,
    handleGoogleSuccess,
    handleGoogleFailure,
    handleUberLogin,
    getCurrentStepType,
    authenticationError,
    response,
    googleClientId,
  } = useAuthContext();

  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [code3, setCode3] = useState("");
  const [code4, setCode4] = useState("");
  const [error, setError] = useState(false);
  const [showUberButton, setShowUberButton] = useState(false);

  useEffect(() => {
    const completeCode = `${code1}${code2}${code3}${code4}`;
    setVerificationCode(completeCode);
  }, [code1, code2, code3, code4, setVerificationCode]);

  useEffect(() => {
    if (response && response.authMethods) {
      const uberMethod = response.authMethods.find(
        (method) => method.methodType === "Uber"
      );
      if (uberMethod && uberMethod.inUse === false) {
        setShowUberButton(true);
      }
    }
  }, [response]);

  useEffect(() => {
    // Autocompletar datos si estamos en el flujo de Google
    const googleMethod = authMethods.find(method => method.methodType === "Google" && method.inUse);
    if (googleMethod) {
      const authData = response?.authData || {};
      setFirstname(authData.firstname || "");
      setLastname(authData.lastname || "");
      setEmail(authData.email || "");
      setPhone(authData.phone || "");
    }
  }, [authMethods, response, setFirstname, setLastname, setEmail, setPhone]);

  const handleVerificationSubmit = () => {
    if (code1 && code2 && code3 && code4) {
      setError(false);
      submitAuthentication();  // Solo submit, no verify
    } else {
      setError(true);
    }
  };

  const handleInputChange = (setCode, nextInputId) => (e) => {
    const value = e.target.value.replace(/\D/, "");
    setCode(value);
    if (value && nextInputId) {
      document.getElementById(nextInputId).focus();
    }
  };

  const showAuthError = authenticationError || error;

  const handleSubmit = async () => {
    await submitAuthentication();
    
    // Después del submit, verifica si hay pasos pendientes
    const authMethod = authMethods.find(method => method.inUse);
    const remainingSteps = authMethod?.steps.filter(step => !step.completed) || [];

    if (remainingSteps.length > 0) {
      // Solo avanzar al siguiente paso si hay pasos pendientes
  
    } else {
      // Si no hay pasos pendientes, se puede proceder con el verify
      console.log('Todos los pasos completos. Verificando...');
      // Aquí se colocaría la lógica para el verify si fuera necesario
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
        <>
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
            <div className="pt-[60px]">
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
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <AuthButton onClick={handleSubmit}>
                Registrarse
              </AuthButton>
            </div>
          )}

          {currentStep === 3 && (
            <div className="pt-[60px]">
              <div className="flex justify-start">
                <p className="text-[28px] text-left font-Poppins font-semibold text-[#0057b8]">
                  Código de <span className="block">verificación</span>
                </p>
              </div>
              <div className="flex justify-start">
                <p className="text-[16px] font-Poppins font-medium text-[#0057b8] text-left">
                  Ingresa el código que hemos enviado al número de teléfono
                </p>
              </div>
              <div className="flex justify-center gap-x-[25px]">
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
                <p className="font-Poppins font-medium">Enviar Código de Verificación</p>
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
                <p className="font-Poppins font-medium">Enviar Autenticación</p>
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
        </>
      )}
    </div>
  );
};

export default AuthForm;
