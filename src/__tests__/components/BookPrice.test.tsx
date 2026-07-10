import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { BookPrice } from '@/components/BookPrice';

describe('BookPrice Component', () => {
  it('renders current price correctly formatted', async () => {
    await render(<BookPrice price={12.99} />);
    expect(screen.getByText('$12.99')).toBeTruthy();
  });

  it('renders discount price and original strike-through price', async () => {
    await render(<BookPrice price={12.99} originalPrice={19.99} />);
    expect(screen.getByText('$12.99')).toBeTruthy();
    expect(screen.getByText('$19.99')).toBeTruthy();
  });

  it('does not render original price if it is lower than current price', async () => {
    await render(<BookPrice price={15.0} originalPrice={10.0} />);
    expect(screen.getByText('$15.00')).toBeTruthy();
    expect(screen.queryByText('$10.00')).toBeNull();
  });
});
