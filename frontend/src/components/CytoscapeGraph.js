
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
//                         "background-color": "#A9A9A9",
//                         "label": "data(label)",
//                         "text-valign": "center",
//                         "color": "black",
//                         "font-size": "14px",
//                         "font-weight": "bold",
//                         "width": "300px",
//                         "height": "60px",
//                         "shape": "rectangle",
//                         "border-radius": "20px",
//                         "text-wrap": "wrap",
//                         "text-max-width": "100px",
//                         "text-halign": "center",
//                         "text-valign": "center",
//                         "padding": "10px",
//                         "box-shadow": "2px 2px 10px rgba(0, 0, 0, 0.2)",
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
//                         "label": "data(label)", // SQL operation (e.g., INNER JOIN, SELECT)
//                         "font-size": "12px",
//                         "text-rotation": "autorotate", // Auto rotate text
//                         "color": "#333", // Label color for better visibility
//                     },
//                 },
//             ],
//             layout: {
//                 name: "dagre",
//                 rankDir: "LR",
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
                        "background-color": (ele) => ele.data("isTarget") ? "#FF5733" : "#90EE90",
                        "label": "data(label)",
                        "text-valign": "center",
                        "color": "black",
                        "font-size": "14px",
                        "font-weight": "bold",
                        // "width": "200px",
                        "width": "label",
                        "text-wrap": "wrap",
                        "text-max-width": "180px",
                        "height": "auto",
                        "shape": "round-rectangle",
                        "border-width": 2,
                        "border-color": "black"
                    },
                },
                {
                    selector: "edge",
                    style: {
                        "width": 2,
                        "line-color": "#999",
                        "target-arrow-color": "#999",
                        "target-arrow-shape": "triangle",
                        "curve-style": "bezier",
                        // "label": "data(label)",
                        "font-size": "10px",
                        "color": "#333",
                    },
                },
                {
                    selector: ".highlight",
                    style: {
                        "background-color": "#FFD700",
                        "line-color": "#FFD700",
                        "target-arrow-color": "#FFD700",
                    }
                }
            ],
            layout: {
                name: "dagre",
                rankDir: "LR",
                nodeSep: 50,
                edgeSep: 30,
                rankSep: 100,
            },
        });

        const cy = cyRef.current;

        // Hover effect to highlight edges and related nodes
        cy.on("mouseover", "node", (event) => {
            const node = event.target;
            node.addClass("highlight");

            node.connectedEdges().forEach(edge => {
                edge.addClass("highlight");
                edge.connectedNodes().forEach(n => n.addClass("highlight"));
            });
        });

        cy.on("mouseout", "node", (event) => {
            cy.elements().removeClass("highlight");
        });

    }, [elements]);

    return <div id="cy" style={{ width: "100%", height: "100%" }}></div>;
};

export default CytoscapeGraph;
