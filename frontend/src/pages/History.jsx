import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  History as HistoryIcon, 
  Search, 
  Trash2, 
  Eye, 
  FileText, 
  Calendar, 
  UploadCloud
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { deleteAnalysisById } from '../services/api';

export default function History() {
  const { history, refreshHistory, setCurrentAnalysis, loadSample } = useResume();
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const filteredHistory = (history || []).filter((item) => {
    const term = searchTerm.toLowerCase();
    const candidateName = item.candidate?.name?.toLowerCase() || '';
    const fileName = item.originalFileName?.toLowerCase() || '';
    return candidateName.includes(term) || fileName.includes(term);
  });

  const handleView = (item) => {
    setCurrentAnalysis(item);
    navigate(`/analysis/${item.id}`);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this resume analysis record?')) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteAnalysisById(id);
      await refreshHistory();
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleReanalyze = async (item, e) => {
    e.stopPropagation();
    setCurrentAnalysis(item);
    navigate(`/analysis/${item.id}`);
  };

  const handleLoadSample = async () => {
    try {
      const res = await loadSample('sample-fullstack');
      navigate(`/analysis/${res.id}`);
    } catch (e) {
      navigate('/upload');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Resume Analysis History
            </h1>
            <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-coral-50 text-[#ff5656] border border-coral-200">
              {filteredHistory.length} Records
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View, review, or re-evaluate previously parsed candidate resumes.
          </p>
        </div>

        <Link
          to="/upload"
          className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-2xl text-xs sm:text-sm font-bold bg-[#ff5656] text-white hover:bg-[#ff4242] transition-colors shadow-md shadow-[#ff5656]/20"
        >
          <UploadCloud className="w-4 h-4" />
          Upload New Resume
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by candidate name or resume file..."
          className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff5656] shadow-sm transition-colors"
        />
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
            <HistoryIcon className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-heading">
            No Resume Analyses Found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            {searchTerm
              ? 'No records match your search criteria. Try a different query.'
              : 'You have not analyzed any resumes yet. Upload a resume or try our sample resume.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleLoadSample}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#ff5656] text-white hover:bg-[#ff4242] shadow-sm transition-all"
            >
              Load Sample Resume
            </button>
            <Link
              to="/upload"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all border border-slate-200"
            >
              Upload Document
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => {
            const overall = item.scores?.overall || 80;
            const ats = item.scores?.ats || 85;

            return (
              <div
                key={item.id}
                onClick={() => handleView(item)}
                className="bg-white rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer border border-slate-200 shadow-sm hover:border-[#ff5656] hover:shadow-md transition-all"
              >
                {/* Info */}
                <div className="flex items-start gap-4 overflow-hidden">
                  <div className="p-3 rounded-2xl bg-coral-50 text-[#ff5656] shrink-0 mt-0.5">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="overflow-hidden space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900 font-heading truncate">
                        {item.candidate?.name || 'Candidate Resume'}
                      </h3>
                      <span className="text-xs text-slate-500">
                        ({item.originalFileName || 'Resume.pdf'})
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                      <span>
                        • {(item.skills?.technical?.length || 0)} Tech Skills Extracted
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scores & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="text-center px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Score
                      </span>
                      <span className="text-sm font-black text-[#ff5656] font-heading">
                        {overall}%
                      </span>
                    </div>

                    <div className="text-center px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        ATS
                      </span>
                      <span className="text-sm font-black text-emerald-600 font-heading">
                        {ats}%
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleReanalyze(item, e)}
                      title="View Analysis"
                      className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      disabled={deletingId === item.id}
                      title="Delete Record"
                      className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
