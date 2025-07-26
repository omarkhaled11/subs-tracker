import React from "react";
import { reminderOptions } from "../utils/constants";
import { PickerList } from "./ui/picker";
import { useSubscriptionsStore } from "../utils/store";

interface ReminderTimePickerProps {
  visible: boolean;
  onClose: () => void;
}

export const ReminderTimePicker: React.FC<ReminderTimePickerProps> = ({
  visible,
  onClose,
}) => {
  const updateUser = useSubscriptionsStore((state) => state.updateUser);

  return (
    <PickerList
      visible={visible}
      title="Reminder Days"
      subtitle="How many days before renewal?"
      onClose={onClose}
      options={reminderOptions.map((days) => ({
        label: `${days} day${days > 1 ? "s" : ""}`,
        value: days,
      }))}
      onOptionPress={(option) => {
        updateUser({ reminderDays: option.value as number });
      }}
    />
  );
};
