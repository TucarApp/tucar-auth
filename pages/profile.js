import { useState } from 'react';
import { PencilIcon, XIcon, MenuIcon, EyeIcon, EyeOffIcon } from '@heroicons/react/solid'; // Íconos de lápiz, X, hamburguesa, ojo
import TucarLogo from '../components/LogoTucar/LogoTucar';
import AuthButton from '@/components/Auth/AuthButton';
import InputField from '@/components/Auth/InputField';

const Cuenta = () => {
    const [selectedSection, setSelectedSection] = useState('Account Info');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [name, setName] = useState('Marcelo Miranda');
    const [phone, setPhone] = useState('+56 9 88973679');
    const [email, setEmail] = useState('ticomiranda4@gmail.com');
    const [password, setPassword] = useState('password123');
    const [showPassword, setShowPassword] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSectionChange = (section) => {
        setSelectedSection(section);
        setIsMenuOpen(false); // Cerrar el menú cuando seleccionas una sección
    };

    const cancelEdit = (field) => {
        if (field === 'name') setIsEditingName(false);
        if (field === 'phone') setIsEditingPhone(false);
        if (field === 'email') setIsEditingEmail(false);
        if (field === 'password') setIsEditingPassword(false);
    };

    return (
        <div>
            {/* Barra superior */}
            <div className="w-full bg-[#0057b8] h-16 flex items-center justify-between px-4 lg:px-6">
                <TucarLogo color="white" className="h-12" />
                <button className="text-white lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                </button>
            </div>

            <div className="flex">
                {/* Menú lateral */}
                <div className={`fixed lg:static top-0 left-0 w-3/4 max-w-xs bg-[white] h-full z-20 transition-transform transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-1/6 lg:h-screen lg:block`}>
                    <div className="border-b-[1px] bg-[#0057b8] h-[65px] lg:hidden flex justify-start items-center">
                        <TucarLogo color="white" className="h-12 pl-5 lg:hidden" />
                    </div>
                    <ul className="text-[#333333] mt-6 lg:mt-5 p-5">
                        <li
                            className={`cursor-pointer mb-4 ${selectedSection === 'Account Info' ? 'font-bold' : ''}`}
                            onClick={() => handleSectionChange('Account Info')}
                        >
                            Información de la cuenta
                        </li>
                        <li
                            className={`cursor-pointer mb-4 ${selectedSection === 'Security' ? 'font-bold' : ''}`}
                            onClick={() => handleSectionChange('Security')}
                        >
                            Seguridad
                        </li>
                        <li
                            className={`cursor-pointer mb-4 ${selectedSection === 'Privacy & Data' ? 'font-bold' : ''}`}
                            onClick={() => handleSectionChange('Privacy & Data')}
                        >
                            Política de privacidad y datos
                        </li>
                    </ul>
                </div>

                {/* Contenido */}
                <div className="w-full lg:w-3/4 p-10 text-[#333333]">
                    {selectedSection === 'Account Info' && (
                        <div className="mx-auto">
                            <h2 className="text-2xl font-bold mb-5">Información de la cuenta</h2>
                            <h3 className="text-lg font-semibold mb-3">Mi perfil</h3>

                            {/* Campo de Nombre */}
                            <div className="mb-5">
                                <p className="text-gray-700">Nombre</p>
                                <div className="flex items-center gap-2">
                                    {isEditingName ? (
                                        <>
                                            <InputField
                                                type="text"
                                                className="border border-gray-300 rounded p-2"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                            <button onClick={() => cancelEdit('name')} className="text-blue-500">
                                                <XIcon className="h-5 w-5" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-[16px]">{name}</p>
                                            <button onClick={() => setIsEditingName(true)} className="text-blue-500">
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                                {isEditingName && (
                                    <div className="mt-3">
                                        <AuthButton onClick={() => setIsEditingName(false)}>Guardar</AuthButton>
                                    </div>
                                )}
                            </div>

                            {/* Campo de Teléfono */}
                            <div className="mb-5">
                                <p className="text-gray-700">Número de teléfono</p>
                                <div className="flex items-center gap-2">
                                    {isEditingPhone ? (
                                        <>
                                            <InputField
                                                type="text"
                                                className="border border-gray-300 rounded p-2"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                            <button onClick={() => cancelEdit('phone')} className="text-blue-500">
                                                <XIcon className="h-5 w-5" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-[16px]">{phone}</p>
                                            <button onClick={() => setIsEditingPhone(true)} className="text-blue-500">
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                                {isEditingPhone && (
                                    <div className="mt-3">
                                        <AuthButton onClick={() => setIsEditingPhone(false)}>Guardar</AuthButton>
                                    </div>
                                )}
                            </div>

                            {/* Campo de Email */}
                            <div className="mb-5">
                                <p className="text-gray-700">Email</p>
                                <div className="flex items-center gap-2">
                                    {isEditingEmail ? (
                                        <>
                                            <InputField
                                                type="email"
                                                className="border border-gray-300 rounded p-2"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <button onClick={() => cancelEdit('email')} className="text-blue-500">
                                                <XIcon className="h-5 w-5" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-[16px]">{email}</p>
                                            <button onClick={() => setIsEditingEmail(true)} className="text-blue-500">
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                                {isEditingEmail && (
                                    <div className="mt-3">
                                        <AuthButton onClick={() => setIsEditingEmail(false)}>Guardar</AuthButton>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Sección de Seguridad */}
                    {selectedSection === 'Security' && (
                        <div className="text-[#333333]">
                            <h2 className="text-2xl font-bold mb-5">Ajustes de Seguridad</h2>
                            <div className="mb-5">
                                <p className="text-gray-700">Contraseña</p>
                                <div className="flex items-center gap-2">
                                    {isEditingPassword ? (
                                        <>
                                            <InputField
                                                type={showPassword ? 'text' : 'password'}
                                                className="border border-gray-300 rounded p-2 w-full"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button onClick={() => setShowPassword(!showPassword)} className="text-gray-500">
                                                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                            </button>
                                            <button onClick={() => cancelEdit('password')} className="text-blue-500">
                                                <XIcon className="h-5 w-5" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-[16px]">********</p>
                                            <button onClick={() => setIsEditingPassword(true)} className="text-blue-500">
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                                {isEditingPassword && (
                                    <div className="mt-3">
                                        <AuthButton onClick={() => setIsEditingPassword(false)}>Guardar</AuthButton>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cuenta;
