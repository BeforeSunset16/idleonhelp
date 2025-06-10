import React, { useRef, useState, useEffect } from 'react';
import {
  Group,
  Stack,
  Paper,
  Text,
  Textarea,
  Button,
  Table,
  Tooltip,
  Select,
} from '@mantine/core';
import Image from 'next/image';
import { IconInfoCircle } from '@tabler/icons-react';
import BoneInputRow from './BoneInputRow';
import grimoireStatic from '../grimoire_static.json';

function useLocalStorageState(key: string, initialValue: string): [string, (v: string) => void] {
  const [value, setValue] = useState<string>(() => {
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
  return [value as string, setValue as (v: string) => void];
}

function UnlockSelectItem(props: any) {
  const { option, checked } = props;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span>{option.label}</span>
      <Image src={`/images/grimoire/${option.image}`} alt={option.label} width={20} height={20} />
      {checked && <span style={{ marginLeft: 'auto', color: '#228be6' }}>✔</span>}
    </div>
  );
}

export default function GrimoireForm({
  femurHr, setFemurHr,
  ribHr, setRibHr,
  craniumHr, setCraniumHr,
  bovinaeHr, setBovinaeHr,
  onSubmit,
  result,
  onUnlockIndexChange,
}: any) {
  const [femurUnit, setFemurUnit] = useLocalStorageState('femurUnit', '');
  const [femurExp, setFemurExp] = useLocalStorageState('femurExp', '');
  const [ribUnit, setRibUnit] = useLocalStorageState('ribUnit', '');
  const [ribExp, setRibExp] = useLocalStorageState('ribExp', '');
  const [craniumUnit, setCraniumUnit] = useLocalStorageState('craniumUnit', '');
  const [craniumExp, setCraniumExp] = useLocalStorageState('craniumExp', '');
  const [bovinaeUnit, setBovinaeUnit] = useLocalStorageState('bovinaeUnit', '');
  const [bovinaeExp, setBovinaeExp] = useLocalStorageState('bovinaeExp', '');
  const roundedBoneTime = result?.roundedBoneTime || [];
  const boneTime = result?.boneTime || [];
  const formattedBoneCount = result?.formattedBoneCount || [];
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedUnlockIndex, setSelectedUnlockIndex] = useState<string>('');
  const unlockOptions = grimoireStatic.map((item: any) => ({
    value: String(item.index),
    label: `${item.index + 1}  ${item.name}`,
    image: item.imageFile,
  }));

  const [selectDisabled, setSelectDisabled] = useState(false);
  useEffect(() => {
    if (selectedUnlockIndex) {
      // 用户有选择，什么都不做
    } else if (result && typeof result.currentUnlock === 'number') {
      // 没有选择时，自动选中 currentUnlock
      setSelectedUnlockIndex(String(result.currentUnlock));
    }
    setSelectDisabled(false);
  }, [selectedUnlockIndex, result, unlockOptions]);

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
            </Text>
            <br />
            <Text>
              使用方式：请先在Data粘贴区粘贴idleontoolbox的Data，等3秒左右，再填写每小时的骨头掉落数，没有可不填，点击提交即可。
            </Text>
          </Paper>
          <Textarea
            ref={textareaRef}
            label={(
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                Data粘贴区
                <Tooltip label="在www.idleontoolbox.com登录后点击上方导航栏的Data按钮，看到第一个框:Data, 点击Copy按钮即可">
                  <span style={{ display: 'inline-flex', cursor: 'pointer' }}>
                    <IconInfoCircle size={18} color="#228be6" />
                  </span>
                </Tooltip>
              </span>
            )}
            placeholder="请把idleontoolbox的Data粘贴到这里，等3秒左右"
            minRows={3}
            maxRows={3}
            autosize
          />
        </Stack>
        <Stack style={{ width: '27%' }} gap="1">
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
          <Select
            data={unlockOptions}
            value={selectedUnlockIndex}
            onChange={(value) => {
              setSelectedUnlockIndex(value || '');
              if (onUnlockIndexChange) {
                onUnlockIndexChange(value === null ? undefined : Number(value));
              }
            }}
            placeholder={selectedUnlockIndex ? undefined : '选择目标解锁项 (可不填,默认为下一个)'}
            clearable
            searchable
            renderOption={(props) => <UnlockSelectItem {...props} />}
            style={{ marginBottom: 8, width: '90%' }}
            disabled={selectDisabled}
          />
          <Group style={{ width: '100%' }} justify="left" gap="6.5rem">
            <Button
              variant="outline"
              color="blue"
              style={{ width: '30%' }}
              type="button"
              onClick={() => {
                if (textareaRef.current) textareaRef.current.value = '';
              }}
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
                <Table.Tr>
                  <Table.Td>合计</Table.Td>
                  <Table.Td>-</Table.Td>
                  <Table.Td>
                    {
                      Math.ceil(
                        boneTime
                          .filter(
                            (t: any) => t !== undefined && t !== null && !Number.isNaN(Number(t)),
                          )
                          .reduce(
                            (sum: number, t: any) => sum + Number(t),
                            0,
                          ),
                      )
                    }
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          );
        })()}
      </form>
    </Group>
  );
}
