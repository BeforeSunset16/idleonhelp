'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Button,
  Title,
  Paper,
  Text,
  LoadingOverlay,
  Center,
} from '@mantine/core';
import { generateClient } from 'aws-amplify/data';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { Schema } from '#/amplify/data/resource';

const client = generateClient<Schema>();

export default function TodoList() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [todos, setTodos] = useState<any[]>([]);

  const fetchTodos = async () => {
    try {
      const { data } = await client.models.Todo.list(
        {
          authMode: 'apiKey',
        },
      );
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const createTodo = async () => {
    const content = window.prompt('Todo content?');
    if (!content) return;

    setIsLoading(true);
    try {
      await client.models.Todo.create({
        content,
      });
      await fetchTodos();
    } catch (error) {
      console.error('Error creating todo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="sm" pt="xl">
      <LoadingOverlay visible={isLoading} />
      <Title order={2} mb="xl">Todos</Title>

      {user && (
        <Button
          onClick={createTodo}
          mb="xl"
          variant="gradient"
          gradient={{ from: 'pink', to: 'yellow' }}
        >
          Add new todo
        </Button>
      )}

      {!user && (
        <Paper p="md" mb="xl" withBorder>
          <Text ta="center" mb="md">Login to create and manage todos</Text>
          <Center>
            <Button
              onClick={() => router.push('/auth')}
              variant="gradient"
              gradient={{ from: 'pink', to: 'yellow' }}
            >
              Login
            </Button>
          </Center>
        </Paper>
      )}

      {todos.map((todo) => (
        <Paper
          key={todo.id}
          p="md"
          mb="sm"
          withBorder
        >
          <Text>{todo.content}</Text>
        </Paper>
      ))}
    </Container>
  );
}
