import { createSlice } from "@reduxjs/toolkit";
import { applications, FolderAppData } from "../components/Utils";

const iconSlice = createSlice({
	name: "icon",
	initialState: {
		iconsOrder: (applications.desktop as FolderAppData).files,
		iconSelected: "",
	},
	reducers: {
		// select an icon and send it to front
		select: (state, action) => {
			const program: string = action.payload;
			state.iconsOrder = state.iconsOrder.filter((item) => item !== program);
			state.iconsOrder.push(program);
			state.iconSelected = program;
		},

		deselect: (state) => {
			state.iconSelected = "";
		},
	},
});

export const { select } = iconSlice.actions;
export default iconSlice.reducer;
