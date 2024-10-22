import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'; 

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
   
    const pastDate = new Date(1970, 0, 1);

   
    Cookies.set('sid', '', { expires: pastDate });

   
    router.push('/');
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg">Cerrando sesión...</p>
    </div>
  );
};

export default Logout;
