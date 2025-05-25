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
import { useState, useCallback } from 'react';
import grimoireStatic from './grimoire_static.json';

// 类型声明
type GrimoireResult = {
  grimoireValues: number[];
  currentLevels: number[];
  targetLevels: number[];
  upgradeCounts: number[];
  sumHourCosts: number[];
  minHourCost: number | null;
  levelsMissing: number;
  hourMatrix: (number | string)[][];
};

function calculateGrimoire(
  jsonText: string,
  femur: number,
  rib: number,
  cranium: number,
  bovinae: number,
): GrimoireResult | { error: string } {
  try {
    const grimoireData = JSON.parse(jsonText);
    let grimoireValues: number[] = [];
    const grimoire = grimoireData.data?.Grimoire;
    if (Array.isArray(grimoire)) {
      grimoireValues = grimoire;
    } else if (typeof grimoire === 'object' && grimoire !== null) {
      grimoireValues = Object.values(grimoire);
    }
    // 生成 currentLevels
    const currentLevels = Array(52)
      .fill(0)
      .map((_, i) => Number(grimoireValues[i] ?? 0));
    // 计算当前解锁数量
    const currentUnlock = currentLevels.filter((v) => v > 0).length;
    // 计算 levelsMissing
    let matchedUnlockLevel = null;
    if (Array.isArray(grimoireStatic)) {
      const match = grimoireStatic.find((item) => item.index === currentUnlock);
      if (match) {
        matchedUnlockLevel = match.unlockLevel;
      }
    }
    const sumLevel = currentLevels.reduce((acc, v) => acc + Number(v), 0);
    let levelsMissing = (matchedUnlockLevel ?? 0) - sumLevel;
    let unlockForCalc = currentUnlock;
    if (levelsMissing === 0) {
      unlockForCalc += 1;
      const match = grimoireStatic.find((item) => item.index === unlockForCalc);
      if (match) {
        matchedUnlockLevel = match.unlockLevel;
      }
      levelsMissing = (matchedUnlockLevel ?? 0) - sumLevel;
    }
    // hourMatrix
    const hourMatrix: (number | string)[][] = Array.from(
      { length: unlockForCalc },
      () => Array(600).fill('-'),
    );
    const hourRates = [femur, rib, cranium, bovinae];
    // INSERT_YOUR_REWRITE_HERE
    for (let i = 0; i < unlockForCalc; i += 1) {
      const staticItem = grimoireStatic.find((item) => item.index === i);
      if (staticItem) {
        const {
          maxLevel = 0, boneType = 0, base = 0, exponent = 1,
        } = staticItem;
        const hourRate = hourRates[boneType] ?? 0;
        for (let j = 0; j < 600; j += 1) {
          if (j >= currentLevels[i] && j < maxLevel) {
            const adjustedExponent = exponent + 0.01;
            const basePlusJ = base + j;
            const powerResult = basePlusJ * (adjustedExponent ** j);
            const multiplier = 3 * (1.05 ** i);
            hourMatrix[i][j] = (multiplier * (j + powerResult)) / hourRate;
          }
        }
      }
    }
    // 找第levelsMissing小的数
    const flatHourMatrix = hourMatrix.flat().filter((v) => v !== '-');
    let minHourCost: number | null = null;
    if (flatHourMatrix.length && levelsMissing > 0) {
      const sorted = flatHourMatrix.map(Number).sort((a, b) => a - b);
      minHourCost = sorted[levelsMissing - 1] ?? null;
    }
    // 统计升级
    const upgradeCounts = Array(unlockForCalc).fill(0);
    const sumHourCosts = Array(unlockForCalc).fill(0);
    if (minHourCost !== null) {
      for (let i = 0; i < unlockForCalc; i += 1) {
        for (let j = 0; j < 600; j += 1) {
          if (typeof hourMatrix[i][j] === 'number' && Number(hourMatrix[i][j]) < minHourCost) {
            upgradeCounts[i] += 1;
            sumHourCosts[i] += Number(hourMatrix[i][j]);
          }
        }
      }
    }
    // 目标等级
    const targetLevels = Array(unlockForCalc)
      .fill(0)
      .map((_, i) => currentLevels[i] + upgradeCounts[i]);
    return {
      grimoireValues,
      currentLevels,
      targetLevels,
      upgradeCounts,
      sumHourCosts,
      minHourCost,
      levelsMissing,
      hourMatrix,
    };
  } catch (err) {
    return { error: 'Invalid JSON format. Please check and try again.' };
  }
}

function GrimoireForm({
  femurHr,
  setFemurHr,
  ribHr,
  setRibHr,
  craniumHr,
  setCraniumHr,
  bovinaeHr,
  setBovinaeHr,
  jsonText,
  setJsonText,
  onSubmit,
}: any) {
  return (
    <form onSubmit={onSubmit}>
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
        <Button type="submit" color="blue">
          提交
        </Button>
      </Group>
    </form>
  );
}

function GrimoireTable({ result }: { result: GrimoireResult | null }) {
  if (!result) return null;
  return (
    <ScrollArea h={400} mb="md">
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>序号</Table.Th>
            <Table.Th>名称</Table.Th>
            <Table.Th>当前等级</Table.Th>
            <Table.Th>目标等级</Table.Th>
            <Table.Th>待升级次数</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Array.isArray(grimoireStatic)
            && grimoireStatic
              .filter((item) => item.index >= 0 && item.index <= 52)
              .map((item) => (
                <Table.Tr key={item.index}>
                  <Table.Td>{item.index + 1 }</Table.Td>
                  <Table.Td>{item.name}</Table.Td>
                  <Table.Td>{result.currentLevels[item.index]}</Table.Td>
                  <Table.Td>{result.targetLevels[item.index]}</Table.Td>
                  <Table.Td>{result.upgradeCounts[item.index]}</Table.Td>
                </Table.Tr>
              ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}

export default function GrimoireCalculator() {
  const [jsonText, setJsonText] = useState('');
  const [femurHr, setFemurHr] = useState('113000000000');
  const [ribHr, setRibHr] = useState('60000000000');
  const [craniumHr, setCraniumHr] = useState('47000000000');
  const [bovinaeHr, setBovinaeHr] = useState('100000000000');
  const [result, setResult] = useState<GrimoireResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProcessJson = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const femur = femurHr === '' ? 1 : Number(femurHr);
    const rib = ribHr === '' ? 1 : Number(ribHr);
    const cranium = craniumHr === '' ? 1 : Number(craniumHr);
    const bovinae = bovinaeHr === '' ? 1 : Number(bovinaeHr);
    const calcResult = calculateGrimoire(jsonText, femur, rib, cranium, bovinae);
    if ('error' in calcResult) {
      setError(calcResult.error);
      setResult(null);
    } else {
      setResult(calcResult);
    }
  }, [jsonText, femurHr, ribHr, craniumHr, bovinaeHr]);

  return (
    <Container size="lg" px="md" py="md">
      <h1 className="text-xl font-bold mb-4">Grimoire计算助手</h1>
      <GrimoireTable result={result} />
      <GrimoireForm
        femurHr={femurHr}
        setFemurHr={setFemurHr}
        ribHr={ribHr}
        setRibHr={setRibHr}
        craniumHr={craniumHr}
        setCraniumHr={setCraniumHr}
        bovinaeHr={bovinaeHr}
        setBovinaeHr={setBovinaeHr}
        jsonText={jsonText}
        setJsonText={setJsonText}
        onSubmit={handleProcessJson}
      />
      {error && <div style={{ color: 'red', marginTop: 16 }}>Error: {error}</div>}
      {result && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </Container>
  );
}
