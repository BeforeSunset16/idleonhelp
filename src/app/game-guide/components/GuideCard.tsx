import {
  Card, Text, Group, Button, Image,
} from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

type GuideCardProps = {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  coverImageUrl: string | null;
  createdAt: Date;
  owner: string;
};

export default function GuideCard({
  id,
  title,
  description,
  content,
  author = '匿名',
  coverImageUrl = null,
  createdAt,
  owner,
}: GuideCardProps) {
  const router = useRouter();
  const { user } = useAuth();

  // 检查用户是否有权限编辑
  const canEdit = user?.username === owner;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      {coverImageUrl && (
        <Card.Section>
          <Image
            src={coverImageUrl}
            height={160}
            alt={title}
            fit="cover"
          />
        </Card.Section>
      )}

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500} size="lg" lineClamp={2}>{title}</Text>
        {canEdit && (
          <Button
            onClick={() => router.push(`/dashboard/game-guide/${id}/edit`)}
            variant="outline"
          >
            编辑
          </Button>
        )}
      </Group>

      <Text size="sm" c="dimmed" lineClamp={2} mb="md">
        {description || content}
      </Text>

      <Group mt="md" justify="space-between">
        <div>
          <Text size="sm" c="dimmed">作者: {author}</Text>
          <Text size="sm" c="dimmed">
            {new Date(createdAt).toLocaleDateString()}
          </Text>
        </div>
        <Button
          component={Link}
          href={`/game-guide/${id}`}
          variant="light"
        >
          查看
        </Button>
      </Group>
    </Card>
  );
}
