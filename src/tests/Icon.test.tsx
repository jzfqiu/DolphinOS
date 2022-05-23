import { render, screen } from "./test-utils";
import System from "../components/System";
import React from "react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { applications, FolderAppData } from "../components/Utils";


test("Icon integration tests", async () => {
    const user = userEvent.setup();
    const desktopFiles = (applications.desktop as FolderAppData).files;
    const nIcons = desktopFiles.length;

    // test the first 2 programs
    const p1 = desktopFiles[0];
    const p2 = desktopFiles[1];

    render(<System />);

    // Check if icons are rendered
    const icon1 = screen.getByTestId(`icon-${p1}`);
    const icon2 = screen.getByTestId(`icon-${p2}`);
    expect(icon1).toBeInTheDocument();
    expect(icon2).toBeInTheDocument();

    // Click on icon1, check for style
    expect(icon1).toHaveClass("icon");
    expect(icon1).not.toHaveClass("selected");
    await user.click(icon1);
    expect(icon1).toHaveClass("selected");
    expect(icon1).toHaveStyle({ zIndex: nIcons - 1 });

    // Click on icon2, check for z-index change in icon1
    await user.click(icon2);
    expect(icon2).toHaveStyle({ zIndex: nIcons - 1 });
    expect(icon1).toHaveStyle({ zIndex: nIcons - 2 });

    // Double click on icon to open window
    expect(screen.queryByTestId(`window-${p1}`)).not.toBeInTheDocument();
    await user.dblClick(icon1);
    expect(screen.getByTestId(`window-${p1}`)).toBeInTheDocument();

});
