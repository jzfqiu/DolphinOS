import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { getIcon, applications, homeIcon, cross } from "../Utils";
import "./Taskbar.sass";

export function Taskbar() {
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
	for (const program of Object.keys(processes)) {
		tasks.push(buildTask(program));
	}

	return (
		<div className="Taskbar" data-testid="taskbar">
			<div>
				<button
					className="Task TaskDesktop"
					onClick={() => dispatch({ type: "window/minimizeAll" })}
					data-testid="task-desktop"
				>
					<img className="TaskIcon" src={homeIcon} alt={"Desktop"}></img>
					<p>Desktop</p>
				</button>
				{tasks}
			</div>
		</div>
	);
}
