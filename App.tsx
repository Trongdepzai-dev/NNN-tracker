import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { Trophy, Flame } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import useLocalStorage from './hooks/useLocalStorage';
import useKonamiCode from './hooks/useKonamiCode';
import { useTheme } from './context/ThemeContext';
import { themes } from './themes';
import CalendarGrid from './components/CalendarGrid';
import QuoteModal from './components/QuoteModal';
import ProgressBar from './components/ProgressBar';
import ThemeSwitcher from './components/ThemeSwitcher';
import AchievementsList from './components/AchievementsList';
import CountdownTimer from './components/CountdownTimer';
import RelapseCooldown from './components/RelapseCooldown';
import NotificationSettings from './components/NotificationSettings';
import PreChallengeCountdown from './components/PreChallengeCountdown';
import Confetti from './components/Confetti';
import WelcomeScreen from './components/WelcomeScreen';
import Dashboard from './components/Dashboard';
import AccentColorPicker from './components/AccentColorPicker';
import GuideModal from './components/GuideModal';
import GuideButton from './components/GuideButton';
import LanguageSwitcher from './components/LanguageSwitcher';
import JournalModal from './components/JournalModal';
import { MOTIVATIONAL_QUOTES, ACHIEVEMENTS } from './constants';
import type { CheckedDays, JournalEntries, AchievementId, Achievement } from './types';

// Vanta needs to be declared as it's loaded from a script tag
declare const VANTA: any;

