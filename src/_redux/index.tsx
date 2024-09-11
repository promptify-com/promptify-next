"use client";
import { ReactNode } from "react";
import { Provider, TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
// Store
import { AppDispatch, store } from "./store";
import { RootState } from "./reducers";

export default function ReduxProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
