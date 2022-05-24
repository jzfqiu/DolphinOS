import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { applications, buildContent } from "./Utils";
import previous from "../assets/icons/previous.png";
import dolphin from "../assets/icons/dolphin.png";
import "../styles/Mobile.sass";

export default function Mobile(props: {}) {
	const dispatch = useDispatch();
	const windowInFocus = useSelector(
		(state: RootState) => state.window.windowInFocus
	);

	let program = windowInFocus;
	if (program === "") program = "desktop";

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
