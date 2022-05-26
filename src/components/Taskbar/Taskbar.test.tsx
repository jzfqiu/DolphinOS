import { render, screen } from "../../tests/test-utils";
import React from "react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import App from "../../App";
import { Taskbar } from "./Taskbar";

describe('Taskbar', ()=>{
    const user = userEvent.setup();
    
    it("renders", () => {
        render(<Taskbar/>);
        expect(screen.getByTestId("taskbar")).toBeInTheDocument();
    })
    
    it("contains desktop", () => {
        render(<Taskbar/>);
        expect(screen.getByText("Desktop")).toBeInTheDocument();
    })

    it("can minimize all windows", async () => {
        render(<App openedPrograms={["test", "readme"]}/>);
        const test = screen.getByTestId(`window-test`);
        const desktop = screen.getByTestId(`window-readme`);
        expect(test).toBeInTheDocument();
        expect(desktop).toBeInTheDocument();
        await user.click(screen.getByTestId("task-desktop"));
        expect(test).not.toBeVisible();
        expect(desktop).not.toBeVisible();
    })

    it("changes style when hover", ()=>{
        // TODO
        render(<Taskbar/>);
        expect(screen.getByText("Desktop")).toBeInTheDocument();
    })
})