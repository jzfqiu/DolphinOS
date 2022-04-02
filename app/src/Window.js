import React, { Component } from 'react';
import styled from 'styled-components';

// https://styled-components.com/docs/basics#attaching-additional-props
// Props pass through attrs constructor for frequently updated attribute
const StyledWindow = styled.div.attrs(props => ({
    style: {
        width: props.size ? props.size.x + "px" : "200px",
        height: props.size ? props.size.y + "px" : "200px",
        left: props.pos.x + "px",
        top: props.pos.y + "px",
      }
  }))`
  border: 2px solid black;
  position: absolute;
`;


// https://stackoverflow.com/questions/20926551/recommended-way-of-making-react-component-div-draggable
class Window extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pos: {
                x: this.props.initialPos.x, 
                y: this.props.initialPos.y
            },
            size: {
                x: this.props.initialSize.x, 
                y: this.props.initialSize.y
            },
            dragging: false,
            relPos: null, // cursor position when dragging starts
        }
        // This binding is necessary to make `this` work in the callback
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind 
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.stopDragging = this.stopDragging.bind(this)
    }


    handleMouseDown (e) {
        this.setState({
            dragging: true,
            relPos: {
                x: this.state.pos.x - e.clientX, 
                y: this.state.pos.y - e.clientY,
            }
        })
    }

    handleMouseMove (e) {
        if (this.state.dragging) {
            this.setState({pos: {
                    x: e.clientX + this.state.relPos.x,
                    y: e.clientY + this.state.relPos.y
                }
            });
        }
    }

    stopDragging (e) {
        this.setState({
            dragging: false,
            basePos: null
        })
    }


    render() {
        return <StyledWindow 
            onMouseDown={this.handleMouseDown}
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.stopDragging}
            onMouseLeave={this.stopDragging}
            pos = {this.state.pos}
            size = {this.state.size}>
            Hi
            </StyledWindow>;
    }
}

export default Window;
