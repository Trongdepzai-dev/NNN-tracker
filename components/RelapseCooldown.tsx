import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const calculateTimeLeft = (endTime: number) => {
  const difference = endTime - new Date().getTime();
  let timeLeft = { hours: 0, minutes: 0, seconds: 0 };
  if (difference > 0) {
    timeLeft = {
      hours: Math.floor(difference / (1000 * 60 * 60)), // Total hours left
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};

const TimeCard: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="h-10" style={{ perspective: '300px' }}>
          <span key={value} className="text-3xl font-bold text-[var(--color-danger-text)] animate-flip-in block">
              {String(value).padStart(2, '0')}
          </span>
      </div>
      <span className="text-xs uppercase text-[var(--color-danger-text-secondary)] mt-1">{label}</span>
    </div>
  );

const RelapseCooldown: React.FC<{ endTime: number }> = ({ endTime }) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(endTime));
    }, 1000);
    return () => clearTimeout(timer);
  });
  
  return (
    <div 
      className="text-center p-6 rounded-lg my-4 animate-fade-in shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
      style={{
        backgroundColor: 'var(--color-danger-background)',
        border: '1px solid var(--color-danger-border)'
      }}
    >
      <h3 className="text-lg font-bold text-[var(--color-danger-text)] flex items-center justify-center gap-2">⚠️ {t('cooldown.title')}</h3>
      <p className="text-sm text-[var(--color-danger-text-secondary)] mt-1 mb-4">{t('cooldown.detailed')}</p>
      <div className="flex justify-center gap-6">
        <TimeCard value={timeLeft.hours} label={t('timeUnits.hours')} />
        <TimeCard value={timeLeft.minutes} label={t('timeUnits.minutes')} />
        <TimeCard value={timeLeft.seconds} label={t('timeUnits.seconds')} />
      </div>
    </div>
  );
};

export default RelapseCooldown;