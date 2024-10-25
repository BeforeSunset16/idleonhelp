// pages/_app.tsx
import { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Component {...pageProps} />
    </MantineProvider>
  );
}
