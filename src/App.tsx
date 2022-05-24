import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Mobile } from "./components/Mobile";
import { Desktop } from "./components/Desktop";
import { getPaths } from "./components/Utils";

export default function App(props: { openedPrograms?: string[] }) {
	const [width, setWidth] = useState<number>(window.innerWidth);
	const dispatch = useDispatch();

	// Switch between mobile and desktop
	// https://stackoverflow.com/questions/39435395/reactjs-how-to-determine-if-the-application-is-being-viewed-on-mobile-or-deskto
	function handleWindowSizeChange() {
		setWidth(window.innerWidth);
	}
	useEffect(() => {
		window.addEventListener("resize", handleWindowSizeChange);
		return () => {
			window.removeEventListener("resize", handleWindowSizeChange);
		};
	}, []);

	// Open Window loaded through address bar
	useEffect(() => {
		const openedProgram = getPaths().program;
		if (openedProgram !== "")
			dispatch({ type: "window/mount", payload: openedProgram });
	}, [dispatch]);

	// Open programs in props
	useEffect(() => {
		if (props.openedPrograms) {
			props.openedPrograms.forEach((program) => {
				dispatch({ type: "window/mount", payload: program });
			});
		}
	}, [props, dispatch]);

	const isMobile = width <= 768;

	if (isMobile) return <Mobile />;
	else return <Desktop />;
}
