// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import HeaderTabs from './components/header';
import './globals.css';
// eslint-disable-next-line import/no-extraneous-dependencies, import/order
import { GoogleAnalytics } from '@next/third-parties/google';

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
        <GoogleAnalytics gaId="G-4510PJS4HL" /> {/* 添加 Google Analytics */}
      </body>
    </html>
  );
}
