'use client'
import { useState } from 'react';

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    // Handle file selection
    const handleFileChange = (event) => setFile(event.target.files[0]);

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            setMessage("Please select a PDF file.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:4000/api/resume', {
                method: 'POST',
                body: formData,
                headers: { 'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGFkbWluIiwiaWQiOiI2NzZhYjkwZjNjZGY5YzMwZGM3YzMyMjAifSwiaWF0IjoxNzM1MTU4MDIyLCJleHAiOjE3MzUxNjUyMjJ9.Pe33hbATNFMzL6Nlb-gF7n3jw2w9ilZ2kt545YKi_B8` }
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
