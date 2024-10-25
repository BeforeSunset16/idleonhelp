import { Card, Image, Text } from '@mantine/core';
import React from 'react';

function Demo() {
  return (
    <Card
      shadow="sm"
      padding="xl"
      component="a"
      target="_blank"
    >
      <Card.Section>
        <Image
          src="/images/homeshow.png"
          h={160}
          alt="No way!"
        />
      </Card.Section>

      <Text fw={500} size="lg" mt="md">
        这是未来的Idleon中文社区
      </Text>

      <Text mt="xs" c="dimmed" size="sm">
        游戏辅助提醒工具，还有玩家攻略，游戏彩蛋，敬请期待
      </Text>
    </Card>
  );
}