import React, { useState } from "react";
import { AppData, getIcon, Point } from "./Utils";
import "../styles/Icon.sass";

type IconProps = {
	initialPos: Point;
	appData: AppData;
	zIndex: number;
	active: boolean;
	sendToFrontCallback: () => void; // program parameter bound in System component
	doubleClickCallback: () => void;
};

export default function Icon(props: IconProps) {
	const [pos, setPos] = useState(props.initialPos);

	const image = getIcon(props.appData.type);
	let cursorPos = { x: 0, y: 0 };

	function handleMouseDown(event: React.MouseEvent<HTMLElement>) {
		// Stops mousedown even from propagating into desktop DOM
		event.stopPropagation();
		props.sendToFrontCallback();
		cursorPos = {
			x: event.clientX - pos.x,
			y: event.clientY - pos.y,
		};
		// https://stackoverflow.com/questions/10444077/javascript-removeeventlistener-not-working
		document.addEventListener("mousemove", dragStart);
		document.addEventListener("mouseup", dragEnd);
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

	return (
		<div
			className={`icon ${props.active ? "active" : ""}`}
			style={{
				left: pos.x + "px",
				top: pos.y + "px",
				zIndex: props.zIndex,
			}}
			onMouseDown={handleMouseDown}
			onDoubleClick={props.doubleClickCallback}
			// ref={this.ref}
		>
			<img
				src={image}
				alt={props.appData.title}
				draggable={"false"}
				// Firefox specific tweak on draggable img
				onDragStart={(e) => {
					e.preventDefault();
				}}
			/>
			<p>{props.appData.title}</p>
		</div>
	);
}
