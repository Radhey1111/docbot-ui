import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DocBotApp() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [sources, setSources] = useState([]);
  const [docId, setDocId] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "https://chatbotthemeidentifier-s6xt.onrender.com";

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/upload/`, formData);
      setDocId(res.data.doc_id);
      alert("✅ File uploaded successfully!");
    } catch (err) {
      alert("❌ Upload failed");
    }
    setLoading(false);
  };

  const handleAsk = async () => {
    if (!question || !docId) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/query/`, {
        question,
        doc_id: docId,
      });
      setAnswer(res.data.summary);
      setSources(res.data.answers || []);
    } catch (err) {
      alert("❌ Failed to get answer");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">
        📄 DocBot – Ask Questions from your PDF
      </h1>
      <Card>
        <CardContent className="p-4 space-y-4">
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".pdf"
          />
          <Button onClick={handleUpload} disabled={loading || !file}>
            {loading ? "Uploading..." : "Upload PDF"}
          </Button>
        </CardContent>
      </Card>
      {docId && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <Input
              placeholder="Ask a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <Button onClick={handleAsk} disabled={loading || !question}>
              {loading ? "Generating..." : "Get Answer"}
            </Button>
          </CardContent>
        </Card>
      )}
      {answer && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-xl font-semibold">🧠 Answer</h2>
            <p>{answer}</p>
            {sources.length > 0 && (
              <div>
                <h3 className="font-medium mt-4">📚 Sources:</h3>
                <ul className="list-disc ml-6">
                  {sources.map((src, idx) => (
                    <li key={idx}>
                      Page {src.citation.page}, Para {src.citation.paragraph}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
