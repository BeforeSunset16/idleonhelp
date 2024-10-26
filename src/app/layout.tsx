// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
// import React from 'react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import HeaderTabs from './components/header';

export const metadata = {
  title: 'Idleon Help',
  description: 'My favorite idleon community!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
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
        </MantineProvider>
      </body>
    </html>
  );
}
