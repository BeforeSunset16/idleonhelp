import {
  Card, Text, Group, Button,
} from '@mantine/core';
import Link from 'next/link';

interface GuideCardProps {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

export default function GuideCard({
  id, title, content, author, createdAt,
}: GuideCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{title}</Text>
      </Group>

      <Text size="sm" c="dimmed" lineClamp={3}>
        {content}
      </Text>

      <Group mt="md" justify="space-between">
        <Group>
          <Text size="sm">作者: {author}</Text>
          <Text size="sm" c="dimmed">
            {new Date(createdAt).toLocaleDateString()}
          </Text>
        </Group>
        <Group>
          <Button component={Link} href={`/personal-guide/${id}`} variant="light">
            查看
          </Button>
          <Button component={Link} href={`/personal-guide/${id}/edit`} variant="outline">
            编辑
          </Button>
        </Group>
      </Group>
    </Card>
  );
}
