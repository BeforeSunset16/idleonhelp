'use client';

import { useEffect, useState } from 'react';
import { Container, Title, Text, Paper } from '@mantine/core';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '#/amplify/data/resource';

const client = generateClient<Schema>();

export default function GuideDetailPage({ params }: { params: { id: string } }) {
  const [guide, setGuide] = useState<any>(null);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const { data } = await client.models.personalGuide.get({ id: params.id });
        setGuide(data);
      } catch (error) {
        console.error('Error fetching guide:', error);
      }
    };

    fetchGuide();
  }, [params.id]);

  if (!guide) {
    return <div>Loading...</div>;
  }

  return (
    <Container size="lg" py="xl">
      <Paper p="md" withBorder>
        <Title order={2} mb="xl">{guide.title}</Title>
        <Text mb="md">分类: {guide.category || '未分类'}</Text>
        <Text>{guide.content}</Text>
      </Paper>
    </Container>
  );
}
