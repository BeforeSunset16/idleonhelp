/* eslint-disable max-len */

'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
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
  {
    name: '游戏攻略',
    key: 'index',
    link: '/game-guide',
  },
  /* {
    name: '主页',
    key: 'home1',
    link: '/home1',
  }, */
  {
    name: '新手教程',
    key: 'tutorial',
    link: '/tutorial',
  },
  {
    name: '快捷查看',
    key: 'one-picture',
    link: '/one-picture',
  },
  {
    name: 'Idle Skiller',
    key: 'idleskiller',
    link: '/idleskiller',
  },
  {
    name: '登录',
    key: 'auth',
    link: '/auth',
  },
];

export default function HeaderTabs() {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [userName, setUserName] = useState<string>('未登录');
  const { user, refreshUser } = useAuth();
  const pathname = usePathname(); // ✅ Next.js 路径钩子
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // 用户名设置
  useEffect(() => {
    setUserName(user?.signInDetails?.loginId || '未登录');
  }, [user]);

  // 高亮当前 tab
  useEffect(() => {
    const matchedTab = tabs.find((tab) => tab.link === pathname);
    setActiveTab(matchedTab?.key || 'index');
  }, [pathname]);

  const items = tabs.map((tab) => (
    <Link href={tab.link} key={tab.key}>
      <Tabs.Tab value={tab.key}>{tab.name}</Tabs.Tab>
    </Link>
  ));

  const userinfo = {
    name: userName,
    email: 'janspoon@fighter.dev',
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
  };

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="xl">
        <Group justify="space-between">
          {/* Logo & Burger */}
          <Link href="/" className={classes.logo}>
            <Image src="/images/logo.png" alt="Logo" width={214} height={42} />
          </Link>

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
                  <Avatar src={userinfo.image} radius="xl" size={22} />
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
            <ul>
              {tabs.map((tab) => (
                <li key={tab.key} className={classes.mobileMenuItem}>
                  <Link href={tab.link} onClick={toggle}>
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
