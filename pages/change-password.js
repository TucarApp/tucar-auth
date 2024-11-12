import { useState } from 'react';
import TucarLogo from '../components/LogoTucar/LogoTucar';
import AuthButton from '@/components/Auth/AuthButton';
import InputField from '@/components/Auth/InputField';

const SimplePasswordChange = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleCancel = () => {
        setEmail('');
        setNewPassword('');
    };

    const handleContinue = () => {
        console.log("Email:", email);
        console.log("Nueva Contraseña:", newPassword);
    };

    return (
        <div className="font-Poppins bg-white min-h-screen">
            {/* Navbar con Logo y título */}
            <div className="w-full bg-[#0057b8] h-16 flex items-center px-6">
                <TucarLogo color="white" className="h-8 mr-2" />
            </div>

            {/* Formulario */}
            <div className="flex flex-col items-start mt-10 w-full max-w-md p-4 text-[#333333]">
                <h2 className="text-2xl font-bold mb-5">Cambiar contraseña</h2>
                <div className='flex flex-col w-full'>
                    <InputField
                        type="email"
                        className="border border-gray-300 rounded p-2 w-full"

                        placeholder='Email'
                    />
                    <InputField
                        type="password"
                        className="border border-gray-300 rounded p-2 w-full mt-2"
                       
                        placeholder='Nueva contraseña'
                    />
                    <div className="flex gap-2 mt-2 w-full max-w-[348px]">
                        <AuthButton className="flex-1" onClick={() => cancelEdit('name')} variant="secondary">
                            Cancelar
                        </AuthButton>
                        <AuthButton className="flex-1" onClick={() => setIsEditingName(false)}>
                            Continuar
                        </AuthButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimplePasswordChange;
