import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { getIcon, applications } from "./Utils";
import cross from "../assets/icons/cross.svg";
import homeIcon from "../assets/icons/house.png";
import "../styles/Taskbar.sass";

export default function Taskbar() {
	const dispatch = useDispatch();
	const windowInFocus = useSelector(
		(state: RootState) => state.window.windowInFocus
	);
	const processes = useSelector((state: RootState) => state.window.processes);

	function buildTask(program: string) {
		const appData = applications[program];
		return (
			<button
				className={program === windowInFocus ? "Task Selected" : "Task"}
				key={program}
				onClick={() => dispatch({ type: "window/mount", payload: program })}
                data-testid={`task-${program}`}
			>
				<img
					className="TaskIcon"
					src={getIcon(appData.type)}
					alt={appData.type}
				></img>
				<p>{appData.title}</p>
				<img
					className="TaskClose"
					src={cross}
					alt={"Close"}
					onClick={(e) => {
						// stop click event from propagating to mount action
						e.stopPropagation();
						dispatch({ type: "window/unmount", payload: program });
					}}
				></img>
			</button>
		);
	}

	let tasks = [];
	for (const program in processes) {
		tasks.push(buildTask(program));
	}

	return (
		<div className="Taskbar">
			<div>
				<button
					className="Task TaskDesktop"
					onClick={() => dispatch({ type: "window/minimizeAll" })}
				>
					<img className="TaskIcon" src={homeIcon} alt={"Desktop"}></img>
					<p>Desktop</p>
				</button>
				{tasks}
			</div>
		</div>
	);
}
