import { ModalType } from "@/types/modal";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  data?: unknown | null;
}

const initialState: ModalState = {
  isOpen: false,
  type: ModalType.NONE,
  data: null,
};

interface OpenModalPayload {
  type: ModalType;
  data?: unknown; // `data` là tùy chọn
}

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<OpenModalPayload>) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.data = action.payload.data || null;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.type = ModalType.NONE;
      state.data = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
