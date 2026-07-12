import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, PlusSquare, BookOpen, FileText, CheckCircle, 
  XCircle, Award, ShieldAlert, Star, TrendingUp, HelpCircle
} from 'lucide-react';

export default function MentorDashboard() {
  const { authenticatedFetch, logout, name } = useAuth();
  
  // State variables
  const [students, setStudents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [reports, setReports] = useState([]);
  
  // Form variables
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskStudentId, setTaskStudentId] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  
  // Grading variables
  const [activeGradeTaskId, setActiveGradeTaskId] = useState(null);
  const [gradeScore, setGradeScore] = useState(80);
  const [gradeFeedback, setGradeFeedback] = useState('');
  
  // Filter variables
  const [selectedStudentFilter, setSelectedStudentFilter] = useState('all');
  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [errMessage, setErrMessage] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      // Students
      const studRes = await authenticatedFetch('/api/mentors/students');
      if (studRes.ok) {
        const studData = await studRes.json();
        setStudents(studData);
        if (studData.length > 0 && !taskStudentId) {
          setTaskStudentId(String(studData[0].id));
        }
      }
      
      // Tasks
      const tasksRes = await authenticatedFetch('/api/mentors/tasks');
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData);
      }

      // Reports
      const reportsRes = await authenticatedFetch('/api/mentors/reports');
      if (reportsRes.ok) {
        const reportsData = await reportsRes.json();
        setReports(reportsData);
      }
    } catch (err) {
      setErrMessage('Error loading dashboard analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignTask = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrMessage('');
    
    if (!taskStudentId) {
      setErrMessage('Please select a student intern first.');
      return;
    }

    try {
      const res = await authenticatedFetch('/api/mentors/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDesc,
          assigned_to_student_id: parseInt(taskStudentId),
          due_date: taskDueDate
        })
      });
      if (res.ok) {
        setMessage('Task assigned and student notified!');
        setTaskTitle('');
        setTaskDesc('');
        setTaskDueDate('');
        fetchData();
      } else {
        const err = await res.json();
        setErrMessage(err.detail || 'Failed to assign task.');
      }
    } catch (err) {
      setErrMessage('Error assigning task.');
    }
  };

  const handleReviewReport = async (reportId, status) => {
    setMessage('');
    setErrMessage('');
    try {
      const res = await authenticatedFetch(`/api/mentors/reports/${reportId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          review_feedback: status === 'approved' ? 'Good progress. Approved.' : 'Incomplete details. Please expand.'
        })
      });
      if (res.ok) {
        setMessage(`Report status updated to ${status}!`);
        fetchData();
      } else {
        const err = await res.json();
        setErrMessage(err.detail || 'Failed to update report status.');
      }
    } catch (err) {
      setErrMessage('Error executing review.');
    }
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrMessage('');
    try {
      const res = await authenticatedFetch(`/api/mentors/tasks/${activeGradeTaskId}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: parseFloat(gradeScore),
          feedback: gradeFeedback
        })
      });
      if (res.ok) {
        setMessage('Task grade and feedback submitted successfully!');
        setActiveGradeTaskId(null);
        setGradeFeedback('');
        fetchData();
      } else {
        const err = await res.json();
        setErrMessage(err.detail || 'Failed to grade task.');
      }
    } catch (err) {
      setErrMessage('Error submitting grade.');
    }
  };

  if (loading && students.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        <TrendingUp className="animate-spin text-blue-500 mr-3" /> Fetching mentor dashboards...
      </div>
    );
  }

  const pendingReports = reports.filter(r => r.status === 'pending');
  const submittedTasks = tasks.filter(t => t.status === 'submitted');

  return (
    <div className="min-h-screen pb-16">
      {/* Navigation Header */}
      <nav className="glass-panel sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold font-heading bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            NEXORA'S MENTOR
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-300">
            {name}
          </span>
          <button
            onClick={logout}
            className="px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        
        {/* Messages and Alerts */}
        {message && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex gap-3 animate-fade-in">
            <CheckCircle size={18} className="shrink-0" />
            <span>{message}</span>
          </div>
        )}
        {errMessage && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-3 animate-fade-in">
            <ShieldAlert size={18} className="shrink-0" />
            <span>{errMessage}</span>
          </div>
        )}

        {/* Dynamic Intern Cards with ML Risk levels */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-extrabold text-xl text-white flex items-center gap-2">
              <Users size={20} className="text-blue-400" /> Assigned Student Interns (AI Predicted Risk)
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-400">
              Total: {students.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {students.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center md:col-span-3">No students currently mapped by the Administrator.</p>
            ) : (
              students.map((student) => (
                <div 
                  key={student.id} 
                  className={`glass-panel p-6 rounded-2xl relative overflow-hidden transition duration-300 border-l-4 ${
                    student.predicted_grade === 'Outstanding' ? 'border-l-emerald-500 hover:shadow-emerald-500/5' :
                    student.predicted_grade === 'At Risk' ? 'border-l-red-500 hover:shadow-red-500/5' :
                    'border-l-cyan-500 hover:shadow-cyan-500/5'
                  }`}
                >
                  {/* Class Badge indicator */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-slate-100 text-base">{student.name}</h4>
                      <p className="text-[10px] text-slate-400">{student.college}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      student.predicted_grade === 'Outstanding' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      student.predicted_grade === 'At Risk' ? 'bg-red-500/15 text-red-400 border border-red-500/20 animate-pulse' :
                      'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    }`}>
                      {student.predicted_grade}
                    </span>
                  </div>

                  {/* Feature lists */}
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-850 text-xs">
                    <div>
                      <span className="block text-[8px] font-semibold text-slate-500 uppercase tracking-widest">Attendance</span>
                      <span className="text-slate-300 font-bold">{student.attendance_rate * 100}%</span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-semibold text-slate-500 uppercase tracking-widest">Tasks Met</span>
                      <span className="text-slate-300 font-bold">{student.task_completion_rate * 100}%</span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-semibold text-slate-500 uppercase tracking-widest">Report Quality</span>
                      <span className="text-slate-300 font-bold">{student.avg_report_quality}%</span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-semibold text-slate-500 uppercase tracking-widest">Success Prob</span>
                      <span className="text-emerald-400 font-bold">{student.completion_probability * 100}%</span>
                    </div>
                  </div>

                  {/* Risk Alert Flag */}
                  {student.predicted_grade === 'At Risk' && (
                    <div className="mt-4 p-2 rounded bg-red-500/10 border border-red-500/20 text-[9px] text-red-400 flex items-center gap-1.5">
                      <ShieldAlert size={12} /> Proactive review recommended. Intern shows low attendance or engagement indicators.
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Dual Form Section: Assigner and Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Assign a New Task Form */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-heading font-bold text-lg text-white mb-4 flex items-center gap-2">
              <PlusSquare size={18} className="text-blue-400" /> Assign New Technical Task
            </h3>
            <form onSubmit={handleAssignTask} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Select Intern Recipient
                </label>
                <select
                  required
                  className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-800 focus:border-blue-500 rounded-lg text-sm text-slate-300 outline-none"
                  value={taskStudentId}
                  onChange={(e) => setTaskStudentId(e.target.value)}
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.internship_domain})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-800 focus:border-blue-500 rounded-lg text-sm text-slate-200 outline-none"
                  placeholder="Supervised Classification using Random Forests"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Instructions & Specifications
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full p-4 bg-slate-900/80 border border-slate-800 focus:border-blue-500 rounded-lg text-sm text-slate-200 outline-none"
                  placeholder="Outline step-by-step goals, datasets to source, and validation metric targets."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Deadline Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-800 focus:border-blue-500 rounded-lg text-sm text-slate-200 outline-none"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xs hover:shadow-lg transition"
              >
                Dispatch Task Assignment
              </button>
            </form>
          </div>

          {/* Pending Daily Reports review panel */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-white mb-4 flex items-center gap-2">
                <FileText size={18} className="text-cyan-400" /> Pending Daily Reports ({pendingReports.length})
              </h3>
              
              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                {pendingReports.length === 0 ? (
                  <p className="text-xs text-slate-500 py-12 text-center">No reports awaiting approval.</p>
                ) : (
                  pendingReports.map((rep) => {
                    const studentName = students.find(s => s.id === rep.student_id)?.name || 'Intern';
                    return (
                      <div key={rep.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-200">{studentName}</span>
                          <span className="text-slate-500 text-[10px]">{rep.date}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-mono">"{rep.content}"</p>
                        {rep.blockers && (
                          <p className="text-[10px] text-red-400 font-mono">Blockers: {rep.blockers}</p>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t border-slate-800/40 text-[10px]">
                          <span className="text-cyan-400 font-semibold">NLP Score: {rep.quality_score}% ({rep.key_phrases})</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReviewReport(rep.id, 'rejected')}
                              className="p-1 hover:bg-red-500/10 text-red-500 rounded"
                            >
                              <XCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleReviewReport(rep.id, 'approved')}
                              className="p-1 hover:bg-emerald-500/10 text-emerald-400 rounded"
                            >
                              <CheckCircle size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Task Outputs Evaluation Grid */}
        <section className="glass-panel p-6 rounded-2xl">
          <h3 className="font-heading font-bold text-lg text-white mb-4 flex items-center gap-2">
            <Award size={18} className="text-indigo-400" /> Task Submissions Awaiting Evaluation ({submittedTasks.length})
          </h3>
          
          <div className="space-y-4">
            {submittedTasks.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No intern outputs awaiting review.</p>
            ) : (
              submittedTasks.map((task) => {
                const studentName = students.find(s => s.id === task.assigned_to_student_id)?.name || 'Intern';
                return (
                  <div key={task.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-slate-200">{task.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Assigned to: <strong className="text-slate-300">{studentName}</strong> | Submitted: {task.submitted_at?.split('T')[0]}</p>
                      </div>
                      
                      {activeGradeTaskId !== task.id && (
                        <button
                          onClick={() => {
                            setActiveGradeTaskId(task.id);
                            setGradeScore(85);
                            setGradeFeedback('');
                          }}
                          className="py-1 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold transition"
                        >
                          Evaluate Output
                        </button>
                      )}
                    </div>
                    
                    <div className="p-3 bg-slate-950/80 rounded border border-slate-900 text-xs font-mono text-slate-400 leading-normal">
                      <strong className="text-[10px] text-slate-500 block uppercase tracking-wider mb-1">Intern Solution Output:</strong>
                      {task.submission_text || 'No solution text provided.'}
                    </div>

                    {activeGradeTaskId === task.id && (
                      <form onSubmit={handleGradeSubmit} className="space-y-4 p-4 bg-slate-950/60 rounded border border-slate-800">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Score (0 - 100)</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              required
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-slate-200"
                              value={gradeScore}
                              onChange={(e) => setGradeScore(e.target.value)}
                            />
                          </div>
                          <div className="md:col-span-3">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Review Feedback</label>
                            <input
                              type="text"
                              required
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-slate-200"
                              placeholder="Outline strengths or specify details requiring improvement."
                              value={gradeFeedback}
                              onChange={(e) => setGradeFeedback(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setActiveGradeTaskId(null)}
                            className="text-xs text-slate-500 font-bold py-1.5 px-3 hover:text-slate-400"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold py-1.5 px-4"
                          >
                            Submit Evaluation
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
