import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { CartItem } from '@/components/CartItem';

const mockBook = {
  id: 'OL123W',
  title: 'Test Book Title',
  authors: ['Author One', 'Author Two'],
  coverUrl: 'http://example.com/cover.jpg',
  description: 'Mock description',
  publishYear: 2020,
  rating: 4.5,
  ratingsCount: 10,
  subjects: ['Fiction'],
  price: 19.99,
};

const mockItem = {
  book: mockBook,
  quantity: 2,
};

describe('CartItem Component', () => {
  const onIncrement = jest.fn();
  const onDecrement = jest.fn();
  const onRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders book information and quantity correctly', async () => {
    await render(
      <CartItem
        item={mockItem}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onRemove={onRemove}
      />
    );

    expect(screen.getByText('Test Book Title')).toBeTruthy();
    expect(screen.getByText('by Author One, Author Two')).toBeTruthy();
    expect(screen.getByText('$19.99')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('calls increment callback when plus button is clicked', async () => {
    await render(
      <CartItem
        item={mockItem}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onRemove={onRemove}
      />
    );

    const plusButton = screen.getByLabelText('Increase quantity');
    fireEvent.press(plusButton);
    expect(onIncrement).toHaveBeenCalledTimes(1);
  });

  it('calls decrement callback when minus button is clicked', async () => {
    await render(
      <CartItem
        item={mockItem}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onRemove={onRemove}
      />
    );

    const minusButton = screen.getByLabelText('Decrease quantity');
    fireEvent.press(minusButton);
    expect(onDecrement).toHaveBeenCalledTimes(1);
  });

  it('calls remove callback when delete cross is clicked', async () => {
    await render(
      <CartItem
        item={mockItem}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onRemove={onRemove}
      />
    );

    const removeButton = screen.getByLabelText('Remove item');
    fireEvent.press(removeButton);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
