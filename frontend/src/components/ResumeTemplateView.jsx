import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  Download, 
  Printer, 
  Palette, 
  Layout, 
  Check, 
  FileText, 
  Copy, 
  Image as ImageIcon,
  Sliders,
  Share2
} from 'lucide-react';

export const TEMPLATE_OPTIONS = [
  { id: 'kickresume', name: 'Kickresume Two-Column', desc: 'Modern sidebar with skill gauges & avatar', badge: 'Popular' },
  { id: 'executive', name: 'Executive Clean', desc: 'Classic ATS-optimized single-column layout', badge: 'ATS Friendly' },
  { id: 'techlead', name: 'Tech Lead Pro', desc: 'Sleek dark navy headers & tech badges', badge: 'Tech Stack' },
  { id: 'editorial', name: 'Editorial Serif', desc: 'Elegant typography for senior & academic roles', badge: 'Clean' },
  { id: 'creative', name: 'Creative Coral', desc: 'Vibrant modern grid with bold highlights', badge: 'Modern' },
];

export const COLOR_PALETTES = [
  { id: 'coral', name: 'Coral Red', hex: '#ff5656', light: '#fff1f2' },
  { id: 'blue', name: 'Ocean Blue', hex: '#2563eb', light: '#eff6ff' },
  { id: 'emerald', name: 'Emerald Green', hex: '#059669', light: '#ecfdf5' },
  { id: 'purple', name: 'Royal Purple', hex: '#7c3aed', light: '#f5f3ff' },
  { id: 'dark', name: 'Midnight Slate', hex: '#1e293b', light: '#f8fafc' },
];

