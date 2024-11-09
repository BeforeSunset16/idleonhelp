'use client';

import { Container, Title, Paper, Stack } from '@mantine/core';
import { useAuth } from '@/app/contexts/AuthContext';

export default function UserDashboardPage() {
  const { user } = useAuth();

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl">个人中心</Title>
      <Paper p="md" withBorder>
        <Stack>
          <Title order={3}>欢迎, {user?.username}</Title>
          {/* 这里可以添加更多的用户相关功能 */}
        </Stack>
      </Paper>
    </Container>
  );
}
