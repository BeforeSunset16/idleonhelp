'use client';

import { generateClient } from 'aws-amplify/data';
import { useState } from 'react';
import type { Schema } from '#/amplify/data/resource';

const client = generateClient<Schema>();

const SAMPLE_DATA = {
  name: 'Jupiteye Major',
  start_date: '2025-05-08',
  end_date: '2025-05-15',
  skull_fight: '{"1":"2 3 2 - 2 1 1(FR)","2":"2 3 1 - 2 1","3":"3 3 3 - 1 2 1 - 2 2 1","4":"1 2"}',
  misc_fight: '{"1":"3 2 2 - 3 3 1(FR)","2":"3 2 3","3":"2 2 3 - 3 3 1 - 3 3 3"}',
  active: 'T' as 'T' | 'F',
};

// const SAMPLE_DATA = {
//   name: 'Jupiteye Major',
//   start_date: '2025-05-08',
//   end_date: '2025-05-15',
// skull_fight: '{"1":"2 3 2 - 2 1 1(FR)","2":"2 3 1 - 2 1","3":"3 3 3 - 1 2 1 - 2 2 1","4":"1 2"}',
//   misc_fight: '{"1":"3 2 2 - 3 3 1(FR)","2":"3 2 3","3":"2 2 3 - 3 3 1 - 3 3 3"}',
//   active: 'T' as 'T' | 'F',
// };

// WeeklyBoss: a.model({
//   name: a.string(),
//   start_date: a.date(),
//   end_date:a.date(),
//   skull_fight: a.json(),
//   misc_fight:a.json(),
//   active: a.enum(['T', 'F']),
//   createdAt: a.datetime(),
// }).authorization((allow) => [allow.owner(), allow.publicApiKey().to(['read'])])
// .secondaryIndexes((index) => [
//   index("active").sortKeys(["createdAt"]),
// ]),

export default function CreateWeeklyBossPage() {
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    skull_fight: '',
    misc_fight: '',
    active: 'T',
  });

  const handleChange = (
    e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await client.models.WeeklyBoss.create({
        name: formData.name,
        start_date: formData.start_date,
        end_date: formData.end_date,
        skull_fight: formData.skull_fight,
        misc_fight: formData.misc_fight,
        active: formData.active as 'T' | 'F',
      });
      alert('创建成功！');
      // 清空表单
      setFormData({
        name: '',
        start_date: '',
        end_date: '',
        skull_fight: '',
        misc_fight: '',
        active: 'T',
      });
    } catch (error) {
      console.error('出错了：', error);
      alert('提交失败，请检查输入格式是否正确');
    }
  };

  const [weeklyBossList, setWeeklyBossList] = useState<Schema['WeeklyBoss']['type'][]>([]);
  const handleDeleteAll = async () => {
    const confirmed = window.confirm('确定要删除所有 WeeklyBoss 数据吗？此操作不可撤销！');
    if (!confirmed) return;

    try {
      const { data } = await client.models.WeeklyBoss.list();
      await Promise.all(
        data
          .filter((item) => item.id)
          .map((item) => client.models.WeeklyBoss.delete({ id: item.id! })),
      );

      alert('删除成功！');
      setWeeklyBossList([]); // 清空前端状态
    } catch (err) {
      console.error('删除失败：', err);
      alert('删除时发生错误');
    }
  };

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
      console.log(data);
    } catch (error) {
      console.error('Error fetching guides:', error);
      setWeeklyBossList([]);
    }
  };

  const handleDeleteLatest = async () => {
    const { data } = await client.models.WeeklyBoss.list();

    // 找到 enddate 最大的那条
    const latest = data
      .filter((item) => item.end_date)
      .sort((a, b) => (b.end_date! > a.end_date! ? 1 : -1))[0];

    if (!latest?.id) {
      alert('没有可删除的数据');
      return;
    }

    const confirmed = window.confirm(`确定删除 end_date 为 ${latest.end_date} 的 "${latest.name}" 吗？`);
    if (!confirmed) return;

    try {
      await client.models.WeeklyBoss.delete({ id: latest.id });
      alert('删除成功');
      // 可选：刷新数据
      fetchWeekly();
    } catch (err) {
      console.error('删除失败：', err);
      alert('删除失败，请查看控制台');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">新建 Weekly Boss</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="名称" className="border p-2 w-full mb-2" />
        <input name="start_date" type="date" value={formData.start_date} onChange={handleChange} className="border p-2 w-full mb-2" />
        <input name="end_date" type="date" value={formData.end_date} onChange={handleChange} className="border p-2 w-full mb-2" />
        <textarea
          name="skull_fight"
          value={formData.skull_fight}
          onChange={handleChange}
          placeholder='{"1":"pattern1","2":"pattern2"}'
          className="border p-2 w-full mb-2"
        />
        <textarea
          name="misc_fight"
          value={formData.misc_fight}
          onChange={handleChange}
          placeholder='{"1":"pattern1","2":"pattern2"}'
          className="border p-2 w-full mb-2"
        />
        <select name="active" value={formData.active} onChange={handleChange} className="border p-2 w-full mb-4">
          <option value="T">激活</option>
          <option value="F">未激活</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-4">提交</button>
        <button type="button" onClick={fetchWeekly} className="bg-green-500 text-white px-4 py-2 rounded mr-4">Show</button>
        <button
          type="button"
          onClick={() => setFormData(SAMPLE_DATA)}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          插入样例
        </button>
      </form>
      <button
        type="button"
        onClick={handleDeleteAll}
        className="bg-red-500 text-white px-4 py-2 rounded ml-2"
      >
        删除表中所有数据
      </button>
      <button
        type="button"
        onClick={handleDeleteLatest}
        className="bg-yellow-500 text-white px-4 py-2 rounded ml-2"
      >
        删除 enddate 最新的一条
      </button>

      {weeklyBossList.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">WeeklyBoss 数据：</h2>
          <ul className="space-y-2">
            {weeklyBossList.map((boss) => (
              <li key={boss.id} className="border p-3 rounded">
                <strong>{boss.name}</strong><br />
                时间：{boss.start_date} ~ {boss.end_date}<br />
                Skull Fight:
                <ul className="list-disc ml-5">
                  {(() => {
                    try {
                      const skulls = JSON.parse(boss.skull_fight as string);
                      return Object.entries(skulls)
                        .sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
                        .map(([key, value]) => (
                          <li key={key}>{value as string}</li>
                        ));
                    } catch (e) {
                      return <li>解析失败</li>;
                    }
                  })()}
                </ul>
                Misc Fight:
                <ul className="list-disc ml-5">
                  {(() => {
                    try {
                      const miscs = JSON.parse(boss.misc_fight as string);
                      return Object.entries(miscs)
                        .sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
                        .map(([key, value]) => (
                          <li key={key}>{value as string}</li>
                        ));
                    } catch (e) {
                      return <li>解析失败</li>;
                    }
                  })()}
                </ul>
                状态：{boss.active === 'T' ? 'T' : 'F'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
