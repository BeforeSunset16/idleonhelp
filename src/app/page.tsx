'use client';

import { SetStateAction, useState } from 'react';
import {
  SimpleGrid, Card, Image, Text, Container, AspectRatio,
  Modal,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import classes from './page.module.css';

const mockdata = [
  {
    title: '炼金锅：所有气泡所需要的材料',
    image:
      '/images/bubble_material.png',
    date: '2024年10月27日',
  },
  {
    title: '一图看懂：不同阶段的盐级分配',
    image:
      '/images/refinery_rank.jpg',
    date: '2024年10月27日',
  },
  {
    title: '齿轮布局终极目标',
    image:
      '/images/cog_goal.jpg',
    date: '2024年10月27日',
  },
  {
    title: '宠物香料元设置：提升烹饪速度/炼金气泡',
    image:
      '/images/spice_setup.png',
    date: '2024年10月27日',
  },
  {
    title: '一图看懂：所有闪光宠物加成',
    image:
      '/images/shiny_pet.png',
    date: '2024年10月27日',
  },
  {
    title: '一图看懂：Merit Shop买什么（世界4）',
    image:
      '/images/merit_guide_w4.png',
    date: '2024年10月27日',
  },
];

export default function ImageGallery() {
  const [opened, setOpened] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

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
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
          {cards}
        </SimpleGrid>
      </Container>

      {/* 模态框：显示选中的图片 */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size={isSmallScreen ? '100%' : '95%'}
        // fullScreen={isSmallScreen}  小屏幕全屏
        centered // 将 Modal 内容居中显示
        withCloseButton={!isSmallScreen} // 小屏幕时隐藏关闭按钮
        padding={isSmallScreen ? 0 : 'xs'} // 去除 Modal 内边距
        radius={isSmallScreen ? 0 : 'md'} // 小屏幕时去除圆角
        overlayProps={{
          opacity: isSmallScreen ? 0 : 0.5, // 小屏幕去除遮罩
        }}
      >

        <Image src={selectedImage} alt="Enlarged view" className={classes.image} />

      </Modal>
    </>
  );
}
