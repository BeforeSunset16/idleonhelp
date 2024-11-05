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
  Loader,
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
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [todos, setTodos] = useState<any[]>([]);

  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated
    if (user === null) {
      router.push('/auth');
    } else if (user) {
      setIsAuthChecking(false);
    }
  }, [user, router]);

  const fetchTodos = async () => {
    try {
      const { data } = await client.models.Todo.list();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };
  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);
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

  // Show loading state while checking authentication
  if (isAuthChecking) {
    return (
      <Container size="sm" pt="xl">
        <Center style={{ height: '60vh' }}>
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  // Don't render anything if not authenticated
  if (!user) {
    return null;
  }

  return (
    <Container size="sm" pt="xl">
      <LoadingOverlay visible={isLoading} />
      <Title order={2} mb="xl">My Todos</Title>

      <Button
        onClick={createTodo}
        mb="xl"
        variant="gradient"
        gradient={{ from: 'pink', to: 'yellow' }}
      >
        Add new todo
      </Button>

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
