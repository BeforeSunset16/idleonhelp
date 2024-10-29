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
  CopyButton, Button, Title, TextInput, Container, Text,
  Table,
} from "@mantine/core";
import React, { useState } from "react";
import { useMediaQuery } from '@mantine/hooks';
import classes from './idleskiller.module.css';

const rewardsData = [
  { reward: "300 Gems", value: "$1.50" },
  { reward: "2x Eternal Card Pack", value: "1200 Gems ($11.00)" },
  {
    reward: `Funny Hat (Normal Helmet)<br />
  - Weapon Power +3<br />
  - STR, AGI, WIS, LUK +5<br />
  - Defence +10<br />
  - Skill Efficiency +6%<br />
  - Upgrade Slots: 5`,
    value: "",
  },
  { reward: "1x Quality Obol Stack, 1x Marvelous Obol Stack", value: "800 Gems ($4.00)" },
  { reward: "5x Cosmic Time Candy, 25x Black Pearl (20% skill XP on skill under level 30)", value: "1,625 Gems ($8.12)" },
  { reward: "550 Gems", value: "$2.75" },
  { reward: "30x Dungeon Loot Dice", value: "3,375 Gems ($16.87)" },
  { reward: "700 Gems", value: "$3.50" },
  { reward: "750 Arcade Balls", value: "1,875 Gems ($9.37)" },
  {
    reward: `Idle Skiller Trophy (Level requirement: 99)<br />
  - Weapon Power +3<br />
  - STR, AGI, WIS, LUK +20<br />
  - Skill Efficiency +15%`,
    value: "",
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
  const rows = results.map((result, index) => (
    <tr key={index}>
      <td>{result}</td>
      <td dangerouslySetInnerHTML={{ __html: rewardsData[index].reward }} />
      <td>{rewardsData[index].value || "N/A"}</td>
    </tr>
  ));

  return (
    <Container className={classes.content} pb="xl" size="full" pt={isSmallScreen ? '2rem' : '7.4rem'}>
      <div className={classes.root}>
        <Container size="lg">
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
                </Text>{' '}
                现在可领
              </Title>

              <Text className={classes.description} mt={30}>
                只需要输入游戏用户名，然后点击“获得领取码”
              </Text>
              <TextInput
                size="lg"
                placeholder="第一个角色的名称, 注意大小写."
                value={playerName}
                onChange={(event) => setPlayerName(event.currentTarget.value)}
              />
              <Button
                onClick={handleButtonClick}
                variant="gradient"
                gradient={{ from: 'pink', to: 'yellow', deg: 90 }}
                size="xl"
                className={classes.control}
                mt={38}
              >
                获得领取码
              </Button>
              {/* 复制结果按钮 */}
              {/* <div style={{ marginTop: '1.2em' }}> */}
              <CopyButton value={results.join(', ')}>
                {({ copied, copy }) => (
                  <Button
                    onClick={copy}
                    variant="outline"
                    size="xl"
                    mt={38}
                    ml={30}
                    color={copied ? '#FF9D3D' : '#f9728c'}
                    className={classes.control}
                  >
                    {copied ? '已复制' : '复制领取码'}
                  </Button>
                )}
              </CopyButton>
              {/* </div> */}
            </div>
            <div>
              <Title order={2}>Results:</Title>
              <Table striped highlightOnHover>
                <thead>
                  <tr>
                    <th>Random Number</th>
                    <th>Reward</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </Table>
            </div>
          </div>
        </Container>
      </div>
    </Container>
  );
}

export default Idleskiller;
