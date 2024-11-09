/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable yoda */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-bitwise */
/* eslint-disable no-confusing-arrow */

'use client';

import {
  CopyButton, Button, Title, TextInput, Container, Text, Paper,
  Table,
  CloseButton,
} from "@mantine/core";
import React, { useState } from "react";
import { useMediaQuery } from '@mantine/hooks';
import classes from './idleskiller.module.css';

const rewardsData = [
  { key: "1", reward: "300 Gems", days: "0" },
  { key: "2", reward: "2x Eternal Card Pack", days: "1" },
  {
    key: "3",
    reward: `Funny Hat (Normal Helmet)
   -  Weapon Power +3
   -  STR, AGI, WIS, LUK +5
   -  Defence +10
   -  Skill Efficiency +6% 
   -  Upgrade Slots: 5`,
    days: "1",
  },
  { key: "4", reward: "1x Quality Obol Stack, 1x Marvelous Obol Stack", vdays: "2" },
  { key: "5", reward: "5x Cosmic Time Candy\n25x Black Pearl (20% skill XP on skill under level 30)", days: "3" },
  { key: "6", reward: "550 Gems", days: "4" },
  { key: "7", reward: "30x Dungeon Loot Dice", days: "5" },
  { key: "8", reward: "700 Gems", days: "6" },
  { key: "9", reward: "750 Arcade Balls", days: "7" },
  {
    key: "10",
    reward: `Idle Skiller Trophy (Level requirement: 99)
   -  Weapon Power +3
   -  STR, AGI, WIS, LUK +20
   -  Skill Efficiency +15%`,
    days: "14",
  },
];

function Idleskiller(): JSX.Element {
  const [playerName, setPlayerName] = useState("");
  const [results, setResults] = useState<number[]>([]);

  const mul1 = (a: number, b: number): number =>
    null != Math.imul ? Math.imul(a, b) : (a * (b & 65535) + (((a * (b >>> 16)) << 16) | 0)) | 0;

  class Rand {
    seed: number | null = null;

    seed2: number | null = null;

    constructor(a: number) {
      this.init(a);
    }

    static hash(a: number, b = 5381) {
      a = mul1(a, -862048943);
      a = mul1((a << 15) | (a >>> 17), 461845907);
      b ^= a;
      b = (mul1((b << 13) | (b >>> 19), 5) - 430675100) | 0;
      b = mul1(b ^ (b >> 16), -2048144789);
      b = mul1(b ^ (b >> 13), -1028477387);
      return b ^ (b >> 16);
    }

    init(a: number) {
      this.seed = a || 1;
      this.seed2 = Rand.hash(a) || 1;
    }

    rand() {
      if (this.seed === null || this.seed2 === null) return 0;
      this.seed = 36969 * (this.seed & 65535) + (this.seed >> 16);
      this.seed2 = 18000 * (this.seed2 & 65535) + (this.seed2 >> 16);
      return ((((((this.seed << 16) + this.seed2) | 0) & 1073741823) % 10007) / 10007);
    }
  }

  const number2Letter = [
    "_", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  ];

  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const isMidScreen = useMediaQuery('(max-width: 1370px)');

  const handleButtonClick = () => {
    let IdleSkillDN = 0;
    for (let sa = 0; sa < playerName.length; sa++) {
      if (0.9 < number2Letter.indexOf(playerName.charAt(sa))) {
        IdleSkillDN += 5 + 3 * Math.max(0, number2Letter.indexOf(playerName.charAt(sa)) - 1);
      }
    }

    const newResults: number[] = [];
    for (let P = 0; P < 10; P++) {
      const r = new Rand(Math.round(IdleSkillDN + 150 * P));
      newResults.push(Math.floor(1e6 * r.rand()));
    }

    setResults(newResults);
  };

  const rows = rewardsData.map((element, index) => (
    <Table.Tr key={element.key}>
      <Table.Td className={classes.code}>{results[index] !== undefined ? results[index] : ' '}</Table.Td>
      <Table.Td className={classes.lineBreak}>{element.reward}</Table.Td>
      <Table.Td className={classes.table}>{element.days}</Table.Td>
    </Table.Tr>
  ));

  const textContent = `总价值57美元+各种属性加成的大礼包，只需要输入游戏用户名，点击“获得兑换码”，然后点击“复制兑换码”，自行保存。\n
  兑换方式：进入游戏，在第一世界城镇的二楼，商店招牌左侧空地，按一下回车，屏幕底部出现对话框，输入兑换码（每次一个），再按回车发送即可。兑换码需按顺序兑换，每次兑换后，需等待一段时间才能兑换下一个，等待天数见右侧表格。`;

  return (
    <Container className={classes.content} pb="xl" size="full" pt={0}>
      <div className={classes.root}>
        <Container size="xl">
          <div className={classes.inner}>
            <div className={classes.content}>
              <Title className={classes.title}>
                Idle Skiller{' '}
                <Text
                  component="span"
                  inherit
                  variant="gradient"
                  gradient={{ from: 'pink', to: 'yellow' }}
                >
                  大礼包和奖杯
                </Text><br className={classes.show_on_large} />
                {' '}现在可领
              </Title>

              <Text className={classes.description} mt={30}>
                {textContent}
              </Text>
              <TextInput
                size="md"
                className={classes.input}
                placeholder="输入第一个idleon角色的名字, 注意大小写"
                value={playerName}
                onChange={(event) => setPlayerName(event.currentTarget.value)}
                radius={isSmallScreen ? "xl" : "sm"}
                rightSectionPointerEvents="all"
                rightSection={(
                  <CloseButton
                    aria-label="Clear input"
                    onClick={() => setPlayerName('')}
                    style={{ display: playerName ? undefined : 'none' }}
                  />
                )}
              />
              <Button
                onClick={handleButtonClick}
                variant="gradient"
                gradient={{ from: 'pink', to: 'yellow', deg: 90 }}
                size={isSmallScreen ? 'lg' : 'xl'}
                className={classes.control}
                mt={isSmallScreen ? 15 : 38}
                radius={isSmallScreen ? "xl" : "sm"}
              >
                获得兑换码
              </Button>
              {/* 复制结果按钮 */}
              {/* <div style={{ marginTop: '1.2em' }}> */}
              <CopyButton value={results.join(', ')}>
                {({ copied, copy }) => (
                  <Button
                    onClick={copy}
                    variant="outline"
                    size={isSmallScreen ? 'lg' : 'xl'}
                    mt={isSmallScreen ? 15 : 38}
                    radius={isSmallScreen ? "xl" : "sm"}
                    color={copied ? '#FF9D3D' : '#f9728c'}
                    className={classes.control}
                  >
                    {copied ? '已复制' : '复制兑换码'}
                  </Button>
                )}
              </CopyButton>
              {/* </div> */}
            </div>
            <Paper className={classes.paper} p="sm" shadow="sm" radius="lg">
              {isMidScreen ? (
                <Title className={classes.result}>ヽ(ﾟ▽ﾟ)ノ礼包内容</Title>
              ) : (
                <Title className={classes.result}>______________ヽ(ﾟ▽ﾟ)ノ礼包内容________________</Title>
              )}
              <Table highlightOnHover>
                <Table.Thead>
                  <Table.Tr className={classes.field}>
                    <Table.Th>兑换码</Table.Th>
                    <Table.Th>奖励</Table.Th>
                    {isSmallScreen ? (
                      <Table.Th>天数</Table.Th>
                    ) : (
                      <Table.Th>(距离上次)兑换等待天数</Table.Th>
                    )}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Paper>
          </div>
        </Container>
      </div>
    </Container>
  );
}

export default Idleskiller;
