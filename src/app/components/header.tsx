/* eslint-disable max-len */

'use client';

import '@/i18n';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/contexts/AuthContext';
import { signOut } from 'aws-amplify/auth';
import {
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Tabs,
  Burger,
  rem,
  useMantineTheme,
  Drawer,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconLogout,
  IconUserCircle,
  IconChevronDown,
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import classes from './header.module.css';

const tabs = [
  { name: 'nav.game_guide', key: 'index', link: '/game-guide' },
  { name: 'nav.grimoire', key: 'grimoire', link: '/grimoire' },
  { name: 'nav.weekly_boss', key: 'realtime-info', link: '/realtime-info' },
  { name: 'nav.tutorial', key: 'tutorial', link: '/tutorial' },
  { name: 'nav.quick_view', key: 'one-picture', link: '/one-picture' },
  { name: 'nav.idleskiller', key: 'idleskiller', link: '/idleskiller' },
  { name: 'nav.login', key: 'auth', link: '/auth' },
];

export default function HeaderTabs() {
  const { t, i18n } = useTranslation();
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { user, refreshUser } = useAuth();
  const pathname = usePathname(); // ✅ Next.js 路径钩子
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // 高亮当前 tab
  useEffect(() => {
    const matchedTab = tabs.find((tab) => tab.link === pathname);
    setActiveTab(matchedTab?.key || 'index');
  }, [pathname]);

  const items = tabs.map((tab) => (
    <Link href={tab.link} key={tab.key}>
      <Tabs.Tab value={tab.key}>{t(tab.name)}</Tabs.Tab> {/* 翻译 Tab 文本 */}
    </Link>
  ));

  const userinfo = {
    name: user ? t('nav.status_on') : t('nav.status_off'), // 翻译登录状态
    email: 'janspoon@fighter.dev',
    image: './images/Green_Mushroom.png',
  };

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="xl">
        <Group justify="space-between">
          {/* Logo & Burger */}
          <Link href="/" className={classes.logo}>
            <Image src="/images/logo.png" alt="Logo" width={214} height={42} />
          </Link>

          <UnstyledButton
            onClick={() => i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')}
            style={{
              fontSize: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '2px 8px',
              fontWeight: 600,
            }}
          >
            {i18n.language.startsWith('zh') ? 'English' : '中文'}
          </UnstyledButton>

          <Group className={classes.mobileHeaderGroup} hiddenFrom="sm">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="md" />
          </Group>

          {/* 用户菜单 */}
          <Menu
            width={180}
            position="bottom-end"
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
          >
            <Menu.Target>
              <UnstyledButton className={classes.user}>
                <Group gap={7}>
                  <Avatar src={userinfo.image} radius="xl" size={25} />
                  <Text fw={500} size="lg" lh={1} mr={3}>{userinfo.name}</Text>
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
        </Group>

        {/* 移动端菜单 */}
        <Drawer opened={opened} onClose={toggle} size="280px" position="left">
          <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {tabs.map((tab) => (
                <li key={tab.key} className={classes.mobileMenuItem}>
                  <Link href={tab.link} onClick={toggle} style={{ color: '#222' }}>
                    {tab.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Drawer>
      </Container>

      {/* Tabs 显示区域 */}
      <Container size="xl">
        {activeTab && (
        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          variant="outline"
          visibleFrom="sm"
          classNames={{
            root: classes.tabs,
            list: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>{items}</Tabs.List>
        </Tabs>
        )}
      </Container>
    </div>
  );
}
