import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { SearchBar } from '@/components/SearchBar';
import { useSearchStore } from '@/store/search-store';

describe('SearchBar Component', () => {
  beforeEach(() => {
    useSearchStore.getState().clearFilters();
  });

  it('renders correctly with placeholder', async () => {
    await render(<SearchBar />);
    expect(screen.getByPlaceholderText('Search for books, authors, genres...')).toBeTruthy();
  });

  it('debounces user input before updating global search query store', async () => {
    await render(<SearchBar />);

    const input = screen.getByPlaceholderText('Search for books, authors, genres...');
    fireEvent.changeText(input, 'Tolstoy');

    // Store should not update immediately — debounce hasn't fired yet
    expect(useSearchStore.getState().query).toBe('');

    // Wait for the 300ms debounce to flush naturally
    await waitFor(
      () => expect(useSearchStore.getState().query).toBe('Tolstoy'),
      { timeout: 1000 }
    );
  });

  it('clears input text and updates global search store when clear button is pressed', async () => {
    await render(<SearchBar />);

    const input = screen.getByPlaceholderText('Search for books, authors, genres...');

    fireEvent.changeText(input, 'George');

    // Wait for debounce to commit 'George' to the store
    await waitFor(
      () => expect(useSearchStore.getState().query).toBe('George'),
      { timeout: 1000 }
    );

    const clearBtn = screen.getByLabelText('Clear search');
    fireEvent.press(clearBtn);

    await waitFor(() => {
      expect(input.props.value).toBe('');
      expect(useSearchStore.getState().query).toBe('');
    });
  });
});
