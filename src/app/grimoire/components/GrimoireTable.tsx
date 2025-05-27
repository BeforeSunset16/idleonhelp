import {
  ScrollArea,
  Table,
  Menu,
  Group,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { IconChevronDown, IconFilter, IconInfoCircle } from '@tabler/icons-react';
import Image from 'next/image';
import grimoireStatic from '../grimoire_static.json';

const BONE_TYPE_LABELS = ['大腿骨', '肋骨', '头盖骨', '牛头'];

export default function GrimoireTable({
  result,
  boneTypeFilter,
  setBoneTypeFilter,
}: {
  result: any,
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
                    <span>
                      骨头种类
                    </span>
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
                      <IconFilter size={14} style={{ marginRight: 4 }} />
                      全部
                    </span>
                  </Menu.Item>
                  {BONE_TYPE_LABELS.map((label) => (
                    <Menu.Item
                      key={label}
                      onClick={() => setBoneTypeFilter(label)}
                      color={boneTypeFilter === label ? 'blue' : undefined}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <Image
                          src={`/images/grimoire/${['femur', 'rib', 'cranium', 'bovinae'][BONE_TYPE_LABELS.indexOf(label)]}.png`}
                          alt={label}
                          width={18}
                          height={18}
                          style={{ marginRight: 6, verticalAlign: 'middle' }}
                        />
                        {label}
                      </span>
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
                          color: '#228be6',
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
                  <Table.Td
                    style={
                      result && result.upgradeCounts[item.index] > 0
                        ? { backgroundColor: '#ffe066', fontWeight: 'bold', color: '#ad6800' }
                        : undefined
                    }
                  >
                    {result ? result.upgradeCounts[item.index] : ''}
                  </Table.Td>
                  <Table.Td>
                    <Image
                      src={`/images/grimoire/${['femur', 'rib', 'cranium', 'bovinae'][item.boneType]}.png`}
                      alt={BONE_TYPE_LABELS[item.boneType]}
                      width={20}
                      height={20}
                      style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }}
                    />
                    {BONE_TYPE_LABELS[item.boneType] ?? ''}
                  </Table.Td>
                </Table.Tr>
              ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
