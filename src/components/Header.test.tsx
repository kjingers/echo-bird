import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/Header';

describe('Header', () => {
  it('renders the app title', () => {
    render(<Header />);
    expect(screen.getByText('Echo Bird')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<Header />);
    expect(screen.getByText('Transform your words into speech')).toBeInTheDocument();
  });

  it('renders the Azure attribution', () => {
    render(<Header />);
    expect(screen.getByText(/Azure Cognitive Services/i)).toBeInTheDocument();
  });

  it('renders the bird logo SVG', () => {
    render(<Header />);
    // Check for SVG element
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
