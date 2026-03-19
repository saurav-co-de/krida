import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Diagnostic = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

    const testConnection = async () => {
        const tests = [
            { name: 'Environment Check', detail: `API_URL is set to: ${API_URL}` },
        ];

        try {
            // Test 1: Basic Ping
            const start = Date.now();
            const res = await axios.get(`${API_URL}/health`).catch(err => err.response || err);
            const duration = Date.now() - start;
            
            tests.push({
                name: 'Backend Health Check',
                status: res.status === 200 ? 'SUCCESS' : 'FAILED',
                detail: `Status: ${res.status || 'No Response'}. Time: ${duration}ms. Error: ${res.message || 'None'}`,
                data: res.data
            });

            // Test 2: Fetch Turfs
            const turfRes = await axios.get(`${API_URL}/turfs`).catch(err => err.response || err);
            tests.push({
                name: 'Fetch Turfs Test',
                status: turfRes.status === 200 ? 'SUCCESS' : 'FAILED',
                detail: `Status: ${turfRes.status || 'No Response'}. Count: ${Array.isArray(turfRes.data) ? turfRes.data.length : 'N/A'}`
            });

        } catch (error) {
            tests.push({
                name: 'Fatal Connection Error',
                status: 'CRITICAL',
                detail: error.message
            });
        }

        setResults(tests);
        setLoading(false);
    };

    useEffect(() => {
        testConnection();
    }, []);

    return (
        <div style={{ padding: '40px', fontFamily: 'monospace', backgroundColor: '#1a1a1a', color: '#00ff00', minHeight: '100vh' }}>
            <h1 style={{ color: '#fff', borderBottom: '2px solid #333', paddingBottom: '10px' }}>KRIDA SYSTEM DIAGNOSTICS</h1>
            
            {loading ? (
                <p>Running connection tests...</p>
            ) : (
                <div style={{ marginTop: '20px' }}>
                    {results.map((test, index) => (
                        <div key={index} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #333', borderRadius: '5px', backgroundColor: '#222' }}>
                            <strong style={{ fontSize: '1.2em' }}>[{test.status || 'INFO'}]</strong> 
                            <span style={{ marginLeft: '10px', color: '#fff' }}>{test.name}</span>
                            <p style={{ marginTop: '10px', color: '#aaa' }}>{test.detail}</p>
                            {test.data && (
                                <pre style={{ backgroundColor: '#000', padding: '10px', overflow: 'auto', fontSize: '11px' }}>
                                    {JSON.stringify(test.data, null, 2)}
                                </pre>
                            )}
                        </div>
                    ))}
                    <button 
                        onClick={() => { setLoading(true); testConnection(); }}
                        style={{ backgroundColor: '#00ff00', color: '#000', border: 'none', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        RERUN TESTS
                    </button>
                </div>
            )}
        </div>
    );
};

export default Diagnostic;
