import { ChevronRightIcon } from '@heroicons/react/solid'; // Asegúrate de instalar este paquete si aún no lo tienes
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

    // Función para cambiar entre secciones
    const handleSectionChange = (section) => {
        setSelectedSection(section);
    };

    // Función para guardar los cambios
    const handleSave = () => {
        setIsEditing(false);
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
                            {/* Información del usuario */}
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

                            {/* Botón para habilitar/deshabilitar la edición */}
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
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-lg mb-1">Contraseña</p>
                                    <p className='font-medium'>********</p>
                                   
                                </div>
                                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            <hr className="my-4" />
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
