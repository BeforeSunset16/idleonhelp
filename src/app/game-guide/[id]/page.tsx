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
        const { data } = await client.models.GameGuide.get({
          id: params.id,
        }, {
          authMode: 'apiKey',
        });

        // 手动筛选 active 属性为 'T' 的 guide
        if (data && data.active === 'T') {
          setGuide(data);
        } else {
          setGuide(null); // 或者处理未找到符合条件的 guide 的情况
        }
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
