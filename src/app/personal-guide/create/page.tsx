'use client';

import {
  Container, Title, TextInput, Button, Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import type { Schema } from '#/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

export default function CreateGuidePage() {
  const client = generateClient<Schema>();

  const form = useForm({
    initialValues: {
      title: '',
      content: '',
      draft_content: '',
      category: '',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await client.models.personalGuide.create({
        ...values,
      });
      // Clear form after successful creation
      form.reset();
    } catch (error) {
      console.error('Error creating guide:', error);
    }
  };

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl">创建新攻略</Title>

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

          <TextInput
            label="内容"
            placeholder="输入攻略内容"
            required
            {...form.getInputProps('content')}
          />

          <TextInput
            label="草稿内容"
            placeholder="输入草稿内容"
            {...form.getInputProps('draft_content')}
          />

          <Button type="submit">创建</Button>
        </Stack>
      </form>
    </Container>
  );
}
