import { render, screen } from "./test-utils";
import System from "../components/System";
import React from "react";
import "@testing-library/jest-dom";
// import userEvent from "@testing-library/user-event";
// import { applications, FolderAppData } from "../components/Utils";

test("Window tests", async () => {
	// const user = userEvent.setup();

	render(<System openedPrograms={["test"]}/>);

	// Check if icons are rendered
	const window = screen.getByTestId(`window-test`);
	expect(window).toBeInTheDocument();

});
