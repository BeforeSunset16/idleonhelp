// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import './globals.css';
import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/app/contexts/AuthContext';
import HeaderTabs from './components/header';

const theme = createTheme({
  colors: {
    primary: ['#DFF2EB', '#66BAB7', '#2c8482', '#2c8482', '#2c8482', '#2c8482', '#2c8482', '#2c8482', '#2c8482', '#2c8482'],
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '2.5rem',
  },
  breakpoints: {
    xs: '320px',
    sm: '768px',
    md: '1024px',
    lg: '1440px',
  },
  components: {
    Button: {
      styles: {
        root: {
          transition: 'all var(--transition-speed)',
        },
      },
    },
  },
});

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
      <body suppressHydrationWarning>
        <MantineProvider theme={theme}>
          <AuthProvider>
            <HeaderTabs />
            <main className="main-content">
              {children}
            </main>
          </AuthProvider>
          <GoogleAnalytics gaId="G-4510PJS4HL" />
        </MantineProvider>
      </body>
    </html>
  );
}
