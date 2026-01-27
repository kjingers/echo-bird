import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LoadingSpinner, VoiceSkeleton } from '@/components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders without crashing', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('has animation elements', () => {
    render(<LoadingSpinner />);
    const spinnerElements = document.querySelectorAll('span');
    expect(spinnerElements.length).toBeGreaterThan(0);
  });
});

describe('VoiceSkeleton', () => {
  it('renders skeleton loaders', () => {
    const { container } = render(<VoiceSkeleton />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders placeholder divs', () => {
    const { container } = render(<VoiceSkeleton />);
    const placeholders = container.querySelectorAll('.h-12');
    expect(placeholders.length).toBe(2);
  });
});
