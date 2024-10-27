'use client';

import { Card, Image, Text } from '@mantine/core';
import React from 'react';

export default function Home() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', height: '90vh',
    }}
    >
      <Card
        shadow="sm"
        padding="xl"
        component="a"
        target="_blank"
        w={500}
      >
        <Card.Section>
          <Image
            src="/images/home-show.png"
            height={240}
            alt="Screenshot"
          />
        </Card.Section>

        <Text fw={600} size="xl" mt="md" style={{ letterSpacing: '0.1em' }}>
          这是未来的Idleon中文社区
        </Text>

        <Text mt="xs" c="cyan" size="sm">
          游戏辅助提醒工具，还有玩家攻略，游戏彩蛋，敬请期待
        </Text>
      </Card>
    </div>
  );
}
