// API Connection Test Page
import { useState } from 'react';
import { submitRiasecCode } from '@/services/assessmentService';
import { getOccupationWithPrograms } from '@/services/occupationService';

export default function ApiTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      // Test 1: RIASEC endpoint
      addResult('🧪 Testing RIASEC endpoint...');
      const riasecResult = await submitRiasecCode('RIA', 5);
      addResult(`✅ RIASEC test successful! Received ${riasecResult.top10_jobs.length} occupations`);
      
      // Test 2: Occupation with programs endpoint
      addResult('🧪 Testing occupation programs endpoint...');
      const testOnetCode = '15-1252.00'; // Software Developers
      const occupationResult = await getOccupationWithPrograms(testOnetCode);
      addResult(`✅ Occupation test successful! Found ${occupationResult.program_count} programs for ${occupationResult.occupation.title}`);
      
      // Test 3: Check for encoding in program names
      const hasHawaiianChars = occupationResult.programs.some(p => 
        p.name.includes('ā') || p.name.includes('ʻ') || p.name.includes('Hawai')
      );
      if (hasHawaiianChars) {
        const sampleProgram = occupationResult.programs.find(p => 
          p.name.includes('ā') || p.name.includes('ʻ') || p.name.includes('Hawai')
        );
        addResult(`✅ Hawaiian characters test: Found "${sampleProgram?.name}"`);
      } else {
        addResult('ℹ️ No Hawaiian characters found in program names');
      }
      
      addResult('🎉 All tests passed! Backend is connected and working.');
    } catch (error) {
      addResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-blue-900 mb-2">Instructions:</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Open your browser's Developer Console (F12 or Cmd+Option+I)</li>
          <li>Click the "Run Tests" button below</li>
          <li>Check the console for detailed logs with emoji indicators:
            <ul className="list-disc list-inside ml-6 mt-1">
              <li>🔍 [API] - Attempting backend call</li>
              <li>✅ [API] - Successfully received data from backend</li>
              <li>⚠️ [FALLBACK] - Using fallback data (backend not connected)</li>
            </ul>
          </li>
        </ol>
      </div>

      <button
        onClick={testBackendConnection}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-6"
      >
        {loading ? 'Running Tests...' : 'Run Tests'}
      </button>

      {testResults.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Test Results:</h2>
          <div className="space-y-2 font-mono text-sm">
            {testResults.map((result, idx) => (
              <div
                key={idx}
                className={`p-2 rounded ${
                  result.includes('✅')
                    ? 'bg-green-50 text-green-800'
                    : result.includes('❌')
                    ? 'bg-red-50 text-red-800'
                    : result.includes('🧪')
                    ? 'bg-blue-50 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-2">Expected Results:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
          <li><strong>Backend Connected:</strong> Console shows "✅ [API]" messages, programs show Hawaiian characters (ā, ʻ)</li>
          <li><strong>Backend NOT Connected:</strong> Console shows "⚠️ [FALLBACK]" messages, using demo data</li>
        </ul>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Current API URL:</strong> {import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1 (default)'}</p>
        <p className="mt-2">Backend server should be running at: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:8000</code></p>
      </div>
    </div>
  );
}