const App: React.FC = () => {
  const { t } = useTranslation();
  const [userName, setUserName] = useLocalStorage<string | null>('nnn-user-name-2024', null);
  const [checkedDays, setCheckedDays] = useLocalStorage<CheckedDays>('nnn-tracker-days-2024', {});
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntries>('nnn-journal-entries-2024', {});
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage<AchievementId[]>('nnn-achievements-2024', []);
  const [relapseCooldownEnd, setRelapseCooldownEnd] = useLocalStorage<number | null>('nnn-cooldown-2024', null);
  const [isCooldownActive, setIsCooldownActive] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<string | null>(null);
  const [newlyUnlocked, setNewlyUnlocked] = useState<AchievementId | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [view, setView] = useState<'tracker' | 'dashboard'>('tracker');
  const [secretThemes, setSecretThemes] = useLocalStorage<string[]>('nnn-secret-themes-2024', []);
  const [footerClicks, setFooterClicks] = useState(0);
  const [hasSeenGuide, setHasSeenGuide] = useLocalStorage<boolean>('nnn-has-seen-guide-2024', false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [selectedJournalDay, setSelectedJournalDay] = useState<number | null>(null);

  const { theme, setTheme, accentColor } = useTheme();

  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    if (!vantaEffect && VANTA) {
      const themeColors = themes[theme];
      const primaryAccent = accentColor || themeColors['--color-accent'];

      setVantaEffect(VANTA.NET({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        backgroundColor: themeColors['--color-background-secondary'],
        color: primaryAccent,
        points: 10.00,
        maxDistance: 22.00,
        spacing: 18.00
      }));
    }

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
        setVantaEffect(null);
      }
    };
  }, [vantaRef, vantaEffect]);
  
  useEffect(() => {
      if(vantaEffect) {
          const themeColors = themes[theme];
          const primaryAccent = accentColor || themeColors['--color-accent'];
          vantaEffect.setOptions({
              backgroundColor: themeColors['--color-background-secondary'],
              color: primaryAccent,
          });
      }
  }, [theme, accentColor, vantaEffect]);

  const isDeveloper = useMemo(() => userName === 'B.Trọng', [userName]);

  const unlockMatrixTheme = useCallback(() => {
    if (!secretThemes.includes('matrix')) {
      setSecretThemes(prev => [...prev, 'matrix']);
      setTheme('matrix');
      toast.success(t('matrixThemeToast'), {
        style: {
          background: '#000',
          color: '#00FF41',
          border: '1px solid #005F00',
        },
      });
    }
  }, [secretThemes, setSecretThemes, setTheme, t]);

  useKonamiCode(unlockMatrixTheme);

  const handleFooterClick = () => {
    const newCount = footerClicks + 1;
    if (newCount >= 10) {
      toast(t('footer.secretToast.title'), {
        description: t('footer.secretToast.description'),
        icon: '🤫',
      });
      setFooterClicks(0);
    } else {
      setFooterClicks(newCount);
    }
  };
  
  useEffect(() => {
    if (userName && !hasSeenGuide) {
      const timer = setTimeout(() => {
        setShowGuideModal(true);
        setHasSeenGuide(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [userName, hasSeenGuide, setHasSeenGuide]);

  useEffect(() => {
    if (relapseCooldownEnd) {
      const now = new Date().getTime();
      if (now < relapseCooldownEnd) {
        setIsCooldownActive(true);
        const timer = setTimeout(() => {
          setIsCooldownActive(false);
          setRelapseCooldownEnd(null);
        }, relapseCooldownEnd - now);
        return () => clearTimeout(timer);
      } else {
        setRelapseCooldownEnd(null);
      }
    }
  }, [relapseCooldownEnd, setRelapseCooldownEnd]);


  const { isNovember, todayInNovember } = useMemo(() => {
    if (isPreviewMode) {
      return {
        isNovember: true,
        todayInNovember: 15,
      };
    }
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();
    
    if (month === 10) { // November is month 10 (0-indexed)
        return {
            isNovember: true,
            todayInNovember: day,
        };
    }

    return {
        isNovember: false,
        todayInNovember: 0,
    };
  }, [isPreviewMode]);

  const daysSucceeded = useMemo(() => {
    return Object.values(checkedDays).filter(Boolean).length;
  }, [checkedDays]);
  
  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = todayInNovember; i > 0; i--) {
      if (checkedDays[i]) {
        streak++;
      } else {
        break; 
      }
    }
    return streak;
  }, [checkedDays, todayInNovember]);

  const daysRemaining = isNovember ? 30 - todayInNovember : 30;

  const handleDayClick = (day: number) => {
    const wasChecked = checkedDays[day] || false;
    const newCheckedDays = { ...checkedDays, [day]: !wasChecked };
    
    if (wasChecked && day < todayInNovember) {
      const newCooldownEnd = Date.now() + 24 * 60 * 60 * 1000;
      setRelapseCooldownEnd(newCooldownEnd);
      setIsCooldownActive(true);
      toast.error(t('cooldown.title'), {
        description: t('cooldown.description'),
      });
    }

    setCheckedDays(newCheckedDays);

    if (!wasChecked) {
      const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
      setCurrentQuote(t(MOTIVATIONAL_QUOTES[randomIndex]));
      setShowQuoteModal(true);
    }
  };
  
  const handleOpenJournal = (day: number) => {
    setSelectedJournalDay(day);
    setIsJournalModalOpen(true);
  };

  const handleSaveJournal = (text: string) => {
    if (selectedJournalDay) {
      setJournalEntries(prev => ({ ...prev, [selectedJournalDay]: text }));
    }
  };

  const checkAchievements = useCallback(() => {
    const newUnlocks: AchievementId[] = [];
    const conditions: { id: AchievementId; met: boolean }[] = [
      { id: 'FIRST_WEEK', met: daysSucceeded >= 7 },
      { id: 'STREAK_7', met: currentStreak >= 7 },
      { id: 'HALFWAY', met: daysSucceeded >= 15 },
      { id: 'FINISHER', met: daysSucceeded >= 30 },
    ];

    for (const condition of conditions) {
      if (condition.met && !unlockedAchievements.includes(condition.id)) {
        newUnlocks.push(condition.id);
      }
    }

    if (newUnlocks.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newUnlocks]);
      const unlockedAchievement = ACHIEVEMENTS[newUnlocks[0]];
      setNewlyUnlocked(unlockedAchievement.id);
      setTimeout(() => setNewlyUnlocked(null), 2000); // For list animation
      toast.success(t('achievements.unlockedToast.title'), {
        description: t('achievements.unlockedToast.description', {
            icon: unlockedAchievement.icon,
            title: t(unlockedAchievement.title)
        }),
        duration: 5000,
      });

      if (newUnlocks.includes('FINISHER')) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 8000);
      }
    }
  }, [daysSucceeded, currentStreak, unlockedAchievements, setUnlockedAchievements, t]);

  useEffect(() => {
    checkAchievements();
  }, [daysSucceeded, currentStreak, checkAchievements]);

  const handleNameSubmit = (name: string) => {
    setUserName(name);
  };

  if (!userName) {
    return <WelcomeScreen onNameSubmit={handleNameSubmit} />;
  }
  
  return (
    <div className="min-h-screen text-[var(--color-text-primary)] flex flex-col items-center p-4 sm:p-8" ref={vantaRef}>
      <Toaster richColors position="bottom-center" theme={theme === 'light' || theme === 'solarizedLight' || theme === 'sepia' ? 'light' : 'dark'} />
      {showConfetti && <Confetti />}
      <main className="w-full max-w-lg md:max-w-2xl mx-auto transition-all duration-300 relative z-10">
        <AnimatePresence mode="wait">
          {view === 'tracker' ? (
            <motion.div
              key="tracker"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {isPreviewMode && (
                <div className="w-full text-center mb-4 p-2 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg text-sm flex items-center justify-center gap-4">
                  <span>{t('previewMode.notice')}</span>
                  <button
                    onClick={() => setIsPreviewMode(false)}
                    className="font-bold underline hover:text-[var(--color-accent)] transition-colors"
                  >
                    {t('previewMode.exit')}
                  </button>
                </div>
              )}
              <header className="text-center mb-6">
                <div className="relative inline-block">
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ background: 'var(--color-accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {t('appName')}
                  </h1>
                  <GuideButton onClick={() => setShowGuideModal(true)} />
                </div>
                <p className="text-xl mt-2 text-[var(--color-text-secondary)] font-medium">{t('tagline', { userName })} {isDeveloper && <span className="admin-badge">{t('adminBadge')}</span>}</p>
                {(isNovember || isPreviewMode) && (
                  <motion.div 
                    className="mt-6 grid grid-cols-2 gap-4 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.2 } }}
                  >
                    <div className="bg-[var(--color-background-secondary)] p-4 rounded-lg border border-[var(--color-border)] flex flex-col items-center justify-center">
                        <div className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">{t('stats.succeeded')}</div>
                        <div className="text-3xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                          <Trophy className="w-7 h-7" style={{ color: 'var(--color-accent)' }}/>
                          {daysSucceeded}
                        </div>
                    </div>
                    <div className="bg-[var(--color-background-secondary)] p-4 rounded-lg border border-[var(--color-border)] flex flex-col items-center justify-center">
                        <div className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">{t('stats.streak')}</div>
                        <div className="text-3xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                          <Flame className="w-7 h-7" style={{ color: 'var(--color-accent)' }}/>
                          {currentStreak}
                        </div>
                    </div>
                  </motion.div>
                )}
              </header>

              {(isNovember || isPreviewMode) ? (
                  <>
                      <CountdownTimer />
                      <ProgressBar value={daysSucceeded} max={30} />
                      
                      {isCooldownActive && relapseCooldownEnd ? (
                        <RelapseCooldown endTime={relapseCooldownEnd} />
                      ) : null}

                      <div className="p-2">
                          <CalendarGrid 
                              checkedDays={checkedDays}
                              journalEntries={journalEntries}
                              todayInNovember={todayInNovember} 
                              onDayClick={handleDayClick}
                              onJournalClick={handleOpenJournal}
                              isDisabled={isCooldownActive}
                          />
                      </div>
                      <AchievementsList unlockedAchievements={unlockedAchievements} newlyUnlockedId={newlyUnlocked} />
                      <div className="text-center mt-8 text-[var(--color-text-secondary)] text-sm">
                          <p>{t('progress.remaining', { count: daysRemaining < 0 ? 0 : daysRemaining })}</p>
                      </div>
                  </>
              ) : (
                  <PreChallengeCountdown onPreview={() => setIsPreviewMode(true)} />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard 
                currentUser={{ name: userName, streak: currentStreak }}
                checkedDays={checkedDays}
                todayInNovember={todayInNovember}
                onBack={() => setView('tracker')}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <footer className="mt-10 flex flex-col items-center gap-6">
          <div className="w-full flex justify-center items-center gap-4">
            <button
              onClick={() => setView(view === 'tracker' ? 'dashboard' : 'tracker')}
              className="border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] font-bold py-2 px-4 rounded-lg transition-colors hover:bg-[var(--color-background-hover)]"
            >
              {view === 'tracker' ? t('footer.toggleView.dashboard') : t('footer.toggleView.tracker')}
            </button>
          </div>
          <NotificationSettings />
          <ThemeSwitcher unlockedSecretThemes={secretThemes} />
          <AccentColorPicker />
          <div className="flex items-center gap-4 mt-4">
            <LanguageSwitcher />
            <p onClick={handleFooterClick} className="cursor-pointer text-sm text-center text-[var(--color-text-secondary)]">
              {t('footer.madeBy')}
            </p>
          </div>
        </footer>
      </main>

      <QuoteModal 
        isOpen={showQuoteModal}
        quote={currentQuote}
        onClose={() => setShowQuoteModal(false)}
      />

      <GuideModal 
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />
      
      <JournalModal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
        day={selectedJournalDay}
        initialText={selectedJournalDay ? journalEntries[selectedJournalDay] || '' : ''}
        onSave={handleSaveJournal}
      />
    </div>
  );
};

export default App;