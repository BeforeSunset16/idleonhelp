'use client';

import {
  AppShell, Burger, Group, UnstyledButton,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classes from './MobileNavbar.module.css';

const navLinks = [
  { label: '游戏攻略', href: '/game-guide' },
  { label: 'Grimoire', href: '/grimoire' },
  { label: '每周BOSS', href: '/realtime-info' },
  { label: '新手教程', href: '/tutorial' },
  { label: '快捷查看', href: '/one-picture' },
  { label: 'Idle Skiller', href: '/idleskiller' },
];

export default function HeaderNavbarShell({ children }: { children: ReactNode }) {
  const [opened, { toggle }] = useDisclosure(false);
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <AppShell
      header={{ height: 'var(--header-height)', offset: false }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header
        style={{
          zIndex: 1000,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: 'var(--header-height)',
          background: 'var(--color-secondary)',
          boxShadow: '0 2px 8px rgb(100, 150, 96)',
          overflow: 'hidden',
        }}
      >
        <Group
          h="100%"
          px="md"
          justify="space-between"
          style={{
            width: '100%',
            background: 'transparent',
            margin: 0,
          }}
        >
          <Group gap="xs">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Link href="/">
              <Image src="/images/logo.png" alt="Idleon Logo" width={214} height={42} style={{ cursor: 'pointer' }} />
            </Link>
          </Group>
          <Group gap={0} visibleFrom="sm">
            {navLinks.map((link) => (
              <UnstyledButton
                key={link.href}
                className={
                  pathname === link.href
                    ? `${classes.control} ${classes.active}`
                    : classes.control
                }
                component={Link}
                href={link.href}
              >
                {link.label}
              </UnstyledButton>
            ))}
          </Group>
          <UnstyledButton className={classes.control}>登录</UnstyledButton>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        py="md"
        px={4}
        style={{
          paddingTop: isMobile ? 'calc(var(--header-height) + 8px)' : 'var(--header-height)',
        }}
      >
        {navLinks.map((link) => (
          <UnstyledButton
            key={link.href}
            className={
              pathname === link.href
                ? `${classes.control} ${classes.active}`
                : classes.control
            }
            component={Link}
            href={link.href}
            onClick={() => {
              if (isMobile && opened) toggle();
            }}
          >
            {link.label}
          </UnstyledButton>
        ))}
      </AppShell.Navbar>
      <AppShell.Main
        style={{ background: 'var(--color-primary)', paddingTop: 'var(--header-height)', minHeight: '100vh' }}
      >
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
