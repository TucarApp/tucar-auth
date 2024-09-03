import { useEffect } from 'react';
import { useRouter } from 'next/router';

const UberAccess = () => {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code && window.opener) {
      window.opener.postMessage({ code }, '*');
      window.close();
    }
  }, []);

  return (
    <div>
      Manejando la redirección de Uber...
    </div>
  );
};

export default UberAccess;
