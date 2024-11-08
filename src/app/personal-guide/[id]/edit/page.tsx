import { Container, Title } from '@mantine/core';

export default function EditGuidePage({ params }: { params: { id: string } }) {
  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl">编辑攻略</Title>
      {/* Rich text editor will go here */}
    </Container>
  );
}
