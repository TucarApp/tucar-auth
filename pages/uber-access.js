import { useEffect } from 'react';

export default function UberAccess() {
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');

    console.log('Código recibido de Uber:', code);

    if (code) {
      // Guardar el código en localStorage
      localStorage.setItem('uberCode', code);

      // Cerrar automáticamente la ventana emergente
      window.close();
    } else {
      console.error('No se recibió el código de Uber en los parámetros.');
    }
  }, []);

  return <p>Procesando flujo de Uber...</p>;
}
