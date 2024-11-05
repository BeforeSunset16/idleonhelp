'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { Container, Button } from '@mantine/core';
import outputs from '#/amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs);

export default function AuthPage() {
  return (
    <Container size="sm" pt="xl">
      <Authenticator>
        {({ signOut, user }) => (
          <main>
            <h1>Hello {user?.username}</h1>
            <Button onClick={signOut}>Sign out</Button>
          </main>
        )}
      </Authenticator>
    </Container>
  );
}
