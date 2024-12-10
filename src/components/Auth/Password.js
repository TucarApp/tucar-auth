import { useState } from 'react';
import { useRouter } from 'next/router';

import TucarLogo from '../../components/LogoTucar/LogoTucar';

const SimplePasswordChange = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const router = useRouter();

  const handleCancel = () => {
      setEmail('');
      setNewPassword('');
      setVerificationCode('');
      setIsCodeSent(false);
      setStatusMessage('');
  };

  const handleChangePassword = async () => {
      try {
          const response = await fetch('https://account-service-twvszsnmba-uc.a.run.app/api/v1/users/change-password', {
              method: 'POST',
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  password: newPassword,
                  userIdentifier: email
              })
          });

          if (response.ok) {
              setStatusMessage('Código de verificación enviado. Revisa tu correo electrónico.');
              setIsCodeSent(true);
          } else {
              const errorData = await response.json();
              if (errorData.detail.errors === "User has google or uber auth method") {
                  setStatusMessage("No se puede cambiar la contraseña si tienes una cuenta vinculada a Google o Uber.");
                  
              } else {
                  setStatusMessage(`Error: ${errorData.detail.errors}`);
              }
          }
      } catch (error) {
          setStatusMessage(`Error: ${error.message}`);
      }
  };

  const handleConfirmChangePassword = async () => {
      try {
          const response = await fetch('https://account-service-twvszsnmba-uc.a.run.app/api/v1/users/confirm-change-password', {
              method: 'POST',
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  code: verificationCode,
                  userIdentifier: email
              })
          });

          if (response.ok) {
              setStatusMessage('Contraseña cambiada con éxito.');
              handleCancel(); // Limpiar campos después de la confirmación
          } else {
              const errorData = await response.json();
              setStatusMessage(`Error: ${errorData.detail.errors}`);
          }
      } catch (error) {
          setStatusMessage(`Error: ${error.message}`);
      }
  };

  return (
      <div className="font-Poppins  min-h-screen">
          {/* Navbar con Logo y título */}
          <div className="w-full bg-[#0057b8] h-16 flex items-center px-6">
              <TucarLogo color="white" className="h-12 mr-2" />
          </div>

          {/* Contenido principal */}
          <div className="flex justify-center items-start mt-10">
              <div className=" max-w-md p-6 rounded-md text-[#333333]">
                  <h2 className="text-2xl font-bold mb-5">Cambiar contraseña</h2>
                  <div className='flex flex-col'>
                      <input
                          type="email"
                          className="w-full max-w-[348px] h-[42px] flex justify-center items-center gap-[10px] rounded-[10px] border border-[#E3EDF7] bg-[#E3EDF7] px-4 py-2"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder='Email'
                      />
                      <input
                          type="password"
                          className="w-full max-w-[348px] h-[42px] flex justify-center items-center gap-[10px] rounded-[10px] border border-[#E3EDF7] bg-[#E3EDF7] px-4 py-2 mt-5"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder='Nueva contraseña'
                      />

                      {isCodeSent && (
                          <input
                              type="text"
                              className="w-full max-w-[348px] h-[42px] flex justify-center items-center gap-[10px] rounded-[10px] border border-[#E3EDF7] bg-[#E3EDF7] px-4 py-2"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value)}
                              placeholder='Código de verificación'
                          />
                      )}

                      {statusMessage && (
                          <p className="text-sm text-red-600 mt-2">{statusMessage}</p>
                      )}


                      <div className="flex gap-2 mt-6">
                          <button className="flex-1 w-full max-w-[348px] h-[42px] flex justify-center items-center gap-[10px] rounded-[10px] border border-[#E3EDF7] bg-[#E3EDF7] shadow-[inset_-6px_-6px_20px_#FFF,4px_4px_20px_rgba(111,140,176,0.41)] mt-[20px] text-[#5B5D71] text-[15px]" onClick={handleCancel}>
                              Cancelar
                          </button>
                          {isCodeSent ? (
                              <button className="flex-1 w-full max-w-[348px] h-[42px] flex justify-center items-center gap-[10px] rounded-[10px] border border-[#E3EDF7] bg-[#E3EDF7] shadow-[inset_-6px_-6px_20px_#FFF,4px_4px_20px_rgba(111,140,176,0.41)] mt-[20px] text-[#5B5D71] text-[15px]" onClick={handleConfirmChangePassword}>
                                  Confirmar cambio
                              </button>
                          ) : (
                              <button className="flex-1 w-full max-w-[348px] h-[42px] flex justify-center items-center gap-[10px] rounded-[10px] border border-[#E3EDF7] bg-[#E3EDF7] shadow-[inset_-6px_-6px_20px_#FFF,4px_4px_20px_rgba(111,140,176,0.41)] mt-[20px] text-[#5B5D71] text-[15px]" onClick={handleChangePassword}>
                                  Continuar
                              </button>
                          )}
                      </div>
                  </div>
                  <a href='https://profile.tucar.dev'>
                  <button className="flex-1 w-full max-w-[348px] h-[42px] flex justify-center items-center gap-[10px] rounded-[10px] border border-[#E3EDF7] bg-[#E3EDF7] shadow-[inset_-6px_-6px_20px_#FFF,4px_4px_20px_rgba(111,140,176,0.41)] mt-[20px] text-[#5B5D71] text-[15px]" >
                      Regresar al perfil
                  </button>
                  </a>
              </div>
          </div>
      </div>
  );
};

export default SimplePasswordChange;