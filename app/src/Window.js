import React, { Component } from "react";
import styled from "styled-components";

/*

Resizable & draggable component using React and Styled-Components

*/



// Default window position in px
const DefaultPos = {
	x: 100,
	y: 100,
};

// Default window size in px
const DefaultSize = {
	x: 400,
	y: 300,
};

// Size of resize corner
const DraggableCornerSize = {
	x: 20,
	y: 20,
};

// https://styled-components.com/docs/basics#attaching-additional-props
// Props pass through attrs constructor for frequently updated attribute
const StyledWindow = styled.div.attrs((props) => ({
	style: {
		width: props.size.x + "px",
		height: props.size.y + "px",
		left: props.pos.x + "px",
		top: props.pos.y + "px",
		cursor: props.resizable ? "nwse-resize" : "auto",
	},
}))`
	min-width: 200px;
	min-height: 100px;
	border: 2px solid black;
	position: absolute;
`;

const StyledWindowContent = styled.div`
	top: 28px;
	width: 100%;
	height: calc(100% - 30px);
	border-top: 2px solid black;
	position: absolute;
`;

const StyledWindowTopBar = styled.div`
	height: 28px;
	width: 100%;
	position: absolute;
	display: flex;
	flex-direction: row;
`;

const StyledWindowTopBarTitle = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const StyledWindowTopBarButton = styled.button`
	height: 100%;
	width: 28px;
`;


export default class Window extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pos: {
				x: this.props.initialPos ? this.props.initialPos.x : DefaultPos.x,
				y: this.props.initialPos ? this.props.initialPos.y : DefaultPos.y,
			},
			size: {
				x: this.props.initialSize ? this.props.initialSize.x : DefaultSize.x,
				y: this.props.initialSize ? this.props.initialSize.y : DefaultSize.y,
			},
			dragging: false,
			resizable: false,
			resizing: false,
		};
		// cursor position when dragging starts, updated when cursor move within component 
		this.cursorPos = null; 
		// This binding is necessary to make `this` work in the callback
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.outOfFrame = this.outOfFrame.bind(this);
	}

	isResizable() {
		return (
			this.cursorPos &&
			this.cursorPos.x > this.state.size.x - DraggableCornerSize.x &&
			this.cursorPos.y > this.state.size.y - DraggableCornerSize.y
		);
	}


	handleMouseMove(event) {

		// set resizable state here because we may need to update cursor style
		this.setState({ resizable: this.isResizable() });

		// if window is currently being dragged, update pos
		if (this.state.dragging){
			this.setState({
				pos: {
					x: event.clientX - this.cursorPos.x,
					y: event.clientY - this.cursorPos.y,
				},
			});
		}
		// if window is currently being resized, update size
		else if (this.state.resizing) {
			// margin in case cursor move too fast for update to catch up
			const resizeMargin = 3;
			this.setState({
				size: {
					x: Math.max(event.clientX - this.state.pos.x + resizeMargin, 100), 
					y: Math.max(event.clientY - this.state.pos.y + resizeMargin, 100)
				},
			});
		}
		// if window is not being dragged, only update cursorPos
		else {
			this.cursorPos = {
				x: event.clientX - this.state.pos.x,
				y: event.clientY - this.state.pos.y,
			};
		}
	}

	handleMouseDown(event) {
		this.setState({
			resizing: this.state.resizable,
			dragging: event.target.className.includes("DragArea"),
		});
	}

	outOfFrame(event) {
		this.setState({
			resizable: false,
			resizing: false,
			dragging: false,
			relPos: null,
		});
	}

	render() {
		return (
			<StyledWindow
				onMouseDown={this.handleMouseDown}
				onMouseMove={this.handleMouseMove}
				onMouseUp={this.outOfFrame}
				onMouseLeave={this.outOfFrame}
				pos={this.state.pos}
				size={this.state.size}
				resizable={this.state.resizable}
			>
				<StyledWindowTopBar>
					<StyledWindowTopBarTitle className={"DragArea"}>Title</StyledWindowTopBarTitle>
					<StyledWindowTopBarButton>-</StyledWindowTopBarButton>
					<StyledWindowTopBarButton>O</StyledWindowTopBarButton>
					<StyledWindowTopBarButton>X</StyledWindowTopBarButton>
				</StyledWindowTopBar>
				<StyledWindowContent>Hi</StyledWindowContent>
			</StyledWindow>
		);
	}
}

