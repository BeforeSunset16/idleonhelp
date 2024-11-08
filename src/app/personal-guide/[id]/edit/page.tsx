'use client';

import { useEffect, useState } from 'react';
import {
  Container, Title, TextInput, Button, Stack, Paper, Text, Select,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import type { Schema } from '#/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import { useRouter } from 'next/navigation';
import CustomRichTextEditor from '@/app/components/RichTextEditor/RichTextEditor';

const client = generateClient<Schema>();

export default function EditGuidePage({ params }: { params: { id: string } }) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const form = useForm({
    initialValues: {
      title: '',
      category: '',
      active: 'T',
    },
  });

  const router = useRouter();

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        setIsLoading(true);
        const { data } = await client.models.PersonalGuide.get({ id: params.id });
        if (!data) return;
        form.setValues({
          title: data.title ?? '',
          category: data.category ?? '',
          active: data.active ?? 'T',
        });
        setContent(data.content ?? '');
      } catch (error) {
        console.error('Error fetching guide:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuide();
  }, [params.id]);

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <Paper p="md" withBorder>
          <Text>Loading...</Text>
        </Paper>
      </Container>
    );
  }

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await client.models.PersonalGuide.update({
        id: params.id,
        ...values,
        active: values.active as "T" | "F",
        content,
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

            <Select
              label="状态"
              placeholder="选择攻略状态"
              data={[{ value: 'T', label: '启用' }, { value: 'F', label: '禁用' }]}
              {...form.getInputProps('active')}
            />

            <TextInput
              label="分类"
              placeholder="输入攻略分类"
              {...form.getInputProps('category')}
            />

            <CustomRichTextEditor
              content={content}
              onChange={setContent}
              variant="edit"
              editable
            />

            <Button type="submit">保存</Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
