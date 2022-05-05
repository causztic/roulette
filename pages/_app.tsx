import '../styles/globals.css';
import ForkMeImage from '../public/forkme.webp';
import type { AppProps } from 'next/app';
import Image from 'next/image';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <a href="https://github.com/causztic/roulette" className="absolute right-0" target="_blank" rel="noopener noreferrer">
        <Image width={149} height={149} src={ForkMeImage} alt="Fork me on GitHub" />
      </a>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
