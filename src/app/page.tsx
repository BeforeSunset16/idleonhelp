'use client';

import { useState } from 'react';
import {
  SimpleGrid, Card, Image, Text, Container, AspectRatio,
  Button,
  Modal,
} from '@mantine/core';
// import Link from 'next/link';
import { useMediaQuery } from '@mantine/hooks';
import classes from './page.module.css';

const mockdata = [
  {
    title: '雕像哪里获得？都有啥用？',
    image:
      '/images/sculpture.jpg',
    date: '2024年10月27日',
  },
  {
    title: '炼金锅：所有气泡所需要的材料',
    image:
      '/images/bubble_material.png',
    date: '2024年10月27日',
  },
  {
    title: '一图看懂：Merit Shop买什么（世界2）',
    image:
      '/images/meritshop_w2.png',
    date: '2024年10月28日',
  },
  {
    title: '一图看懂：Merit Shop买什么（世界3）',
    image:
      '/images/meritshop_w3.png',
    date: '2024年10月28日',
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
  {
    title: '你的芯片毕业了吗？',
    image:
      '/images/chip.jpg',
    date: '2024年10月28日',
  },
  {
    title: '忍者偷偷',
    image:
      '/images/sneaking.png',
    date: '2024年10月28日',
  },
];

export default function ImageGallery() {
  const [selectedImage, setSelectedImage] = useState('');
  const [modalOpened, setModalOpened] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setModalOpened(true);
  };

  const handleClose = () => {
    setModalOpened(false);
    setSelectedImage(''); // 清除选中的图片
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
        {/* <Link href={article.image}> */}
        <AspectRatio ratio={1920 / 1080}>
          <Image src={article.image} alt={article.title} />
        </AspectRatio>
        {/* </Link> */}
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
      <Container className={classes.content} pb="xl" size="xl" pt={isSmallScreen ? '4rem' : '8.5rem'}>
        {/* SimpleGrid 设置最大宽度和居中对齐 */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
          {cards}
        </SimpleGrid>
      </Container>
      {/* 直接显示全屏图片 */}
      <Modal
        classNames={{ content: 'modal-content' }} // 应用滚动条样式
        opened={modalOpened}
        onClose={handleClose}
        // size={isSmallScreen ? '100%' : '95%'}
        size="100%"
        radius={isSmallScreen ? 0 : 'md'} // 小屏幕时去除圆角
        withCloseButton={false} // 去掉默认关闭按钮
        centered
        padding={0}
        overlayProps={{
          opacity: isSmallScreen ? 0 : 0.3, // 小屏幕去除遮罩
        }}
      >
        {selectedImage && ( // 当 selectedImage 有值时才渲染 Image 元素
        <div className={classes.fullscreen_container}>
          <Image src={selectedImage} alt="Enlarged view" className={classes.image} />
          <Button
            className={classes.closeButton}
            onClick={handleClose}
          >
            ✕
          </Button>
        </div>
        )}
      </Modal>
    </>
  );
}
