import React, { useState } from 'react';
import { uploadFile } from '../../utils/ipfs';

const FileUpload = ({ onFileUpload }) => {
    const [file, setFile] = useState(null);

    const handleUpload = async () => {
        if (file) {
            const url = await uploadFile(file);
            onFileUpload(url);
        }
    };

    return (
        <div>
            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
            />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default FileUpload;