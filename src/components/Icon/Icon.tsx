import React, { useState } from "react";
import { applications, getIcon, Point } from "../Utils";
import "./Icon.sass";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";

type IconProps = {
    program: string;
    initialPos: Point;
};

export function Icon(props: IconProps) {
    
    // Global states
    const dispatch = useDispatch();
    const iconsOrder = useSelector((state: RootState) => state.icon.iconsOrder);
    const iconSelected = useSelector(
        (state: RootState) => state.icon.iconSelected
    );

    // Local states
    const [pos, setPos] = useState(props.initialPos);

    const program = props.program;
    const appData = applications[program];
    const image = getIcon(appData.type);
    let cursorPos = { x: 0, y: 0 };

    function handleMouseDown(event: React.MouseEvent<HTMLElement>) {
        // Stops mousedown even from propagating into desktop DOM
        event.stopPropagation();
        dispatch({ type: "icon/select", payload: program });
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
            className={`icon ${iconSelected === program ? "selected" : ""}`}
            style={{
                left: pos.x + "px",
                top: pos.y + "px",
                zIndex: iconsOrder.indexOf(program),
            }}
            onMouseDown={handleMouseDown}
            onDoubleClick={() =>
                dispatch({ type: "window/mount", payload: props.program })
            }
            data-testid={`icon-${program}`}
        >
            <img
                src={image}
                alt={appData.title}
                draggable={"false"}
                // Firefox specific tweak on draggable img
                onDragStart={(e) => {
                    e.preventDefault();
                }}
            />
            <p>{appData.title}</p>
        </div>
    );
}
