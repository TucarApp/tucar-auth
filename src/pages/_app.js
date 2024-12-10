import '@/styles/globals.css'
import AppProvider from '../components/context/provider';

export default function App({ Component, pageProps }) {
  return <>
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  </>
}
