import React, { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  ReferenceLine,
  Label,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { themes } from '../themes';
import type { CheckedDays } from '../types';

interface ProgressChartProps {
  checkedDays: CheckedDays;
  todayInNovember: number;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label, t }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    let statusText: string;
    let statusColor = 'var(--color-text-secondary)';

    if (data.status === 1) {
      statusText = t('chartTooltip.statusTypes.success');
      statusColor = 'var(--color-accent)';
    } else if (data.status === 0) {
      statusText = t('chartTooltip.statusTypes.fail');
      statusColor = 'var(--color-danger-text)';
    } else {
        statusText = t('chartTooltip.statusTypes.pending');
    }

    return (
      <div className="p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg shadow-lg text-sm">
        <p className="font-bold text-[var(--color-text-primary)] mb-1">{t('chartTooltip.day', { label })}</p>
        <p style={{ color: statusColor }}>{t('chartTooltip.status', { status: statusText })}</p>
        <p className="text-[var(--color-text-secondary)]">{t('chartTooltip.cumulative', { count: data.cumulative })}</p>
      </div>
    );
  }

  return null;
};

const ProgressChart: React.FC<ProgressChartProps> = ({ checkedDays, todayInNovember }) => {
  const { t } = useTranslation();
  const { theme, accentColor } = useTheme();

  const currentTheme = themes[theme];
  const colorAccent = accentColor || currentTheme['--color-accent'];
  const colorDanger = currentTheme['--color-danger-text'];
  const colorNeutral = currentTheme['--color-border'];
  const colorTextSecondary = currentTheme['--color-text-secondary'];

  const chartData = useMemo(() => {
    let cumulativeSuccess = 0;
    return Array.from({ length: 30 }, (_, i) => {
      const day = i + 1;
      let status: 0 | 1 | 2 = 2; // 0: fail, 1: success, 2: pending

      if (checkedDays[day]) {
        status = 1;
        cumulativeSuccess++;
      } else if (day < todayInNovember) {
        status = 0;
      }

      return {
        day,
        status,
        cumulative: cumulativeSuccess,
      };
    });
  }, [checkedDays, todayInNovember]);

  return (
    <div className="w-full h-72 p-4 bg-[var(--color-background-secondary)] rounded-lg border border-[var(--color-border)] mt-6">
      <h3 className="font-bold text-lg text-center mb-4 text-[var(--color-text-primary)]">{t('dashboard.chartTitle')}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{
            top: 5,
            right: 20,
            left: -15,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colorAccent} stopOpacity={0.4} />
              <stop offset="95%" stopColor={colorAccent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="day" 
            tick={{ fill: colorTextSecondary, fontSize: 12 }} 
            stroke={currentTheme['--color-border']}
            tickLine={{ stroke: currentTheme['--color-border'] }}
            axisLine={{ stroke: currentTheme['--color-border'] }}
            interval={4}
          />
          <YAxis 
            tick={{ fill: colorTextSecondary, fontSize: 12 }} 
            stroke={currentTheme['--color-border']}
            tickLine={{ stroke: currentTheme['--color-border'] }}
            axisLine={{ stroke: currentTheme['--color-border'] }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip t={t} />} cursor={{ fill: 'rgba(var(--rgb-border), 0.15)' }} />
          
          <Bar dataKey="status" barSize={20}>
            {chartData.map((entry) => (
              <Cell 
                key={`cell-${entry.day}`} 
                fill={
                  entry.status === 1 ? colorAccent : 
                  entry.status === 0 ? colorDanger : 
                  colorNeutral
                } 
                opacity={entry.status === 2 ? 0.3 : 0.7}
              />
            ))}
          </Bar>

          <Area type="monotone" dataKey="cumulative" fill="url(#colorCumulative)" stroke="none" />
          <Line 
            type="monotone" 
            dataKey="cumulative" 
            stroke={colorAccent} 
            strokeWidth={2} 
            dot={false}
            activeDot={{ r: 6, stroke: 'var(--color-background)', strokeWidth: 2 }}
          />

          {todayInNovember > 0 && todayInNovember <= 30 && (
            <ReferenceLine x={todayInNovember} stroke={colorAccent} strokeDasharray="3 3">
              <Label value={t('timeUnits.days')} position="top" fill={colorAccent} fontSize={12} dy={-10} />
            </ReferenceLine>
          )}

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;