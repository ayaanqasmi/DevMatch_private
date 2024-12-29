'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';

export default function ChatInterface() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<{ explanation: string; resumeLink: string } | null>(null);
  const [candidate, setCandidate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResponse = async (query: string) => {
    const res = await fetch('http://localhost:5000/api/query_documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error('Failed to fetch response');
    return res.json();
  };

  const fetchCandidate = async (resumeId: string) => {
    const res = await fetch(`http://localhost:4000/api/resume/${resumeId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to fetch candidate data');
    return res.json();
  };

  const parseResponse = (data: any) => {
    if (!data.success || !data.results.response) {
      throw new Error('Invalid response format');
    }
    const parsedResponse = JSON.parse(data.results.response.replace(/```json\n|\n```/g, ''));
    return {
      explanation: parsedResponse.explanation.replace(/\b[0-9a-f]{24}\b/g, ''),
      resumeId: parsedResponse.metadata.source,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchResponse(query);
      const { explanation, resumeId } = parseResponse(data);
      const resumeLink = `https://storage.googleapis.com/devmatch-resumes/${resumeId}.pdf`;
      const candidateData = await fetchCandidate(resumeId);
      setCandidate(candidateData.data.user_id);
      setResponse({ explanation, resumeLink });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Chat with AI Resume Matcher</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your query..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {response && (
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">Response:</h2>
            <p>{response.explanation}</p>
            <p>
              <a
                href={response.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Resume
              </a>
              <Link href={`/dashboard/profile/${candidate}`} className="text-blue-500 hover:underline ml-4" target="_blank">
              View profile
              </Link>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
