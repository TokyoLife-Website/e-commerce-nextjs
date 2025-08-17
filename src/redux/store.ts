import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch } from "react-redux";
import userReducer from "./userSlice";
import modalReducer from "./modalSlice";
import { useSelector } from "react-redux";
import { persistStore } from "redux-persist";
import viewedProductReducer from "./viewedProductSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    modal: modalReducer,
    viewedProduct: viewedProductReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppStore = typeof store;
