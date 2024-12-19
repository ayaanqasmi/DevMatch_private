'use client'
import { useState } from 'react';

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!file) {
            setMessage("Please select a PDF file.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:4000/upload-pdf', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.text();
                setMessage(result);
            } else {
                const errorText = await response.text();
                setMessage(`Error: ${errorText}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h1>Upload PDF</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="application/pdf" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadPage;
