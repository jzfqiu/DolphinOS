import React, { useEffect, useState } from "react";
import { FileAppData } from "../Utils";

type BrowserProps = {
    appData: FileAppData;
};


export function Browser(props: BrowserProps) {
    const [content, setContent] = useState("");

    useEffect(() => {
        fetch(props.appData.filepath)
            .then((res) => res.text())
            .then(
                (result) => {
                    setContent(result);
                },
                (error) => {
                    console.log(error);
                    setContent("<p>Error fetching content</p>");
                }
            );
            
    }, [props.appData.filepath]);
    // https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects
    
    return (
        <div
            className="Browser"
            dangerouslySetInnerHTML={{ __html: content }}
        ></div>
    );
}
