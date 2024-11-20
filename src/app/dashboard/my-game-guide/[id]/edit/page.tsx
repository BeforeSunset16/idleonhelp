'use client';

import {
  Container, Title, Paper, Stack, Button, TextInput,
  Textarea, Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '#/amplify/data/resource';
import { useAuth } from '@/app/contexts/AuthContext';
import CustomRichTextEditor from '@/app/components/RichTextEditor/RichTextEditor';
import ImageUploadModal from '@/app/components/ImageUploadModal/ImageUploadModal';

const client = generateClient<Schema>();

export default function EditGuidePage({ params }: { params: { id: string } }) {
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      active: 'T' as 'T' | 'F',
    },
  });

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        setIsLoading(true);
        const { data } = await client.models.GameGuide.get({ id: params.id });
        if (!data) return;

        // 验证作者限
        if (data.owner !== user?.username) {
          alert('您没有权限编辑此攻略');
          router.push('/dashboard/game-guide');
          return;
        }

        form.setValues({
          title: data.title ?? '',
          description: data.description ?? '',
          active: data.active ?? 'T',
        });
        setContent(data.content ?? '');
      } catch (error) {
        console.error('Error fetching guide:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.username) {
      fetchGuide();
    }
  }, [params.id, user]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await client.models.GameGuide.update({
        id: params.id,
        ...values,
        content,
        coverImageUrl,
      });

      alert('保存成功！');
      router.push(`/game-guide/${params.id}`);
    } catch (error) {
      console.error('Error updating guide:', error);
      alert('保存失败，请稍后重试');
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    setCoverImageUrl(imageUrl);
  };

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <Paper p="md" withBorder>
          <Text>Loading...</Text>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl">编辑攻略</Title>

      <Paper p="md" withBorder>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="标题"
              placeholder="输入攻略标题"
              required
              {...form.getInputProps('title')}
            />

            <Button
              variant="outline"
              onClick={() => setModalOpened(true)}
            >
              修改封面图片
            </Button>

            <Textarea
              label="简介"
              placeholder="输入攻略简介"
              minRows={3}
              maxRows={5}
              {...form.getInputProps('description')}
            />

            <CustomRichTextEditor
              content={content}
              onChange={setContent}
              editable
              variant="edit"
            />

            <Button type="submit">保存</Button>
          </Stack>
        </form>
      </Paper>
      <ImageUploadModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onImageUploaded={handleImageUploaded}
      />
    </Container>
  );
}
