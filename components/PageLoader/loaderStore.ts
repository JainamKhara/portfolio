import { create } from "zustand";

interface LoaderState {
  done: boolean;
}

export const loaderStore = create<LoaderState>(() => ({
  done: false,
}));