export default function ResumeTemplateView({ resumeData }) {
  const resumeRef = useRef(null);
  const [selectedTemplate, setSelectedTemplate] = useState('kickresume');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTES[0]);
  const [showPhoto, setShowPhoto] = useState(true);
  const [fontSize, setFontSize] = useState('normal'); // compact | normal | large
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!resumeData) return null;

  const { candidate, summary, education, experience, skills, projects, certifications } = resumeData;

  // 1-Click PDF Download using html2canvas & jsPDF
  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    try {
      setDownloading(true);
      const element = resumeRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `${(candidate?.name || 'Resume').replace(/\s+/g, '_')}_JSR_Resume.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('PDF generation error:', err);
      // Fallback to browser print
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handleBrowserPrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const plainText = `${candidate?.name || 'Candidate Name'}
Email: ${candidate?.email || ''} | Phone: ${candidate?.phone || ''} | Location: ${candidate?.location || ''}
${candidate?.linkedin ? `LinkedIn: ${candidate.linkedin}` : ''} | ${candidate?.github ? `GitHub: ${candidate.github}` : ''}

SUMMARY:
${summary || ''}

SKILLS:
Technical: ${skills?.technical?.join(', ') || ''}
Soft Skills: ${skills?.soft?.join(', ') || ''}

EXPERIENCE:
${experience?.map((e) => `${e.role} - ${e.company} (${e.duration})\n${e.responsibilities?.map((r) => `• ${r}`).join('\n')}`).join('\n\n')}

PROJECTS:
${projects?.map((p) => `${p.title} [${p.techStack?.join(', ')}]\n${p.description}`).join('\n\n')}

EDUCATION:
${education?.map((ed) => `${ed.degree} - ${ed.college} (${ed.year}) | Score: ${ed.score}`).join('\n')}`;

    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Customization Toolbar */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
              <Layout className="w-5 h-5 text-[#ff5656]" />
              Choose Template & 1-Click Download
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select any design template, customize colors, and download a print-ready PDF resume.
            </p>
          </div>

          {/* Action Download Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>

            <button
              onClick={handleBrowserPrint}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print / Vector PDF
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#ff5656] hover:bg-[#ff4242] text-white shadow-lg shadow-[#ff5656]/25 transition-all disabled:opacity-50"
            >
              <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
              {downloading ? 'Generating PDF...' : '1-Click Download PDF'}
            </button>
          </div>
        </div>

        {/* Template Selector Pills */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block font-heading">
            Select Template Style ({TEMPLATE_OPTIONS.length}):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {TEMPLATE_OPTIONS.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl.id)}
                className={`p-3.5 rounded-2xl text-left border transition-all ${
                  selectedTemplate === tmpl.id
                    ? 'border-[#ff5656] bg-coral-50/60 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 font-heading">
                    {tmpl.name}
                  </span>
                  {selectedTemplate === tmpl.id && (
                    <span className="w-2 h-2 rounded-full bg-[#ff5656]" />
                  )}
                </div>
                <span className="text-[10px] text-slate-500 line-clamp-1 block">
                  {tmpl.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette & Customizer Settings */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
          {/* Colors */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-slate-500" />
              Theme Accent:
            </span>
            <div className="flex items-center gap-2">
              {COLOR_PALETTES.map((pal) => (
                <button
                  key={pal.id}
                  onClick={() => setSelectedColor(pal)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    selectedColor.id === pal.id ? 'scale-125 border-slate-900 shadow-md' : 'border-white'
                  }`}
                  style={{ backgroundColor: pal.hex }}
                  title={pal.name}
                />
              ))}
            </div>
          </div>

          {/* Photo & Size Controls */}
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPhoto}
                onChange={(e) => setShowPhoto(e.target.checked)}
                className="w-4 h-4 rounded text-[#ff5656] focus:ring-[#ff5656]"
              />
              <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>Show Photo</span>
            </label>

            <div className="flex items-center gap-1 font-semibold text-slate-700">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Spacing:</span>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none"
              >
                <option value="compact">Compact</option>
                <option value="normal">Standard</option>
                <option value="large">Spacious</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE RESUME SHEET (PRINT & DOWNLOAD READY) */}
      <div className="flex justify-center p-2 sm:p-4 overflow-x-auto">
        <div
          ref={resumeRef}
          id="printable-resume"
          className="w-full max-w-[800px] min-h-[1050px] bg-white text-slate-900 shadow-2xl rounded-2xl border border-slate-200 overflow-hidden font-sans transition-all"
          style={{
            fontSize: fontSize === 'compact' ? '12px' : fontSize === 'large' ? '14px' : '13px',
          }}
        >
          {/* ===================== TEMPLATE 1: KICKRESUME TWO-COLUMN ===================== */}
          {selectedTemplate === 'kickresume' && (
            <div className="grid grid-cols-12 min-h-[1050px]">
              {/* Dark Sidebar */}
              <div className="col-span-4 bg-[#1e232f] text-slate-300 p-6 space-y-6 flex flex-col justify-between">
                <div className="space-y-6">
                  {showPhoto && (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 mx-auto shadow-md" style={{ borderColor: selectedColor.hex }}>
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="text-center space-y-1">
                    <h2 className="text-lg font-black text-white font-heading leading-tight">
                      {candidate?.name || 'Candidate Name'}
                    </h2>
                    <p className="text-xs font-semibold" style={{ color: selectedColor.hex }}>
                      {experience?.[0]?.role || 'Software Engineer'}
                    </p>
                  </div>

                  {/* Contact */}
                  <div className="space-y-2 text-xs border-t border-slate-700/80 pt-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                      CONTACT
                    </span>
                    {candidate?.email && <p className="text-[11px] truncate">✉ {candidate.email}</p>}
                    {candidate?.phone && <p className="text-[11px]">📞 {candidate.phone}</p>}
                    {candidate?.location && <p className="text-[11px]">📍 {candidate.location}</p>}
                    {candidate?.linkedin && <p className="text-[11px] truncate">🔗 {candidate.linkedin}</p>}
                    {candidate?.github && <p className="text-[11px] truncate">💻 {candidate.github}</p>}
                  </div>

                  {/* Skills */}
                  <div className="space-y-2 border-t border-slate-700/80 pt-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                      CORE SKILLS
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {skills?.technical?.slice(0, 10).map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-200 border border-slate-700"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="space-y-2 border-t border-slate-700/80 pt-4 text-xs">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                      EDUCATION
                    </span>
                    {education?.map((edu, idx) => (
                      <div key={idx} className="space-y-0.5 text-[11px]">
                        <p className="font-bold text-white">{edu.degree}</p>
                        <p className="text-slate-400">{edu.college}</p>
                        <p className="text-slate-500 text-[10px]">{edu.year} • {edu.score}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 text-center pt-4 border-t border-slate-800">
                  Verified by JSR AI • Dev by Ankit Dev
                </div>
              </div>

              {/* Main Content */}
              <div className="col-span-8 p-8 space-y-6 bg-white">
                {/* Profile Summary */}
                {summary && (
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">
                      PROFESSIONAL PROFILE
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-700">
                      {summary}
                    </p>
                  </div>
                )}

                {/* Experience */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b text-slate-900 font-heading" style={{ borderColor: selectedColor.hex }}>
                    WORK EXPERIENCE
                  </h3>
                  {experience?.map((exp, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-bold text-slate-900">{exp.role}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: selectedColor.light, color: selectedColor.hex }}>
                          {exp.duration}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-600">{exp.company}</p>
                      <ul className="space-y-1 pl-3 text-xs text-slate-600 list-disc">
                        {exp.responsibilities?.map((r, ri) => (
                          <li key={ri} className="leading-relaxed">{r}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Key Projects */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b text-slate-900 font-heading" style={{ borderColor: selectedColor.hex }}>
                    KEY PROJECTS
                  </h3>
                  {projects?.map((proj, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {proj.techStack?.slice(0, 3).join(', ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>

                {/* Certifications */}
                {certifications?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b text-slate-900 font-heading" style={{ borderColor: selectedColor.hex }}>
                      CERTIFICATIONS & AWARDS
                    </h3>
                    <ul className="space-y-1 pl-3 text-xs text-slate-700 list-disc">
                      {certifications.map((c, ci) => (
                        <li key={ci}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== TEMPLATE 2: EXECUTIVE CLEAN ===================== */}
          {selectedTemplate === 'executive' && (
            <div className="p-10 space-y-6">
              {/* Header */}
              <div className="text-center pb-6 border-b-2" style={{ borderColor: selectedColor.hex }}>
                <h1 className="text-2xl font-black text-slate-900 font-heading uppercase tracking-wide">
                  {candidate?.name || 'Candidate Name'}
                </h1>
                <p className="text-xs font-bold mt-1" style={{ color: selectedColor.hex }}>
                  {experience?.[0]?.role || 'Full Stack Engineer'}
                </p>
                <div className="flex justify-center flex-wrap gap-4 text-xs text-slate-600 mt-2">
                  {candidate?.email && <span>{candidate.email}</span>}
                  {candidate?.phone && <span>• {candidate.phone}</span>}
                  {candidate?.location && <span>• {candidate.location}</span>}
                  {candidate?.linkedin && <span>• {candidate.linkedin}</span>}
                </div>
              </div>

              {/* Summary */}
              {summary && (
                <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 font-heading">
                    PROFESSIONAL SUMMARY
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-700">{summary}</p>
                </div>
              )}

              {/* Skills */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 font-heading">
                  TECHNICAL SKILLS
                </h3>
                <p className="text-xs text-slate-700">
                  <strong className="text-slate-900">Core Technologies: </strong>
                  {skills?.technical?.join(' • ')}
                </p>
                <p className="text-xs text-slate-700">
                  <strong className="text-slate-900">Soft Skills & Methodologies: </strong>
                  {skills?.soft?.join(' • ')}
                </p>
              </div>

              {/* Experience */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 font-heading">
                  WORK EXPERIENCE
                </h3>
                {experience?.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline font-bold text-xs text-slate-900">
                      <span>{exp.role} — <span className="font-semibold text-slate-700">{exp.company}</span></span>
                      <span className="text-slate-500 font-medium">{exp.duration}</span>
                    </div>
                    <ul className="space-y-1 pl-4 text-xs text-slate-600 list-disc">
                      {exp.responsibilities?.map((r, ri) => (
                        <li key={ri}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 font-heading">
                  PROJECTS
                </h3>
                {projects?.map((proj, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline font-bold text-xs text-slate-900">
                      <span>{proj.title}</span>
                      <span className="text-xs font-medium text-slate-500">{proj.techStack?.join(', ')}</span>
                    </div>
                    <p className="text-xs text-slate-600">{proj.description}</p>
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 font-heading">
                  EDUCATION
                </h3>
                {education?.map((edu, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-slate-800">
                    <div>
                      <span className="font-bold">{edu.degree}</span> • {edu.college}
                    </div>
                    <span className="text-slate-500">{edu.year} ({edu.score})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TEMPLATE 3: TECH LEAD NAVY ===================== */}
          {selectedTemplate === 'techlead' && (
            <div>
              {/* Dark Top Banner */}
              <div className="p-8 text-white" style={{ backgroundColor: '#0f172a' }}>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h1 className="text-2xl font-black font-heading tracking-wide">
                      {candidate?.name || 'Candidate Name'}
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: selectedColor.hex }}>
                      {experience?.[0]?.role || 'Senior Software Developer'}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-300 pt-1">
                      {candidate?.email && <span>✉ {candidate.email}</span>}
                      {candidate?.phone && <span>📞 {candidate.phone}</span>}
                      {candidate?.location && <span>📍 {candidate.location}</span>}
                    </div>
                  </div>
                  {showPhoto && (
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2" style={{ borderColor: selectedColor.hex }}>
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80"
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Main Content */}
              <div className="p-8 space-y-6">
                {/* Tech Badges Grid */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
                    TECH STACK & TOOLS
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skills?.technical?.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-800 border border-slate-200 shadow-sm"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b text-slate-900 font-heading flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedColor.hex }} />
                    WORK EXPERIENCE
                  </h3>
                  {experience?.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-xs text-slate-900">{exp.role} — <span className="text-slate-600">{exp.company}</span></span>
                        <span className="text-[11px] font-bold text-slate-500">{exp.duration}</span>
                      </div>
                      <ul className="space-y-1 pl-4 text-xs text-slate-600 list-disc">
                        {exp.responsibilities?.map((r, ri) => (
                          <li key={ri}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Projects */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b text-slate-900 font-heading flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedColor.hex }} />
                    PROJECT HIGHLIGHTS
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {projects?.map((proj, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <h4 className="font-bold text-xs text-slate-900">{proj.title}</h4>
                        <p className="text-xs text-slate-600">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b text-slate-900 font-heading flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedColor.hex }} />
                    EDUCATION
                  </h3>
                  {education?.map((edu, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-slate-700">
                      <span><strong>{edu.degree}</strong> ({edu.college})</span>
                      <span className="text-slate-500">{edu.year} • {edu.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================== TEMPLATE 4: EDITORIAL SERIF ===================== */}
          {selectedTemplate === 'editorial' && (
            <div className="p-10 space-y-6 font-serif">
              <div className="text-center pb-4 border-b border-slate-300">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {candidate?.name || 'Candidate Name'}
                </h1>
                <p className="text-xs italic text-slate-600 mt-1">
                  {candidate?.email} • {candidate?.phone} • {candidate?.location}
                </p>
              </div>

              {summary && (
                <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-sans">
                    About
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-800 italic">{summary}</p>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-sans border-b pb-1">
                  Experience
                </h3>
                {experience?.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-900">
                      <span>{exp.role}, {exp.company}</span>
                      <span className="italic font-normal">{exp.duration}</span>
                    </div>
                    <ul className="space-y-1 pl-4 text-xs text-slate-700 list-disc font-sans">
                      {exp.responsibilities?.map((r, ri) => (
                        <li key={ri}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-sans border-b pb-1">
                  Key Skills & Education
                </h3>
                <p className="text-xs text-slate-800 font-sans">
                  <strong>Technical Competencies: </strong> {skills?.technical?.join(', ')}
                </p>
                {education?.map((edu, idx) => (
                  <p key={idx} className="text-xs text-slate-800">
                    <strong>{edu.degree}</strong>, {edu.college} — <em>{edu.year} ({edu.score})</em>
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TEMPLATE 5: CREATIVE CORAL ===================== */}
          {selectedTemplate === 'creative' && (
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start pb-6 border-b-4" style={{ borderColor: selectedColor.hex }}>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full" style={{ backgroundColor: selectedColor.light, color: selectedColor.hex }}>
                    AI Parsed Profile
                  </span>
                  <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
                    {candidate?.name || 'Candidate Name'}
                  </h1>
                  <p className="text-xs text-slate-600 font-semibold">
                    {candidate?.email} | {candidate?.phone} | {candidate?.location}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black" style={{ color: selectedColor.hex }}>94%</span>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">ATS Score</span>
                </div>
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-7 space-y-5">
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
                      EXPERIENCE
                    </h3>
                    {experience?.map((exp, idx) => (
                      <div key={idx} className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-900">{exp.role} • {exp.company}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold">{exp.duration}</span>
                        <ul className="space-y-1 pl-3 text-xs text-slate-600 list-disc">
                          {exp.responsibilities?.map((r, ri) => (
                            <li key={ri}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-5 space-y-5">
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
                      SKILLS
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {skills?.technical?.map((sk, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md text-[11px] font-bold" style={{ backgroundColor: selectedColor.light, color: selectedColor.hex }}>
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
                      EDUCATION
                    </h3>
                    {education?.map((edu, idx) => (
                      <div key={idx} className="text-xs space-y-0.5">
                        <p className="font-bold text-slate-900">{edu.degree}</p>
                        <p className="text-slate-500">{edu.college}</p>
                        <p className="text-[10px] text-slate-400">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
