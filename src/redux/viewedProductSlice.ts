import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { DiscountType } from "@/types/discountType";

export interface ViewedProduct {
  id: string | number;
  name: string;
  image: string;
  slug: string;
  price: number;
  discountType: DiscountType;
  discountValue: number;
  finalPrice: number;
}

export interface ViewedProductState {
  viewedProducts: ViewedProduct[];
}

const initialState: ViewedProductState = {
  viewedProducts: [],
};

const viewedProductSlice = createSlice({
  name: "viewedProduct",
  initialState,
  reducers: {
    addViewedProduct: (state, action: PayloadAction<ViewedProduct>) => {
      const newProduct = action.payload;

      const existingIndex = state.viewedProducts.findIndex(
        (product) => product.id === newProduct.id
      );

      if (existingIndex !== -1) {
        state.viewedProducts.splice(existingIndex, 1);
      }

      state.viewedProducts.unshift(newProduct);

      if (state.viewedProducts.length > 10) {
        state.viewedProducts = state.viewedProducts.slice(0, 10);
      }
    },
  },
});

const persistConfig = {
  key: "viewedProduct",
  storage,
  whitelist: ["viewedProducts"],
};

export const { addViewedProduct } = viewedProductSlice.actions;

export default persistReducer(persistConfig, viewedProductSlice.reducer);
