import { Input } from '@/components/ui/input';
import { useCallback, useState, useRef, useEffect } from 'react';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CurrencyInput({ value, onChange, placeholder = '0', className = '', disabled }: CurrencyInputProps) {
  const [focused, setFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!focused) {
      setDisplayValue(value > 0 ? value.toLocaleString('en-US') : '');
    }
  }, [value, focused]);

  const handleFocus = useCallback(() => {
    setFocused(true);
    setDisplayValue(value > 0 ? String(value) : '');
  }, [value]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    const num = parseInt(displayValue.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num)) {
      onChange(num);
    } else {
      onChange(0);
    }
  }, [displayValue, onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setDisplayValue(raw);
  }, []);

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
      <Input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`pl-7 tabular-nums ${className}`}
        disabled={disabled}
      />
    </div>
  );
}
