"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Sparkles, FileText, BarChart3, Paperclip, X, Send, CheckCircle, MessageCircle } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import ReactMarkdown from 'react-markdown'
import Image from "next/image"

export default function AssistantPage() {
  const [showAttachModal, setShowAttachModal] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<{role: 'user'|'assistant', content: string}[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setShowAttachModal(false)
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setShowAttachModal(false)
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  function handleCardClick(prompt: string) {
    setInput(prompt)
  }

  async function handleChatSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const prompt = input.trim();
    setMessages((msgs) => [...msgs, { role: 'user', content: prompt }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, timeout: 120 })
      });
      const data = await res.json();
      if (data?.result?.report) {
        setMessages((msgs) => [...msgs, { role: 'assistant', content: data.result.report }]);
      } else {
        setMessages((msgs) => [...msgs, { role: 'assistant', content: 'No report found in response.' }]);
      }
    } catch {
      setMessages((msgs) => [...msgs, { role: 'assistant', content: 'Error contacting analysis API.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Welcome Section - Only show if no messages */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center px-4 py-8">
                <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
                  <div className="flex flex-col items-center mb-12 mt-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 flex items-center justify-center mb-6 shadow-lg">
                      <MessageCircle className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-semibold text-gray-700 mb-2">Welcome to A-Search Assistant <span className="inline-block">👋</span></h2>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Your AI Research Partner</h1>
                    <p className="text-lg text-gray-600 text-center max-w-2xl">
                      Get intelligent assistance with research design, data analysis, and report generation. 
                      Upload files, ask questions, and receive comprehensive insights.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
                    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border-0 shadow-md" onClick={() => handleCardClick("Help me design a research study process")}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                            <Sparkles className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-xs text-gray-500">Research</div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Research Study Process</h3>
                        <p className="text-gray-600 mb-4">Get guidance on designing, planning, and conducting research studies efficiently.</p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Study design & planning
                          </div>
                          <div className="w-4 h-4 text-gray-400">→</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border-0 shadow-md" onClick={() => handleCardClick("Help me analyze and evaluate data")}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-xs text-gray-500">Analysis</div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Analysis & Evaluation</h3>
                        <p className="text-gray-600 mb-4">Receive support for analyzing data, interpreting results, and evaluating findings.</p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Statistical analysis
                          </div>
                          <div className="w-4 h-4 text-gray-400">→</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border-0 shadow-md" onClick={() => handleCardClick("Help me generate a report and analysis")}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-xs text-gray-500">Reports</div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Report Generation</h3>
                        <p className="text-gray-600 mb-4">Get help generating reports, summaries, and actionable insights from your data.</p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Insights & summaries
                          </div>
                          <div className="w-4 h-4 text-gray-400">→</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>


                </div>
              </div>
            )}

            {/* Chat Messages Area */}
            {messages.length > 0 && (
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="w-full max-w-4xl mx-auto space-y-4">
                  {messages.map((message, index) => {
                    if (message.role === 'user') {
                      return (
                        <div key={index} className="flex justify-end">
                          <div className="max-w-[80%] rounded-lg px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md">
                            <div className="whitespace-pre-wrap">{message.content}</div>
                          </div>
                        </div>
                      );
                    } else {
                      // Try to parse the message content as JSON for segmented display
                      let parsed = null;
                      try {
                        parsed = JSON.parse(message.content);
                      } catch {
                        // fallback to plain text
                      }
                      if (parsed && parsed.result) {
                        const result = parsed.result;
                        return (
                          <div key={index} className="flex justify-start">
                            <div className="max-w-[80%] rounded-2xl bg-white border border-gray-200 text-gray-800 w-full shadow-md overflow-hidden">
                              {/* Report Section */}
                              {result.report && (
                                <div className="p-6 border-b">
                                  <h3 className="font-semibold text-lg mb-2">Report</h3>
                                  <ReactMarkdown>{result.report}</ReactMarkdown>
                                </div>
                              )}
                              {/* Plots Section */}
                              {Array.isArray(result.plots) && result.plots.length > 0 && (
                                <div className="p-6 border-b">
                                  <h3 className="font-semibold text-lg mb-2">Visualizations</h3>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {result.plots.map((img: string, i: number) => (
                                      <div key={i} className="bg-gray-50 rounded-lg border flex items-center justify-center p-2 shadow">
                                        <Image
                                          src={`data:image/png;base64,${img}`}
                                          alt={`Plot ${i + 1}`}
                                          width={200}
                                          height={100}
                                          className="rounded max-h-64 object-contain mx-auto"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {/* SQL Query Section */}
                              {result.sql_query && (
                                <div className="p-6 border-b">
                                  <h3 className="font-semibold text-lg mb-2">SQL Query</h3>
                                  <pre className="bg-gray-100 rounded p-3 overflow-x-auto text-sm"><code>{result.sql_query}</code></pre>
                                </div>
                              )}
                              {/* Data Summary Section */}
                              {result.data_summary && (
                                <div className="p-6 border-b">
                                  <h3 className="font-semibold text-lg mb-2">Data Summary</h3>
                                  <div className="mb-2 text-sm text-gray-700">Rows: {result.data_summary.row_count}, Columns: {result.data_summary.column_count}</div>
                                  <div className="mb-2">
                                    <span className="font-medium">Columns:</span> {result.data_summary.columns.join(', ')}
                                  </div>
                                </div>
                              )}
                              {/* Execution Steps Section */}
                              {Array.isArray(result.execution_steps) && result.execution_steps.length > 0 && (
                                <div className="p-6">
                                  <h3 className="font-semibold text-lg mb-2">Execution Steps</h3>
                                  <ol className="space-y-2">
                                    {result.execution_steps.map((step: string, i: number) => (
                                      <li key={i} className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>{step}</span>
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      } else {
                        // fallback to plain text
                        return (
                          <div key={index} className="flex justify-start">
                            <div className="max-w-[80%] rounded-lg px-4 py-3 bg-white border border-gray-200 text-gray-800">
                              <div className="whitespace-pre-wrap">{message.content}</div>
                            </div>
                          </div>
                        );
                      }
                    }
                  })}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-800 shadow-md">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                          <span>Analyzing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}
          </div>

          {/* Input bar at the bottom */}
          <div className="fixed left-0 right-0 bottom-0 z-20 flex justify-center pointer-events-none">
            <div className="w-full max-w-4xl mx-2 lg:mx-8 pb-4 pointer-events-auto">
              <form className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl shadow-md px-6 py-2 w-full" onSubmit={handleChatSubmit}>
                <Input
                  type="text"
                  placeholder="Ask me anything..."
                  className="w-full border-none focus:ring-0 bg-transparent text-base placeholder-gray-400"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={loading}
                />
                <Button type="button" variant="outline" className="px-3 py-2" onClick={() => setShowAttachModal(true)} disabled={loading}>
                  <Paperclip className="w-5 h-5" />
                  <span className="sr-only">Attach</span>
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-5 py-2 rounded-lg shadow-none" disabled={loading || !input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <div className="text-xs text-gray-400 text-center mt-2 pb-2">
                A-Search may display inaccurate info, so please double check the response. <a href="#" className="underline">Your Privacy & A-Search</a>
              </div>
            </div>
          </div>

          {/* Attach Modal */}
          {showAttachModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowAttachModal(false)}
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Attach a file</h2>
                <p className="text-gray-500 mb-6 text-sm">Upload a CSV, Excel, or PDF document from your device</p>
                <div
                  className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl p-8 mb-4 cursor-pointer hover:border-blue-500 transition"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ minHeight: 160 }}
                >
                  <Paperclip className="w-10 h-10 text-blue-400 mb-2" />
                  <span className="text-gray-600 mb-1">Drag & drop or click to select a file</span>
                  <span className="text-xs text-gray-400">(CSV, Excel, PDF only)</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                {file && (
                  <div className="mt-2 text-sm text-gray-700">Selected: <span className="font-medium">{file.name}</span></div>
                )}
                <div className="flex justify-end mt-6">
                  <Button variant="outline" onClick={() => setShowAttachModal(false)} className="mr-2">Cancel</Button>
                  <Button className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white" onClick={() => setShowAttachModal(false)}>Attach</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
} 