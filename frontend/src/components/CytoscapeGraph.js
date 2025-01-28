
// import React, { useEffect, useRef } from "react";
// import cytoscape from "cytoscape";
// import dagre from "cytoscape-dagre";

// cytoscape.use(dagre);

// const CytoscapeGraph = ({ elements }) => {
//     const cyRef = useRef(null);

//     useEffect(() => {
//         if (cyRef.current) {
//             cyRef.current.destroy();
//         }

//         cyRef.current = cytoscape({
//             container: document.getElementById("cy"),
//             elements,
//             style: [
//                 {
//                     selector: "node",
//                     style: {
//                         "background-color": "#007bff",
//                         "label": "data(label)",
//                         "text-valign": "center",
//                         "color": "white",
//                         "font-size": "12px",
//                         "width": "50px",
//                         "height": "50px",
//                     },
//                 },
//                 {
//                     selector: "edge",
//                     style: {
//                         "width": 2,
//                         "line-color": "#ccc",
//                         "target-arrow-color": "#ccc",
//                         "target-arrow-shape": "triangle",
//                         "curve-style": "bezier",
//                     },
//                 },
//             ],
//             layout: {
//                 name: "dagre",
//                 rankDir: "LR", // Left to Right layout
//                 nodeSep: 50,
//                 edgeSep: 30,
//                 rankSep: 100,
//             },
//         });
//     }, [elements]);

//     return <div id="cy" style={{ width: "100%", height: "100%" }}></div>;
// };

// export default CytoscapeGraph;
import React, { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";

cytoscape.use(dagre);

const CytoscapeGraph = ({ elements }) => {
    const cyRef = useRef(null);

    useEffect(() => {
        if (cyRef.current) {
            cyRef.current.destroy();
        }

        cyRef.current = cytoscape({
            container: document.getElementById("cy"),
            elements,
            style: [
                {
                    selector: "node",
                    style: {
                        "background-color": "#A9A9A9",
                        "label": "data(label)",
                        "text-valign": "center",
                        "color": "black",
                        "font-size": "14px",
                        "font-weight": "bold",  // Increased font size for better readability
                        "width": "300px",     // Increased width for label space
                        "height": "60px",     // Increased height for label space
                        "shape": "rectangle", // Change shape to rectangle
                        "border-radius": "20px", // Rounded corners for visual appeal
                        "text-wrap": "wrap",  // Allows label wrapping if it's too long
                        "text-max-width": "100px", // Maximum width of the label
                        "text-halign": "center", // Horizontal text alignment
                        "text-valign": "center", // Vertical text alignment
                        "padding": "10px", // Padding inside the rectangle
                        "box-shadow": "2px 2px 10px rgba(0, 0, 0, 0.2)", // Shadow for depth
                    },
                },
                {
                    selector: "edge",
                    style: {
                        "width": 2,
                        "line-color": "#ccc",
                        "target-arrow-color": "#ccc",
                        "target-arrow-shape": "triangle",
                        "curve-style": "bezier",
                    },
                },
            ],
            layout: {
                name: "dagre",
                rankDir: "LR", // Left to Right layout
                nodeSep: 50,
                edgeSep: 30,
                rankSep: 100,
            },
        });
    }, [elements]);

    return <div id="cy" style={{ width: "100%", height: "100%" }}></div>;
};

export default CytoscapeGraph;
