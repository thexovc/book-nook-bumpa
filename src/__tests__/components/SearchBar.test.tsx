import React from 'react';
import { render, fireEvent, act, screen, waitFor } from '@testing-library/react-native';
import { SearchBar } from '@/components/SearchBar';
import { useSearchStore } from '@/store/search-store';

describe('SearchBar Component', () => {
  beforeEach(() => {
    useSearchStore.getState().clearFilters();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly with placeholder', async () => {
    await render(<SearchBar />);
    expect(screen.getByPlaceholderText('Search for books, authors, genres...')).toBeTruthy();
  });

  it('debounces user input before updating global search query store', async () => {
    await render(<SearchBar />);
    
    const input = screen.getByPlaceholderText('Search for books, authors, genres...');
    fireEvent.changeText(input, 'Tolstoy');

    expect(useSearchStore.getState().query).toBe('');

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(useSearchStore.getState().query).toBe('Tolstoy');
    });
  });

  it('clears input text and updates global search store when clear button is pressed', async () => {
    await render(<SearchBar />);
    
    const input = screen.getByPlaceholderText('Search for books, authors, genres...');
    
    fireEvent.changeText(input, 'George');
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(useSearchStore.getState().query).toBe('George');

    const clearBtn = screen.getByLabelText('Clear search');
    fireEvent.press(clearBtn);

    await waitFor(() => {
      expect(input.props.value).toBe('');
      expect(useSearchStore.getState().query).toBe('');
    });
  });
});
