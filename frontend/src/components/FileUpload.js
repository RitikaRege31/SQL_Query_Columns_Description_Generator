// import React, { useState } from "react";
// import { uploadSQLFile } from "../api/api";

// const FileUpload = () => {
//     const [file, setFile] = useState(null);
//     const [uploadStatus, setUploadStatus] = useState("");

//     const handleFileChange = (e) => {
//         setFile(e.target.files[0]);
//     };

//     const handleUpload = async () => {
//         if (!file) {
//             setUploadStatus("Please select a file first.");
//             return;
//         }
//         try {
//             setUploadStatus("Uploading...");
//             const response = await uploadSQLFile(file);
//             setUploadStatus("File uploaded successfully!");
//         } catch (error) {
//             setUploadStatus("Error uploading file. Please try again.");
//         }
//     };

//     return (
//         <div className="p-4">
//             <input type="file" onChange={handleFileChange} />
//             <button
//                 onClick={handleUpload}
//                 className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
//             >
//                 Upload
//             </button>
//             {uploadStatus && <p className="mt-2">{uploadStatus}</p>}
//         </div>
//     );
// };

// export default FileUpload;
import axios from 'axios';
import React, { useState } from 'react';

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState('');

    const handleFileChange = (e) => {
        setFiles(e.target.files); // Capture multiple files
    };

    const handleUpload = async () => {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]); // Match the 'files' key in the backend
        }

        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/sql/upload/', // Ensure the endpoint matches
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setStatus('File uploaded successfully: ' + response.data.message);
        } catch (error) {
            console.error('Error uploading file:', error);
            setStatus('File upload failed.');
        }
    };

    return (
        <div>
            <input type="file" multiple onChange={handleFileChange} />
            <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>
            {status && <p>{status}</p>}
        </div>
    );
};

export default FileUpload;
