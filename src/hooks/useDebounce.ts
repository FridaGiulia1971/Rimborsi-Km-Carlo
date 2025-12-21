import { useState, useEffect } from 'react';

/**
 * Hook per implementare il debouncing di un valore
 * @param value - Il valore da "debounceare"
 * @param delay - Il ritardo in millisecondi
 * @returns Il valore debounced
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Imposta un timer per aggiornare il valore debounced
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Pulisce il timer se il valore cambia prima che il delay sia completato
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}