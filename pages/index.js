import Meta from '@/Layouts/Meta';
import Auth from '../components/Auth/Auth';

const HomePage = () => {
  return (
    <div className='px-[15px] max-w-m'>
      <Meta />
      <div className='flex justify-center items-center'> 
             <Auth />
      </div>

    </div>
  );
};

export default HomePage;
