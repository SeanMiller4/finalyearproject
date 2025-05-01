import { AuthorisationProvider } from '../src/contexts/AuthorisationContext';
import '../styles/globals.css';

function WholesaleWizard({ Component, pageProps }) {
  return (
	<AuthorisationProvider>
	<Component {...pageProps} />
    </AuthorisationProvider>
  )
}

export default WholesaleWizard;