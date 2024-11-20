import { useState } from 'react';
import TucarLogo from '../components/LogoTucar/LogoTucar';


import { useRouter } from 'next/router';
import styled from 'styled-components';



const AuthButton = styled.button`
  width: 100%; 
  max-width: 348px; 
  height: 42px;
  display: flex; 
  padding: 0; 
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  border: 1px solid var(--boton-2, #E3EDF7);
  background: var(--boton-2, #E3EDF7);


  box-shadow: -6px -6px 20px 0px #FFF, 4px 4px 20px 0px rgba(111, 140, 176, 0.41);
  margin-top: 20px; 
  color: #5B5D71;
  font-size: 15px;
`;

const InputField = styled.input`
  width: 350px;
  height: 45px;
  flex: 1;
  border-radius: 4px;
  border: 1px solid var(--Blanco, #FFF);
  background: #E3EDF7;
  box-shadow: -4px -4px 9px 0px rgba(255, 255, 255, 0.88) inset, 
              4px 4px 14px 0px #D9D9D9 inset;
  ::placeholder,
  ::-webkit-input-placeholder {
    color: #5b5d71;
  }
  :-ms-input-placeholder {
    color: red;
  }
  padding-left: 15px;
  margin-top: 15px;
  color: #5b5d71;


`;


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
                        <InputField
                            type="email"
                            className="border border-gray-300 rounded p-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Email'
                        />
                        <InputField
                            type="password"
                            className="border border-gray-300 rounded p-2 mt-4"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder='Nueva contraseña'
                        />

                        {isCodeSent && (
                            <InputField
                                type="text"
                                className="border border-gray-300 rounded p-2 mt-4"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder='Código de verificación'
                            />
                        )}

                        {statusMessage && (
                            <p className="text-sm text-red-600 mt-2">{statusMessage}</p>
                        )}


                        <div className="flex gap-2 mt-6">
                            <AuthButton className="flex-1" onClick={handleCancel}>
                                Cancelar
                            </AuthButton>
                            {isCodeSent ? (
                                <AuthButton className="flex-1" onClick={handleConfirmChangePassword}>
                                    Confirmar cambio
                                </AuthButton>
                            ) : (
                                <AuthButton className="flex-1" onClick={handleChangePassword}>
                                    Continuar
                                </AuthButton>
                            )}
                        </div>
                    </div>
                    <AuthButton className="flex-1"  onClick={() => router.push('/profile')}>
                        Regresar al perfil
                    </AuthButton>
                </div>
            </div>
        </div>
    );
};

export default SimplePasswordChange;
