import { createSlice } from "@reduxjs/toolkit";
import { setAddressBar } from "../components/Utils";

type ProcessState = {
    minimized: boolean;
};

const windowSlice = createSlice({
    name: "window",
    initialState: {
        processes: {} as { [pid: string]: ProcessState },
        windowsOrder: [] as string[],
        windowInFocus: "",
    },
    reducers: {
        // Mount a new program or restore a minimized program
        mount: (state, action) => {
            const program = action.payload;
            state.processes[program] = { minimized: false };
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
            setAddressBar(program);
        },

        // Remove program from processes list, destroy its state (size, pos)
        unmount: (state, action) => {
            const program: string = action.payload;
            delete state.processes[program];
            state.windowsOrder = state.windowsOrder.filter(
                (item) => item !== program
            );
            state.windowInFocus = "";
            setAddressBar("");
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
            setAddressBar(program);
        },

        minimize: (state, action) => {
            const program: string = action.payload;
            state.processes[program].minimized = true;
            state.windowInFocus = "";
            setAddressBar("");
        },

        minimizeAll: (state) => {
            for (const program in state.processes) {
                state.processes[program].minimized = true;
            }
            state.windowInFocus = "";
            setAddressBar("");
        },
    },
});

export const { mount, unmount, focus, minimize, minimizeAll } =
    windowSlice.actions;
export default windowSlice.reducer;
