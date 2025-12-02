import { useState } from "react";

interface DialogState<T> {
  open: boolean;
  data: T | null;
}

export const useDialogState = <T = any>() => {
  const [state, setState] = useState<DialogState<T>>({
    open: false,
    data: null,
  });

  const openDialog = (data?: T) => {
    setState({ open: true, data: data ?? null });
  };

  const closeDialog = () => {
    setState({ open: false, data: null });
  };

  return {
    isOpen: state.open,
    data: state.data,
    openDialog,
    closeDialog,
  };
};
