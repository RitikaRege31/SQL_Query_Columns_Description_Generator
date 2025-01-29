
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
            setLineageData(response.lineage_data);
        } catch (error) {
            console.error("Error fetching lineage data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateDescriptions = async () => {
        if (loading) return;  // Prevent multiple clicks triggering excessive requests
    
        setLoading(true);
        try {
            const response = await fetchDescriptions();
            setDescriptions(response.results);
        } catch (error) {
            console.error("Error fetching descriptions:", error);
        } finally {
            setTimeout(() => setLoading(false), 5000); // Add a delay before allowing another request
        }
    };
    

    

    // const elements = lineageData.reduce((acc, lineage) => {
    //     const nodes = lineage.nodes.map((node) => ({
    //         data: { id: node.id, label: node.data.label || "No label" },
    //     }));
    
    //     const edges = lineage.edges.map((edge) => ({
    //         data: { 
    //             id: edge.id, 
    //             source: edge.source, 
    //             target: edge.target, 
    //             label: edge.data?.label || "UNKNOWN", // Use actual relation type
    //         },
    //     }));
    
    //     return [...acc, ...nodes, ...edges];
    // }, []);
    const elements = lineageData.flatMap(({ nodes, edges }) => [
        ...nodes.map(node => ({
            data: { id: node.id, label: node.data.label, isTarget: node.data.is_target || false }
        })),
        ...edges.map(edge => ({
            data: { id: edge.id, source: edge.source, target: edge.target, label: edge.data.label }
        }))
    ]);
    

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
