import { createSlice } from "@reduxjs/toolkit";
import { applications, updateAddressBar, getPaths } from "../components/Utils";

type ProcessState = {
	minimized: boolean;
};

const windowSlice = createSlice({
	name: "window",
	initialState: {
		processes: {} as { [pid: string]: ProcessState },
		windowsOrder: [] as string[],
		windowInFocus: "",
		// iconsOrder: (applications.desktop as FolderAppData).files,
		// iconSelected: ""
	},
	reducers: {
		// Mount a new program or restore a minimized program
		mount: (state, action) => {
			const program = action.payload;
			// if program is a link, open it in a new tab in the browser
			if (applications[program].type === "Link") {
				// window
				// 	.open((applications[program] as LinkAppData).url, "_blank")
				// 	?.focus();
				return;
			}
			state.processes[program] = { minimized: false };
			state.windowInFocus = program;
			if (!state.windowsOrder.includes(program)) {
				// if program was not rendered, just add it to the end of list
				state.windowsOrder.push(program);
			} else {
				// if program is already rendered, remove the program from windowsOrder,
				// then push to last (highest z-index)
				state.windowsOrder = state.windowsOrder.filter(
					(item) => item !== program
				);
			}
		},

		// Remove program from processes list, destroy its state (size, pos)
		unmount: (state, action) => {
			const program: string = action.payload;
			delete state.processes[program];
			state.windowsOrder = state.windowsOrder.filter(
				(item) => item !== program
			);
			state.windowInFocus = "";
			updateAddressBar(getPaths().baseUrl);
		},

		// Focus in on a program by updating windowsOrder
		focus: (state, action) => {
			const program: string = action.payload;
			if (!state.windowsOrder.includes(program)) {
				// if program was not rendered, just add it to the end of list
				state.windowsOrder.push(program);
			} else {
				// if program is already rendered, remove the program from windowsOrder,
				// then push to last (highest z-index)
				state.windowsOrder = state.windowsOrder.filter(
					(item) => item !== program
				);
				state.windowsOrder.push(program);
			}
			state.windowInFocus = program;
			updateAddressBar(getPaths().baseUrl + "/" + program);
		},

		minimize: (state, action) => {
			const program: string = action.payload;
			state.processes[program].minimized = true;
			state.windowInFocus = "";
		},

		minimizeAll: (state) => {
			for (const program in state.processes) {
				state.processes[program].minimized = true;
			}
			state.windowInFocus = "";
		},
	},
});

export const { mount, unmount, focus, minimize, minimizeAll } =
	windowSlice.actions;
export default windowSlice.reducer;
