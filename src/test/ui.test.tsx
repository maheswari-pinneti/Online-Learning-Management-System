import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

const ThemeTester: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('UI/UX: Design System & Reusable Component Library', () => {
  it('toggles dark and light mode correctly in ThemeContext', () => {
    render(
      <ThemeProvider>
        <ThemeTester />
      </ThemeProvider>
    );

    const themeVal = screen.getByTestId('theme-value');
    const initialTheme = themeVal.textContent;
    expect(initialTheme).toMatch(/light|dark/);

    const toggleBtn = screen.getByRole('button', { name: /Toggle Theme/i });
    act(() => {
      fireEvent.click(toggleBtn);
    });

    const expectedToggled = initialTheme === 'dark' ? 'light' : 'dark';
    expect(screen.getByTestId('theme-value').textContent).toBe(expectedToggled);
  });

  it('renders Button variants, sizes, and handles clicks', () => {
    const handleClick = vi.fn();
    render(
      <div>
        <Button variant="primary" size="md" onClick={handleClick}>
          Primary Action
        </Button>
        <Button variant="outline" size="sm">
          Outline Action
        </Button>
        <Button variant="danger" disabled>
          Disabled Danger
        </Button>
      </div>
    );

    const primaryBtn = screen.getByRole('button', { name: /Primary Action/i });
    expect(primaryBtn).toBeInTheDocument();
    fireEvent.click(primaryBtn);
    expect(handleClick).toHaveBeenCalledTimes(1);

    const disabledBtn = screen.getByRole('button', { name: /Disabled Danger/i });
    expect(disabledBtn).toBeDisabled();
  });

  it('renders Badge with variants and dot indicators', () => {
    render(
      <div>
        <Badge variant="emerald" dot>
          Active Status
        </Badge>
        <Badge variant="rose">Overdue</Badge>
        <Badge variant="purple">Advanced Level</Badge>
      </div>
    );

    expect(screen.getByText(/Active Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Overdue/i)).toBeInTheDocument();
    expect(screen.getByText(/Advanced Level/i)).toBeInTheDocument();
  });

  it('renders accessible Modal and handles open/close callbacks', () => {
    const handleClose = vi.fn();
    const { rerender } = render(
      <Modal isOpen={true} onClose={handleClose} title="UI Confirmation Modal" maxWidth="md">
        <p>Modal body content for testing</p>
      </Modal>
    );

    expect(screen.getByText(/UI Confirmation Modal/i)).toBeInTheDocument();
    expect(screen.getByText(/Modal body content for testing/i)).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    rerender(
      <Modal isOpen={false} onClose={handleClose} title="UI Confirmation Modal">
        <p>Modal body content for testing</p>
      </Modal>
    );
    expect(screen.queryByText(/UI Confirmation Modal/i)).not.toBeInTheDocument();
  });

  it('renders Breadcrumbs navigation correctly with route items', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/courses']}>
        <Breadcrumbs />
      </MemoryRouter>
    );

    expect(screen.getByText(/EduSphere/i)).toBeInTheDocument();
    expect(screen.getByText(/Course Management/i)).toBeInTheDocument();
  });
});
