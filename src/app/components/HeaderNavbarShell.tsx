'use client';

import {
  AppShell, Burger, Group, UnstyledButton, Menu, Avatar, Text, useMantineTheme, rem,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { ReactNode, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { IconLogout, IconUserCircle, IconChevronDown } from '@tabler/icons-react';
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
  const { user, signOut, refreshUser } = useAuth();
  const theme = useMantineTheme();
  const [, setUserMenuOpened] = useState(false);

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
        }}
      >
        <div className={classes.headerShell}>
          {/* 左侧 */}
          <div className={classes.headerLeft}>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="md" />
            <Link href="/">
              <Image src="/images/logo.png" alt="Idleon Logo" width={214} height={42} className={classes.logo} style={{ cursor: 'pointer' }} />
            </Link>
          </div>
          {/* 中间绝对居中 */}
          <div className={classes.headerCenter}>
            <Group gap={0} visibleFrom="sm" className={classes.headerNavGroup}>
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
          </div>
          {/* 右侧 */}
          <div className={classes.headerRight}>
            <Menu
              width={180}
              position="bottom-end"
              withinPortal
              zIndex={3000}
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
            >
              <Menu.Target>
                <UnstyledButton className={classes.userMenu}>
                  <Group gap={7}>
                    <Avatar src="./images/Green_Mushroom.png" radius="xl" size={28} />
                    <Text fw={500} size="lg" lh={1} mr={3}>{user ? '已登录' : '未登录'}</Text>
                    <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                {user ? (
                  <>
                    <Menu.Item
                      leftSection={<IconUserCircle style={{ width: rem(20), height: rem(20) }} color={theme.colors.blue[6]} stroke={1.5} />}
                      component={Link}
                      href="/dashboard"
                    >
                      个人中心
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconLogout style={{ width: rem(20), height: rem(20) }} color={theme.colors.red[6]} stroke={1.5} />}
                      onClick={async () => {
                        await signOut();
                        await refreshUser();
                        window.location.href = '/';
                      }}
                    >
                      退出登录
                    </Menu.Item>
                  </>
                ) : (
                  <Menu.Item component={Link} href="/auth">登录</Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
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
