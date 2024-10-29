import { useState } from 'react';
import { MenuIcon, XIcon } from '@heroicons/react/outline'; // Íconos de hamburguesa y cerrar
import { ChevronRightIcon } from '@heroicons/react/solid'; // Chevron
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'; // Íconos de mostrar/ocultar contraseña
import TucarLogo from '../components/LogoTucar/LogoTucar';
import AuthButton from '@/components/Auth/AuthButton';
import InputField from '@/components/Auth/InputField';
import Logo from '../components/LogoTucar/LogoTucar';

const Cuenta = () => {
    const [selectedSection, setSelectedSection] = useState('Account Info');
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('Marcelo Miranda');
    const [phone, setPhone] = useState('+56 9 88973679');
    const [email, setEmail] = useState('ticomiranda4@gmail.com');
    const [isPasswordEditing, setIsPasswordEditing] = useState(false);
    const [password, setPassword] = useState('password123');
    const [showPassword, setShowPassword] = useState(false); // Controla si la contraseña se muestra o no
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    // Función para cambiar entre secciones
    const handleSectionChange = (section) => {
        setSelectedSection(section);
        setIsMenuOpen(false); // Cerrar el menú cuando seleccionas una sección
    };

    // Función para alternar la visibilidad de la contraseña
    // listoo
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            {/* Barra superior */}
            <div className="w-full bg-[#0057b8] h-16 flex items-center justify-between px-4 lg:px-6">
                <TucarLogo color="white" className="h-12" />
                {/* Botón de menú hamburguesa para mobile */}
                <button className="text-white lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                </button>
            </div>

            <div className="flex">
                {/* Menú lateral para desktop y menú mobile cuando está abierto */}
                <div className={`fixed lg:static top-0 left-0 w-3/4 max-w-xs bg-[white] h-full z-20 transition-transform transform   ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-1/6 lg:h-screen lg:block`}>
                    <div className='border-b-[1px] bg-[#0057b8] h-[65px] lg:hidden flex justify-start items-center'>
                        <TucarLogo color='white' className='h-12 pl-5 lg:hidden' />
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
                                    onClick={() => setIsEditing(false)}
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
                      <div className="relative w-full max-w-sm flex items-center rounded p-2">
                          <InputField
                              type={showPassword ? 'text' : 'password'}
                              className="w-full outline-none" // Hacemos el input flexible dentro del contenedor
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              style={{ paddingRight: "2rem" }} // Espacio para el ícono
                          />
                          <div
                              className="absolute right-5 pt-[13px] cursor-pointer" // Posición fija del ícono
                              onClick={togglePasswordVisibility}
                          >
                              {showPassword ? (
                                  <EyeOffIcon className="h-5 w-5 text-gray-500" />
                              ) : (
                                  <EyeIcon className="h-5 w-5 text-gray-500" />
                              )}
                          </div>
                      </div>
                  
                      <AuthButton
                          onClick={() => setIsPasswordEditing(false)}
                          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                      >
                          Guardar Contraseña
                      </AuthButton>
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
