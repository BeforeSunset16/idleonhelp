'use client';

import {
  Container, Title, TextInput, Button, Stack, Paper,
  Textarea, Image,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import type { Schema } from '#/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import CustomRichTextEditor from '@/app/components/RichTextEditor/RichTextEditor';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploadModal from '@/app/components/ImageUploadModal/ImageUploadModal';

export default function CreateGuidePage() {
  const client = generateClient<Schema>();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [modalOpened, setModalOpened] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      author: '',
      active: 'T',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const result = await client.models.GameGuide.create({
        ...values,
        active: 'T',
        content,
        coverImageUrl,
      });

      alert('保存成功！');
      router.push(`/game-guide/${result.data?.id}`);
    } catch (error) {
      console.error('Error creating guide:', error);
      alert('创建失败，请稍后重试');
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    setCoverImageUrl(imageUrl);
  };

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl">创建新攻略</Title>

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
              选择封面图片
            </Button>

            {coverImageUrl && (
              <Image
                src={coverImageUrl}
                alt="Cover preview"
                radius="md"
                height={200}
                fit="cover"
              />
            )}

            <Textarea
              label="简介"
              placeholder="输入攻略简介"
              minRows={3}
              maxRows={5}
              {...form.getInputProps('description')}
            />

            <TextInput
              label="作者"
              placeholder="输入作者名称"
              {...form.getInputProps('author')}
            />

            <CustomRichTextEditor
              content={content}
              onChange={setContent}
              editable
              variant="edit"
            />

            <Button type="submit">创建</Button>
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
