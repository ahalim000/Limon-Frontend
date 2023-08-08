import '@/styles/globals.css'
import '@/styles/fullcalendar.css';
import dynamic from 'next/dynamic'

export function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});