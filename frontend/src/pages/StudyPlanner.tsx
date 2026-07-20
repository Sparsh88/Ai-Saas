import React, { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import {
  Map,
  BookOpen,
  Mic,
  MicOff,
  UserCheck,
  Send,
  Loader,
  AlertCircle,
  Award,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const StudyPlanner: React.FC = () => {
  const { updateUserCredits } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'ROADMAP' | 'PLANNER' | 'INTERVIEW'>('ROADMAP');

  // Input states
  const [careerGoal, setCareerGoal] = useState('');
  const [studyTopic, setStudyTopic] = useState('');
  const [interviewRole, setInterviewRole] = useState('');
  const [interviewIndustry, setInterviewIndustry] = useState('');

  // Response loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Result structures
  const [roadmap, setRoadmap] = useState<any>(null);
  const [studyPlan, setStudyPlan] = useState<any>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<any>(null);
  const [speechAnalysis, setSpeechAnalysis] = useState<any>(null);

  // Speech Recognition hook
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = React.useRef<any>(null);

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please try Chrome/Safari.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (e: any) => {
      let text = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setCandidateAnswer(text);
    };

    rec.onerror = (err: any) => {
      console.error(err);
      setIsRecording(false);
    };

    rec.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = rec;
    rec.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // Trigger Roadmaps
  const handleGenerateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerGoal) return;
    setLoading(true);
    setError(null);
    setRoadmap(null);

    try {
      const response = await axios.post('/api/ai/tool', {
        toolName: 'career-roadmap',
        payload: { careerGoal }
      });
      setRoadmap(JSON.parse(response.data.result));
      updateUserCredits(response.data.creditsRemaining);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate career path.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger Study Planner
  const handleGenerateStudyPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studyTopic) return;
    setLoading(true);
    setError(null);
    setStudyPlan(null);

    try {
      const response = await axios.post('/api/ai/tool', {
        toolName: 'study-planner',
        payload: { topic: studyTopic }
      });
      setStudyPlan(JSON.parse(response.data.result));
      updateUserCredits(response.data.creditsRemaining);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate study curriculum.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger Mock Interview
  const handleStartInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewRole) return;
    setLoading(true);
    setError(null);
    setInterviewQuestions([]);
    setEvaluation(null);
    setSpeechAnalysis(null);
    setCandidateAnswer('');

    try {
      const response = await axios.post('/api/ai/tool', {
        toolName: 'mock-interview-questions',
        payload: { role: interviewRole, industry: interviewIndustry || 'Software' }
      });
      setInterviewQuestions(JSON.parse(response.data.result));
      setCurrentQuestionIndex(0);
      updateUserCredits(response.data.creditsRemaining);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create mock session.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Answer for evaluate
  const handleSubmitAnswer = async () => {
    if (!candidateAnswer) return;
    setLoading(true);
    setError(null);
    setEvaluation(null);
    setSpeechAnalysis(null);

    const questionText = interviewQuestions[currentQuestionIndex].question;

    try {
      // 1. Evaluate answer text
      const evalResponse = await axios.post('/api/ai/tool', {
        toolName: 'evaluate-interview-answer',
        payload: { question: questionText, answer: candidateAnswer }
      });

      setEvaluation(JSON.parse(evalResponse.data.result));
      updateUserCredits(evalResponse.data.creditsRemaining);

      // 2. Evaluate filler words & speaking pacing
      const speechResponse = await axios.post('/api/ai/tool', {
        toolName: 'speech-analysis',
        payload: { transcript: candidateAnswer }
      });

      setSpeechAnalysis(JSON.parse(speechResponse.data.result));
      updateUserCredits(speechResponse.data.creditsRemaining);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to process evaluation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-2">
        {[
          { id: 'ROADMAP', name: 'AI Career Roadmaps', icon: Map },
          { id: 'PLANNER', name: 'AI Study Planners', icon: BookOpen },
          { id: 'INTERVIEW', name: 'Mock Interview Prep', icon: UserCheck }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setError(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-4.5 h-4.5" />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs max-w-md">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* View Panels */}
      <div>
        {/* tab 1: roadmaps */}
        {activeTab === 'ROADMAP' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Input Form */}
            <div className="p-6 rounded-xl glass-panel border border-white/5 bg-slate-900/40 flex flex-col justify-between">
              <form onSubmit={handleGenerateRoadmap} className="space-y-4">
                <h3 className="text-sm font-bold text-slate-200">Interactive Career Roadmap</h3>
                <p className="text-xs text-slate-500 mb-6">Create customized skill paths based on your desired goals.</p>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Desired Career Role / Goal
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Full Stack React Developer"
                    value={careerGoal}
                    onChange={(e) => setCareerGoal(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-slate-100 placeholder-slate-650 text-xs outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-650 hover:to-purple-750 text-white rounded-xl py-3 font-semibold text-xs transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Map className="w-4 h-4" />}
                  <span>Generate Roadmap (-3 credits)</span>
                </button>
              </form>
            </div>

            {/* Tree Roadmap Renderer */}
            <div className="lg:col-span-2 p-6 rounded-xl glass-panel border border-white/5 bg-slate-900/60 min-h-[350px]">
              {roadmap ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-200">{roadmap.role}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{roadmap.description}</p>
                    </div>
                  </div>

                  {/* Vertical Timeline Nodes */}
                  <div className="relative pl-6 space-y-6">
                    <div className="absolute left-2.5 top-2 bottom-2 w-0.5 timeline-line rounded-full" />
                    
                    {roadmap.milestones.map((ms: any, idx: number) => (
                      <div key={idx} className="relative text-xs">
                        {/* Dot indicator */}
                        <div className="absolute -left-[22px] top-1.5 w-3.5 h-3.5 bg-slate-950 border-2 border-indigo-400 rounded-full flex items-center justify-center shadow-lg" />
                        
                        <div className="p-4 rounded-xl border border-white/5 bg-slate-950/40 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-200 text-xs">{ms.phase}</span>
                            <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{ms.duration}</span>
                          </div>
                          
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Topics to cover</span>
                            <div className="flex flex-wrap gap-1.5">
                              {ms.topics.map((t: string, i: number) => (
                                <span key={i} className="text-[10px] px-2 py-0.5 bg-white/5 rounded text-slate-350 border border-white/5">{t}</span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1 pt-1.5 border-t border-white/2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Milestone project challenge</span>
                            <div className="flex items-center gap-1 text-[11px] text-indigo-300 font-semibold">
                              <Award className="w-3.5 h-3.5 shrink-0" />
                              <p>{ms.projects[0]}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-650 py-16 gap-3">
                  <Map className="w-8 h-8 text-slate-700" />
                  <span>Your interactive roadmap milestones tree will render here.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* tab 2: study plan */}
        {activeTab === 'PLANNER' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Input Form */}
            <div className="p-6 rounded-xl glass-panel border border-white/5 bg-slate-900/40 flex flex-col justify-between">
              <form onSubmit={handleGenerateStudyPlan} className="space-y-4">
                <h3 className="text-sm font-bold text-slate-200">AI Curriculum Planner</h3>
                <p className="text-xs text-slate-500 mb-6">Receive structured weekly study calendars for any subject.</p>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    What topic or skill do you want to learn?
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js App Router & GraphQL"
                    value={studyTopic}
                    onChange={(e) => setStudyTopic(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-slate-100 placeholder-slate-650 text-xs outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-650 hover:to-purple-750 text-white rounded-xl py-3 font-semibold text-xs transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
                  <span>Create Study Calendar (-2 credits)</span>
                </button>
              </form>
            </div>

            {/* Weekly Curriculum view */}
            <div className="lg:col-span-2 p-6 rounded-xl glass-panel border border-white/5 bg-slate-900/60 min-h-[350px]">
              {studyPlan ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <h4 className="text-sm font-bold text-slate-200">{studyPlan.title}</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {studyPlan.weeklySchedule.map((week: any, wIdx: number) => (
                      <div key={wIdx} className="p-4 rounded-xl border border-white/5 bg-slate-950/40 flex flex-col justify-between">
                        <div className="mb-3">
                          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded uppercase tracking-wider">{week.week}</span>
                          <h5 className="text-xs font-bold text-slate-300 mt-2">{week.goal}</h5>
                        </div>
                        <div className="space-y-2 border-t border-white/2 pt-2 text-[11px]">
                          {week.days.map((d: any, dIdx: number) => (
                            <div key={dIdx} className="flex gap-2 text-slate-400">
                              <span className="font-semibold text-indigo-300 min-w-[50px] shrink-0">{d.day}:</span>
                              <span>{d.task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-650 py-16 gap-3">
                  <BookOpen className="w-8 h-8 text-slate-700" />
                  <span>Your study curriculum cards will render here.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* tab 3: mock interview */}
        {activeTab === 'INTERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Interview Settings */}
            <div className="p-6 rounded-xl glass-panel border border-white/5 bg-slate-900/40 flex flex-col justify-between">
              <form onSubmit={handleStartInterview} className="space-y-4">
                <h3 className="text-sm font-bold text-slate-200">Interactive Mock Interview</h3>
                <p className="text-xs text-slate-500 mb-6">Test yourself against simulated technical and behavioral prompts.</p>
                
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Target Job Position / Role
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Junior React Developer"
                    value={interviewRole}
                    onChange={(e) => setInterviewRole(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-slate-100 placeholder-slate-650 text-xs outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Domain / Industry (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fintech, SaaS"
                    value={interviewIndustry}
                    onChange={(e) => setInterviewIndustry(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-slate-100 placeholder-slate-650 text-xs outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-650 hover:to-purple-750 text-white rounded-xl py-3 font-semibold text-xs transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                  <span>Generate Interview Session (-2 credits)</span>
                </button>
              </form>
            </div>

            {/* Questions Console Area */}
            <div className="lg:col-span-2 p-6 rounded-xl glass-panel border border-white/5 bg-slate-900/60 min-h-[350px] flex flex-col justify-between">
              {interviewQuestions.length > 0 ? (
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header question status */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-4">
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded tracking-wide">
                        QUESTION {currentQuestionIndex + 1} OF 3: {interviewQuestions[currentQuestionIndex].type}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">Targets: {interviewQuestions[currentQuestionIndex].optimalKeywords.slice(0, 2).join(', ')}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-200 leading-relaxed mb-6">
                      {interviewQuestions[currentQuestionIndex].question}
                    </h4>

                    {/* Speech / Text Area */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Your Answer Response</label>
                        
                        {/* Audio controls */}
                        <button
                          onClick={isRecording ? stopRecording : startRecording}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                            isRecording
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse'
                              : 'bg-white/5 border border-white/5 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {isRecording ? (
                            <>
                              <MicOff className="w-3.5 h-3.5" />
                              <span>Stop Recording</span>
                            </>
                          ) : (
                            <>
                              <Mic className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Speech to Text</span>
                            </>
                          )}
                        </button>
                      </div>

                      <textarea
                        rows={4}
                        placeholder={isRecording ? "Listening to your microphone transcript..." : "Write your response text here..."}
                        value={candidateAnswer}
                        onChange={(e) => setCandidateAnswer(e.target.value)}
                        className="w-full bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-slate-100 placeholder-slate-650 text-xs outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Evaluation results */}
                    <AnimatePresence>
                      {evaluation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-6 border-t border-white/5 pt-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1">
                              <Award className="w-4 h-4 text-indigo-400 animate-bounce" />
                              <span>AI Evaluation Results</span>
                            </h5>
                            <span className="text-xs font-black text-indigo-400">Score: {evaluation.score}/100</span>
                          </div>
                          
                          <p className="text-xs text-slate-400 leading-relaxed bg-white/2 p-3 rounded-lg border border-white/2">{evaluation.feedback}</p>
                          
                          {speechAnalysis && (
                            <div className="grid grid-cols-2 gap-4 border-t border-white/2 pt-3 text-[11px]">
                              <div>
                                <span className="font-bold text-slate-500 block uppercase tracking-wider mb-1">Speaking Pacing</span>
                                <p className="text-slate-300 font-semibold">{speechAnalysis.speakingRateWPM} WPM ({speechAnalysis.pacingFeedback})</p>
                              </div>
                              <div>
                                <span className="font-bold text-slate-500 block uppercase tracking-wider mb-1">Purity (Filler Words)</span>
                                <div className="flex flex-wrap gap-1 mt-0.5">
                                  {Object.keys(speechAnalysis.fillerWordsCount).length === 0 ? (
                                    <span className="text-emerald-400 font-semibold">Perfect articulation!</span>
                                  ) : (
                                    Object.entries(speechAnalysis.fillerWordsCount).map(([word, count]) => (
                                      <span key={word} className="bg-rose-500/10 text-rose-450 border border-rose-500/15 px-1.5 py-0.5 rounded text-[10px]">{word}: {count as number}</span>
                                    ))
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Buttons controls */}
                  <div className="flex gap-3 justify-end border-t border-white/5 pt-4 mt-6">
                    {!evaluation ? (
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={loading || !candidateAnswer.trim()}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-650 hover:to-purple-750 text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                      >
                        {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        <span>Submit Answer (-4 credits)</span>
                      </button>
                    ) : (
                      currentQuestionIndex < 2 ? (
                        <button
                          onClick={() => {
                            setCurrentQuestionIndex((prev) => prev + 1);
                            setCandidateAnswer('');
                            setEvaluation(null);
                            setSpeechAnalysis(null);
                          }}
                          className="flex items-center gap-1 bg-white/5 border border-white/5 hover:border-indigo-500/20 text-slate-350 hover:text-indigo-400 px-4 py-2 rounded-xl text-xs font-semibold"
                        >
                          <span>Next Question</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setInterviewQuestions([]);
                            setCandidateAnswer('');
                            setEvaluation(null);
                            setSpeechAnalysis(null);
                          }}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold"
                        >
                          Finish Session 🏁
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-650 py-16 gap-3">
                  <UserCheck className="w-8 h-8 text-slate-700" />
                  <span>Generate an interview session on the left to activate prep simulator.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default StudyPlanner;
