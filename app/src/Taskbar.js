import { Component } from "react";
import styled from "styled-components";


const StyledTaskbar = styled.div`
    height: 40px;
    width: 100%;
    border-top: 2px solid black;
    background-color: white;
    position: absolute;
`


export default class Taskbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePrograms: [],
			windowsOrder: [],
		};
	}

    render () {
        return <StyledTaskbar></StyledTaskbar>
    }
}