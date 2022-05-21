import React, { useState, useRef } from "react";
import { Point, AppData } from "./Utils";
import "../styles/Window.sass";
import { useDispatch } from "react-redux";

// Default window position in px
const DefaultPos = {
	x: 50,
	y: 50,
};

// Default window size in px
const DefaultSize = {
	x: 1000,
	y: 700,
};

type WindowProps = {
	initialPos?: Point;
	initialSize?: Point;
	key: string;
	program: string;
	display: boolean;
	appData: AppData;
	zIndex: number;
	children?: JSX.Element;
};

export default function Window(props: WindowProps) {
	const [size, setSize] = useState(
		props.initialSize ? props.initialSize : DefaultSize
	);
	const [pos, setPos] = useState(
		props.initialPos ? props.initialPos : DefaultPos
	);
	const [maximized, setMaximized] = useState(false);
	const [restore, setRestore] = useState({
		size: { x: 0, y: 0 },
		pos: { x: 0, y: 0 },
	});

	const dispatch = useDispatch();

	const desktopSize = {
		x: window.innerWidth - 2, // 2*2px border
		y: window.innerHeight - 2, // Taskbar height
	};
	const windowRef = useRef(null);

	let cursorPos = { x: 0, y: 0 };

	function handleMouseDown(event: React.MouseEvent<HTMLElement>) {
		// Stops mousedown even from propagating into desktop DOM
		if (
			event.target instanceof Element &&
			event.target.className.includes("WindowTopBar")
		) {
			event.stopPropagation();
			dispatch({ type: "window/focus", payload: props.program });
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
		setRestore({
			// ref.current will never be null because the target window
			// is always mounted when this method is called.
			size: {
				x: (windowRef.current! as HTMLElement).offsetWidth - 4,
				y: (windowRef.current! as HTMLElement).offsetHeight - 4,
			},
			pos: pos,
		});
		setMaximized(true);
		setPos({ x: 0, y: 0 });
		setSize(desktopSize);
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
				zIndex: props.zIndex,
				display: props.display ? "block" : "none",
			}}
			onMouseDown={handleMouseDown}
			ref={windowRef}
		>
			<div className="WindowTopBar">
				<button
					className="WindowTopBarButton WindowClose"
					onClick={() =>
						dispatch({ type: "window/unmount", payload: props.program })
					}
				/>
				<button
					className="WindowTopBarButton WindowMinimize"
					onClick={() =>
						dispatch({ type: "window/minimize", payload: props.program })
					}
				/>
				{maximized ? (
					<button
						className="WindowTopBarButton WindowRestore"
						onClick={restoreWindow}
					/>
				) : (
					<button
						className="WindowTopBarButton WindowMaximize"
						onClick={maximizeWindow}
					/>
				)}

				<div className={"WindowTopBarTitle"}>
					{props.appData.title || "Untitled"}
				</div>
			</div>
			<div className="WindowContent">{props.children}</div>
		</div>
	);
}
