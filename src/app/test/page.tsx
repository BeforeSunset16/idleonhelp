'use client';

import {
  Container, Title, SimpleGrid, Card, Text,
} from '@mantine/core';
import Link from 'next/link';

const testRoutes = [
  {
    id: 'upload',
    title: 'Upload Test',
    description: 'Test image upload functionality',
  },
  {
    id: 'rich-text',
    title: 'Rich Text Editor Test',
    description: 'Test rich text editor functionality',
  },
];

export default function TestPage() {
  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl">Test Pages</Title>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {testRoutes.map((test) => (
          <Card
            key={test.id}
            component={Link}
            href={`/test/${test.id}`}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
          >
            <Text fw={500} mb="xs">{test.title}</Text>
            <Text size="sm" c="dimmed">
              {test.description}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}
