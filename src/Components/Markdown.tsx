import React, { Component, CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import { duotoneLight as codeStyle } from 'react-syntax-highlighter/dist/esm/styles/prism'
import "../styles/Markdown.sass"
import { FileAppData } from "./Utils";

type MarkdownProps = {
	appData: FileAppData,
}

type MarkdownState = {
	content: string,
}

/**
 * Markdown contents inside of a window
 */
export default class Markdown extends Component<MarkdownProps, MarkdownState> {
	constructor(props: MarkdownProps) {
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
			<div className="Markdown">
				{/* <ReactMarkdown>{this.state.content}</ReactMarkdown>*/}
				<ReactMarkdown
				children={this.state.content}
				components={{
				code({node, inline, className, children, ...props}) {
					const match = /language-(\w+)/.exec(className || '')
					return !inline && match ? (
					<SyntaxHighlighter
						children={String(children).replace(/\n$/, '')}
						// Ongoing issue with typed react-syntax-highlighter
						// https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/439
						style={codeStyle as any}
						language={match[1]}
						PreTag="div"
						{...props}
					/>
					) : (
					<code className={className} {...props}>
						{children}
					</code>
					)
				}
				}}
			/>
			</div>
		);
	}
}
