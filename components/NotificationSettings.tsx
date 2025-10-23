import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import useLocalStorage from '../hooks/useLocalStorage';

const NotificationSettings: React.FC = () => {
  const { t } = useTranslation();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [reminderTime, setReminderTime] = useLocalStorage<string | null>('nnn-reminder-time', null);
  const [selectedTime, setSelectedTime] = useState(reminderTime || '08:00');
  const timeoutIdRef = useRef<number | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const scheduleNextNotification = useCallback((time: string) => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    let nextNotificationDate = new Date();
    nextNotificationDate.setHours(hours, minutes, 0, 0);

    // If the time has already passed for today, schedule it for tomorrow
    if (nextNotificationDate <= now) {
      nextNotificationDate.setDate(nextNotificationDate.getDate() + 1);
    }

    const delay = nextNotificationDate.getTime() - now.getTime();

    timeoutIdRef.current = window.setTimeout(() => {
      new Notification(t('notifications.reminder.title'), {
        body: t('notifications.reminder.body'),
        icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✅</text></svg>',
      });
      // Reschedule for the next day
      scheduleNextNotification(time);
    }, delay);
  }, [t]);

  useEffect(() => {
    if (permission === 'granted' && reminderTime) {
      scheduleNextNotification(reminderTime);
    } else {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    }
  }, [permission, reminderTime, scheduleNextNotification]);


  const handleRequestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error(t('notifications.toast.unsupported'));
      return;
    }
    const currentPermission = await Notification.requestPermission();
    setPermission(currentPermission);
    return currentPermission;
  };

  const handleSave = async () => {
    let currentPermission = permission;
    if (currentPermission !== 'granted') {
      currentPermission = await handleRequestPermission();
    }

    if (currentPermission === 'granted') {
      setReminderTime(selectedTime);
      toast.success(t('notifications.toast.success', { time: selectedTime }));
    } else {
      toast.warning(t('notifications.toast.warning'));
    }
  };

  const handleDisable = () => {
    setReminderTime(null);
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    toast.info(t('notifications.toast.disabled'));
  };

  return (
    <div className="w-full max-w-sm p-4 rounded-lg bg-[var(--color-background-secondary)] border border-[var(--color-border)] text-center">
      <h3 className="font-bold text-lg text-[var(--color-text-primary)] mb-2">{t('notifications.title')}</h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">{t('notifications.description')}</p>
      
      {permission === 'denied' ? (
        <p className="text-sm text-[var(--color-danger-text)]">{t('notifications.blocked')}</p>
      ) : (
        <>
          <div className="flex justify-center items-center gap-4 mb-4">
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-md p-2 text-[var(--color-text-primary)]"
              aria-label="Reminder time"
            />
          </div>
          <div className="flex justify-center gap-2">
            <button
              onClick={handleSave}
              className="bg-[var(--color-accent)] text-[var(--color-background)] font-bold py-2 px-4 rounded-lg transition-opacity hover:opacity-90"
            >
              {t('notifications.save')}
            </button>
            <button
              onClick={handleDisable}
              disabled={!reminderTime}
              className="border border-[var(--color-border)] text-[var(--color-text-secondary)] font-bold py-2 px-4 rounded-lg transition-colors hover:bg-[var(--color-background-hover)] disabled:opacity-50"
            >
              {t('notifications.disable')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationSettings;