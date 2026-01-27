import { describe, it, expect } from 'vitest';
import { cn, formatDuration, truncateText, getStyleDisplayName } from '@/utils';

describe('cn', () => {
  it('merges class names correctly', () => {
    const result = cn('foo', 'bar');
    expect(result).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    const include = true;
    const exclude = false;
    const result = cn('base', include && 'included', exclude && 'excluded');
    expect(result).toBe('base included');
  });

  it('merges tailwind classes correctly', () => {
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toBe('py-1 px-4');
  });
});

describe('formatDuration', () => {
  it('formats zero correctly', () => {
    expect(formatDuration(0)).toBe('0:00');
  });

  it('formats seconds correctly', () => {
    expect(formatDuration(5000)).toBe('0:05');
    expect(formatDuration(45000)).toBe('0:45');
  });

  it('formats minutes correctly', () => {
    expect(formatDuration(60000)).toBe('1:00');
    expect(formatDuration(90000)).toBe('1:30');
    expect(formatDuration(125000)).toBe('2:05');
  });
});

describe('truncateText', () => {
  it('returns short text unchanged', () => {
    expect(truncateText('hello', 10)).toBe('hello');
  });

  it('truncates long text with ellipsis', () => {
    expect(truncateText('hello world', 8)).toBe('hello...');
  });

  it('uses default max length of 50', () => {
    const longText = 'a'.repeat(60);
    const result = truncateText(longText);
    expect(result).toHaveLength(50);
    expect(result.endsWith('...')).toBe(true);
  });
});

describe('getStyleDisplayName', () => {
  it('returns known style display names', () => {
    expect(getStyleDisplayName('cheerful')).toBe('Cheerful');
    expect(getStyleDisplayName('sad')).toBe('Sad');
    expect(getStyleDisplayName('newscast')).toBe('Newscast');
  });

  it('capitalizes unknown styles', () => {
    expect(getStyleDisplayName('unknownstyle')).toBe('Unknownstyle');
  });

  it('handles hyphenated styles', () => {
    expect(getStyleDisplayName('some-new-style')).toBe('Some new style');
  });
});
