'use client';

import { Container, Title } from '@mantine/core';
import { useState, useCallback, useEffect } from 'react';
import GrimoireForm from './components/GrimoireForm';
import GrimoireTable from './components/GrimoireTable';
import grimoireStatic from './grimoire_static.json';

// 类型声明
type GrimoireResult = {
  grimoireValues: number[];
  currentLevels: number[];
  targetLevels: number[];
  upgradeCounts: number[];
  roundedBoneTime: number[];
  formattedBoneCount: string[];
  minHourCost: number | null;
  levelsMissing: number;
  hourMatrix: (number | string)[][];
};

function formatNumberWithUnit(num: number): string {
  if (num === 0) return '0';
  const units = ['', 'K', 'M', 'B', 'T', 'Q', 'QQ', 'QQQ', 'E'];
  let unitIndex = 0;
  let n = Math.abs(num);
  while (n >= 1000 && unitIndex < units.length - 1) {
    n /= 1000;
    unitIndex += 1;
  }
  // 保留两位小数
  return `${(num / 1000 ** unitIndex).toFixed(2)}${units[unitIndex]}`;
}

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
          maxLevel = 0,
          boneType = 0,
          base = 0,
          exponent = 1,
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
          if (typeof hourMatrix[i][j] === 'number' && Number(hourMatrix[i][j]) <= minHourCost) {
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

    // 计算每种骨头所需时间和数量
    const boneTime = Array(4).fill(0);
    for (let i = 0; i < unlockForCalc; i += 1) {
      const staticItem = grimoireStatic.find((item) => item.index === i);
      if (staticItem) {
        const { boneType = 0 } = staticItem;
        boneTime[boneType] += sumHourCosts[i];
      }
    }
    const boneIndex = [femur, rib, cranium, bovinae];
    const boneCount = boneTime.map((time, idx) => time * boneIndex[idx]);
    const formattedBoneCount = boneCount.map(formatNumberWithUnit);
    const roundedBoneTime = boneTime.map((time) => Number(time.toFixed(2)));

    return {
      grimoireValues,
      currentLevels,
      targetLevels,
      upgradeCounts,
      minHourCost,
      levelsMissing,
      roundedBoneTime,
      formattedBoneCount,
      hourMatrix,
    };
  } catch (err) {
    return { error: 'Invalid JSON format. Please check and try again.' };
  }
}

// 本地持久化hook
function useLocalStorageState(key: string, initialValue: string) {
  const [value, setValue] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key) ?? initialValue;
    }
    return initialValue;
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }, [key, value]);
  return [value, setValue] as const;
}

export default function GrimoireCalculator() {
  const [jsonTextState, setJsonTextState] = useState('');
  const [femurHr, setFemurHr] = useLocalStorageState('femurHr', '');
  const [ribHr, setRibHr] = useLocalStorageState('ribHr', '');
  const [craniumHr, setCraniumHr] = useLocalStorageState('craniumHr', '');
  const [bovinaeHr, setBovinaeHr] = useLocalStorageState('bovinaeHr', '');
  const [result, setResult] = useState<GrimoireResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [boneTypeFilter, setBoneTypeFilter] = useState('');

  const handleProcessJson = useCallback(
    (
      {
        jsonText, femur, rib, cranium, bovinae,
      }: {
        jsonText: string;
        femur: number;
        rib: number;
        cranium: number;
        bovinae: number;
      },
    ) => {
      setError(null);
      const calcResult = calculateGrimoire(
        jsonText,
        femur,
        rib,
        cranium,
        bovinae,
      );
      if ('error' in calcResult) {
        setError(calcResult.error);
        setResult(null);
      } else {
        setResult(calcResult as GrimoireResult);
      }
    },
    [],
  );

  return (
    <Container size="xl" px="md" py="md">
      <Title order={1} mb="lg" style={{ color: '#523E3A', textAlign: 'center' }}>Grimoire计算器</Title>
      <GrimoireForm
        femurHr={femurHr}
        setFemurHr={setFemurHr}
        ribHr={ribHr}
        setRibHr={setRibHr}
        craniumHr={craniumHr}
        setCraniumHr={setCraniumHr}
        bovinaeHr={bovinaeHr}
        setBovinaeHr={setBovinaeHr}
        jsonTextState={jsonTextState}
        setJsonTextState={setJsonTextState}
        onSubmit={handleProcessJson}
        result={result}
      />
      {error && <div style={{ color: 'red', marginTop: 16 }}>Error: {error}</div>}
      <GrimoireTable
        result={result}
        boneTypeFilter={boneTypeFilter}
        setBoneTypeFilter={setBoneTypeFilter}
      />
    </Container>
  );
}
