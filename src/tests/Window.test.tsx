import { render, screen } from "./test-utils";
import System from "../components/System";
import React from "react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
// import { applications, FolderAppData } from "../components/Utils";

test("Window tests", async () => {
    const user = userEvent.setup();

    render(<System openedPrograms={["test", "desktop"]}/>);

    // Check if the windows are rendered
    const test = screen.getByTestId(`window-test`);
    const desktop = screen.getByTestId(`window-desktop`);
    expect(test).toBeInTheDocument();
    expect(desktop).toBeInTheDocument();

    // Check maximize and restore
    // const restoreWidth = test.style.width;
    await user.click(screen.getByTestId("window-maximize-desktop"));
    expect(desktop).toHaveStyle(`width: ${window.innerWidth-2}px`);
    // https://stackoverflow.com/questions/53721999/react-jest-enzyme-how-to-mock-ref-properties/53739669#53739669
    // await user.click(screen.getByTestId("window-restore-test")); 
    // expect(test).toHaveStyle(`width: ${restoreWidth}`);

    // Check minimize and restore
    await user.click(screen.getByTestId("window-minimize-desktop"));
    expect(desktop).not.toBeVisible();
    await user.click(screen.getByTestId("task-desktop"));
    expect(desktop).toBeVisible();
    expect(desktop).toHaveStyle(`width: ${window.innerWidth-2}px`);

    // Close window
    await user.click(screen.getByTestId("window-close-desktop"));
    expect(screen.queryByTestId("window-desktop")).not.toBeInTheDocument();
});
