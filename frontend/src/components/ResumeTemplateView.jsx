import React, { useRef, useState, useEffect } from 'react';
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
  Upload,
  Trash2,
  Sparkles,
  Sliders,
  Type,
  Maximize2,
  FileJson,
  CheckCircle2,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';

export const TEMPLATE_OPTIONS = [
  { id: 'kickresume', name: 'Two-Column Sidebar', desc: 'Modern sleek sidebar with skill gauges & photo', badge: 'Popular' },
  { id: 'executive', name: 'Executive Clean ATS', desc: 'Classic ATS-optimized single-column layout', badge: 'ATS #1' },
  { id: 'techlead', name: 'Tech Lead Navy Pro', desc: 'Dark modern header with tech stack badges', badge: 'Tech Stack' },
  { id: 'modernist', name: 'Modernist Gradient', desc: 'Vibrant top banner with floating avatar & dual grid', badge: 'New & Trendy' },
  { id: 'harvard', name: 'Harvard Classic Ivy', desc: 'Black & white ivy-league bulletproof ATS format', badge: 'Ivy League' },
  { id: 'editorial', name: 'Editorial Serif', desc: 'Elegant typography for senior, academic & consulting', badge: 'Serif Style' },
  { id: 'creative', name: 'Creative Dynamic', desc: 'Vibrant asymmetric cards with project highlights', badge: 'Creative' },
  { id: 'compact', name: 'Compact 1-Page Pro', desc: 'High-density layout guaranteed to fit everything on 1 page', badge: 'Dense 1-Page' },
];

export const COLOR_PALETTES = [
  { id: 'coral', name: 'Coral Flame', hex: '#ff5656', light: '#fff1f2', gradient: 'from-[#ff5656] to-[#ff7e5f]' },
  { id: 'blue', name: 'Ocean Blue', hex: '#2563eb', light: '#eff6ff', gradient: 'from-[#2563eb] to-[#38bdf8]' },
  { id: 'emerald', name: 'Emerald Forest', hex: '#059669', light: '#ecfdf5', gradient: 'from-[#059669] to-[#34d399]' },
  { id: 'purple', name: 'Royal Violet', hex: '#7c3aed', light: '#f5f3ff', gradient: 'from-[#7c3aed] to-[#c084fc]' },
  { id: 'dark', name: 'Midnight Obsidian', hex: '#0f172a', light: '#f8fafc', gradient: 'from-[#0f172a] to-[#334155]' },
  { id: 'amber', name: 'Sunset Amber', hex: '#ea580c', light: '#fff7ed', gradient: 'from-[#ea580c] to-[#f59e0b]' },
  { id: 'rose', name: 'Ruby Rose', hex: '#e11d48', light: '#fff1f2', gradient: 'from-[#e11d48] to-[#fb7185]' },
  { id: 'cyan', name: 'Cyber Teal', hex: '#0891b2', light: '#ecfeff', gradient: 'from-[#0891b2] to-[#22d3ee]' },
];

export const FONT_OPTIONS = [
  { id: 'sans', name: 'Inter / Clean Sans', css: 'font-sans' },
  { id: 'heading', name: 'Outfit / Modern Bold', css: 'font-heading' },
  { id: 'serif', name: 'Merriweather / Serif', css: 'font-serif' },
  { id: 'mono', name: 'JetBrains / Tech Mono', css: 'font-mono' },
];

