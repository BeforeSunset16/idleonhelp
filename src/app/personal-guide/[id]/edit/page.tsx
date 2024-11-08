'use client';

import { useEffect, useState } from 'react';
import {
  Container, Title, TextInput, Button, Stack, Paper,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import type { Schema } from '#/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import { useRouter } from 'next/navigation';

const client = generateClient<Schema>();

export default function EditGuidePage({ params }: { params: { id: string } }) {
  const form = useForm({
    initialValues: {
      title: '',
      content: '',
      draft_content: '',
      category: '',
    },
  });

  const router = useRouter();

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const { data } = await client.models.personalGuide.get({ id: params.id });
        if (!data) return;
        form.setValues({
          title: data.title ?? '',
          content: data.content ?? '',
          draft_content: data.draft_content ?? '',
          category: data.category ?? '',
        });
      } catch (error) {
        console.error('Error fetching guide:', error);
      }
    };

    fetchGuide();
  }, [params.id]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await client.models.personalGuide.update({
        id: params.id,
        ...values,
      });
      
      alert('保存成功！');
      router.push(`/personal-guide/${params.id}`);
    } catch (error) {
      console.error('Error updating guide:', error);
      alert('保存失败，请稍后重试');
    }
  };

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

            <Button type="submit">保存</Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
