import 'tailwindcss/tailwind.css'
import '../components/global.css'

import { ToastProvider } from 'react-toast-notifications';

function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider
      autoDismiss
      autoDismissTimeout={2000}
      placement="top-center"
    >
      <Component {...pageProps} />
    </ToastProvider>
  )
}

export default MyApp
