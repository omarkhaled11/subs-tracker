import React from "react";
import { currencies } from "../utils/constants";
import { Currency } from "../utils/types";
import { PickerList } from "./ui/picker";
import { useSubscriptionsStore } from "../utils/store";

interface CurrencyPickerProps {
  visible: boolean;
  onClose: () => void;
}

export const CurrencyPicker: React.FC<CurrencyPickerProps> = ({
  visible,
  onClose,
}) => {
  const updateUser = useSubscriptionsStore((state) => state.updateUser);

  return (
    <PickerList
      visible={visible}
      title="Select Currency"
      subtitle="Choose your preferred currency"
      onClose={onClose}
      options={currencies.map((currency: Currency) => ({
        label: currency,
        value: currency,
      }))}
      onOptionPress={(option) => {
        updateUser({ defaultCurrency: option.value as Currency });
      }}
    />
  );
};
