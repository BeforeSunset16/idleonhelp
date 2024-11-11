'use client';

import { useState, useEffect } from 'react';
import {
  Container, Title, SimpleGrid, Group,
} from '@mantine/core';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '#/amplify/data/resource';
import GuideCard from '@/app/components/GuideCard/GuideCard';

const client = generateClient<Schema>();

export default function GameGuidePage() {
  const [guides, setGuides] = useState<any[]>([]);

  const fetchGuides = async () => {
    try {
      const { data } = await client.models.GameGuide.listGameGuideByActiveAndCreatedAt(
        {
          active: 'T',
        },
        {
          authMode: 'apiKey',
          limit: 100,
          sortDirection: 'DESC',
        },
      );
      setGuides(data);
    } catch (error) {
      console.error('Error fetching guides:', error);
      setGuides([]);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={2}>游戏攻略</Title>
        {/* <Button component={Link} href="/game-guide/create">
          创建攻略
        </Button> */}
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {guides?.map((guide) => (
          <GuideCard key={guide.id} {...guide} />
        ))}
      </SimpleGrid>
    </Container>
  );
}
