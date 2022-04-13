import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";

const StyledMarkdown = styled.div`
	padding: 10px;
	max-width: 1000px;
	margin: auto;
`;

/**
 * Markdown contents inside of a window
 * @param {Object} appData: data about the file
 */
export default class Markdown extends Component {
	constructor(props) {
		super(props);
		this.state = {
			content: "",
		};
	}

	// https://reactjs.org/docs/faq-ajax.html
	componentDidMount() {
		fetch(this.props.appData.filepath)
			.then((res) => res.text())
			.then(
				(result) => {
					this.setState({ content: result });
				},
				(error) => {
					this.setState({ content: error });
				}
			);
	}

	render() {
		return (
			<StyledMarkdown>
				<ReactMarkdown>{this.state.content}</ReactMarkdown>
			</StyledMarkdown>
		);
	}
}
