'use client';

import {
  Table,
  Textarea,
  Button,
  Container,
  ScrollArea,
  Group,
  TextInput,
} from '@mantine/core';
import { useState } from 'react';
import grimoireStatic from './grimoire_static.json';

export default function GrimoireCalculator() {
  const [jsonText, setJsonText] = useState('');
  const [output, setOutput] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [femurHr, setFemurHr] = useState('113000000000');
  const [ribHr, setRibHr] = useState('60000000000');
  const [craniumHr, setCraniumHr] = useState('47000000000');
  const [bovinaeHr, setBovinaeHr] = useState('100000000000');

  function handleProcessJson(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOutput(null);

    // 这四个变量可用于后续逻辑
    const femur = femurHr === '' ? 1 : Number(femurHr);
    const rib = ribHr === '' ? 1 : Number(ribHr);
    const cranium = craniumHr === '' ? 1 : Number(craniumHr);
    const bovinae = bovinaeHr === '' ? 1 : Number(bovinaeHr);

    try {
      const grimoireData = JSON.parse(jsonText);

      // 提取Grimoire的52个value
      let grimoireValues: any[] = [];
      const grimoire = grimoireData.data?.Grimoire;
      if (Array.isArray(grimoire)) {
        grimoireValues = grimoire;
      } else if (typeof grimoire === 'object' && grimoire !== null) {
        grimoireValues = Object.values(grimoire);
      }
      // 生成currentLvArr
      const currentLvArr = Array(52).fill('-');
      let currentUnlock = 0;
      for (let i = 0; i < 52; i += 1) {
        if (grimoireValues[i] !== undefined) {
          currentLvArr[i] = grimoireValues[i];
          if (currentLvArr[i] > 0) {
            currentUnlock += 1;
          }
        }
      }

      // 根据当前解锁的grimoire数量，找到下一次unlock需要的Level总数
      let matchedUnlockLevel = null;
      if (Array.isArray(grimoireStatic)) {
        const match = grimoireStatic.find((item) => item.index === currentUnlock);
        if (match) {
          matchedUnlockLevel = match.unlockLevel;
        }
      }
      // 计算下一次解锁还需要多少次upgrade
      const sumLevel = grimoireValues.reduce((acc, v) => acc + Number(v), 0);
      let levelsMissing = (matchedUnlockLevel ?? 0) - sumLevel;
      if (levelsMissing === 0) {
        currentUnlock += 1;
        const match = grimoireStatic.find((item) => item.index === currentUnlock);
        if (match) {
          matchedUnlockLevel = match.unlockLevel;
        }
        levelsMissing = (matchedUnlockLevel ?? 0) - sumLevel;
      }

      const hourMatrix = Array.from({ length: currentUnlock }, () => Array(600).fill('-'));
      for (let i = 0; i < currentUnlock; i += 1) {
        const maxLevel = grimoireStatic.find((item) => item.index === i)?.max_level ?? 0;
        const boneType = grimoireStatic.find((item) => item.index === i)?.boneType ?? 0;
        const hourRates = [femur, rib, cranium, bovinae];
        const hourRate = hourRates[boneType] ?? 0;
        const base = grimoireStatic.find((item) => item.index === i)?.base ?? 0;
        const exponent = grimoireStatic.find((item) => item.index === i)?.exponent ?? 1;
        for (let j = 0; j < 600; j += 1) {
          if (j >= currentLvArr[i] && j < maxLevel) {
            const adjustedExponent = exponent + 0.01;
            const basePlusJ = base + j;
            const powerResult = basePlusJ * (adjustedExponent ** j);
            const multiplier = 3 * (1.05 ** i);
            hourMatrix[i][j] = (multiplier * (j + powerResult)) / hourRate;
          }
        }
      }

      // 找出hourMatrix里第levelsMissing小的数
      const flatHourMatrix = hourMatrix.flat().filter((v) => v !== '-');
      let minHourCost = null;
      if (flatHourMatrix.length && levelsMissing > 0) {
        const sorted = flatHourMatrix.map(Number).sort((a, b) => a - b);
        minHourCost = sorted[levelsMissing - 1] ?? null;
      }

      // 找到hourMatrix[i][j]每一列小于minHourCost的数的个数
      const upgradeCount = Array(currentUnlock).fill(0);
      const sumHourCost = Array(currentUnlock).fill(0);
      if (minHourCost !== null) {
        for (let i = 0; i < currentUnlock; i += 1) {
          for (let j = 0; j < 600; j += 1) {
            if (hourMatrix[i][j] < minHourCost) {
              upgradeCount[i] += 1;
              sumHourCost[i] += hourMatrix[i][j];
            }
          }
        }
      }
      const targetLvArr = Array(currentUnlock).fill(0);
      for (let i = 0; i < currentUnlock; i += 1) {
        targetLvArr[i] = currentLvArr[i] + upgradeCount[i];
      }

      const result = {
        grimoireValues,
        levelsMissing,
        femurHr: femur,
        ribHr: rib,
        craniumHr: cranium,
        bovinaeHr: bovinae,
        currentLvArr,
        minHourCost,
        upgradeCount,
        sumHourCost,
        targetLvArr,
        hourMatrix,
      };
      console.log(result);
      setOutput(result);
    } catch (err) {
      setError('Invalid JSON format. Please check and try again.');
    }
  }

  return (
    <Container size="lg" px="md" py="md">
      <h1 className="text-xl font-bold mb-4">Grimoire计算助手</h1>
      <ScrollArea h={400} mb="md">
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>序号</Table.Th>
              <Table.Th>名称</Table.Th>
              <Table.Th>当前等级</Table.Th>
              <Table.Th>下一个解锁需要达到的等级</Table.Th>
              <Table.Th>待升级次数</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {Array.isArray(grimoireStatic)
              && grimoireStatic
                .filter((item) => item.index >= 1 && item.index <= 52)
                .map((item) => (
                  <Table.Tr key={item.index}>
                    <Table.Td>{item.index}</Table.Td>
                    <Table.Td>{item.name}</Table.Td>
                    <Table.Td>{output?.currentLvArr?.[item.index - 1]}</Table.Td>
                    <Table.Td>{output?.targetLvArr?.[item.index - 1]}</Table.Td>
                    <Table.Td>{output?.upgradeCount?.[item.index - 1]}</Table.Td>
                  </Table.Tr>
                ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      <form onSubmit={handleProcessJson}>
        <Textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          minRows={40}
          maxRows={40}
          label="Data粘贴区"
          placeholder="请把idleontoolbox的Data粘贴到这里，3秒后点击提交"
          mb="md"
        />
        <Group mb="md" grow>
          <TextInput
            label="大腿骨"
            value={femurHr}
            onChange={(e) => setFemurHr(e.target.value)}
            type="number"
            min={0}
          />
          <TextInput
            label="肋骨"
            value={ribHr}
            onChange={(e) => setRibHr(e.target.value)}
            type="number"
            min={0}
          />
          <TextInput
            label="头盖骨"
            value={craniumHr}
            onChange={(e) => setCraniumHr(e.target.value)}
            type="number"
            min={0}
          />
          <TextInput
            label="牛头"
            value={bovinaeHr}
            onChange={(e) => setBovinaeHr(e.target.value)}
            type="number"
            min={0}
          />
        </Group>
        <Group justify="flex-start">
          <Button type="submit" color="blue">提交</Button>
        </Group>
      </form>
      {error && <div style={{ color: 'red', marginTop: 16 }}>Error: {error}</div>}
      {output && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Result:</h2>
          <pre>{JSON.stringify(output, null, 2)}</pre>
        </div>
      )}
    </Container>
  );
}
