import {
  Card, Text, Group, Button, Image, Modal,
} from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import type { Schema } from '#/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

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
  const form = useForm({
    initialValues: {
      active: 'F' as 'T' | 'F',
    },
  });

  const router = useRouter();
  const { user } = useAuth();
  const client = generateClient<Schema>();

  // 检查用户是否有权限编辑
  const canEdit = user?.username === owner;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (values: typeof form.values) => {
    try {
      await client.models.GameGuide.update({
        id,
        ...values,
        content,
      });

      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('删除请求出错:', error);
    }
  };

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
            onClick={() => router.push(`/dashboard/my-game-guide/${id}/edit`)}
            variant="outline"
          >
            编辑
          </Button>
        )}
      </Group>

      <Group justify="space-between" mt="md" mb="xs">
        <Text size="sm" c="dimmed" lineClamp={2} mb="md">
          {description }
        </Text>
        {canEdit && (
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
          >
            删除
          </Button>
        )}
      </Group>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="确认删除"
        centered
      >
        <Text>您确定要删除这篇文章吗？</Text>
        <Group justify="flex-end" mt="md">
          <Button onClick={() => handleDelete(form.values)} color="red">
            确认
          </Button>
          <Button onClick={() => setIsModalOpen(false)}>
            取消
          </Button>
        </Group>
      </Modal>

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
