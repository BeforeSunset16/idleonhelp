/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable yoda */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-bitwise */
/* eslint-disable no-confusing-arrow */

'use client';

import {
  Button, Title, TextInput, Container,
} from "@mantine/core";
import React, { useState } from "react";
import { useMediaQuery } from '@mantine/hooks';

import classes from './idleskiller.module.css';

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

  return (
    <Container className={classes.content} pb="xl" size="md" pt={isSmallScreen ? '4rem' : '8.5rem'}>
      {/* <Title order={1}>Idleon Skill Eff 奖杯领取码生成器</Title>
      <Title order={1}>输入你的名字</Title>
      <TextInput
        placeholder="请输入IdleOn用户名"
        value={playerName}
        onChange={(event) => setPlayerName(event.currentTarget.value)}
      /> */}
      <TextInput
        size="lg"
        label="Idleon Skill Eff 奖杯领取码"
        description="输入Idleon游戏用户名"
        placeholder="Input placeholder"
        value={playerName}
        onChange={(event) => setPlayerName(event.currentTarget.value)}
      />
      <Button
        onClick={handleButtonClick}
        variant="gradient"
        gradient={{ from: '#32cff1', to: '#f77ba7', deg: 90 }}
      >
        获得领取码
      </Button>
      <div>
        <Title order={2}>结果:</Title>
        <ul>
          {results.map((result, index) => (
            <li key={index}>{result}</li> /* eslint-disable-line react/no-array-index-key */
          ))}
        </ul>

      </div>
    </Container>
  );
}

export default Idleskiller;
