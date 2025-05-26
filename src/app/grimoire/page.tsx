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
  Paper,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useState, useCallback, useRef } from 'react';
import { IconChevronDown, IconFilter, IconInfoCircle } from '@tabler/icons-react';
import Image from 'next/image';
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
  imgName,
  onValueChange,
  unit,
  onUnitChange,
  exponent,
  onExponentChange,
  inputWidth = '30%',
}: {
  label: string;
  value: string;
  imgName: string;
  onValueChange: (v: string) => void;
  unit: string;
  onUnitChange: (v: string) => void;
  exponent: string;
  onExponentChange: (v: string) => void;
  inputWidth: string;
}) {
  return (
    <Group align="flex-end" mb="xs" style={{ width: inputWidth }} gap="xs">
      <TextInput
        placeholder={label}
        leftSection={<Image src={`/images/grimoire/${imgName}.png`} alt={label} width={19} height={19} />}
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const jsonText = textareaRef.current?.value || '';
    const femur = femurHr === '' ? 1 : parseBoneValue(femurHr, femurUnit, femurExp);
    const rib = ribHr === '' ? 1 : parseBoneValue(ribHr, ribUnit, ribExp);
    const cranium = craniumHr === '' ? 1 : parseBoneValue(craniumHr, craniumUnit, craniumExp);
    const bovinae = bovinaeHr === '' ? 1 : parseBoneValue(bovinaeHr, bovinaeUnit, bovinaeExp);
    onSubmit({
      jsonText,
      femur,
      rib,
      cranium,
      bovinae,
    });
  }

  return (
    <Group align="stretch" wrap="nowrap" mt="md" mb="lg">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flex: 1, width: '100%' }}>
        <Stack style={{ marginRight: '2rem', width: '38%' }} align="left-end">
          <Paper shadow="xs" p="xs">
            <Text>
              该计算器可自动计算出下一次unlock的最佳升级分配方案，并给出最短耗时。
            </Text>
            <Text>
              使用方式：请先在Data粘贴区粘贴idleontoolbox的Data，等3秒左右，再填写每小时的骨头掉落数，没有可不填，点击提交即可。
            </Text>
          </Paper>
          <Textarea
            ref={textareaRef}
            label="Data粘贴区"
            placeholder="请把idleontoolbox的Data粘贴到这里，等3秒左右"
            minRows={3}
            maxRows={3}
          />
        </Stack>
        <Stack style={{ width: '27%' }} gap="xs">
          <BoneInputRow
            label="每小时大腿骨掉落数"
            imgName="femur"
            value={femurHr}
            onValueChange={setFemurHr}
            unit={femurUnit}
            onUnitChange={setFemurUnit}
            exponent={femurExp}
            onExponentChange={setFemurExp}
            inputWidth="90%"
          />
          <BoneInputRow
            label="每小时肋骨掉落数"
            imgName="rib"
            value={ribHr}
            onValueChange={setRibHr}
            unit={ribUnit}
            onUnitChange={setRibUnit}
            exponent={ribExp}
            onExponentChange={setRibExp}
            inputWidth="90%"
          />
          <BoneInputRow
            label="每小时头盖骨掉落数"
            imgName="cranium"
            value={craniumHr}
            onValueChange={setCraniumHr}
            unit={craniumUnit}
            onUnitChange={setCraniumUnit}
            exponent={craniumExp}
            onExponentChange={setCraniumExp}
            inputWidth="90%"
          />
          <BoneInputRow
            label="每小时牛头掉落数"
            imgName="bovinae"
            value={bovinaeHr}
            onValueChange={setBovinaeHr}
            unit={bovinaeUnit}
            onUnitChange={setBovinaeUnit}
            exponent={bovinaeExp}
            onExponentChange={setBovinaeExp}
            inputWidth="90%"
          />
          <Group style={{ width: '100%' }} justify="left" gap="6.5rem">
            <Button
              variant="outline"
              color="blue"
              style={{ width: '30%' }}
              type="button"
            >
              清空Data
            </Button>
            <Button type="submit" color="blue" style={{ width: '30%' }}>
              提交
            </Button>
          </Group>
        </Stack>
        {(() => {
          const boneLabels = ['大腿骨', '肋骨', '头盖骨', '牛头'];
          const boneImages = ['femur', 'rib', 'cranium', 'bovinae'];
          return (
            <Table striped highlightOnHover withTableBorder withColumnBorders style={{ flex: 1, border: '1px solid #ddd' }}>
              <Table.Thead>
                <Table.Tr style={{ backgroundColor: '#66bab7', color: '#fff' }}>
                  <Table.Th>骨头种类</Table.Th>
                  <Table.Th>所需数量</Table.Th>
                  <Table.Th>预计耗时（小时）</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {boneLabels.map((label, idx) => (
                  <Table.Tr key={label}>
                    <Table.Td>
                      <Image
                        src={`/images/grimoire/${boneImages[idx]}.png`}
                        alt={label}
                        width={24}
                        height={24}
                        style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }}
                      />
                      {label}
                    </Table.Td>
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
                      {boneTypeFilter || '(点击筛选)'}
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
                  <Table.Td>
                    <Image
                      src={`/images/grimoire/${item.imageFile}`}
                      alt={item.name}
                      width={24}
                      height={24}
                      style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}
                    />
                    {item.name}
                    <Tooltip label={item.bonus} withArrow>
                      <span
                        style={{
                          color: '#228be6', // 蓝色更像 info
                          marginLeft: 8,
                          cursor: 'pointer',
                          verticalAlign: 'middle',
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                      >
                        <IconInfoCircle size={18} stroke={1.8} />
                      </span>
                    </Tooltip>
                  </Table.Td>
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
  const [jsonTextState, setJsonTextState] = useState('');
  const [femurHr, setFemurHr] = useState('');
  const [ribHr, setRibHr] = useState('');
  const [craniumHr, setCraniumHr] = useState('');
  const [bovinaeHr, setBovinaeHr] = useState('');
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
        setResult(calcResult);
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
