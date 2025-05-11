'use client';

import { generateClient } from 'aws-amplify/data';
import { useState } from 'react';
import type { Schema } from '#/amplify/data/resource';

const client = generateClient<Schema>();

export default function CreateWeeklyBossPage() {
  const [formData, setFormData] = useState({
    name: '',
    startdate: '',
    enddate: '',
    skullfight: '',
    miscfight: '',
    active: 'T',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await client.models.WeeklyBoss.create({
        name: formData.name,
        startdate: formData.startdate,
        enddate: formData.enddate,
        skullfight: formData.skullfight,
        miscfight: formData.miscfight,
        active: formData.active as 'T' | 'F',
      });
      alert('创建成功！');
    } catch (error) {
      console.error('出错了：', error);
      alert('提交失败，看看控制台～');
    }
  };

  const [weeklyBossList, setWeeklyBossList] = useState<Schema['WeeklyBoss']['type'][]>([]);

  const fetchWeekly = async () => {
    try {
      const { data } = await client.models.WeeklyBoss.listWeeklyBossByActiveAndCreatedAt(
        {
          active: 'T',
        },
        {
          authMode: 'apiKey',
          limit: 100,
          sortDirection: 'DESC',
        },
      );
      setWeeklyBossList(data);
    } catch (error) {
      console.error('Error fetching guides:', error);
      setWeeklyBossList([]);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">新建 Weekly Boss</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="名称" className="border p-2 w-full mb-2" />
        <input name="startdate" type="date" value={formData.startdate} onChange={handleChange} className="border p-2 w-full mb-2" />
        <input name="enddate" type="date" value={formData.enddate} onChange={handleChange} className="border p-2 w-full mb-2" />
        <input name="skullfight" value={formData.skullfight} onChange={handleChange} placeholder="Skull Fight" className="border p-2 w-full mb-2" />
        <input name="miscfight" value={formData.miscfight} onChange={handleChange} placeholder="Misc Fight" className="border p-2 w-full mb-2" />
        <select name="active" value={formData.active} onChange={handleChange} className="border p-2 w-full mb-4">
          <option value="T">激活</option>
          <option value="F">未激活</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-4">提交</button>
        <button type="button" onClick={fetchWeekly} className="bg-green-500 text-white px-4 py-2 rounded">Show</button>
      </form>

      {weeklyBossList.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">WeeklyBoss 数据：</h2>
          <ul className="space-y-2">
            {weeklyBossList.map((boss) => (
              <li key={boss.id} className="border p-3 rounded">
                <strong>{boss.name}</strong><br />
                时间：{boss.startdate} ~ {boss.enddate}<br />
                Skull Fight: {boss.skullfight}<br />
                Misc Fight: {boss.miscfight}<br />
                状态：{boss.active === 'T' ? '激活' : '未激活'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
