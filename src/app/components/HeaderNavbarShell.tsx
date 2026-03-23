'use client';

import '@/i18n'; // 1. 引入 i18n 配置文件
import {
  AppShell, Burger, Group, UnstyledButton, Menu, Avatar, Text, useMantineTheme, rem,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { ReactNode, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import {
  IconLogout, IconUserCircle, IconChevronDown, IconLanguage,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next'; // 2. 引入翻译 Hook
import classes from './MobileNavbar.module.css';

// 3. 将 label 替换为 i18n 的 Key
const navLinks = [
  { label: 'nav.game_guide', href: '/game-guide' },
  { label: 'nav.grimoire', href: '/grimoire' },
  { label: 'nav.weekly_boss', href: '/realtime-info' },
  { label: 'nav.tutorial', href: '/tutorial' },
  { label: 'nav.quick_view', href: '/one-picture' },
  { label: 'nav.idleskiller', href: '/idleskiller' },
];

export default function HeaderNavbarShell({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation(); // 4. 初始化 t 函数 [cite: 2026-03-23]
  const [opened, { toggle }] = useDisclosure(false);
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { user, signOut, refreshUser } = useAuth();
  const theme = useMantineTheme();
  const [, setUserMenuOpened] = useState(false);

  // 5. 定义切换语言的函数
  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('zh') ? 'en' : 'zh';
    i18n.changeLanguage(nextLang);
  };

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
            <Group gap={16} visibleFrom="sm" className={classes.headerNavGroup}>
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
                  {t(link.label)} {/* 6. 翻译导航链接  */}
                </UnstyledButton>
              ))}
            </Group>
          </div>

          {/* 右侧 */}
          <div className={classes.headerRight}>
            <Group gap="xs">
              {/* 7. 新增语言切换按钮 */}
              <UnstyledButton
                onClick={toggleLanguage}
                className={classes.userMenu} // 复用样式保持风格统一
                style={{ padding: '4px 8px', borderRadius: '4px' }}
              >
                <Group gap={4}>
                  <IconLanguage size={18} stroke={1.5} />
                  <Text size="sm" fw={600}>
                    {i18n.language.startsWith('zh') ? 'EN' : '中'}
                  </Text>
                </Group>
              </UnstyledButton>

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
                      <Text fw={500} size="lg" lh={1} mr={3}>
                        {user ? t('nav.status_on') : t('nav.status_off')} {/* 8. 翻译登录状态 */}
                      </Text>
                      <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  {user ? (
                    <>
                      <Menu.Item
                        leftSection={(
                          <IconUserCircle
                            style={{ width: rem(20), height: rem(20) }}
                            color={theme.colors.blue[6]}
                            stroke={1.5}
                          />
                        )}
                        component={Link}
                        href="/dashboard"
                      >
                        {t('nav.user_center')} {/* 9. 翻译个人中心 */}
                      </Menu.Item>
                      <Menu.Item
                        leftSection={(
                          <IconLogout
                            style={{ width: rem(20), height: rem(20) }}
                            color={theme.colors.red[6]}
                            stroke={1.5}
                          />
                        )}
                        onClick={async () => {
                          await signOut();
                          await refreshUser();
                          window.location.href = '/';
                        }}
                      >
                        {t('nav.logout')}
                      </Menu.Item>
                    </>
                  ) : (
                    <Menu.Item component={Link} href="/auth">{t('nav.login')}</Menu.Item>
                  )}
                </Menu.Dropdown>
              </Menu>
            </Group>
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
            {t(link.label)} {/* 11. 翻译移动端导航 [cite: 2026-03-23] */}
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
