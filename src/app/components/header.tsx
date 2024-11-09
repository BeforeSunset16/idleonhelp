'use client';

import cx from 'clsx';
import React, { useState } from 'react';
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
  IconHeart,
  IconStar,
  IconMessage,
  IconSettings,
  IconPlayerPause,
  IconTrash,
  IconSwitchHorizontal,
  IconChevronDown,
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import classes from './header.module.css';

const user = {
  name: 'Username',
  email: 'janspoon@fighter.dev',
  image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
};

const tabs = [
  {
    name: '攻略',
    key: 'index',
    link: '/',
  },
  {
    name: '新手教程',
    key: 'tutorial',
    link: '/tutorial',
  },
  {
    name: '游戏攻略',
    key: 'game-guide',
    link: '/game-guide',
  },
  // {
  //   name: '世界1',
  //   key: 'world1',
  //   link: '/world1',
  // },
  // {
  //   name: '世界2',
  //   key: 'world2',
  //   link: '/world2',
  // },
  // {
  //   name: '世界3',
  //   key: 'world3',
  //   link: '/world3',
  // },
  // {
  //   name: '世界4',
  //   key: 'world4',
  //   link: '/world4',
  // },
  // {
  //   name: '世界5',
  //   key: 'world5',
  //   link: '/world5',
  // },
  // {
  //   name: '世界6',
  //   key: 'world6',
  //   link: '/world6',
  // // },
  // {
  //   name: '世界5 洞穴攻略',
  //   key: 'W5-HOLE-GUIDE',
  //   link: '/w5-hole-guide',
  // },
  // {
  //   name: 'Todos',
  //   key: 'todos',
  //   link: '/todos',
  // },
  {
    name: 'Idle Skiller',
    key: 'idleskiller',
    link: '/idleskiller',
  },
  // {
  //   name: '登录',
  //   key: 'auth',
  //   link: '/auth',
  // },
  // {
  //   name: 'test',
  //   key: 'test',
  //   link: '/test',
  // },
];

export default function HeaderTabs() {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const items = tabs.map((tab) => (
    <Link href={tab.link} key={tab.key}>
      <Tabs.Tab value={tab.key}>
        {tab.name}
      </Tabs.Tab>
    </Link>
  ));

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="xl">
        <Group justify="space-between">
          <Link href="/" className={classes.logo}>
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={214.4}
              height={42}
              priority
            />
          </Link>
          <Group className={classes.mobileHeaderGroup} hiddenFrom="sm">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="md" />
            <Link href="/" className={classes.mobileLogo}>
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={132.7} // 调整小屏幕下的 logo 大小
                height={26}
                priority
              />
            </Link>
          </Group>

          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
              >
                <Group gap={7}>
                  <Avatar src={user.image} alt={user.name} radius="xl" size={20} />
                  <Text fw={500} size="md" lh={1} mr={3}>
                    {user.name}
                  </Text>
                  <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={(
                  <IconHeart
                    style={{ width: rem(16), height: rem(16) }}
                    color={theme.colors.red[6]}
                    stroke={1.5}
                  />
                )}
              >
                Liked posts
              </Menu.Item>
              <Menu.Item
                leftSection={(
                  <IconStar
                    style={{ width: rem(16), height: rem(16) }}
                    color={theme.colors.yellow[6]}
                    stroke={1.5}
                  />
                )}
              >
                Saved posts
              </Menu.Item>
              <Menu.Item
                leftSection={(
                  <IconMessage
                    style={{ width: rem(16), height: rem(16) }}
                    color={theme.colors.blue[6]}
                    stroke={1.5}
                  />
                )}
              >
                Your comments
              </Menu.Item>
              <Menu.Label>Settings</Menu.Label>
              <Menu.Item
                leftSection={
                  <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
              >
                Account settings
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconSwitchHorizontal style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
              >
                Change account
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
              >
                Logout
              </Menu.Item>

              <Menu.Divider />

              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item
                leftSection={
                  <IconPlayerPause style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
              >
                Pause subscription
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
              >
                Delete account
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Drawer
          opened={opened}
          onClose={toggle}
          size="280px"
          position="left"
          classNames={{
            header: classes.drawerHeader,
            content: classes.drawerContent,
            body: classes.drawerBody,
            close: classes.drawerClose,
          }}
        >
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
      <Container size="xl">
        <Tabs
          defaultValue="index"
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
      </Container>
    </div>
  );
}
