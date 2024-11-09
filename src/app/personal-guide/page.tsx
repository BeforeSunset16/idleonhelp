'use client';

import { useState, useEffect } from 'react';
import {
  Container, Title, SimpleGrid, Button, Group,
} from '@mantine/core';
import Link from 'next/link';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '#/amplify/data/resource';
import GuideCard from './components/GuideCard';

const client = generateClient<Schema>();

export default function PersonalGuidePage() {
  const [guides, setGuides] = useState<any[]>([]);

  const fetchGuides = async () => {
    try {
      const { data } = await client.models.PersonalGuide.listPersonalGuideByActiveAndCreatedAt(
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
        <Title order={2}>玩家攻略</Title>
        <Button component={Link} href="/personal-guide/create">
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
