'use client';

import {
  Table,
  Textarea,
  Button,
  Container,
  ScrollArea,
  Group,
} from '@mantine/core';
import { useState } from 'react';
import grimoireStatic from './grimoire_static.json';

export default function GrimoireCalculator() {
  const [jsonText, setJsonText] = useState('');
  const [output, setOutput] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  function handleProcessJson(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOutput(null);

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
      // 计算当前解锁的grimoire数量
      let currentUnlock = grimoireValues.filter((v) => v !== 0).length;
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

      // const matrixHour = Array.from({ length: currentUnlock }, () => Array(600).fill(0));
      // for (let i = 0; i < currentUnlock; i++) {
      //   for (let j = 0; j < 600; j++) {
      //     if ()
      //   }
      // }
      const result = {
        // grimoireValues, // 展示grimoireValues
        levelsMissing,
      };

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
              <Table.Th>index</Table.Th>
              <Table.Th>name</Table.Th>
              <Table.Th>current_lv</Table.Th>
              <Table.Th>target_lv</Table.Th>
              <Table.Th>targetlv - current_lv</Table.Th>
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
                    <Table.Td>-</Table.Td>
                    <Table.Td>-</Table.Td>
                    <Table.Td>-</Table.Td>
                  </Table.Tr>
                ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      <form onSubmit={handleProcessJson}>
        <Textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          minRows={10}
          autosize
          label="Data粘贴区"
          placeholder="请把idleontoolbox的Data粘贴到这里，3秒后点击提交"
          mb="md"
        />
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
