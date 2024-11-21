import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UberBond() {
  const router = useRouter();
  const [redirectUri, setRedirectUri] = useState(null); // Guardar el redirectUri recibido
  const [uberBondId, setUberBondId] = useState(null); // Guardar el uberBondId
  const [uberCode, setUberCode] = useState(null); // Guardar el código recibido de Uber
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Manejo de errores

  useEffect(() => {
    const getBond = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get('token');

        console.log('Token recibido:', token);

        if (!token) {
          setError('Falta el token en los parámetros.');
          console.error('Token no encontrado en los parámetros.');
          return;
        }

        const params = {
          user_id: searchParams.get('user_id'),
          client_id: searchParams.get('client_id'),
          redirect_uri: searchParams.get('redirect_uri'), // Usar el redirectUri que viene en los parámetros
          tenancy: searchParams.get('tenancy'),
        };

        console.log('Parámetros para el GET bond:', params);

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
          console.log('Bond Response:', data);

          // Guardar el uberBondId y el redirectUri para abrir Uber
          setUberBondId(data.uberBondId);
          setRedirectUri(data.redirectUri);
        } else {
          const errorText = await response.text();
          console.error('Error en el endpoint de getBond:', errorText);
          setError('Error al obtener el bond de Uber.');
        }
      } catch (error) {
        console.error('Error durante la solicitud de getBond:', error);
        setError('Error al obtener el bond de Uber.');
      } finally {
        setLoading(false);
      }
    };

    getBond();
  }, []);

  const handleUberClick = () => {
    if (!redirectUri) {
      setError('No se puede iniciar el flujo de Uber.');
      return;
    }

    // Abrir la ventana emergente para Uber con el redirectUri
    const popup = window.open(
      `${redirectUri}&uberBondId=${uberBondId}`,
      'UberAuth',
      'width=500,height=700'
    );

    const interval = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(interval);

        const savedCode = localStorage.getItem('uberCode'); // Recuperar el código desde uber-access
        if (savedCode) {
          setUberCode(savedCode); // Guardar el código en el estado
          console.log('Código recibido de Uber:', savedCode); // Mostrar el código en consola
          completeBond(savedCode); // Completar el flujo con el código recibido
        } else {
          console.error('No se recibió el código de Uber.');
          setError('No se recibió el código de Uber.'); // Manejar el error si el código no está disponible
        }
      }
    }, 500);
  };

  const completeBond = async (code) => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get('token');

      const body = {
        uberBondId,
        code,
      };

      console.log('Enviando al endpoint POST:', body);

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
        console.log('Bond Completion Response:', data);

        if (data.redirectUri) {
          console.log('Redirigiendo a:', data.redirectUri);
          router.push(data.redirectUri); // Redirigir al URI final
        } else {
          setError('No se recibió redirectUri en la respuesta.');
        }
      } else {
        const errorText = await response.text();
        console.error('Error en el endpoint de completeBond:', errorText);
        setError('Error al completar el bond de Uber.');
      }
    } catch (error) {
      console.error('Error durante el bonding final:', error);
      setError('Error al completar el bond de Uber.');
    }
  };

  return (
    <div className='text-black'>
      {loading && <p>Cargando flujo de Uber...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <div>
          <p>Flujo de Uber preparado.</p>
          {uberCode && <p>Código recibido de Uber: {uberCode}</p>}
          <button onClick={handleUberClick}>Continuar con Uber</button>
        </div>
      )}
    </div>
  );
}
