import React from "react";
import Navbar from "../components/Navbar";
import FileUpload from "../components/FileUpload";
import LineageGraph from "../components/LineageGraph";

const Dashboard = () => {
   return (
       <div>
           <Navbar />
           <div className="container mx-auto p-4">
               <h2 className="text-2xl font-bold mb-4">SQL Lineage Dashboard</h2>
               <FileUpload />
               <LineageGraph />
           </div>
       </div>
   );
};

export default Dashboard;
