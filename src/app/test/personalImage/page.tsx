'use client';

import { useState, useEffect } from 'react';
import {
  Container, Title, SimpleGrid, Button, Group, Card, Image, Text,
} from '@mantine/core';
import Link from 'next/link';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '#/amplify/data/resource';
import { useAuth } from '@/app/contexts/AuthContext';

const client = generateClient<Schema>();

export default function PersonalImagePage() {
  const [images, setImages] = useState<any[]>([]);
  const { user } = useAuth();

  const fetchImages = async () => {
    try {
      const { data } = await client.models.PersonalImage
        .listPersonalImageByActiveAndCreatedAt(//! it is a good example
          {
            active: 'T',
          },
          {
            sortDirection: 'DESC',
            filter: {
              owner: { beginsWith: user?.username },
            },
            authMode: 'userPool',
            limit: 100,
          },
        );
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      setImages([]);
    }
  };

  useEffect(() => {
    if (user) {
      fetchImages();
    }
  }, [user]);

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={2}>个人图库</Title>
        <Button component={Link} href="/test/upload">
          上传图片
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="lg">
        {images?.map((image) => (
          <Card key={image.id} p="md" radius="md" withBorder>
            <Card.Section>
              <Image
                src={image.imageUrl}
                alt={image.title || 'Uploaded image'}
                height={160}
                fit="cover"
              />
            </Card.Section>
            <Text size="sm" mt="md" lineClamp={2}>
              {image.title || '未命名'}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              {new Date(image.createdAt).toLocaleDateString('zh-CN')}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}
