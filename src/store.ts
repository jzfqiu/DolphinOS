import { configureStore } from "@reduxjs/toolkit";
import systemSlice from "./slices/systemSlice";

const store = configureStore({
	reducer: {
		system: systemSlice,
	},
});

export default store;
// https://react-redux.js.org/tutorials/typescript-quick-start
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
