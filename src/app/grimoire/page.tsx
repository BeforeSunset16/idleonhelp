'use client';

import {
  Table,
  Textarea,
  Button,
  Container,
  ScrollArea,
  Group,
  TextInput,
  Select,
  Stack,
  Menu,
  ActionIcon,
} from '@mantine/core';
import { useState, useCallback } from 'react';
import { IconChevronDown, IconFilter } from '@tabler/icons-react';
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

const UNITS = ['无', 'K', 'M', 'B', 'T', 'Q', 'QQ', 'QQQ', 'E'];
const BONE_TYPE_LABELS = ['大腿骨', '肋骨', '头盖骨', '牛头'];

function BoneInputRow({
  label,
  value,
  onValueChange,
  unit,
  onUnitChange,
  exponent,
  onExponentChange,
  inputWidth = '33%',
}: {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  unit: string;
  onUnitChange: (v: string) => void;
  exponent: string;
  onExponentChange: (v: string) => void;
  inputWidth?: string;
}) {
  return (
    <Group align="flex-end" mb="xs" style={{ width: inputWidth }}>
      <TextInput
        placeholder={label}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        type="number"
        min={0}
        style={{ flex: 2 }}
      />
      <Select
        placeholder="单位"
        data={UNITS}
        value={unit}
        onChange={(v) => onUnitChange(v ?? '')}
        style={{ flex: 1 }}
        allowDeselect={false}
      />
      {unit === 'E' && (
        <TextInput
          label="指数"
          value={exponent}
          onChange={(e) => onExponentChange(e.target.value)}
          type="number"
          min={0}
          style={{ flex: 1 }}
        />
      )}
    </Group>
  );
}

BoneInputRow.defaultProps = {
  inputWidth: '33%',
};

