'use client';

import {
  Container, Title, TextInput, Button, Stack, Paper,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import type { Schema } from '#/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import CustomRichTextEditor from '@/app/components/RichTextEditor/RichTextEditor';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateGuidePage() {
  const client = generateClient<Schema>();
  const router = useRouter();
  const [content, setContent] = useState('');

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      category: '',
      author: '',
      active: 'T',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const result = await client.models.PersonalGuide.create({
        ...values,
        active: 'T',
        content,
      });

      alert('保存成功！');
      router.push(`/personal-guide/${result.data?.id}`);
    } catch (error) {
      console.error('Error creating guide:', error);
      alert('创建失败，请稍后重试');
    }
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

            <TextInput
              label="分类"
              placeholder="输入攻略分类,没啥用"
              {...form.getInputProps('category')}
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
    </Container>
  );
}
