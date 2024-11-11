'use client';

import {
  Container, Title, Paper, Stack, Button, Group,
} from '@mantine/core';
import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';

export default function UserDashboardPage() {
  const { user } = useAuth();

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl">个人中心</Title>
      <Paper p="md" withBorder>
        <Stack>
          <Title order={3}>欢迎, {user?.signInDetails?.loginId}</Title>
          <Group>
            <Button
              component={Link}
              href="/dashboard/my-game-guide"
              variant="light"
            >
              我的攻略
            </Button>
            <Button
              component={Link}
              href="/dashboard/my-game-guide/create"
              variant="filled"
            >
              创建新攻略
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}
