import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

interface CheckoutFormProps {
  onSubmit: (details: { name: string; email: string; cardNumber: string }) => void;
  loading: boolean;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit, loading }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatCardNumber = (text: string) => {
    // Strip non-digits
    const cleaned = text.replace(/\D/g, '');
    // Insert space every 4 digits
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardNumber(formatted.substring(0, 19)); // Max 16 digits + 3 spaces = 19 chars
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    setExpiry(formatted.substring(0, 5)); // MM/YY
  };

  const formatCvv = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setCvv(cleaned.substring(0, 3)); // Max 3 digits
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const cleanCard = cardNumber.replace(/\s/g, '');
    if (!cleanCard) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cleanCard.length < 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    if (!expiry) {
      newErrors.expiry = 'Required';
    } else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry)) {
      newErrors.expiry = 'Invalid';
    }

    if (!cvv) {
      newErrors.cvv = 'Required';
    } else if (cvv.length < 3) {
      newErrors.cvv = 'Invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (loading) return;
    if (validate()) {
      onSubmit({
        name,
        email,
        cardNumber: cardNumber.replace(/\s/g, ''),
      });
    }
  };

  return (
    <View className="gap-4">
      {/* Name */}
      <View className="gap-1.5">
        <Text className="text-brand-text font-medium text-xs">Cardholder Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Daniel Osariemen"
          placeholderTextColor="#94A3B8"
          className="bg-brand-surface border border-brand-border rounded-2xl px-4 py-3 text-brand-text text-sm shadow-sm"
          autoCorrect={false}
          editable={!loading}
        />
        {errors.name && <Text className="text-brand-accent text-xs mt-0.5">{errors.name}</Text>}
      </View>

      {/* Email */}
      <View className="gap-1.5">
        <Text className="text-brand-text font-medium text-xs">Email Address</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="e.g. daniel@example.com"
          placeholderTextColor="#94A3B8"
          className="bg-brand-surface border border-brand-border rounded-2xl px-4 py-3 text-brand-text text-sm shadow-sm"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
        {errors.email && <Text className="text-brand-accent text-xs mt-0.5">{errors.email}</Text>}
      </View>

      {/* Card Number */}
      <View className="gap-1.5">
        <Text className="text-brand-text font-medium text-xs">Card Number</Text>
        <TextInput
          value={cardNumber}
          onChangeText={formatCardNumber}
          placeholder="4111 2222 3333 4444"
          placeholderTextColor="#94A3B8"
          className="bg-brand-surface border border-brand-border rounded-2xl px-4 py-3 text-brand-text text-sm shadow-sm"
          keyboardType="numeric"
          editable={!loading}
        />
        {errors.cardNumber && <Text className="text-brand-accent text-xs mt-0.5">{errors.cardNumber}</Text>}
      </View>

      {/* Expiry & CVV */}
      <View className="flex-row gap-4">
        {/* Expiry */}
        <View className="flex-1 gap-1.5">
          <Text className="text-brand-text font-medium text-xs">Expiry (MM/YY)</Text>
          <TextInput
            value={expiry}
            onChangeText={formatExpiry}
            placeholder="12/28"
            placeholderTextColor="#64748B"
            className="bg-brand-surface border border-brand-border rounded-2xl px-4 py-3 text-brand-text text-sm shadow-sm"
            keyboardType="numeric"
            editable={!loading}
          />
          {errors.expiry && <Text className="text-brand-accent text-xs mt-0.5">{errors.expiry}</Text>}
        </View>

        {/* CVV */}
        <View className="w-[100px] gap-1.5">
          <Text className="text-brand-text font-medium text-xs">CVV</Text>
          <TextInput
            value={cvv}
            onChangeText={formatCvv}
            placeholder="123"
            placeholderTextColor="#64748B"
            className="bg-brand-surface border border-brand-border rounded-2xl px-4 py-3 text-brand-text text-sm shadow-sm"
            keyboardType="numeric"
            secureTextEntry
            editable={!loading}
          />
          {errors.cvv && <Text className="text-brand-accent text-xs mt-0.5">{errors.cvv}</Text>}
        </View>
      </View>

      {/* Submit Button */}
      <Pressable
        onPress={handleSubmit}
        disabled={loading}
        className={`w-full py-4 rounded-2xl items-center justify-center shadow-md active:opacity-80 transition-all duration-200 mt-4 ${loading ? 'bg-primary/50' : 'bg-primary'
          }`}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text className="text-white font-bold text-sm text-center">
            Pay Securely
          </Text>
        )}
      </Pressable>
    </View>
  );
};
