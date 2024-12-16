import { useState } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

import TucarLogo from '../../components/LogoTucar/LogoTucar';
import styled from 'styled-components';
import InputField from './steps/InputField';
import AuthButton from './AuthButton';

const FormContainer = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 0 20px;
`;

const SimplePasswordChange = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const router = useRouter();

  const handleCancel = () => {
    setEmail('');
    setNewPassword('');
    setVerificationCode('');
    setIsCodeSent(false);
    Swal.fire({
      icon: 'info',
      title: 'Cancelado',
      text: 'Los campos han sido reseteados.',
    });
  };

  const handleChangePassword = async () => {
    try {
      const response = await fetch(
        'https://account-service-1032838122231.us-central1.run.app/api/v1/users/change-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: newPassword,
            userIdentifier: email,
          }),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Código enviado',
          text: 'Revisa tu correo electrónico o tu celular para obtener el código de verificación.',
        });
        setIsCodeSent(true);
      } else {
        const errorData = await response.json();
        if (errorData.detail.errors === 'User has google or uber auth method') {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se puede cambiar la contraseña si tienes una cuenta vinculada a Google o Uber.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',   
            text: `Error: ${errorData.detail.errors}`,
          });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error: ${error.message}`,
      });
    }
  };

  const handleConfirmChangePassword = async () => {
    try {
      const response = await fetch(
        'https://account-service-1032838122231.us-central1.run.app/api/v1/users/confirm-change-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: verificationCode,
            userIdentifier: email,
          }),
        }
      );
  
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Tu contraseña ha sido cambiada con éxito.',
        }).then(() => {
          // Limpiar los campos después de mostrar el mensaje
          setEmail('');
          setNewPassword('');
          setVerificationCode('');
          setIsCodeSent(false);
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error: ${errorData.detail.errors}`,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error: ${error.message}`,
      });
    }
  };
  

  return (
    <div className="font-Poppins  min-h-screen">
      {/* Navbar con Logo y título */}
      <div className="w-full bg-[#0057b8] h-16 flex items-center px-6">
        <TucarLogo color="white" className="h-12 mr-2" />
      </div>

      {/* Contenido principal */}
      <FormContainer className="flex justify-center items-start mt-10">
        <div className=" max-w-md p-6 rounded-md text-[#333333]">
          <h2 className="text-2xl font-bold mb-5">Cambiar contraseña</h2>
          <div className="flex flex-col">
            <InputField
              type="email"
              className="w-full max-w-[348px] h-[42px] flex justify-center items-center gap-[10px] rounded-[10px] border border-[#E3EDF7] bg-[#E3EDF7] px-4 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <InputField
              type="password"
              className="w-full max-w-[348px] h-[42px] flex justify-center items-center gap-[10px] rounded-[10px] border border-[#E3EDF7] bg-[#E3EDF7] px-4 py-2 mt-5"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nueva contraseña"
            />

            {isCodeSent && (
              <InputField
                type="text"
                className="w-full max-w-[348px] h-[42px] flex justify-center items-center gap-[10px] rounded-[10px] border border-[#E3EDF7] bg-[#E3EDF7] px-4 py-2"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Código de verificación"
              />
            )}

            <div className="flex gap-2 mt-6">
              <AuthButton
                className="flex-1 w-full max-w-[348px] h-[42px] flex justify-center items-center gap-[10px] rounded-[10px] border border-[#E3EDF7] bg-[#E3EDF7]"
                onClick={handleCancel}
              >
                Cancelar
              </AuthButton>
              {isCodeSent ? (
                <AuthButton
                  className="flex-1 w-full max-w-[348px] h-[42px] flex justify-center items-center gap-[10px] rounded-[10px] border border-[#E3EDF7] bg-[#E3EDF7]"
                  onClick={handleConfirmChangePassword}
                >
                  Confirmar cambio
                </AuthButton>
              ) : (
                <AuthButton
                  className="flex-1 w-full max-w-[348px] h-[42px] flex justify-center items-center gap-[10px] rounded-[10px] border border-[#E3EDF7] bg-[#E3EDF7]"
                  onClick={handleChangePassword}
                >
                  Continuar
                </AuthButton>
              )}
            </div>
          </div>
          <a href="https://profile.tucar.dev">
            <AuthButton className="flex-1 w-full max-w-[348px] h-[42px] flex justify-center items-center gap-[10px] rounded-[10px] border border-[#E3EDF7] bg-[#E3EDF7]">
              Regresar al perfil
            </AuthButton>
          </a>
        </div>
      </FormContainer>
    </div>
  );
};

export default SimplePasswordChange;
