import React, { useRef, useState } from 'react';
import {
  Group,
  Stack,
  Paper,
  Text,
  Textarea,
  Button,
  Table,
} from '@mantine/core';
import BoneInputRow from './BoneInputRow';

export default function GrimoireForm({
  femurHr, setFemurHr,
  ribHr, setRibHr,
  craniumHr, setCraniumHr,
  bovinaeHr, setBovinaeHr,
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
              该计算器可自动计算出你下一次unlock的最佳升级分配方案(每种Upgrade需要达到的等级，升级的次数)，并给出最短耗时。
            </Text><br />
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
                      <img
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
