import { Workspace } from '@ant-design/agentic-ui';
import { Button, Progress, Statistic, Table, Tag, theme } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const chartData = [
  { name: '周一', value: 320 },
  { name: '周二', value: 420 },
  { name: '周三', value: 380 },
  { name: '周四', value: 560 },
  { name: '周五', value: 640 },
  { name: '周六', value: 590 },
  { name: '周日', value: 720 },
];
const teamData = [
  { key: 'design', name: '体验设计', owner: '陈晨', tasks: 12, status: '完成' },
  { key: 'web', name: '前端研发', owner: '林悦', tasks: 18, status: '进行中' },
  { key: 'qa', name: '质量验证', owner: '周明', tasks: 8, status: '待开始' },
];
const teamColumns = [
  { title: '工作组', dataIndex: 'name', width: 120 },
  { title: '负责人', dataIndex: 'owner', width: 100 },
  { title: '任务数', dataIndex: 'tasks', width: 90 },
  {
    title: '状态',
    dataIndex: 'status',
    width: 110,
    render: (status: string) => (
      <Tag
        color={
          status === '完成'
            ? 'success'
            : status === '进行中'
              ? 'processing'
              : 'default'
        }
      >
        {status}
      </Tag>
    ),
  },
];

const CustomChart: React.FC = () => {
  const { token } = theme.useToken();
  return (
    <>
      <div style={{ marginBottom: token.marginLG }}>
        <div style={{ fontWeight: token.fontWeightStrong }}>每周任务处理量</div>
        <div
          style={{ color: token.colorTextSecondary, marginTop: token.marginXS }}
        >
          最近 7 天 · 单位：次
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={chartData}
          margin={{ top: 12, right: 12, bottom: 8, left: -20 }}
        >
          <CartesianGrid stroke={token.colorBorderSecondary} vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: token.colorTextSecondary,
              fontSize: token.fontSizeSM,
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: token.colorTextSecondary,
              fontSize: token.fontSizeSM,
            }}
          />
          <Tooltip
            isAnimationActive={false}
            contentStyle={{
              background: token.colorBgElevated,
              borderColor: token.colorBorderSecondary,
              borderRadius: token.borderRadius,
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            name="处理任务"
            stroke={token.colorPrimary}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

const CustomStats: React.FC = () => {
  const { token } = theme.useToken();
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
        gap: token.marginLG,
      }}
    >
      {[
        { title: '累计处理任务', value: 11280, suffix: '次' },
        { title: '今日处理任务', value: 1128, suffix: '次' },
        { title: '平均处理时间', value: 2.4, suffix: '秒' },
        { title: '任务完成率', value: 98.6, suffix: '%' },
      ].map((item) => (
        <div
          key={item.title}
          style={{
            padding: token.paddingLG,
            borderRadius: token.borderRadiusLG,
            background: token.colorFillAlter,
          }}
        >
          <Statistic
            title={item.title}
            value={item.value}
            suffix={item.suffix}
          />
        </div>
      ))}
    </div>
  );
};

const CustomControlPanel: React.FC = () => {
  const { token } = theme.useToken();
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stop = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  useEffect(() => stop, []);
  const start = () => {
    if (timerRef.current !== null) return;
    let value = progress === 100 ? 0 : progress;
    setProgress(value);
    setRunning(true);
    timerRef.current = setInterval(() => {
      value = Math.min(value + 10, 100);
      setProgress(value);
      if (value === 100) {
        stop();
        setRunning(false);
      }
    }, 240);
  };
  return (
    <div style={{ maxWidth: 560 }}>
      <div
        style={{
          fontWeight: token.fontWeightStrong,
          marginBottom: token.marginXS,
        }}
      >
        批量分析任务
      </div>
      <p
        style={{
          color: token.colorTextSecondary,
          margin: `0 0 ${token.marginLG}px`,
        }}
      >
        点击开始模拟处理 10 份文档，重置会取消当前任务。
      </p>
      <div aria-live="polite" style={{ marginBottom: token.marginLG }}>
        <Progress
          percent={progress}
          status={running ? 'active' : progress === 100 ? 'success' : 'normal'}
        />
        <span style={{ color: token.colorTextSecondary }}>
          {running
            ? `已处理 ${progress / 10} / 10 份文档`
            : progress === 100
              ? '全部文档已处理完成'
              : '准备就绪'}
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: token.marginSM }}>
        <Button type="primary" onClick={start} disabled={running}>
          {progress === 100 ? '重新开始' : '开始处理'}
        </Button>
        <Button
          onClick={() => {
            stop();
            setRunning(false);
            setProgress(0);
          }}
          disabled={!running && progress === 0}
        >
          重置
        </Button>
      </div>
    </div>
  );
};

const WorkspaceCustomDemo: React.FC = () => {
  const { token } = theme.useToken();
  const panelStyle: React.CSSProperties = {
    height: '100%',
    overflow: 'auto',
    boxSizing: 'border-box',
    padding: token.paddingLG,
  };
  return (
    <div
      style={{
        height: 560,
        width: '100%',
        minWidth: 0,
        fontFamily: token.fontFamily,
      }}
    >
      <Workspace pure title="数据分析工作台" style={{ boxShadow: 'none' }}>
        <Workspace.Custom tab={{ key: 'chart', title: '趋势' }}>
          <div style={panelStyle}>
            <CustomChart />
          </div>
        </Workspace.Custom>
        <Workspace.Custom tab={{ key: 'stats', title: '指标' }}>
          <div style={panelStyle}>
            <CustomStats />
          </div>
        </Workspace.Custom>
        <Workspace.Custom tab={{ key: 'table', title: '团队' }}>
          <div style={panelStyle}>
            <Table
              columns={teamColumns}
              dataSource={teamData}
              pagination={false}
              size="middle"
              scroll={{ x: 420 }}
            />
          </div>
        </Workspace.Custom>
        <Workspace.Custom tab={{ key: 'control', title: '处理任务' }}>
          <div style={panelStyle}>
            <CustomControlPanel />
          </div>
        </Workspace.Custom>
      </Workspace>
    </div>
  );
};
export default WorkspaceCustomDemo;