function parseBoneValue(value: string, unit: string, exponent: string): number {
  const num = Number(value) || 0;
  const unitMap: Record<string, number> = {
    无: 1,
    K: 1e3,
    M: 1e6,
    B: 1e9,
    T: 1e12,
    Q: 1e15,
    QQ: 1e18,
    QQQ: 1e21,
    E: 1,
  };
  if (unit === 'E') {
    const exp = Number(exponent) || 0;
    return num * 10 ** exp;
  }
  return num * (unitMap[unit] || 1);
}

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
  result,
}: any) {
  const [femurUnit, setFemurUnit] = useState('');
  const [femurExp, setFemurExp] = useState('');
  const [ribUnit, setRibUnit] = useState('');
  const [ribExp, setRibExp] = useState('');
  const [craniumUnit, setCraniumUnit] = useState('');
  const [craniumExp, setCraniumExp] = useState('');
  const [bovinaeUnit, setBovinaeUnit] = useState('');
  const [bovinaeExp, setBovinaeExp] = useState('');
  const roundedBoneTime = result?.roundedBoneTime || [];
  const formattedBoneCount = result?.formattedBoneCount || [];

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    const femur = femurHr === '' ? 1 : parseBoneValue(femurHr, femurUnit, femurExp);
    const rib = ribHr === '' ? 1 : parseBoneValue(ribHr, ribUnit, ribExp);
    const cranium = craniumHr === '' ? 1 : parseBoneValue(craniumHr, craniumUnit, craniumExp);
    const bovinae = bovinaeHr === '' ? 1 : parseBoneValue(bovinaeHr, bovinaeUnit, bovinaeExp);
    onSubmit({
      femur, rib, cranium, bovinae,
    });
  }

  return (
    <Group align="stretch" wrap="nowrap" mb="lg">
      <form onSubmit={handleFormSubmit} style={{ display: 'flex', flex: 1, width: '100%' }}>
        <Stack style={{ marginRight: '3rem', width: '20%' }} align="left-end">
          <Textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            label="Data粘贴区"
            placeholder="请把idleontoolbox的Data粘贴到这里，等3秒左右"
            mb="0"
            autosize
            minRows={8}
            maxRows={8}
          />
        </Stack>
        <Stack style={{ mb: '3rem' }} gap="xs">
          <BoneInputRow
            label="大腿骨"
            value={femurHr}
            onValueChange={setFemurHr}
            unit={femurUnit}
            onUnitChange={setFemurUnit}
            exponent={femurExp}
            onExponentChange={setFemurExp}
            inputWidth="75%"
          />
          <BoneInputRow
            label="肋骨"
            value={ribHr}
            onValueChange={setRibHr}
            unit={ribUnit}
            onUnitChange={setRibUnit}
            exponent={ribExp}
            onExponentChange={setRibExp}
            inputWidth="75%"
          />
          <BoneInputRow
            label="头盖骨"
            value={craniumHr}
            onValueChange={setCraniumHr}
            unit={craniumUnit}
            onUnitChange={setCraniumUnit}
            exponent={craniumExp}
            onExponentChange={setCraniumExp}
            inputWidth="75%"
          />
          <BoneInputRow
            label="牛头"
            value={bovinaeHr}
            onValueChange={setBovinaeHr}
            unit={bovinaeUnit}
            onUnitChange={setBovinaeUnit}
            exponent={bovinaeExp}
            onExponentChange={setBovinaeExp}
            inputWidth="75%"
          />
          <Button type="submit" color="blue" style={{ width: '60%' }}>
            提交
          </Button>
        </Stack>
        {(() => {
          const boneLabels = ['大腿骨', '肋骨', '头盖骨', '牛头'];
          return (
            <Table striped highlightOnHover withTableBorder withColumnBorders style={{ flex: 1 }}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>骨头种类</Table.Th>
                  <Table.Th>所需数量</Table.Th>
                  <Table.Th>预计耗时（小时）</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {boneLabels.map((label, idx) => (
                  <Table.Tr key={label}>
                    <Table.Td>{label}</Table.Td>
                    <Table.Td>{formattedBoneCount[idx] ?? '-'}</Table.Td>
                    <Table.Td>{roundedBoneTime[idx] ?? '-'}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          );
        })()}
      </form>
    </Group>
  );
}

function GrimoireTable({
  result,
  boneTypeFilter,
  setBoneTypeFilter,
}: {
  result: GrimoireResult | null,
  boneTypeFilter: string,
  setBoneTypeFilter: (v: string) => void,
}) {
  return (
    <ScrollArea h={400} mb="md" type="auto">
      <Table striped highlightOnHover withTableBorder withColumnBorders stickyHeader>
        <Table.Thead>
          <Table.Tr style={{ backgroundColor: '#66bab7', color: '#fff' }}>
            <Table.Th>序号</Table.Th>
            <Table.Th>名称</Table.Th>
            <Table.Th>当前等级</Table.Th>
            <Table.Th>目标等级</Table.Th>
            <Table.Th>待升级次数</Table.Th>
            <Table.Th style={{ position: 'relative', zIndex: 1 }}>
              <Menu shadow="md" width={120} position="bottom-end" withinPortal>
                <Menu.Target>
                  <Group gap={4} style={{ cursor: 'pointer', display: 'inline-flex' }}>
                    <span>骨头种类</span>
                    <span style={{ color: '#fff', fontWeight: 400, marginLeft: 6 }}>
                      {boneTypeFilter || '(可筛选)'}
                    </span>
                    <ActionIcon size="sm" variant="subtle" style={{ color: '#fff' }}>
                      <IconChevronDown size={18} />
                    </ActionIcon>
                  </Group>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => setBoneTypeFilter('')}
                    color={boneTypeFilter === '' ? 'blue' : undefined}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <IconFilter size={14} style={{ marginRight: 4 }} />全部
                    </span>
                  </Menu.Item>
                  {BONE_TYPE_LABELS.map((label) => (
                    <Menu.Item
                      key={label}
                      onClick={() => setBoneTypeFilter(label)}
                      color={boneTypeFilter === label ? 'blue' : undefined}
                    >
                      {label}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Array.isArray(grimoireStatic)
            && grimoireStatic
              .filter((item) => item.index >= 0 && item.index <= 52)
              .filter(
                (item) => !boneTypeFilter || BONE_TYPE_LABELS[item.boneType] === boneTypeFilter,
              )
              .map((item) => (
                <Table.Tr key={item.index}>
                  <Table.Td>{item.index + 1 }</Table.Td>
                  <Table.Td>{item.name}</Table.Td>
                  <Table.Td>{result ? result.currentLevels[item.index] : ''}</Table.Td>
                  <Table.Td>{result ? result.targetLevels[item.index] : ''}</Table.Td>
                  <Table.Td>{result ? result.upgradeCounts[item.index] : ''}</Table.Td>
                  <Table.Td>{BONE_TYPE_LABELS[item.boneType] ?? ''}</Table.Td>
                </Table.Tr>
              ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}

export default function GrimoireCalculator() {
  const [jsonText, setJsonText] = useState('');
  const [femurHr, setFemurHr] = useState('');
  const [ribHr, setRibHr] = useState('');
  const [craniumHr, setCraniumHr] = useState('');
  const [bovinaeHr, setBovinaeHr] = useState('');
  const [result, setResult] = useState<GrimoireResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [boneTypeFilter, setBoneTypeFilter] = useState('');

  const handleProcessJson = useCallback(
    (
      bones: {
        femur: number;
        rib: number;
        cranium: number;
        bovinae: number;
      },
    ) => {
      setError(null);
      const calcResult = calculateGrimoire(
        jsonText,
        bones.femur,
        bones.rib,
        bones.cranium,
        bones.bovinae,
      );
      if ('error' in calcResult) {
        setError(calcResult.error);
        setResult(null);
      } else {
        setResult(calcResult);
      }
    },
    [jsonText],
  );

  return (
    <Container size="xl" px="md" py="md">
      <h1 className="text-xl font-bold mb-4">Grimoire计算助手</h1>
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
