// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HeaderTabs from './components/header';

export const metadata: Metadata = {
  title: 'Idleon Help',
  description: 'My favorite idleon community!',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <HeaderTabs />
          {children}
          <GoogleAnalytics gaId="G-4510PJS4HL" />
        </MantineProvider>
      </body>
    </html>
  );
}
