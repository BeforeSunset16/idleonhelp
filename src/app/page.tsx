"use client";
import React from 'react';
import { Card } from "antd";

const { Meta } = Card;

const App: React.FC = () => (
  <div style={{
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' // 设置为全屏高度，保证垂直居中
  }}>
    <Card
      hoverable
      style={{ width: 240 }}
      cover={<img alt="example" src="/images/home-show.png" />}
    >
      <Meta title="这是未来的Idleon中文社区" description="会有游戏的辅助提醒工具，还可以搜索玩家攻略，敬请期待" />
    </Card>
  </div>
);

export default App;
