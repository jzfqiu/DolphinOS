import { configureStore } from "@reduxjs/toolkit";
import windowSlice from "./slices/windowSlice";
import iconSlice from "./components/Icon";

const store = configureStore({
    reducer: {
        window: windowSlice,
        icon: iconSlice,
    },
});

export default store;
// https://react-redux.js.org/tutorials/typescript-quick-start
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
