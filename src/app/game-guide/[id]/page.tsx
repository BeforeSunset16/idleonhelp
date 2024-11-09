'use client';

import { useEffect, useState } from 'react';
import {
  Container, Title, Paper,
} from '@mantine/core';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '#/amplify/data/resource';
import CustomRichTextEditor from '@/app/components/RichTextEditor/RichTextEditor';

const client = generateClient<Schema>();

export default function GuideDetailPage({ params }: { params: { id: string } }) {
  const [guide, setGuide] = useState<any>(null);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const { data } = await client.models.GameGuide.get(
          { id: params.id },
          { authMode: 'apiKey' },
        );
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
      <Paper p="md" withBorder={false} style={{ background: 'transparent' }}>
        <Title order={2} mb="xl">{guide.title}</Title>
        <CustomRichTextEditor
          content={guide.content}
          onChange={() => {}}
          editable={false}
          variant="display"
        />
      </Paper>
    </Container>
  );
}
