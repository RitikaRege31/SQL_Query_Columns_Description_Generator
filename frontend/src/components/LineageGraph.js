
import React, { useState } from "react";
import { fetchLineageData, fetchDescriptions } from "../api/api";
import ReactFlow from "react-flow-renderer";

const LineageGraph = () => {
    const [lineageData, setLineageData] = useState([]);
    const [descriptions, setDescriptions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch raw lineage data for graph
    // const handleCreateLineage = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await fetchLineageData();
    //         setLineageData(response.lineage_data); // Set raw lineage data for graph
    //     } catch (error) {
    //         console.error("Error fetching lineage data:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const handleCreateLineage = async () => {
        setLoading(true);
        try {
            const response = await fetchLineageData();
            setLineageData(response.lineage_data); // Set raw lineage data for graph
        } catch (error) {
            console.error("Error fetching lineage data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch descriptions of the target columns
    const handleGenerateDescriptions = async () => {
        setLoading(true);
        try {
            const response = await fetchDescriptions();
            setDescriptions(response.results); // Set descriptions
        } catch (error) {
            console.error("Error fetching descriptions:", error);
        } finally {
            setLoading(false);
        }
    };

    const elements = lineageData.map((lineage, index) => {
        const nodes = lineage.nodes.map(node => ({
            id: node.id,
            data: node.data,
            position: { x: Math.random() * 500, y: Math.random() * 500 }
        }));

        const edges = lineage.edges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            animated: true
        }));

        return [...nodes, ...edges];
    }).flat();

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

            {/* Display descriptions */}
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

            {/* Display graph */}
            {!loading && lineageData.length > 0 && (
                <div style={{ height: 500, border: "1px solid #ddd", marginTop: 20 }}>
                    <ReactFlow elements={elements} />
                </div>
            )}
        </div>
    );
};

export default LineageGraph;
//     // Map raw lineage data to graph elements
//     const elements = lineageData.map((lineage, index) => {
//         const sourceNodes = lineage.source_columns.map((source, idx) => ({
//             id: `${index}-${idx}`,
//             data: { label: source },
//             position: { x: Math.random() * 500, y: Math.random() * 500 },
//         }));

//         const targetNode = {
//             id: `${index}-target`,
//             data: { label: lineage.target_column },
//             position: { x: Math.random() * 500, y: Math.random() * 500 },
//         };

//         const edges = lineage.source_columns.map((source, idx) => ({
//             id: `${index}-${idx}-edge`,
//             source: `${index}-${idx}`,
//             target: `${index}-target`,
//             animated: true,
//         }));

//         return [...sourceNodes, targetNode, ...edges];
//     }).flat();

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
