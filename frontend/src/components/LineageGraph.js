
// import React, { useState } from "react";
// import { fetchLineageData, fetchDescriptions } from "../api/api";
// import ReactFlow from "react-flow-renderer";

// const LineageGraph = () => {
//     const [lineageData, setLineageData] = useState([]);
//     const [descriptions, setDescriptions] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const handleCreateLineage = async () => {
//         setLoading(true);
//         try {
//             const response = await fetchLineageData();
//             console.log("Lineage data:", response);  // Log the response
//             setLineageData(response.lineage_data); // Set raw lineage data for graph
//         } catch (error) {
//             console.error("Error fetching lineage data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch descriptions of the target columns
//     const handleGenerateDescriptions = async () => {
//         setLoading(true);
//         try {
//             const response = await fetchDescriptions();
//             setDescriptions(response.results); // Set descriptions
//         } catch (error) {
//             console.error("Error fetching descriptions:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // const elements = lineageData.map((lineage, index) => {
//     //     const nodes = lineage.nodes.map(node => ({
//     //         id: node.id,
//     //         data: node.data,
//     //         position: { x: Math.random() * 500, y: Math.random() * 500 }
//     //     }));

//     //     const edges = lineage.edges.map(edge => ({
//     //         id: edge.id,
//     //         source: edge.source,
//     //         target: edge.target,
//     //         animated: true
//     //     }));

//     //     return [...nodes, ...edges];
//     // }).flat();
//     const elements = lineageData.reduce((acc, lineage, index) => {
//         const nodes = lineage.nodes.map((node, nodeIndex) => ({
//             id: node.id,
//             data: node.data,
//             position: { x: nodeIndex * 150, y: index * 150 } // Create a grid layout
//         }));
    
//         const edges = lineage.edges.map(edge => ({
//             id: edge.id,
//             source: edge.source,
//             target: edge.target,
//             animated: true
//         }));
    
//         return [...acc, ...nodes, ...edges];
//     }, []);
    

//     return (
//         <div className="p-4">
//             <button
//                 onClick={handleGenerateDescriptions}
//                 className="bg-blue-500 text-white px-4 py-2 rounded"
//             >
//                 Generate Descriptions
//             </button>
//             <button
//                 onClick={handleCreateLineage}
//                 className="bg-green-500 text-white px-4 py-2 rounded ml-4"
//             >
//                 Create Lineage
//             </button>

//             {loading && <p>Loading...</p>}

//             {/* Display descriptions */}
//             {!loading && descriptions.length > 0 && (
//                 <div className="mt-4">
//                     <h3>Descriptions:</h3>
//                     <ul>
//                         {descriptions.map((desc, index) => (
//                             <li key={index}>
//                                 <strong>{desc.target_column}</strong>: {desc.description}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}

//             {/* Display graph */}
//             {!loading && lineageData.length > 0 && (
//                 <div style={{ height: 500, border: "1px solid #ddd", marginTop: 20 }}>
//                     <ReactFlow elements={elements} />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default LineageGraph;
import React, { useState } from "react";
import { fetchLineageData, fetchDescriptions } from "../api/api";
import CytoscapeGraph from "./CytoscapeGraph"; // Import your custom wrapper

const LineageGraph = () => {
    const [lineageData, setLineageData] = useState([]);
    const [descriptions, setDescriptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleCreateLineage = async () => {
        setLoading(true);
        try {
            const response = await fetchLineageData();
            console.log("Lineage data:", response);
            setLineageData(response.lineage_data);
        } catch (error) {
            console.error("Error fetching lineage data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateDescriptions = async () => {
        setLoading(true);
        try {
            const response = await fetchDescriptions();
            setDescriptions(response.results);
        } catch (error) {
            console.error("Error fetching descriptions:", error);
        } finally {
            setLoading(false);
        }
    };

    // const elements = lineageData.reduce((acc, lineage) => {
    //     const nodes = lineage.nodes.map((node) => ({
    //         data: { id: node.id, label: node.data },
    //     }));

    //     const edges = lineage.edges.map((edge) => ({
    //         data: { id: edge.id, source: edge.source, target: edge.target },
    //     }));

    //     return [...acc, ...nodes, ...edges];
    // }, []);
    const elements = lineageData.reduce((acc, lineage) => {
        const nodes = lineage.nodes.map((node) => ({
            data: { id: node.id, label: node.data.label || node.data.name || 'No label' }, // Ensure it's a string
        }));
    
        const edges = lineage.edges.map((edge) => ({
            data: { id: edge.id, source: edge.source, target: edge.target },
        }));
    
        return [...acc, ...nodes, ...edges];
    }, []);
    

    return (
        <div className="p-4">
            <button
                onClick={handleGenerateDescriptions}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Generate Descriptions
            </button>
            <button
                onClick={handleCreateLineage}
                className="bg-green-500 text-white px-4 py-2 rounded ml-4"
            >
                Create Lineage
            </button>

            {loading && <p>Loading...</p>}

            {!loading && descriptions.length > 0 && (
                <div className="mt-4">
                    <h3>Descriptions:</h3>
                    <ul>
                        {descriptions.map((desc, index) => (
                            <li key={index}>
                                <strong>{desc.target_column}</strong>: {desc.description}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {!loading && lineageData.length > 0 && (
                <div style={{ height: 500, border: "1px solid #ddd", marginTop: 20 }}>
                    <CytoscapeGraph elements={elements} style={{ height: "100%" }} />
                </div>
            )}
        </div>
    );
};

export default LineageGraph;
