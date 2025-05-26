import { Group, TextInput, Select } from '@mantine/core';
import Image from 'next/image';

const UNITS = ['无', 'K', 'M', 'B', 'T', 'Q', 'QQ', 'QQQ', 'E'];

export default function BoneInputRow({
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
