import { create } from "zustand";

interface ConfirmationDialogState {
  // State
  visible: boolean;
  title: string;
  subtitle?: string;
  cancelText: string;
  confirmText: string;
  destructive: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;

  // Actions
  showConfirmDialog: (options: {
    title: string;
    subtitle?: string;
    cancelText?: string;
    confirmText?: string;
    destructive?: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
  }) => void;
  hideConfirmDialog: () => void;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export const useConfirmationDialogStore = create<ConfirmationDialogState>((set, get) => ({
  // Initial state
  visible: false,
  title: "",
  subtitle: undefined,
  cancelText: "Cancel",
  confirmText: "Confirm",
  destructive: false,
  onConfirm: undefined,
  onCancel: undefined,

  // Show dialog with options
  showConfirmDialog: (options) => {
    set({
      visible: true,
      title: options.title,
      subtitle: options.subtitle,
      cancelText: options.cancelText || "Cancel",
      confirmText: options.confirmText || "Confirm",
      destructive: options.destructive || false,
      onConfirm: options.onConfirm,
      onCancel: options.onCancel,
    });
  },

  // Hide dialog and reset state
  hideConfirmDialog: () => {
    set({
      visible: false,
      title: "",
      subtitle: undefined,
      cancelText: "Cancel",
      confirmText: "Confirm",
      destructive: false,
      onConfirm: undefined,
      onCancel: undefined,
    });
  },

  // Handle confirm button press
  handleConfirm: () => {
    const { onConfirm } = get();
    onConfirm?.();
    get().hideConfirmDialog();
  },

  // Handle cancel button press
  handleCancel: () => {
    const { onCancel } = get();
    onCancel?.();
    get().hideConfirmDialog();
  },
}));