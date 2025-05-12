'use client';

import {
  Card, Group, Text, Table,
} from '@mantine/core';
import { IconSkull, IconTrophy } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import classes from './home1.module.css';

const DataSkull = [
  {
    id: '1',
    skull: '2 2 1 - 3 3 1 - 3',
    trophy: '3 3 3 - 2 3 1',
  },
  {
    id: '2',
    skull: '1 1 1 - 3 1 (FR)',
    trophy: '3 3 3 - 1 3 3 - 1 (FR)',
  },
  {
    id: '3',
    skull: '3 3',
    trophy: '3 3 3 - 3 3 1',
  },
  {
    id: '4',
    skull: '3 2 1',
    trophy: '3 3 3',
  },
  {
    id: '5',
    skull: '3 1 3 - 1 3 3',
    trophy: '2 2 3 - 2 (FR)',
  },
  {
    id: '6',
    skull: '2 1 2 - 2 (FR)',
    trophy: '3 3',
  },
  {
    id: '7',
    skull: '1 2 1 - 3 1 1',
    trophy: '3 3 3 - 2 3 1',
  },
];

const DataTrophy = [
  {
    id: '1',
    trophy: '3 3 3 - 2 3 1',
  },
  {
    id: '2',
    trophy: '3 3 3 - 1 3 3 - 1 (FR)',
  },
  {
    id: '3',
    trophy: '3 3 3 - 3 3 1',
  },
  {
    id: '4',
    trophy: '3 3 3',
  },
];

export default function WeeklyBoss() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const rows = DataSkull.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.skull}</Table.Td>
    </Table.Tr>
  ));
  const rowt = DataTrophy.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.trophy}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Card
      withBorder
      radius="md"
      className={classes.card}
      style={{
        width: isMobile ? '85%' : '50%',
        margin: '0 auto',
        marginTop: '8rem',
        paddingTop: '0',
      }}
    >
      <Group
        wrap="nowrap"
        gap={0}
        className={classes.cardGroup}
      >
        <div className={classes.body}>
          <Group wrap="nowrap" gap="xs">
            <Text className={classes.title} mt="sm" mb="sm" size="xl">
              Weekly Boss
            </Text>
            <Text className={classes.title} c="dimmed" mt="sm" mb="sm">
              4月10日-4月17日 Decibop Box
            </Text>
          </Group>
          <Text tt="uppercase" fw={700} size="md">
            <IconSkull size={20} /> 5个骷髅头 <IconSkull size={20} />
          </Text>
          <Table>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>

        <div className={classes.body}>
          <Text tt="uppercase" fw={700} size="md" mt="md">
            Misc + 奖杯 <IconTrophy size={20} />
          </Text>
          <Table miw={285}>
            <Table.Tbody>{rowt}</Table.Tbody>
          </Table>
        </div>
      </Group>
    </Card>
  );
}
