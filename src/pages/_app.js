import '../../public/styles/globals.css';
import AppProvider from '../components/context/provider';
import Meta from '@/Layouts/Meta';

export default function App({ Component, pageProps }) {
  return <>

    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  </>
}
