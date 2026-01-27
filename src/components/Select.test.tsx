import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '@/components/Select';

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('Select', () => {
  it('renders all options', () => {
    render(<Select options={mockOptions} />);
    
    expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 3' })).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Select label="Choose option" options={mockOptions} />);
    expect(screen.getByText('Choose option')).toBeInTheDocument();
  });

  it('renders placeholder when provided', () => {
    render(<Select options={mockOptions} placeholder="Select an option..." />);
    expect(screen.getByRole('option', { name: 'Select an option...' })).toBeInTheDocument();
  });

  it('handles selection change', async () => {
    const user = userEvent.setup();
    render(<Select options={mockOptions} />);
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'option2');
    
    expect(select).toHaveValue('option2');
  });

  it('shows error message when error prop is provided', () => {
    render(<Select options={mockOptions} error="Selection required" />);
    expect(screen.getByText('Selection required')).toBeInTheDocument();
  });

  it('disables select when disabled prop is true', () => {
    render(<Select options={mockOptions} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('disables specific options', () => {
    const optionsWithDisabled = [
      ...mockOptions,
      { value: 'disabled', label: 'Disabled Option', disabled: true },
    ];
    render(<Select options={optionsWithDisabled} />);
    
    expect(screen.getByRole('option', { name: 'Disabled Option' })).toBeDisabled();
  });
});
