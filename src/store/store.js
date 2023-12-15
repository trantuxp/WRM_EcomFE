import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartSliceReducer from "./shopping-cart/cartSlice";
import cartUiSliceReducer from "./shopping-cart/cartUiSlice";
import userReducer from "./shopping-cart/userSlide";
import productReducer from "./shopping-cart/productSlide";
import orderReducer from "./shopping-cart/orderSlide";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["product", "user"],
};

const rootReducer = combineReducers({
  product: productReducer,
  user: userReducer,
  order: orderReducer,
  cart: cartSliceReducer,
  cartUi: cartUiSliceReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);