export const PRESET_AVATARS = [
  { id: 'av1', label: 'Pro Male 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
  { id: 'av2', label: 'Pro Male 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
  { id: 'av3', label: 'Pro Female 1', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80' },
  { id: 'av4', label: 'Tech Pro', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
];

export default function ResumeTemplateView({ resumeData, onUpdateResume }) {
  const resumeRef = useRef(null);
  const fileInputRef = useRef(null);

  const [selectedTemplate, setSelectedTemplate] = useState('kickresume');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTES[0]);
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0]);
  const [showPhoto, setShowPhoto] = useState(true);
  const [photoShape, setPhotoShape] = useState('circle'); // 'circle' | 'rounded' | 'square'
  const [customPhoto, setCustomPhoto] = useState(
    resumeData?.candidate?.photo || PRESET_AVATARS[0].url
  );
  const [fontSize, setFontSize] = useState('normal'); // 'compact' | 'normal' | 'large'
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    if (resumeData?.candidate?.photo) {
      setCustomPhoto(resumeData.candidate.photo);
    }
  }, [resumeData?.candidate?.photo]);

  if (!resumeData) return null;

  const { candidate, summary, education, experience, skills, projects, certifications, scores } = resumeData;

  // Handle Photo Upload from Local Disk
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        setCustomPhoto(dataUrl);
        setShowPhoto(true);
        if (onUpdateResume) {
          onUpdateResume({
            ...resumeData,
            candidate: {
              ...resumeData.candidate,
              photo: dataUrl
            }
          });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetAvatar = (url) => {
    setCustomPhoto(url);
    setShowPhoto(true);
    setShowAvatarModal(false);
    if (onUpdateResume) {
      onUpdateResume({
        ...resumeData,
        candidate: {
          ...resumeData.candidate,
          photo: url
        }
      });
    }
  };

  const handleRemovePhoto = () => {
    setCustomPhoto('');
    setShowPhoto(false);
    if (onUpdateResume) {
      onUpdateResume({
        ...resumeData,
        candidate: {
          ...resumeData.candidate,
          photo: ''
        }
      });
    }
  };

  // 1-Click High-Res PDF Download
  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    try {
      setDownloading(true);
      const element = resumeRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width mm
      const pageHeight = 297; // A4 height mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 2) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `${(candidate?.name || 'Resume').replace(/\s+/g, '_')}_JSR_Resume.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handleBrowserPrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${(candidate?.name || 'Resume').replace(/\s+/g, '_')}_data.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyText = () => {
    const plainText = `${candidate?.name || 'Candidate Name'}
${candidate?.email || ''} | ${candidate?.phone || ''} | ${candidate?.location || ''}
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

  // Helper for photo shape classes
  const getPhotoShapeClass = () => {
    if (photoShape === 'circle') return 'rounded-full';
    if (photoShape === 'rounded') return 'rounded-2xl';
    return 'rounded-md';
  };

  return (
    <div className="space-y-8">
      {/* Top Customization Control Center */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
        
        {/* Header & Main Export Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-coral-50 text-[#ff5656] mb-1.5 border border-coral-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Customization Studio • 8 Professional Templates</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              Resume Templates & Photo Customizer
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Upload your photo, pick a high-converting template, adjust fonts/colors, and export 1-click PDF.
            </p>
          </div>

          {/* Action Download Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
              title="Copy plain formatted text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>

            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
              title="Export Resume JSON"
            >
              <FileJson className="w-4 h-4" />
              JSON
            </button>

            <button
              onClick={handleBrowserPrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm"
              title="System Vector Print (Ctrl+P)"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#ff5656] hover:bg-[#ff4242] text-white shadow-lg shadow-[#ff5656]/25 transition-all disabled:opacity-50"
            >
              <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
              {downloading ? 'Exporting PDF...' : '1-Click PDF Download'}
            </button>
          </div>
        </div>

        {/* 1. Template Selector Grid (8 Designs) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block font-heading">
              1. Select Resume Template ({TEMPLATE_OPTIONS.length} Styles):
            </label>
            <span className="text-[11px] text-slate-500 font-medium">Click any template for instant live preview</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
            {TEMPLATE_OPTIONS.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl.id)}
                className={`p-3.5 rounded-2xl text-left border transition-all relative overflow-hidden group ${
                  selectedTemplate === tmpl.id
                    ? 'border-[#ff5656] bg-coral-50/70 ring-2 ring-[#ff5656]/20 shadow-md'
                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 font-heading truncate">
                    {tmpl.name}
                  </span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase ${
                    selectedTemplate === tmpl.id 
                      ? 'bg-[#ff5656] text-white' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tmpl.badge}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">
                  {tmpl.desc}
                </p>
                {selectedTemplate === tmpl.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ff5656]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Photo Upload & Management Bar */}
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                {customPhoto && showPhoto ? (
                  <img
                    src={customPhoto}
                    alt="Profile"
                    className={`w-12 h-12 object-cover border-2 shadow-sm ${getPhotoShapeClass()}`}
                    style={{ borderColor: selectedColor.hex }}
                  />
                ) : (
                  <div className={`w-12 h-12 bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm ${getPhotoShapeClass()}`}>
                    <User className="w-6 h-6" />
                  </div>
                )}
                {showPhoto && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[8px] text-white">
                    ✓
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 font-heading flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#ff5656]" />
                  Profile Photo Manager
                </h4>
                <p className="text-[11px] text-slate-500">
                  Upload your headshot or choose from preset avatars
                </p>
              </div>
            </div>

            {/* Photo Action Controls */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold bg-[#ff5656] text-white hover:bg-[#ff4242] shadow-sm transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Photo
              </button>

              <button
                onClick={() => setShowAvatarModal(!showAvatarModal)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Preset Avatars
              </button>

              {customPhoto && (
                <button
                  onClick={handleRemovePhoto}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                  title="Remove Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}

              {/* Show/Hide Toggle */}
              <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer ml-2 select-none">
                <input
                  type="checkbox"
                  checked={showPhoto}
                  onChange={(e) => setShowPhoto(e.target.checked)}
                  className="w-4 h-4 rounded text-[#ff5656] focus:ring-[#ff5656]"
                />
                <span>Include in Resume</span>
              </label>
            </div>
          </div>

          {/* Photo Shape Selector */}
          {showPhoto && customPhoto && (
            <div className="flex items-center gap-4 pt-2 border-t border-slate-200/60 text-xs">
              <span className="font-bold text-slate-600">Photo Shape:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPhotoShape('circle')}
                  className={`px-3 py-1 rounded-lg font-bold border transition-all ${
                    photoShape === 'circle' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Circle
                </button>
                <button
                  onClick={() => setPhotoShape('rounded')}
                  className={`px-3 py-1 rounded-lg font-bold border transition-all ${
                    photoShape === 'rounded' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Rounded Square
                </button>
                <button
                  onClick={() => setPhotoShape('square')}
                  className={`px-3 py-1 rounded-lg font-bold border transition-all ${
                    photoShape === 'square' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Square
                </button>
              </div>
            </div>
          )}

          {/* Preset Avatars Dropdown Modal */}
          {showAvatarModal && (
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-md space-y-2 mt-2">
              <span className="text-xs font-bold text-slate-800 block">Select a Preset Professional Avatar:</span>
              <div className="flex items-center gap-3 flex-wrap">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    onClick={() => handleSelectPresetAvatar(av.url)}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-[#ff5656] hover:bg-coral-50/50 transition-all text-left"
                  >
                    <img src={av.url} alt={av.label} className="w-9 h-9 rounded-full object-cover" />
                    <span className="text-xs font-semibold text-slate-700">{av.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Color, Font & Layout Customization Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          
          {/* Color Palette */}
          <div className="space-y-1.5">
            <span className="font-bold text-slate-800 flex items-center gap-1 font-heading">
              <Palette className="w-3.5 h-3.5 text-slate-500" />
              Theme Accent Color:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {COLOR_PALETTES.map((pal) => (
                <button
                  key={pal.id}
                  onClick={() => setSelectedColor(pal)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    selectedColor.id === pal.id ? 'scale-125 border-slate-900 shadow-md ring-2 ring-[#ff5656]/30' : 'border-white'
                  }`}
                  style={{ backgroundColor: pal.hex }}
                  title={pal.name}
                />
              ))}
            </div>
          </div>

          {/* Typography / Font Selector */}
          <div className="space-y-1.5">
            <span className="font-bold text-slate-800 flex items-center gap-1 font-heading">
              <Type className="w-3.5 h-3.5 text-slate-500" />
              Typography / Font:
            </span>
            <select
              value={selectedFont.id}
              onChange={(e) => {
                const found = FONT_OPTIONS.find((f) => f.id === e.target.value);
                if (found) setSelectedFont(found);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#ff5656]"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          {/* Spacing / Density */}
          <div className="space-y-1.5">
            <span className="font-bold text-slate-800 flex items-center gap-1 font-heading">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              Page Spacing & Density:
            </span>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#ff5656]"
            >
              <option value="compact">Compact (Fit Maximum Content)</option>
              <option value="normal">Standard (Balanced Layout)</option>
              <option value="large">Spacious (Executive Presentation)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LIVE PRINTABLE RESUME CANVAS                                               */}
      {/* ========================================================================= */}
      <div className="flex justify-center p-2 sm:p-4 overflow-x-auto">
        <div
          ref={resumeRef}
          id="printable-resume"
          className={`w-full max-w-[850px] min-h-[1100px] bg-white text-slate-900 shadow-2xl rounded-2xl border border-slate-200 overflow-hidden ${selectedFont.css} transition-all`}
          style={{
            fontSize: fontSize === 'compact' ? '12px' : fontSize === 'large' ? '14px' : '13px',
          }}
        >
          {/* ===================================================================== */}
          {/* TEMPLATE 1: KICKRESUME TWO-COLUMN SIDEBAR                              */}
          {/* ===================================================================== */}
          {selectedTemplate === 'kickresume' && (
            <div className="grid grid-cols-12 min-h-[1100px]">
              {/* Left Dark Sidebar */}
              <div className="col-span-4 bg-[#1e232f] text-slate-300 p-6 space-y-6 flex flex-col justify-between">
                <div className="space-y-6">
                  {showPhoto && customPhoto && (
                    <div 
                      className={`w-28 h-28 overflow-hidden border-2 mx-auto shadow-lg ${getPhotoShapeClass()}`}
                      style={{ borderColor: selectedColor.hex }}
                    >
                      <img
                        src={customPhoto}
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
                      {experience?.[0]?.role || 'Full Stack Engineer'}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 text-xs border-t border-slate-700/80 pt-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                      CONTACT INFO
                    </span>
                    {candidate?.email && <p className="text-[11px] truncate flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-400 shrink-0" /> {candidate.email}</p>}
                    {candidate?.phone && <p className="text-[11px] flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400 shrink-0" /> {candidate.phone}</p>}
                    {candidate?.location && <p className="text-[11px] flex items-center gap-1.5"><MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {candidate.location}</p>}
                    {candidate?.linkedin && <p className="text-[11px] truncate flex items-center gap-1.5"><Globe className="w-3 h-3 text-slate-400 shrink-0" /> {candidate.linkedin}</p>}
                    {candidate?.github && <p className="text-[11px] truncate flex items-center gap-1.5"><ExternalLink className="w-3 h-3 text-slate-400 shrink-0" /> {candidate.github}</p>}
                  </div>

                  {/* Skills Gauges */}
                  <div className="space-y-2 border-t border-slate-700/80 pt-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                      CORE SKILLS
                    </span>
                    <div className="space-y-2">
                      {skills?.technical?.slice(0, 8).map((sk, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span>{sk}</span>
                            <span className="text-slate-400 text-[10px]">90%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.max(65, 95 - idx * 4)}%`,
                                backgroundColor: selectedColor.hex,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Soft Skills */}
                  {skills?.soft?.length > 0 && (
                    <div className="space-y-2 border-t border-slate-700/80 pt-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                        SOFT SKILLS
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {skills.soft.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 text-center pt-4">
                  ATS Verified Candidate Profile
                </div>
              </div>

              {/* Right Content Column */}
              <div className="col-span-8 p-7 space-y-6 bg-white">
                {/* Summary */}
                {summary && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 pb-1" style={{ borderColor: selectedColor.hex }}>
                      PROFESSIONAL SUMMARY
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {summary}
                    </p>
                  </div>
                )}

                {/* Experience */}
                {experience?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 pb-1" style={{ borderColor: selectedColor.hex }}>
                      WORK EXPERIENCE
                    </h3>
                    <div className="space-y-4">
                      {experience.map((exp, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-baseline">
                            <h4 className="text-xs font-bold text-slate-900">
                              {exp.role} <span className="font-semibold text-slate-600">@ {exp.company}</span>
                            </h4>
                            <span className="text-[10px] font-semibold text-slate-400">{exp.duration}</span>
                          </div>
                          {exp.location && <p className="text-[10px] text-slate-400 italic">{exp.location}</p>}
                          <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
                            {exp.responsibilities?.map((r, ri) => (
                              <li key={ri}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {projects?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 pb-1" style={{ borderColor: selectedColor.hex }}>
                      KEY PROJECTS
                    </h3>
                    <div className="space-y-3">
                      {projects.map((proj, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-baseline">
                            <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                            {proj.techStack?.length > 0 && (
                              <span className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ backgroundColor: selectedColor.light, color: selectedColor.hex }}>
                                {proj.techStack.join(', ')}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-700">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {education?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 pb-1" style={{ borderColor: selectedColor.hex }}>
                      EDUCATION & ACADEMICS
                    </h3>
                    <div className="space-y-2">
                      {education.map((edu, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-900">{edu.degree}</p>
                            <p className="text-slate-600">{edu.college}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-slate-500">{edu.year}</p>
                            {edu.score && <p className="font-semibold text-slate-700">Grade: {edu.score}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TEMPLATE 2: EXECUTIVE CLEAN SINGLE-COLUMN ATS                         */}
          {/* ===================================================================== */}
          {selectedTemplate === 'executive' && (
            <div className="p-10 space-y-6">
              {/* Centered Top Header with Photo */}
              <div className="flex items-center justify-between pb-6 border-b-2" style={{ borderColor: selectedColor.hex }}>
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">
                    {candidate?.name || 'Candidate Name'}
                  </h1>
                  <p className="text-xs font-bold" style={{ color: selectedColor.hex }}>
                    {experience?.[0]?.role || 'Full Stack Engineer'}
                  </p>
                  <p className="text-xs text-slate-600 flex flex-wrap gap-2 pt-1">
                    {candidate?.email && <span>{candidate.email}</span>}
                    {candidate?.phone && <span>• {candidate.phone}</span>}
                    {candidate?.location && <span>• {candidate.location}</span>}
                    {candidate?.linkedin && <span>• {candidate.linkedin}</span>}
                  </p>
                </div>

                {showPhoto && customPhoto && (
                  <div 
                    className={`w-20 h-20 overflow-hidden border-2 shadow-sm shrink-0 ${getPhotoShapeClass()}`}
                    style={{ borderColor: selectedColor.hex }}
                  >
                    <img src={customPhoto} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Summary */}
              {summary && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
                    PROFESSIONAL SUMMARY
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
                </div>
              )}

              {/* Skills Matrix */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
                  CORE COMPETENCIES & SKILLS
                </h3>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <p><strong>Technical Skills: </strong>{skills?.technical?.join(' • ')}</p>
                  {skills?.soft?.length > 0 && <p><strong>Soft Skills: </strong>{skills.soft.join(' • ')}</p>}
                </div>
              </div>

              {/* Experience */}
              {experience?.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
                    PROFESSIONAL EXPERIENCE
                  </h3>
                  <div className="space-y-4">
                    {experience.map((exp, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                          <span>{exp.role} — <span className="font-normal text-slate-700">{exp.company}</span></span>
                          <span className="text-slate-500 font-normal">{exp.duration}</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
                          {exp.responsibilities?.map((r, ri) => (
                            <li key={ri}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {projects?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
                    PROJECTS & ACHIEVEMENTS
                  </h3>
                  <div className="space-y-2">
                    {projects.map((proj, idx) => (
                      <div key={idx} className="text-xs space-y-0.5">
                        <p className="font-bold text-slate-900">
                          {proj.title} {proj.techStack?.length > 0 && <span className="font-normal text-slate-500">[{proj.techStack.join(', ')}]</span>}
                        </p>
                        <p className="text-slate-700">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
                    EDUCATION
                  </h3>
                  {education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-slate-800">
                      <span><strong>{edu.degree}</strong>, {edu.college}</span>
                      <span className="text-slate-500">{edu.year} {edu.score ? `(${edu.score})` : ''}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===================================================================== */}
          {/* TEMPLATE 3: TECH LEAD DARK HEADER PRO                                 */}
          {/* ===================================================================== */}
          {selectedTemplate === 'techlead' && (
            <div>
              {/* Dark Tech Header */}
              <div className="bg-[#0b1120] text-white p-8 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1.5 text-center sm:text-left">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                      SENIOR ENGINEERING RESUME
                    </span>
                    <h1 className="text-3xl font-black font-heading tracking-tight text-white">
                      {candidate?.name || 'Candidate Name'}
                    </h1>
                    <p className="text-xs font-mono" style={{ color: selectedColor.hex }}>
                      &gt; {experience?.[0]?.role || 'Full Stack Software Engineer'}
                    </p>
                  </div>

                  {showPhoto && customPhoto && (
                    <div 
                      className={`w-24 h-24 overflow-hidden border-2 shadow-2xl shrink-0 ${getPhotoShapeClass()}`}
                      style={{ borderColor: selectedColor.hex }}
                    >
                      <img src={customPhoto} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-slate-400 font-mono border-t border-slate-800 pt-3">
                  {candidate?.email && <span>✉ {candidate.email}</span>}
                  {candidate?.phone && <span>📞 {candidate.phone}</span>}
                  {candidate?.location && <span>📍 {candidate.location}</span>}
                  {candidate?.github && <span>💻 {candidate.github}</span>}
                  {candidate?.linkedin && <span>🔗 {candidate.linkedin}</span>}
                </div>
              </div>

              {/* Body */}
              <div className="p-8 space-y-6">
                {/* Tech Badges */}
                <div className="space-y-2">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <span style={{ color: selectedColor.hex }}>#</span> TECH STACK & TOOLS
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skills?.technical?.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-xs font-mono font-bold border"
                        style={{
                          backgroundColor: selectedColor.light,
                          color: selectedColor.hex,
                          borderColor: `${selectedColor.hex}30`
                        }}
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                {experience?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <span style={{ color: selectedColor.hex }}>#</span> PRODUCTION EXPERIENCE
                    </h3>
                    <div className="space-y-4">
                      {experience.map((exp, idx) => (
                        <div key={idx} className="space-y-1.5 pl-3 border-l-2" style={{ borderColor: selectedColor.hex }}>
                          <div className="flex justify-between items-baseline">
                            <h4 className="text-xs font-bold text-slate-900 font-mono">
                              {exp.role} <span className="font-semibold text-slate-600">@ {exp.company}</span>
                            </h4>
                            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {exp.duration}
                            </span>
                          </div>
                          <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
                            {exp.responsibilities?.map((r, ri) => (
                              <li key={ri}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {projects?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <span style={{ color: selectedColor.hex }}>#</span> KEY ARCHITECTURE & PROJECTS
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {projects.map((p, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <h4 className="text-xs font-bold text-slate-900">{p.title}</h4>
                          <p className="text-[11px] text-slate-600 line-clamp-3">{p.description}</p>
                          {p.techStack?.length > 0 && (
                            <p className="text-[10px] font-mono font-bold" style={{ color: selectedColor.hex }}>
                              {p.techStack.join(' • ')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {education?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <span style={{ color: selectedColor.hex }}>#</span> EDUCATION
                    </h3>
                    {education.map((edu, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-slate-700">
                        <span><strong>{edu.degree}</strong> ({edu.college})</span>
                        <span className="text-slate-500 font-mono">{edu.year} • {edu.score}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TEMPLATE 4: MODERNIST GRADIENT BANNER DUAL-COLUMN                      */}
          {/* ===================================================================== */}
          {selectedTemplate === 'modernist' && (
            <div>
              {/* Vibrant Gradient Banner */}
              <div 
                className="p-8 text-white relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${selectedColor.hex}, #1e293b)`
                }}
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
                  <div className="space-y-1.5 text-center sm:text-left">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/20 backdrop-blur-sm text-white">
                      Modern Verified Profile
                    </span>
                    <h1 className="text-3xl font-black font-heading tracking-tight text-white">
                      {candidate?.name || 'Candidate Name'}
                    </h1>
                    <p className="text-sm font-semibold text-white/90">
                      {experience?.[0]?.role || 'Full Stack Engineer'}
                    </p>
                    <p className="text-xs text-white/80 pt-1 flex flex-wrap gap-3">
                      {candidate?.email && <span>✉ {candidate.email}</span>}
                      {candidate?.phone && <span>📞 {candidate.phone}</span>}
                      {candidate?.location && <span>📍 {candidate.location}</span>}
                    </p>
                  </div>

                  {showPhoto && customPhoto && (
                    <div 
                      className={`w-24 h-24 overflow-hidden border-4 border-white/80 shadow-2xl shrink-0 ${getPhotoShapeClass()}`}
                    >
                      <img src={customPhoto} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Dual Column Body */}
              <div className="p-8 grid grid-cols-12 gap-6">
                <div className="col-span-12 sm:col-span-7 space-y-6">
                  {/* Summary */}
                  {summary && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedColor.hex }} />
                        Executive Profile
                      </h3>
                      <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {experience?.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedColor.hex }} />
                        Experience Timeline
                      </h3>
                      <div className="space-y-4">
                        {experience.map((exp, idx) => (
                          <div key={idx} className="space-y-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                            <div className="flex justify-between items-baseline">
                              <h4 className="text-xs font-bold text-slate-900">{exp.role}</h4>
                              <span className="text-[10px] text-slate-500 font-semibold">{exp.duration}</span>
                            </div>
                            <p className="text-xs font-semibold" style={{ color: selectedColor.hex }}>{exp.company}</p>
                            <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600 pt-1">
                              {exp.responsibilities?.map((r, ri) => (
                                <li key={ri}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-span-12 sm:col-span-5 space-y-6">
                  {/* Skills Matrix */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedColor.hex }} />
                      Core Competencies
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {skills?.technical?.map((sk, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-xl text-[11px] font-bold" style={{ backgroundColor: selectedColor.light, color: selectedColor.hex }}>
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Projects */}
                  {projects?.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedColor.hex }} />
                        Featured Projects
                      </h3>
                      <div className="space-y-2.5">
                        {projects.map((proj, idx) => (
                          <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                            <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                            <p className="text-[11px] text-slate-600">{proj.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {education?.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedColor.hex }} />
                        Education
                      </h3>
                      {education.map((edu, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <p className="font-bold text-slate-900">{edu.degree}</p>
                          <p className="text-slate-500">{edu.college}</p>
                          <p className="text-[10px] text-slate-400">{edu.year}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TEMPLATE 5: HARVARD CLASSIC IVY LEAGUE (ATS BULLETPROOF)              */}
          {/* ===================================================================== */}
          {selectedTemplate === 'harvard' && (
            <div className="p-10 space-y-5 text-slate-950 font-serif">
              <div className="text-center space-y-1 pb-3 border-b border-black">
                <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide">
                  {candidate?.name || 'Candidate Name'}
                </h1>
                <p className="text-xs text-slate-800">
                  {candidate?.location} • {candidate?.phone} • {candidate?.email}
                  {candidate?.linkedin ? ` • ${candidate.linkedin}` : ''}
                </p>
              </div>

              {/* Education Top (Standard Ivy format) */}
              {education?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 font-sans">
                    EDUCATION
                  </h3>
                  {education.map((edu, idx) => (
                    <div key={idx} className="space-y-0.5 text-xs">
                      <div className="flex justify-between font-bold">
                        <span>{edu.college}</span>
                        <span>{edu.year}</span>
                      </div>
                      <div className="flex justify-between italic">
                        <span>{edu.degree}</span>
                        <span>{edu.score ? `GPA/Score: ${edu.score}` : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Experience */}
              {experience?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 font-sans">
                    PROFESSIONAL EXPERIENCE
                  </h3>
                  {experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between font-bold">
                        <span>{exp.company}</span>
                        <span>{exp.duration}</span>
                      </div>
                      <div className="italic text-slate-800 font-semibold">{exp.role}</div>
                      <ul className="list-disc pl-5 space-y-1 text-slate-800 font-sans">
                        {exp.responsibilities?.map((r, ri) => (
                          <li key={ri}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {projects?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 font-sans">
                    PROJECTS & RESEARCH
                  </h3>
                  {projects.map((p, idx) => (
                    <div key={idx} className="space-y-0.5 text-xs">
                      <div className="font-bold">
                        {p.title} {p.techStack?.length > 0 && <span className="font-normal italic font-sans text-slate-700">| {p.techStack.join(', ')}</span>}
                      </div>
                      <p className="text-slate-800 font-sans">{p.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 font-sans">
                  TECHNICAL SKILLS & INTERESTS
                </h3>
                <div className="text-xs space-y-1 font-sans">
                  <p><strong>Languages & Frameworks: </strong>{skills?.technical?.join(', ')}</p>
                  {skills?.soft?.length > 0 && <p><strong>Leadership & Competencies: </strong>{skills.soft.join(', ')}</p>}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TEMPLATE 6: EDITORIAL SERIF                                           */}
          {/* ===================================================================== */}
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

          {/* ===================================================================== */}
          {/* TEMPLATE 7: CREATIVE DYNAMIC                                          */}
          {/* ===================================================================== */}
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
                
                {showPhoto && customPhoto && (
                  <div 
                    className={`w-20 h-20 overflow-hidden border-2 shadow-sm ${getPhotoShapeClass()}`}
                    style={{ borderColor: selectedColor.hex }}
                  >
                    <img src={customPhoto} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                )}
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

          {/* ===================================================================== */}
          {/* TEMPLATE 8: COMPACT 1-PAGE PRO DEVELOPER                              */}
          {/* ===================================================================== */}
          {selectedTemplate === 'compact' && (
            <div className="p-6 space-y-3.5 text-[11px] leading-tight">
              {/* Ultra Compact Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-300">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 font-heading leading-none">
                    {candidate?.name || 'Candidate Name'}
                  </h1>
                  <p className="text-[11px] font-bold pt-1" style={{ color: selectedColor.hex }}>
                    {experience?.[0]?.role || 'Full Stack Engineer'}
                  </p>
                  <p className="text-[10px] text-slate-600 pt-0.5">
                    {candidate?.email} • {candidate?.phone} • {candidate?.location} • {candidate?.linkedin}
                  </p>
                </div>
                {showPhoto && customPhoto && (
                  <div 
                    className={`w-14 h-14 overflow-hidden border shadow-sm shrink-0 ${getPhotoShapeClass()}`}
                    style={{ borderColor: selectedColor.hex }}
                  >
                    <img src={customPhoto} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Compact Skills Grid */}
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block mb-1">
                  CORE TECH STACK:
                </span>
                <p className="text-slate-700">
                  {skills?.technical?.join(' • ')}
                </p>
              </div>

              {/* Experience */}
              {experience?.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block border-b border-slate-200 pb-0.5">
                    WORK EXPERIENCE
                  </span>
                  {experience.map((exp, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{exp.role} — {exp.company}</span>
                        <span className="text-slate-500 font-normal">{exp.duration}</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                        {exp.responsibilities?.map((r, ri) => (
                          <li key={ri}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {projects?.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block border-b border-slate-200 pb-0.5">
                    KEY PROJECTS
                  </span>
                  {projects.map((proj, idx) => (
                    <div key={idx}>
                      <span className="font-bold text-slate-900">{proj.title}: </span>
                      <span className="text-slate-600">{proj.description}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {education?.length > 0 && (
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block border-b border-slate-200 pb-0.5">
                    EDUCATION
                  </span>
                  {education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between text-slate-700">
                      <span><strong>{edu.degree}</strong>, {edu.college}</span>
                      <span className="text-slate-500">{edu.year}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
