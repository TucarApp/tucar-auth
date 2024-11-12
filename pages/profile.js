import { useState, useEffect } from 'react';
import { PencilIcon, XIcon, MenuIcon, CheckCircleIcon, ExclamationCircleIcon, ChevronRightIcon } from '@heroicons/react/solid';
import TucarLogo from '../components/LogoTucar/LogoTucar';
import AuthButton from '@/components/Auth/AuthButton';
import InputField from '@/components/Auth/InputField';

// Importamos los mocks
import { fetchUserData } from '../utils/mocks/mockUsersApi';
import { updateCredentials } from '../utils/mocks/mockCredentialsApi';
import { verifyUser } from '../utils/mocks/mockVerifyApi';
import { changePassword } from '../utils/mocks/mockChangePasswordApi';
import { confirmChangePassword } from '../utils/mocks/mockConfirmChangePasswordApi';

const Cuenta = () => {
    const [selectedSection, setSelectedSection] = useState('Account Info');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isChangeConfirmed, setIsChangeConfirmed] = useState(false);

    const [allowedApplications, setAllowedApplications] = useState([]);



    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneCode, setPhoneCode] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userIdentifier, setUserIdentifier] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');


    const [userData, setUserData] = useState(null);
    const [changePasswordStatus, setChangePasswordStatus] = useState(null);
    const [confirmPasswordStatus, setConfirmPasswordStatus] = useState(null);

    const [verifiedStatus, setVerifiedStatus] = useState({ email: false, phone: false });

    const token = "AC.PPQ-EFdGHwly7r2-3bHoau1KjnZKW4NtIMV3ekH73ZvFiGZXCdI_kheUvFxC2pWAfrxbeAgIzgSyGy4cM5qy-sH1T2IifPW6FVF5-3fJVbyi_eSaGS-s9OnAtGXik3irnc_9nIFWAlTdFKyHcr52FyyjcNNRVAkTp3rGlA.VKZSmojF4i9gAIzz0tnKQtR7fNre0Ixo3VfUe-BIWc6wlrRyktle4kJgTHByCFe59-7qV46TAMCw0SIc2tKkEEOFOGrrDy4RLyln7JrxO0J_nuU5iLRxLdyT2jT5l67gF1rIYjt3xrifV4c3gbtnIUWS_ttyL76IRoiOm8mfaodw11qcfDFmLNvjWByXQa3AyisEtIkSzj3ymjJ79fca2zAhlGNo5-FzetHRcKS36iFdsW9tS--Ov1p3mfyN78xKS6yIh-IZRAL9Mn6yyBcy4sBSxnt6Ghm9fXc-xQpOXB4YjAIMPKcvDQj2TVw3A1hjAB71ce2JhHqaCH-Lmo-8aQ";






    useEffect(() => {
        const loadData = async () => {
            const data = await fetchUserData();
            const verifyData = await verifyUser();
            setUserData(data);

            if (data) {
                setName(data.allowedApplications[0].contactName || '');
                setLastname(data.allowedApplications[0].contactLastname || '');
                setPhone(data.allowedApplications[0].contactPhone || '');
                setPhoneCode(data.code || '');
                setEmail(data.allowedApplications[0].contactEmail || '');
            }

            if (verifyData) {
                setVerifiedStatus(verifyData.verifiedElements);
            }

            // Fetch user credentials using the default email
            await fetchUserCredentials("email", "ticomiranda4@gmail.com");
        };
        loadData();
    }, []);

    // Function to fetch user credentials with token
    const [authentications, setAuthentications] = useState([]); // Nuevo estado para autenticaciones

    const fetchUserCredentials = async (credentialType, value) => {
        try {
            const response = await fetch(`https://account-service-twvszsnmba-uc.a.run.app/api/v1/users/?credential_type=${credentialType}&value=${value}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log("User Credentials:", data);

                // Update the states with fetched data
                setName(data.firstname || '');
                setLastname(data.lastname || '');
                setPhone(data.phone || '');
                setPhoneCode(data.code || '');
                setEmail(data.email || '');
                setVerifiedStatus(data.verifiedElements || { email: false, phone: false });
                setAuthentications(data.authentications || []); // Almacena las autenticaciones permitidas
                setAllowedApplications(data.allowed_applications || []); // Almacena las aplicaciones permitidas
            } else {
                console.error("Error fetching user credentials:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };



    const handleSectionChange = (section) => {
        setSelectedSection(section);
        setIsMenuOpen(false);
    };

    const cancelEdit2 = () => {
        setIsEditingPassword(false); // Vuelve al estado inicial sin edición
        setIsCodeSent(false); // Resetea el estado de envío de código
        setIsChangeConfirmed(false); // Resetea el estado de confirmación de cambio
        setCurrentPassword(''); // Limpia el valor del campo de contraseña actual
        setNewPassword(''); // Limpia el valor del campo de nueva contraseña
        setVerificationCode(''); // Limpia el valor del código de verificación
        setChangePasswordStatus(null); // Resetea el mensaje de estado
        setConfirmPasswordStatus(null);
    };


    const handleSendVerificationCode = () => {
        setIsCodeSent(true);
        setChangePasswordStatus("Código de verificación enviado. Revisa tu correo o teléfono.");
    };


    const handleEditPassword = () => {
        setIsEditingPassword(true);
        setIsCodeSent(false);
        setChangePasswordStatus(null);
    };


    const cancelEdit = (field) => {
        if (field === 'name') setIsEditingName(false);
        if (field === 'phone') setIsEditingPhone(false);
        if (field === 'email') setIsEditingEmail(false);
        if (field === 'password') setIsEditingPassword(false);
        setVerificationCode('');
    };



    const handleConfirmVerificationCode = async (field) => {
        if (field === 'phone') {
            setIsEditingPhone(false);
            setVerifiedStatus((prevStatus) => ({ ...prevStatus, phone: true }));
        }
        if (field === 'email') {
            setIsEditingEmail(false);
            setVerifiedStatus((prevStatus) => ({ ...prevStatus, email: true }));
        }
        setIsCodeSent(false);
    };



    const handleChangePassword = async () => {
        const response = await changePassword({
            password,
            userIdentifier
        });
        if (response.status === "success") {
            setIsCodeSent(true);
            setChangePasswordStatus("Código de verificación enviado. Revisa tu correo o teléfono.");
        } else {
            setChangePasswordStatus("Error al enviar el código. Inténtalo de nuevo.");
        }
    };

    const handleConfirmChangePassword = async () => {
        const response = await confirmChangePassword({
            code: verificationCode,
            userIdentifier
        });
        if (response.status === "success") {
            setConfirmPasswordStatus("Contraseña cambiada con éxito.");
        } else {
            setConfirmPasswordStatus("Error al confirmar el cambio de contraseña. Inténtalo de nuevo.");
        }
    };

    return (
        <div className='font-Poppins'>
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
                <div className="w-full lg:w-[55%] p-10 text-[#333333]">
                    {selectedSection === 'Account Info' && (
                        <div className="mx-auto">
                            <h2 className="text-2xl font-bold mb-5">Información de la cuenta</h2>

                            {/* Campo de Nombre y Apellido */}
                            <div className="mb-5 border-b border-gray-300 pb-3">
                                <p className="text-gray-700 font-bold">Nombre</p>
                                <div className="flex justify-between items-center">
                                    {isEditingName ? (
                                        <>
                                            <div className='flex flex-col w-full'>
                                                <InputField
                                                    type="text"
                                                    className="border border-gray-300 rounded p-2 w-full"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder='Nombre'
                                                />
                                                <InputField
                                                    type="text"
                                                    className="border border-gray-300 rounded p-2 w-full mt-2"
                                                    value={lastname}
                                                    onChange={(e) => setLastname(e.target.value)}
                                                    placeholder='Apellido'
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
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-[16px]">{`${name} ${lastname}`}</p>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => setIsEditingName(true)} className="text-blue-500">
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>



                            {/* Campo de Teléfono */}
                            <div className="mb-5 border-b border-gray-300 pb-3">
                                <p className="text-gray-700 font-bold">Número de teléfono</p>
                                <div className="flex justify-between items-center">
                                    {isEditingPhone ? (
                                        <div className="flex flex-col gap-2">
                                            <InputField
                                                type="text"
                                                className="border border-gray-300 rounded p-2 w-full"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                            {isCodeSent ? (
                                                <>
                                                    <InputField
                                                        type="text"
                                                        className="border border-gray-300 rounded p-2 w-full"
                                                        placeholder="Código de Verificación"
                                                        value={verificationCode}
                                                        onChange={(e) => setVerificationCode(e.target.value)}
                                                    />
                                                    <div className="flex gap-2 mt-2">
                                                        <AuthButton onClick={() => cancelEdit('phone')} variant="secondary">Cancelar</AuthButton>
                                                        <AuthButton onClick={() => handleConfirmVerificationCode('phone')}>Confirmar cambio</AuthButton>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex gap-2 mt-2">
                                                    <AuthButton onClick={() => cancelEdit('phone')} variant="secondary">Cancelar</AuthButton>
                                                    <AuthButton onClick={handleSendVerificationCode}>Enviar Código</AuthButton>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-[16px]">{`${phoneCode} ${phone}`}</p>
                                            <div className="flex items-center gap-2">
                                                {verifiedStatus.phone ? (
                                                    <CheckCircleIcon className="h-5 w-5 text-green-500" title="Verificado" />
                                                ) : (
                                                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" title="Falta verificar" />
                                                )}
                                                <button onClick={() => setIsEditingPhone(true)} className="text-blue-500">
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>









                            {/* Campo de Email */}
                            <div className="mb-5 border-b border-gray-300 pb-3">
                                <p className="text-gray-700 font-bold">Email</p>
                                <div className="flex justify-between items-center">
                                    {isEditingEmail ? (
                                        <div className="flex flex-col gap-2">
                                            <InputField
                                                type="email"
                                                className="border border-gray-300 rounded p-2 w-full"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            {isCodeSent ? (
                                                <>
                                                    <InputField
                                                        type="text"
                                                        className="border border-gray-300 rounded p-2 w-full"
                                                        placeholder="Código de Verificación"
                                                        value={verificationCode}
                                                        onChange={(e) => setVerificationCode(e.target.value)}
                                                    />
                                                    <div className="flex gap-2 mt-2">
                                                        <AuthButton onClick={() => cancelEdit('email')} variant="secondary">Cancelar</AuthButton>
                                                        <AuthButton onClick={() => handleConfirmVerificationCode('email')}>Confirmar cambio </AuthButton>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex gap-2 mt-2">
                                                    <AuthButton onClick={() => cancelEdit('email')} variant="secondary">Cancelar</AuthButton>
                                                    <AuthButton onClick={handleSendVerificationCode}>Enviar Código</AuthButton>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-[16px]">{email}</p>
                                            <div className="flex items-center gap-2">
                                                {verifiedStatus.email ? (
                                                    <CheckCircleIcon className="h-5 w-5 text-green-500" title="Verificado" />
                                                ) : (
                                                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" title="Falta verificar" />
                                                )}
                                                <button onClick={() => setIsEditingEmail(true)} className="text-blue-500">
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>



                        </div>
                    )}

                    {selectedSection === 'Security' && (
                        <div>
                            <div className="text-[#333333] mb-5 border-b border-gray-300 pb-3">
                                <h2 className="text-2xl font-bold mb-5">Cambiar Contraseña</h2>

                                {!isEditingPassword ? (
                                    // Etapa inicial: Contraseña oculta y botón de edición
                                    <div className="flex justify-between items-center mb-5">
                                        <p className="text-[16px]">●●●●●●●●</p>
                                        <button onClick={() => setIsEditingPassword(true)} className="text-blue-500">
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                ) : (
                                    // Etapa de edición y confirmación
                                    <>
                                        {!isCodeSent && !isChangeConfirmed ? (
                                            <>
                                                <div className="mb-5">
                                                    <InputField
                                                        type="password"
                                                        className="border border-gray-300 rounded p-2 w-full"
                                                        placeholder="Nueva contraseña"
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                    />
                                                </div>

                                                <div className="mb-5">
                                                    <InputField
                                                        type="password"
                                                        className="border border-gray-300 rounded p-2 w-full"
                                                        placeholder="Confirmar contraseña"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                    />
                                                </div>

                                                <div className="flex gap-2 mt-2 w-full max-w-[348px]">
                                                    <AuthButton className="flex-1" onClick={cancelEdit2} variant="secondary">
                                                        Cancelar
                                                    </AuthButton>
                                                    <AuthButton className="flex-1" onClick={handleSendVerificationCode}>
                                                        Continuar
                                                    </AuthButton>
                                                </div>
                                            </>
                                        ) : isCodeSent && !isChangeConfirmed ? (
                                            // Etapa de código de verificación únicamente
                                            <>
                                                <div className="mb-5">
                                                    <InputField
                                                        type="text"
                                                        className="border border-gray-300 rounded p-2 w-full"
                                                        placeholder="Código de verificación"
                                                        value={verificationCode}
                                                        onChange={(e) => setVerificationCode(e.target.value)}
                                                    />
                                                </div>

                                                {changePasswordStatus && <p className="mt-2 text-sm text-gray-600">{changePasswordStatus}</p>}

                                                <div className="flex gap-2 mt-2 w-full max-w-[348px]">
                                                    <AuthButton className="flex-1" onClick={cancelEdit2} variant="secondary">
                                                        Cancelar
                                                    </AuthButton>
                                                    <AuthButton className="flex-1" onClick={() => handleConfirmChangePassword().then(() => setIsChangeConfirmed(true))}>
                                                        Confirmar cambio
                                                    </AuthButton>
                                                </div>
                                            </>
                                        ) : (
                                            // Etapa final: Mostrar botón "Volver" después de confirmar el cambio
                                            <>
                                                <p className="mt-2 text-sm text-gray-600">Contraseña cambiada con éxito.</p>
                                                <div className="flex gap-2 mt-2 w-full max-w-[348px]">
                                                    <AuthButton className="flex-1" onClick={cancelEdit2}>
                                                        Volver
                                                    </AuthButton>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Cuentas vinculadas */}
                            <div className="mb-5 border-b border-gray-300 pb-3">
                                <p className="text-gray-700 font-bold">Cuentas vinculadas</p>
                                <div>
                                    {authentications.map((auth, index) => (
                                        auth.allowed && (
                                            <div key={index} className="flex justify-between items-center">
                                                <p className="text-[16px] my-2">{auth.methodType}</p>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}



                    {selectedSection === 'Privacy & Data' && (
                        <div>
                            <div className="text-[#333333] border-b border-gray-300 pb-3">
                                <h2 className="text-2xl font-bold mb-5">Política de privacidad</h2>
                                {allowedApplications.map((app, index) => (
                                    <div key={index} className="mb-4">
                                        <p className="font-medium">{app.name}</p>
                                        <p className="text-gray-700">{app.description}</p>
                                       
                                      <ul className='list-disc mx-5'>
                                        <li>  <a href={app.privacyPolicy} target="_blank" rel="noopener noreferrer" className="underline text-[#0057b8]">
                                            Política de Privacidad
                                        </a>
                                        
                                      </li>
                                      <li>
                                      <a href={app.termsOfService} target="_blank" rel="noopener noreferrer" className="underline text-[#0057b8]">
                                            Términos de Servicio
  </a>
                                      </li>
                                      </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}



                </div>
            </div>
        </div>
    );
};

export default Cuenta;
