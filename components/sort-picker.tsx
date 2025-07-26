import React from "react";
import { PickerList } from "./ui/picker";

type SortOption = "highest" | "lowest" | "nearest";

interface SortPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (sortBy: SortOption) => void;
}

export const SortPicker: React.FC<SortPickerProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  return (
    <PickerList
      visible={visible}
      title="Sort Expenses"
      subtitle="Choose a sorting option"
      onClose={onClose}
      options={[
        { label: "Highest Expense", value: "highest" },
        { label: "Lowest Expense", value: "lowest" },
        { label: "Next Renewal", value: "nearest" },
      ]}
      onOptionPress={(option) => {
        onSelect(option.value as SortOption);
        onClose();
      }}
    />
  );
};
