import React, { useState, useRef } from "react";
import { app404, applications } from "../Utils";
import "./Window.sass";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";

// Default window size in px
const DefaultSize = {
	x: Math.min(window.innerWidth * 0.8, 1200),
	y: window.innerHeight * 0.8,
};

const DefaultPos = {
	x: window.innerWidth * 0.1,
	y: 40,
};

const DesktopSize = {
	x: window.innerWidth - 2, // 2*2px border
	y: window.innerHeight - 2, 
};

type WindowProps = {
	key: string;
	program: string;
	children?: JSX.Element;
};

export function Window(props: WindowProps) {
	const program = props.program;
	// get indexed appData; default 404 if program does not exist
	const appData = applications.get(program) || app404;

	// Global States
	const dispatch = useDispatch();
	const programState = useSelector(
		(state: RootState) => state.window.processes[program]
	);
	const windowsOrder = useSelector(
		(state: RootState) => state.window.windowsOrder
	);

	// Local States: window size, position, maximized, restored size
	const windowRef = useRef(null);
	const nProcesses = windowsOrder.length;
	const [maximized, setMaximized] = useState(false);
	const [pos, setPos] = useState(
		appData.initialPos
			? appData.initialPos
			: { x: DefaultPos.x + nProcesses * 20, y: DefaultPos.y + nProcesses * 20 }
	);
	const [size, setSize] = useState(
		appData.initialSize ? appData.initialSize : DefaultSize
	);
	const [restore, setRestore] = useState({
		size: { x: 0, y: 0 },
		pos: { x: 0, y: 0 },
	});

	let cursorPos = { x: 0, y: 0 };

	function handleMouseDown(event: React.MouseEvent<HTMLElement>) {
		// Stops mousedown even from propagating into desktop DOM
		if (
			event.target instanceof Element &&
			event.target.className.includes("WindowTopBar")
		) {
			event.stopPropagation();
			dispatch({ type: "window/focus", payload: program });
			cursorPos = {
				x: event.clientX - pos.x,
				y: event.clientY - pos.y,
			};
			// https://stackoverflow.com/questions/10444077/javascript-removeeventlistener-not-working
			document.addEventListener("mousemove", dragStart);
			document.addEventListener("mouseup", dragEnd);
		}
	}

	function dragStart(event: MouseEvent) {
		const newX = event.clientX - cursorPos.x;
		const newY = event.clientY - cursorPos.y;
		const newPos = { x: newX, y: newY };
		if (newPos !== pos) {
			setPos(newPos);
		}
	}

	function dragEnd() {
		document.removeEventListener("mousemove", dragStart);
		document.removeEventListener("mouseup", dragEnd);
	}

	// Make window fill the page
	function maximizeWindow() {
        // ref.current will never be null because the target window
		// is always mounted when this method is called.
        const restoreSize = {
            x: (windowRef.current! as HTMLElement).offsetWidth - 4,
            y: (windowRef.current! as HTMLElement).offsetHeight - 4,
        }
		setRestore({
			size: restoreSize,
			pos: pos,
		});
		setMaximized(true);
		setPos({ x: 0, y: 0 });
		setSize(DesktopSize);
	}

	// Restore to size before maximizing
	function restoreWindow() {
		setMaximized(false);
		setSize(restore.size);
		setPos(restore.pos);
	}

	return (
		<div
			className="Window"
			style={{
				left: pos.x + "px",
				top: pos.y + "px",
				width: size.x + "px",
				height: size.y + "px",
				zIndex: windowsOrder.indexOf(program) + 100,
				display: programState.minimized ? "none" : "block",
			}}
			onMouseDown={handleMouseDown}
			ref={windowRef}
			data-testid={`window-${program}`}
		>
			<div className="WindowTopBar">
				<button
					className="WindowTopBarButton WindowClose"
					onClick={() => dispatch({ type: "window/unmount", payload: program })}
					data-testid={`window-close-${program}`}
				/>
				<button
					className="WindowTopBarButton WindowMinimize"
					onClick={() =>
						dispatch({ type: "window/minimize", payload: program })
					}
					data-testid={`window-minimize-${program}`}
				/>
				{maximized ? (
					<button
						className="WindowTopBarButton WindowRestore"
						onClick={restoreWindow}
						data-testid={`window-restore-${program}`}
					/>
				) : (
					<button
						className="WindowTopBarButton WindowMaximize"
						onClick={maximizeWindow}
						data-testid={`window-maximize-${program}`}
					/>
				)}
				<div className={"WindowTopBarTitle"}>{appData.title}</div>
			</div>
			<div className="WindowContent">{props.children}</div>
		</div>
	);
}
