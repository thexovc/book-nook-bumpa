import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CheckoutForm } from '@/components/CheckoutForm';

describe('CheckoutForm Component', () => {
  const onSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form inputs and submit button', async () => {
    const { getByPlaceholderText, getByText } = await render(
      <CheckoutForm onSubmit={onSubmit} loading={false} />
    );

    expect(getByPlaceholderText('e.g. Daniel Osariemen')).toBeTruthy();
    expect(getByPlaceholderText('e.g. daniel@example.com')).toBeTruthy();
    expect(getByPlaceholderText('4111 2222 3333 4444')).toBeTruthy();
    expect(getByPlaceholderText('12/28')).toBeTruthy();
    expect(getByPlaceholderText('123')).toBeTruthy();
    expect(getByText('Pay Securely')).toBeTruthy();
  });

  it('displays validation errors when fields are empty', async () => {
    const { getByText, getAllByText } = await render(
      <CheckoutForm onSubmit={onSubmit} loading={false} />
    );

    await fireEvent.press(getByText('Pay Securely'));

    await waitFor(() => {
      expect(getByText('Full name is required')).toBeTruthy();
      expect(getByText('Email is required')).toBeTruthy();
      expect(getByText('Card number is required')).toBeTruthy();
      expect(getAllByText('Required')).toHaveLength(2); // Expiry and CVV
    });
    
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('displays error for invalid email structure', async () => {
    const { getByPlaceholderText, getByText } = await render(
      <CheckoutForm onSubmit={onSubmit} loading={false} />
    );

    await fireEvent.changeText(getByPlaceholderText('e.g. daniel@example.com'), 'invalidemail');
    await fireEvent.press(getByText('Pay Securely'));

    await waitFor(() => {
      expect(getByText('Please enter a valid email address')).toBeTruthy();
    });
    
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with sanitized details when inputs are valid', async () => {
    const { getByPlaceholderText, getByText } = await render(
      <CheckoutForm onSubmit={onSubmit} loading={false} />
    );

    await fireEvent.changeText(getByPlaceholderText('e.g. Daniel Osariemen'), 'Daniel O.');
    await fireEvent.changeText(getByPlaceholderText('e.g. daniel@example.com'), 'daniel@example.com');
    await fireEvent.changeText(getByPlaceholderText('4111 2222 3333 4444'), '4111 2222 3333 4444');
    await fireEvent.changeText(getByPlaceholderText('12/28'), '12/28');
    await fireEvent.changeText(getByPlaceholderText('123'), '123');

    await fireEvent.press(getByText('Pay Securely'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Daniel O.',
        email: 'daniel@example.com',
        cardNumber: '4111222233334444',
      });
    });
  });
});
