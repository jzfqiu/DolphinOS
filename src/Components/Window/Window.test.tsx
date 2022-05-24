import { render, screen } from "../../tests/test-utils";
import React from "react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import App from "../../App";
// import { applications, FolderAppData } from "../components/Utils";

describe('Window', ()=>{
    const user = userEvent.setup();
    
    it("renders", () => {
        render(<App openedPrograms={["test", "desktop"]}/>);
        const test = screen.getByTestId(`window-test`);
        const desktop = screen.getByTestId(`window-desktop`);
        expect(test).toBeInTheDocument();
        expect(desktop).toBeInTheDocument();
    })
    
    it("can be maximized", async () => {
        render(<App openedPrograms={["test"]}/>);
        await user.click(screen.getByTestId("window-maximize-test"));
        expect(screen.getByTestId(`window-test`)).toHaveStyle(`width: ${window.innerWidth-2}px`);
    })
    
    it("can be minimized", async () => {
        render(<App openedPrograms={["test"]}/>);
        const test = screen.getByTestId(`window-test`);
        await user.click(screen.getByTestId("window-minimize-test"));
        expect(test).not.toBeVisible();
        await user.click(screen.getByTestId("task-test"));
        expect(test).toBeVisible();
        // TODO: configure test to allow ref
        // https://stackoverflow.com/questions/53721999/react-jest-enzyme-how-to-mock-ref-properties/53739669#53739669
        // expect(desktop).toHaveStyle(`width: ${window.innerWidth-2}px`);
    })

    it("can be closed", async () => {
        render(<App openedPrograms={["test"]}/>);
        const test = screen.getByTestId(`window-test`);
        expect(test).toBeVisible();
        await user.click(screen.getByTestId("window-close-test"));
        expect(screen.queryByTestId("window-test")).not.toBeInTheDocument();
    })
})