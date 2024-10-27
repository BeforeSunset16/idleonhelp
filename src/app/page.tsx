'use client';

import { SetStateAction, useState } from 'react';
import {
  SimpleGrid, Card, Image, Text, Container, AspectRatio,
  Modal,
} from '@mantine/core';
import classes from './page.module.css';

const mockdata = [
  {
    title: 'Top 10 places to visit in Norway this summer',
    image:
      'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80',
    date: 'August 18, 2022',
  },
  {
    title: 'Best forests to visit in North America',
    image:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80',
    date: 'August 27, 2022',
  },
  {
    title: 'Hawaii beaches review: better than you think',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80',
    date: 'September 9, 2022',
  },
  {
    title: 'Mountains at night: 12 best locations to enjoy the view',
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80',
    date: 'September 12, 2022',
  },
];

export default function ImageGallery() {
  const [opened, setOpened] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleImageClick = (image: SetStateAction<string>) => {
    setSelectedImage(image);
    setOpened(true);
  };

  // 渲染卡片
  const cards = mockdata.map((article) => (
    <Card
      key={article.title}
      p="md"
      radius="md"
      className={classes.card}
      style={{ cursor: 'pointer' }}
      onClick={() => handleImageClick(article.image)}
    >
      <Container style={{ margin: "-16px -32px 0 -32px", overflow: "hidden" }}>
        <AspectRatio ratio={1920 / 1080}>
          <Image src={article.image} alt={article.title} />
        </AspectRatio>
      </Container>
      <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
        {article.date}
      </Text>
      <Text className={classes.title} mt={5}>
        {article.title}
      </Text>
    </Card>
  ));

  return (
    <>
      <Container py="xl" size="xl">
        {/* SimpleGrid 设置最大宽度和居中对齐 */}
        <SimpleGrid cols={3} spacing="xl">
          {cards}
        </SimpleGrid>
      </Container>

      {/* 模态框：显示选中的图片 */}
      <Modal opened={opened} onClose={() => setOpened(false)} size="87%">
        <AspectRatio ratio={16 / 9} style={{ width: '100%' }}>
          <Image src={selectedImage} alt="Enlarged view" className={classes.image} />
        </AspectRatio>
      </Modal>
    </>
  );
}
