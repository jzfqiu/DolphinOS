import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { applications, buildContent } from "./Utils";
import previous from "../assets/icons/previous.png";
import dolphin from "../assets/icons/dolphin.png";
import "../styles/Mobile.sass";

export default function Mobile(props: {}) {
	const dispatch = useDispatch();
	const program = useSelector(
		(state: RootState) => {
            if (state.window.windowInFocus !== "")
                return state.window.windowInFocus
            else
                return "desktop"
        }
	);
    const prevProgram = useSelector(
        (state: RootState) => {
            const windowOrder = state.window.windowsOrder;
            if (windowOrder.length >= 2)
                return windowOrder[windowOrder.length-2]
            else
                return "desktop"
        }
    )

	const appData = applications[program];

	return (
		<div className="Mobile">
			<div className="MobileHeader">
				{program === "desktop" ? (
					// <span className="MobileHeaderClose"></span>
                    <img
                    className="MobileHeaderClose"
						src={dolphin}
						alt={"Logo"}
					/>
				) : (
					<img
                    className="MobileHeaderClose"
						src={previous}
						alt={"Back"}
						onClick={() => {
							dispatch({ type: "window/unmount", payload: program });
							dispatch({ type: "window/focus", payload: prevProgram });
						}}
					/>
				)}
				<p>{appData.type === "Folder" ? appData.title : ""}</p>
                <span></span>
			</div>
            <div className="MobileContent">
            {buildContent(appData, true)}
            </div>
		</div>
	);
}
