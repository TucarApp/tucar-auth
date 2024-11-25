import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/LogoTucar/LogoTucar';

export default function UberBond() {
  const router = useRouter();
  const [redirectUri, setRedirectUri] = useState(null);
  const [uberBondId, setUberBondId] = useState(null);
  const [uberCode, setUberCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupOpened, setPopupOpened] = useState(false);

  // Traducciones para errores del GET
  const getErrorMessages = {
    'Token not found': 'Ups ha ocurrido un error.',
    'Invalid token': 'Ups ha ocurrido un error.',
    'Token expired': 'Ups ha ocurrido un error.',
    'User not allowed': 'Tu usuario no tiene permisos para esta acción.',
    "Can't bond another Uber account": 'No puedes vincular otra cuenta de Uber.',
    'Application not allowed': 'Esta aplicación no está autorizada.',
    'Redirect uri not allowed': 'Ups ha ocurrido un error.',
    'Authentication method not allowed': 'Ups ha ocurrido un error.',
  };

  // Traducciones para errores del POST
  const postErrorMessages = {
    'User not found': 'Ups ha ocurrido un error.',
    'Application not found': 'Ups ha ocurrido un error.',
    'Uber bond attempt already used': 'El intento de vinculación de Uber ya fue utilizado.',
    'Expired Uber bond attempt': 'El intento de vinculación de Uber ha expirado.',
    'User already has linked Uber account': 'Tu cuenta ya está vinculada con Uber.',
    'User with this email and phone already exists': 'Ya existe un usuario con este correo y número de teléfono.',
    'User with this email already exists': 'Ya existe un usuario con este correo electrónico.',
    'User with this phone already exists': 'Ya existe un usuario con este número de teléfono.',
    'Invalid email domain': 'El dominio del correo electrónico no es válido.',
    'User does not have Uber partner account' : 'No tienes una cuenta de socio de Uber vinculada. Por favor, asegúrate de que tu cuenta sea de socio.',
    'Invalid grant, please try again': 'Error en la autenticación, por favor intenta nuevamente.',
    'Internal server error': 'Ups ha ocurrido un error.',
  };

  useEffect(() => {
    const getBond = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get('token');

        if (!token) {
          setError('No encontramos el token necesario para continuar.');
          return;
        }

        const params = {
          user_id: searchParams.get('user_id'),
          client_id: searchParams.get('client_id'),
          redirect_uri: searchParams.get('redirect_uri'),
          tenancy: searchParams.get('tenancy'),
        };

        const response = await fetch(
          `https://account-service-twvszsnmba-uc.a.run.app/api/v1/ubers/bond?${new URLSearchParams(params).toString()}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUberBondId(data.uberBondId);
          setRedirectUri(data.redirectUri);
          setTimeout(() => handleUberClick(data.redirectUri, data.uberBondId), 1000);
        } else {
          const errorData = await response.json();
          const errorMessage =
            getErrorMessages[errorData.detail?.errors] || 'Error desconocido al obtener los datos.';
          setError(errorMessage);
        }
      } catch (err) {
        setError('Error de conexión al servidor.');
      } finally {
        setLoading(false);
      }
    };

    getBond();
  }, []);

  const handleUberClick = (uri, bondId) => {
    if (popupOpened || !uri || !bondId) return;

    setPopupOpened(true);
    setLoading(true); // Muestra el loader durante la apertura del popup

    const popup = window.open(
      `${uri}&uberBondId=${bondId}`,
      'UberAuth',
      'width=500,height=700'
    );

    const interval = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(interval);
        setLoading(false); // Oculta el loader cuando el popup se cierra

        const savedCode = localStorage.getItem('uberCode');
        if (savedCode) {
          setUberCode(savedCode);
          completeBond(savedCode, bondId);
        } else {
          setError('No se recibió el código de Uber.');
        }
      }
    }, 500);
  };

  const completeBond = async (code, bondId) => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get('token');

      const body = { uberBondId: bondId, code };

      const response = await fetch(
        'https://account-service-twvszsnmba-uc.a.run.app/api/v1/ubers/bond',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.redirectUri) {
          router.push(data.redirectUri);
        } else {
          setError('No se recibió la redirección final en la respuesta.');
        }
      } else {
        const errorData = await response.json();
        const errorMessage =
          postErrorMessages[errorData.detail?.errors] || 'Error desconocido al completar la acción.';
        setError(errorMessage);
      }
    } catch (err) {
      setError('Error de conexión al servidor.');
    }
  };

  return (
    <div>
      {(loading || popupOpened) && (
        <div className="w-full h-screen flex flex-col justify-center items-center">
          <Logo color="color" className="cursor-pointer mb-5" width={180} />
          <div className="flex flex-col items-center font-Poppins font-light text-black">
            {!error && (
              <div className="flex flex-row gap-2 items-center">
                <p>Vinculando cuenta de Uber</p>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-700 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-700 animate-bounce [animation-delay:-.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-700 animate-bounce [animation-delay:-.4s]"></div>
                </div>
              </div>
            )}
            {error && <p className="text-red-500 mt-1">{error}</p>}
          </div>
        </div>
      )}
      {!loading && error && (
        <div className="w-full h-screen flex justify-center items-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
}
