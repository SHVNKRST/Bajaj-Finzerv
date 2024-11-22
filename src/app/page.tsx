// src/app/page.tsx
'use client';

import { useState } from 'react';
import Head from 'next/head';

interface ApiResponse {
  status: string;
  numbers_array: number[];
  alphabets_array: string[];
  highest_alphabet_array: string[];
  is_prime_available: boolean;
}

interface DropdownOption {
  value: keyof Pick<ApiResponse, 'numbers_array' | 'alphabets_array' | 'highest_alphabet_array'>;
  label: string;
}

export default function Home() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const dropdownOptions: DropdownOption[] = [
    { value: 'alphabets_array', label: 'Alphabets' },
    { value: 'numbers_array', label: 'Numbers' },
    { value: 'highest_alphabet_array', label: 'Highest lowercase alphabet' }
  ];

  const validateAndSubmit = async () => {
    try {
      setError('');
      setIsLoading(true);

      // Validate JSON format
      const parsedJson = JSON.parse(jsonInput);
      
      // Make API call
      const response = await fetch('https://api-test-ten-zeta.vercel.app/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input_string: JSON.stringify(parsedJson.data)
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setApiResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionChange = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const renderResponse = () => {
    if (!apiResponse || selectedOptions.length === 0) return null;

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        {selectedOptions.map(option => {
          const optionKey = option as keyof typeof apiResponse;
          const data = apiResponse[optionKey];
          
          return (
            <div key={option} className="mb-2">
              <h3 className="font-semibold capitalize">
                {option.replace('_array', '').replace('_', ' ')}:
              </h3>
              <p className="ml-2">
                {Array.isArray(data) ? data.join(', ') : data}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>YOUR_ROLL_NUMBER</title>
      </Head>

      <div className="max-w-xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter JSON Input
            </label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={4}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={'{ "data": ["A","C","z"] }'}
            />
          </div>

          <button
            onClick={validateAndSubmit}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white ${
              isLoading 
                ? 'bg-gray-400' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {apiResponse && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Response Fields
              </label>
              <div className="space-y-2">
                {dropdownOptions.map(option => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={option.value}
                      checked={selectedOptions.includes(option.value)}
                      onChange={() => handleOptionChange(option.value)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label 
                      htmlFor={option.value}
                      className="ml-2 text-gray-700"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {renderResponse()}
        </div>
      </div>
    </div>
  );
}