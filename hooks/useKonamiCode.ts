import { useEffect, useState, useCallback } from 'react';

const konamiCode = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];

const useKonamiCode = (callback: () => void) => {
  const [index, setIndex] = useState(0);

  const keydownHandler = useCallback((event: KeyboardEvent) => {
    const key = (event.key || '').toLowerCase();
    if (key === konamiCode[index]) {
      setIndex(prevIndex => prevIndex + 1);
    } else {
      // Reset if wrong key, but check if the current key is the start of the sequence
      setIndex(key === konamiCode[0] ? 1 : 0);
    }
  }, [index]);

  useEffect(() => {
    if (index === konamiCode.length) {
      callback();
      setIndex(0); // Reset after callback
    }
  }, [index, callback]);
  
  useEffect(() => {
    window.addEventListener('keydown', keydownHandler);
    return () => {
      window.removeEventListener('keydown', keydownHandler);
    };
  }, [keydownHandler]);
};

export default useKonamiCode;