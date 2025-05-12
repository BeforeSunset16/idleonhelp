'use client';

import { generateClient } from 'aws-amplify/data';
import { useEffect, useState } from 'react';
import {
  Card, Group, Text, Table,
} from '@mantine/core';
import { IconSkull, IconTrophy } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import type { Schema } from '#/amplify/data/resource';
import classes from './realtime-info.module.css';

const client = generateClient<Schema>();

export default function WeeklyBoss() {
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const [skullData, setSkullData] = useState<string[]>([]);
  const [trophyData, setTrophyData] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [name, setName] = useState<string>('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const { data } = await client.models.WeeklyBoss.list({
          filter: {
            start_date: { le: today },
            end_date: { ge: today },
            active: { eq: 'T' },
          },
          limit: 100, //! 以后这里要注意，表里最多存100条数据
          authMode: 'apiKey',
        });
        const boss = data[0];
        if (boss) {
          setSkullData(
            boss.skull_fight
              ? (Object.values(JSON.parse(boss.skull_fight as string)) as string[])
              : [],
          );
          setTrophyData(
            boss.misc_fight
              ? (Object.values(JSON.parse(boss.misc_fight as string)) as string[])
              : [],
          );
          setStartDate(boss.start_date ?? '');
          setEndDate(boss.end_date ?? '');
          setName(boss.name ?? '');
        }
      } catch (err) {
        console.error('加载 WeeklyBoss 数据失败：', err);
      }
    };

    fetchData();
  }, []);

  const rows = skullData.map((item, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Table.Tr key={`skull-${item}-${index}`}>
      <Table.Td>{item}</Table.Td>
    </Table.Tr>
  ));

  const rowt = trophyData.map((item, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Table.Tr key={`trophy-${item}-${index}`}>
      <Table.Td>{item}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Card
      withBorder
      radius="md"
      className={classes.card}
      style={{
        width: isMobile ? '85%' : '50%',
        marginTop: isMobile ? '9rem' : '4rem',
        marginRight: 'auto',
        marginBottom: '2rem',
        marginLeft: 'auto',
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
              Weekly Boss： {name}
            </Text>
            <Text className={classes.title} color="dimmed" mt="sm" mb="sm">
              {startDate} ~ {endDate}
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
