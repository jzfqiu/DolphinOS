import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { duotoneLight as codeStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./Markdown.sass";
import { FileAppData } from "../Utils";

/**
 * Markdown contents inside of a window
 */
export function Markdown(props: { appData: FileAppData }) {
    const [content, setContent] = useState("");

    useEffect(() => {
        fetch(props.appData.filepath)
            .then((res) => res.text())
            .then(
                (result) => {
                    setContent(result);
                },
                (error) => {
                    setContent("<p>Error fetching content</p>");
                }
            );
    }, [props.appData.filepath]);

    return (
        <div className="Markdown">
            {/* https://github.com/remarkjs/react-markdown#use-custom-components-syntax-highlight */}
            <ReactMarkdown
                children={content}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                            <SyntaxHighlighter
                                children={String(children).replace(/\n$/, "")}
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
                        );
                    },
                }}
            />
        </div>
    );
}
