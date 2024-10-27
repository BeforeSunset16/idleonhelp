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
  Transition,
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
  '攻略',
  '世界1',
  '世界2',
  '世界3',
  '世界4',
  '世界5',
  '世界6',
  '世界7',
];

export default function HeaderTabs() {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab} key={tab}>
      {tab}
    </Tabs.Tab>
  ));

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="xl">
        <Group justify="space-between">
          <Link href="/">
            <Image
              className={classes.logo}
              src="/images/logo.png"
              alt="Logo"
              width={214.4}
              height={42}
              priority
            />
          </Link>
          <Group className={classes.mobileHeaderGroup}>
            <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
            <Image
              className={classes.mobileLogo}
              src="/images/logo.png"
              alt="Logo"
              width={132.7} // 调整小屏幕下的 logo 大小
              height={26}
              priority
            />
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
                  <Text fw={500} size="sm" lh={1} mr={3}>
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
        <Transition mounted={opened} transition="slide-right" duration={300} timingFunction="ease">
          {(styles) => (
            <nav
              className={classes.mobileMenu}
              style={{
                ...styles,
                left: opened ? '0' : '-280px', // 根据 opened 状态切换 left 值
              }}
            >
              <ul>
                {tabs.map((tab) => (
                  <li key={tab} className={classes.mobileMenuItem}>
                    <a href=" ">{tab}</a>
                    {/* <a href={`/${tab.toLowerCase()}`}>{tab}</a> 菜单有页面后启用 */}
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </Transition>

        {/* <Transition mounted={opened} transition="slide-right"
        duration={300} timingFunction="ease">
          {(styles) => (
            <nav className={classes.mobileMenu}
            style={{ ...styles, left: opened ? '0' : '-280px' }}>
              <ul>
                {tabs.map((tab) => (
                  <li key={tab} className={classes.mobileMenuItem}>
                    <a href=" ">{tab}</a>
                    <a href={`/${tab.toLowerCase()}`}>{tab}</a> 菜单有页面后启用
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </Transition> */}

      </Container>
      <Container size="xl">
        <Tabs
          defaultValue="攻略"
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
