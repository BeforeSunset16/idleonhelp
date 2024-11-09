'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { Container, Button, Group } from '@mantine/core';
import { useRouter } from 'next/navigation';
import outputs from '#/amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs);

export default function AuthPage() {
  const router = useRouter();

  return (
    <Container size="sm" pt="xl">
      <Authenticator>
        {({ signOut, user }) => (
          <main>
            <h1>Hello {user?.username}</h1>
            <Group>
              <Button onClick={() => router.push('/dashboard')}>
                个人中心
              </Button>
              <Button
                onClick={() => {
                  signOut?.();
                  window.location.reload();
                }}
                variant="outline"
                color="red"
              >
                退出登录
              </Button>
            </Group>
          </main>
        )}
      </Authenticator>
    </Container>
  );
}
