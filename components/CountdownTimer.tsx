import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const calculateTimeLeft = () => {
  const now = new Date();
  const year = now.getFullYear();
  const endOfMonth = new Date(year, 11, 1); // December 1st of the current year
  const difference = endOfMonth.getTime() - now.getTime();

  let timeLeft: {days?: number, hours?: number, minutes?: number, seconds?: number} = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

const TimeCard: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center justify-center bg-[var(--color-background-secondary)] p-3 rounded-lg w-20 h-20 border border-[var(--color-border)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
      <div className="h-10" style={{ perspective: '300px' }}>
          <span key={value} className="text-3xl font-bold animate-flip-in block" style={{ background: 'var(--color-accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {String(value).padStart(2, '0')}
          </span>
      </div>
      <span className="text-xs uppercase text-[var(--color-text-secondary)] tracking-wider mt-1">{label}</span>
    </div>
  );

const CountdownTimer: React.FC = () => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timerComponents = Object.entries(timeLeft);

  return (
    <div className="my-6">
      <h2 className="text-xl font-bold text-center mb-4 text-[var(--color-text-primary)]">{t('countdown.title')}</h2>
      {timerComponents.length ? (
        <div className="flex justify-center gap-2 sm:gap-4">
          <TimeCard value={timeLeft.days ?? 0} label={t('timeUnits.days')} />
          <TimeCard value={timeLeft.hours ?? 0} label={t('timeUnits.hours')} />
          <TimeCard value={timeLeft.minutes ?? 0} label={t('timeUnits.minutes')} />
          <TimeCard value={timeLeft.seconds ?? 0} label={t('timeUnits.seconds')} />
        </div>
      ) : (
        <p className="text-center text-xl font-bold text-[var(--color-text-primary)]">{t('countdown.ended')}</p>
      )}
    </div>
  );
};

export default CountdownTimer;