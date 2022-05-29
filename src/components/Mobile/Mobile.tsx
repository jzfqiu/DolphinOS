import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { applications, buildContent, previous, dolphin, app404 } from "../Utils";
import "./Mobile.sass";

export function Mobile() {
	const dispatch = useDispatch();
	const program = useSelector((state: RootState) => {
		if (state.window.windowInFocus !== "") {
			return state.window.windowInFocus;
		} else {
			return "desktop";
		}
	});

	const prevProgram = useSelector((state: RootState) => {
		const windowOrder = state.window.windowsOrder;
		if (windowOrder.length >= 2) {
			return windowOrder[windowOrder.length - 2];
		} else {
			return "desktop";
		}
	});

	const appData = applications.get(program) || app404;

	return (
		<div className="Mobile">
			<div className="MobileHeader">
				{program === "desktop" ? (
					<img className="MobileHeaderClose" src={dolphin} alt={"Logo"} />
				) : (
					<img
						className="MobileHeaderClose"
						src={previous}
						alt={"Back"}
						onClick={() => {
							dispatch({ type: "window/unmount", payload: program });
							// unmounting would set focus to desktop, but we want to go to the last program opened
							dispatch({ type: "window/focus", payload: prevProgram });
						}}
					/>
				)}
				<p>{appData.type === "Folder" ? appData.title : ""}</p>
				<span></span>
			</div>
			<div className="MobileContent">{buildContent(appData, true)}</div>
		</div>
	);
}
