'use client';

import { useState, useEffect } from 'react';
import {
  Container, Title, SimpleGrid, Button, Group,
} from '@mantine/core';
import Link from 'next/link';
import { generateClient } from 'aws-amplify/data';
import { useAuth } from '@/app/contexts/AuthContext';
import type { Schema } from '#/amplify/data/resource';
import GuideCard from '@/app/game-guide/components/GuideCard';

const client = generateClient<Schema>();

export default function GameGuidePage() {
  const [guides, setGuides] = useState<any[]>([]);
  const { user } = useAuth();

  const fetchGuides = async () => {
    try {
      const { data } = await client.models.GameGuide.listGameGuideByActiveAndCreatedAt(
        {
          active: 'T',
        },
        {
          authMode: 'apiKey',
          limit: 50,
          sortDirection: 'DESC',
          filter: {
            owner: {
              contains: user?.username,
            },
          },
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
        <Title order={2}>我的攻略</Title>
        <Button component={Link} href="/dashboard/game-guide/create">
          创建攻略
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {guides?.map((guide) => (
          <GuideCard key={guide.id} {...guide} />
        ))}
      </SimpleGrid>
    </Container>
  );
}
