'use client';

import { Authenticator, translations } from '@aws-amplify/ui-react';
import { I18n } from 'aws-amplify/utils';
import { Amplify } from 'aws-amplify';
import { Container, Button, Group } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import outputs from '#/amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';

I18n.putVocabularies(translations);
I18n.setLanguage('zh');
Amplify.configure(outputs);

export default function AuthPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  return (
    <Container size="sm" pt="xl">
      <Authenticator>
        {({ signOut, user }) => (
          <main>
            <h1>Hello, {user?.signInDetails?.loginId}</h1>
            <Group mt="sm">
              <Button onClick={async () => {
                await refreshUser();
                router.push('/dashboard');
              }}
              >
                个人中心
              </Button>
              <Button
                onClick={async () => {
                  signOut?.();
                  await refreshUser();
                  router.push('/auth');
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
