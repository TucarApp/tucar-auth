import { ChevronRightIcon } from '@heroicons/react/solid'; 
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'; // Para los íconos de mostrar/ocultar contraseña
import { useState } from 'react';
import TucarLogo from '../components/LogoTucar/LogoTucar';
import AuthButton from '@/components/Auth/AuthButton';
import InputField from '@/components/Auth/InputField';

const Cuenta = () => {
    const [selectedSection, setSelectedSection] = useState('Account Info');
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('Marcelo Miranda');
    const [phone, setPhone] = useState('+56 9 88973679');
    const [email, setEmail] = useState('ticomiranda4@gmail.com');
    const [isPasswordEditing, setIsPasswordEditing] = useState(false); 
    const [password, setPassword] = useState('********');
    const [showPassword, setShowPassword] = useState(false); // Controla si la contraseña se muestra o no

    // Función para cambiar entre secciones
    const handleSectionChange = (section) => {
        setSelectedSection(section);
    };

    // Función para habilitar la edición de la contraseña
    const handlePasswordClick = () => {
        setIsPasswordEditing(true);
    };

    // Función para guardar la nueva contraseña
    const handlePasswordSave = () => {
        setIsPasswordEditing(false);
        // Lógica para guardar la contraseña en el backend
    };

    // Función para alternar la visibilidad de la contraseña
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            {/* Barra superior negra */}
            <div className="w-full bg-[#0057b8] h-12 flex items-center">
                <TucarLogo color="white" className="h-8 ml-6" />
            </div>

            <div className="flex">
                {/* Menú lateral */}
                <div className="w-1/6 h-screen py-5">
                    <ul className="text-[#333333]">
                        <li
                            className={`cursor-pointer mb-4 ${selectedSection === 'Account Info' ? 'font-bold bg-gray-200 w-full p-3 pl-6' : 'p-3 pl-6'}`}
                            onClick={() => handleSectionChange('Account Info')}
                        >
                            Información de la cuenta
                        </li>
                        <li
                            className={`cursor-pointer mb-4 ${selectedSection === 'Security' ? 'font-bold bg-gray-200 w-full p-3 pl-6' : 'p-3 pl-6'}`}
                            onClick={() => handleSectionChange('Security')}
                        >
                            Seguridad
                        </li>
                        <li
                            className={`cursor-pointer mb-4 ${selectedSection === 'Privacy & Data' ? 'font-bold bg-gray-200 w-full p-3 pl-6' : 'p-3 pl-6'}`}
                            onClick={() => handleSectionChange('Privacy & Data')}
                        >
                            Política de privacidad y datos
                        </li>
                    </ul>
                </div>

                {/* Contenido */}
                <div className="w-3/4 p-10 text-[#333333]">
                    {/* Sección de Account Info */}
                    {selectedSection === 'Account Info' && (
                        <div className="mx-auto">
                            <h2 className="text-2xl font-bold mb-5">Información de la cuenta</h2>
                            <div className="flex items-center mb-10">
                                <div>
                                    <h3 className="text-xl">{name}</h3>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold mb-3">Mi perfil</h3>
                            <div className="mb-5">
                                <p className="text-gray-700">Nombre</p>
                                {isEditing ? (
                                    <InputField
                                        type="text"
                                        className="border border-gray-300 rounded p-2 w-full"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                ) : (
                                    <p className="text-[16px]">{name}</p>
                                )}
                            </div>
                            <div className="mb-5">
                                <p className="text-gray-700">Número de teléfono</p>
                                {isEditing ? (
                                    <InputField
                                        type="text"
                                        className="border border-gray-300 rounded p-2 w-full"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                ) : (
                                    <p className="text-[16px]">{phone}</p>
                                )}
                            </div>
                            <div className="mb-5">
                                <p className="text-gray-700">Email</p>
                                {isEditing ? (
                                    <InputField
                                        type="email"
                                        className="border border-gray-300 rounded p-2 w-full"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                ) : (
                                    <p className="text-[16px]">{email}</p>
                                )}
                            </div>

                            {isEditing ? (
                                <AuthButton
                                    onClick={handleSave}
                                    className="bg-blue-500 text-white px-4 py-2 rounded "
                                >
                                    Guardar
                                </AuthButton>
                            ) : (
                                <AuthButton
                                    onClick={() => setIsEditing(true)}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded "
                                >
                                    Editar
                                </AuthButton>
                            )}
                        </div>
                    )}

                    {/* Sección de Security */}
                    {selectedSection === 'Security' && (
                        <div className="text-[#333333]">
                            <h2 className="text-2xl font-bold mb-5">Ajustes de Seguridad</h2>
                            <div className="flex justify-between items-center cursor-pointer" onClick={handlePasswordClick}>
                                <div className="relative">
                                    <p className="font-medium text-lg mb-1">Contraseña</p>
                                    {isPasswordEditing ? (
                                        <div className="relative">
                                            <InputField
                                                type={showPassword ? 'text' : 'password'} // Alternar entre 'password' y 'text'
                                                className="border border-gray-300 rounded p-2 w-full"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <div
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer pt-[15px]"
                                                onClick={togglePasswordVisibility} // Lógica para alternar el tipo de input
                                            >
                                                {showPassword ? (
                                                    <EyeOffIcon className="h-5 w-5 text-gray-500" />
                                                ) : (
                                                    <EyeIcon className="h-5 w-5 text-gray-500" />
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="font-medium">********</p>
                                    )}
                                  
                                </div>
                                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            <hr className="my-4" />

                            {isPasswordEditing && (
                                <AuthButton
                                    onClick={handlePasswordSave}
                                    className="bg-blue-500 text-white px-4 py- rounded"
                                >
                                    Guardar Contraseña
                                </AuthButton>
                            )}
                        </div>
                    )}

                    {/* Sección de Privacy & Data */}
                    {selectedSection === 'Privacy & Data' && (
                        <div className="text-[#333333]">
                            <h2 className="text-2xl font-bold mb-5">Política de privacidad</h2>
                            <a
                                href="https://tucar.app/politica-de-privacidad"
                                target="_blank"
                                className="underline"
                            >
                                <p className="font-medium text-[#0057b8]">
                                    Política de privacidad
                                </p>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cuenta;
