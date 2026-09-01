import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  FileText, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { uploadResumeFile, analyzeResumeText } from '../services/api';
import { useResume } from '../context/ResumeContext';
import { SAMPLE_RESUMES } from '../utils/sampleResumes';

export default function ResumeUploader({ onAnalysisComplete }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | uploading | analyzing | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { setCurrentAnalysis, refreshHistory, loadSample } = useResume();

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['pdf', 'docx', 'doc', 'txt'];

    if (!validExtensions.includes(ext)) {
      setErrorMessage('Please upload a valid PDF or DOCX file.');
      setStatus('error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds 10MB. Please upload a smaller document.');
      setStatus('error');
      return;
    }

    setErrorMessage('');
    setSelectedFile(file);
    setStatus('idle');
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setStatus('idle');
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) return;

    try {
      setStatus('uploading');
      setUploadProgress(25);

      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 85) {
            clearInterval(progressTimer);
            return 85;
          }
          return prev + 15;
        });
      }, 200);

      const uploadRes = await uploadResumeFile(selectedFile);
      clearInterval(progressTimer);
      setUploadProgress(90);
      setStatus('analyzing');

      const analysisResult = await analyzeResumeText(
        uploadRes.text,
        uploadRes.fileName,
        uploadRes.fileSize
      );

      setUploadProgress(100);
      setStatus('success');
      setCurrentAnalysis(analysisResult);
      await refreshHistory();

      if (onAnalysisComplete) {
        onAnalysisComplete(analysisResult);
      } else {
        navigate(`/analysis/${analysisResult.id}`);
      }
    } catch (err) {
      console.error('Processing error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'An error occurred while analyzing the resume.');
    }
  };

  const handleSampleClick = async (sampleId) => {
    try {
      setStatus('analyzing');
      setUploadProgress(60);
      const res = await loadSample(sampleId);
      setUploadProgress(100);
      setStatus('success');
      if (onAnalysisComplete) {
        onAnalysisComplete(res);
      } else {
        navigate(`/analysis/${res.id}`);
      }
    } catch (e) {
      setStatus('error');
      setErrorMessage('Failed to load sample resume.');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 transition-all duration-200 text-center ${
          !selectedFile ? 'cursor-pointer' : ''
        } ${
          dragOver
            ? 'border-[#ff5656] bg-coral-50 scale-[1.01]'
            : selectedFile
            ? 'border-coral-300 bg-white'
            : 'border-slate-300 bg-white hover:border-[#ff5656] hover:bg-slate-50/70 shadow-sm'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept=".pdf,.docx,.doc,.txt"
          className="hidden"
        />

        {!selectedFile ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-coral-50 text-[#ff5656] flex items-center justify-center shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Drag & drop your resume here
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Supports PDF and DOCX formats (Max 10MB)
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-[#ff5656] text-white hover:bg-[#ff4242] shadow-md shadow-[#ff5656]/20 transition-all"
              >
                Browse File
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* File Info Card */}
            <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-3 rounded-xl bg-coral-50 text-[#ff5656] shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-900 truncate font-heading">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>

              {status !== 'uploading' && status !== 'analyzing' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="text-xs font-semibold text-[#ff5656] hover:underline px-2.5 py-1.5 rounded-lg bg-white border border-slate-200"
                  >
                    Replace
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {(status === 'uploading' || status === 'analyzing' || status === 'success') && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-600 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#ff5656]" />
                    {status === 'uploading'
                      ? 'Extracting resume content...'
                      : status === 'analyzing'
                      ? 'Evaluating ATS scores & skills...'
                      : 'Analysis Complete!'}
                  </span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-[#ff5656] to-orange-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Trigger */}
            {status !== 'uploading' && status !== 'analyzing' && (
              <button
                onClick={handleUploadAndAnalyze}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-base font-bold bg-[#ff5656] hover:bg-[#ff4242] text-white shadow-xl shadow-[#ff5656]/25 hover:shadow-[#ff5656]/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Analyze Resume with JSR AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Error Banner */}
      {status === 'error' && errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Upload Error</p>
            <p className="mt-0.5 text-rose-600">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Try Sample Resumes for Viva Demo */}
      <div className="pt-2">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            1-Click Demo Sample Resumes
          </span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SAMPLE_RESUMES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSampleClick(sample.id)}
              disabled={status === 'uploading' || status === 'analyzing'}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#ff5656] hover:shadow-md text-left transition-all group disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 group-hover:text-[#ff5656] font-heading">
                  {sample.title}
                </span>
                <span className="text-[10px] text-[#ff5656] font-bold uppercase px-2 py-0.5 rounded bg-coral-50 border border-coral-200">
                  Instant Load
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {sample.fileName}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
