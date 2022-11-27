import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
 user: userReducer,
});

const persistConfig = {
 key: "root",
 storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
 reducer: persistedReducer,
 devTools: process.env.NODE_ENV !== "production",
 middleware: [thunk],
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
