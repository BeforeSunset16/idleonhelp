'use client';

import {
  Container, Title, TextInput, Button, Stack, Paper,
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
      category: '',
      // draft_content: '',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const result = await client.models.personalGuide.create({
        ...values,
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

            <TextInput
              label="分类"
              placeholder="输入攻略分类"
              {...form.getInputProps('category')}
            />

            <CustomRichTextEditor
              content={content}
              onChange={setContent}
            />

            {/* <TextInput
              label="草稿内容"
              placeholder="输入草稿内容"
              {...form.getInputProps('draft_content')}
            /> */}

            <Button type="submit">创建</Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
