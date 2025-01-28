import React, { useState } from "react";
import { fetchLineageData } from "../api/api";
import ReactFlow from "react-flow-renderer";

const LineageGraph = () => {
    const [lineageData, setLineageData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleCreateLineage = async () => {
        setLoading(true);
        try {
            const response = await fetchLineageData();
            setLineageData(response.results); // Update based on your API's response
        } catch (error) {
            console.error("Error fetching lineage data:", error);
        } finally {
            setLoading(false);
        }
    };

    // const elements = lineageData.map((node, index) => ({
    //     id: `${index}`,
    //     data: { label: node.name },
    //     position: { x: Math.random() * 500, y: Math.random() * 500 },
    // }));
    const elements = Array.isArray(lineageData)
    ? lineageData.map((node, index) => ({
          id: `${index}`,
          data: { label: `${node.target_column}: ${node.description}` }, // Display target column and description
          position: { x: Math.random() * 500, y: Math.random() * 500 },
      }))
    : [];


    return (
        <div className="p-4">
            <button
                onClick={handleCreateLineage}
                className="bg-green-500 text-white px-4 py-2 rounded"
            >
                Create Lineage
            </button>
            {loading && <p>Loading...</p>}
            {!loading && lineageData.length === 0 && (
                <p>No lineage data available. Try uploading a SQL file and creating the lineage.</p>
            )}
            {!loading && lineageData.length > 0 && (
                <div style={{ height: 500, border: "1px solid #ddd", marginTop: 20 }}>
                    <ReactFlow elements={elements} />
                </div>
            )}
        </div>
    );
};

export default LineageGraph;
