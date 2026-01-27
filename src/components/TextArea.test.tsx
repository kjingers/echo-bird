import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextArea } from '@/components/TextArea';

describe('TextArea', () => {
  it('renders with placeholder', () => {
    render(<TextArea placeholder="Enter text..." />);
    expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<TextArea label="Description" />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('handles text input', async () => {
    const user = userEvent.setup();
    render(<TextArea placeholder="Type here" />);
    
    const textarea = screen.getByPlaceholderText('Type here');
    await user.type(textarea, 'Hello world');
    
    expect(textarea).toHaveValue('Hello world');
  });

  it('shows character count when maxChars is provided', () => {
    render(<TextArea charCount={10} maxChars={100} />);
    expect(screen.getByText('10 / 100')).toBeInTheDocument();
  });

  it('shows error message when error prop is provided', () => {
    render(<TextArea error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    render(<TextArea error="Error" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-red-500/50');
  });
});
