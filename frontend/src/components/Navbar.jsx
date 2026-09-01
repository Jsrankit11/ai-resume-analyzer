import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  UploadCloud, 
  Menu, 
  X,
  Palette,
  ChevronDown,
  Layout,
  Sun,
  Moon
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';

const NAV_ITEMS = [
  { name: 'Upload', path: '/upload' },
  { name: 'AI Builder', path: '/builder' },
  { name: 'ATS Checker', path: '/analysis' },
  { name: 'Templates', path: '/templates' },
  { name: 'Job Match', path: '/job-match' },
  { name: 'Interview Prep', path: '/interview' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'History', path: '/history' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { currentAnalysis, theme, setTheme, themes } = useResume();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setThemeDropdownOpen(false);
  }, [location.pathname]);

  const getAnalysisPath = () => {
    if (currentAnalysis?.id) {
      return `/analysis/${currentAnalysis.id}`;
    }
    return '/analysis';
  };

  const currentThemeObj = themes?.find((t) => t.id === theme) || themes?.[0];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          scrolled
            ? 'kick-nav py-3 shadow-sm'
            : 'bg-white/95 backdrop-blur-md py-4 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo JSR */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#ff5656] to-[#ff7a7a] flex items-center justify-center text-white shadow-md shadow-[#ff5656]/25 group-hover:scale-105 transition-transform font-bold text-xs tracking-wider">
              JSR
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black font-heading tracking-tight text-slate-900">
                jsr<span className="text-[#ff5656]">resume</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {NAV_ITEMS.map((item) => {
              const targetPath = item.path === '/analysis' ? getAnalysisPath() : item.path;
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.name}
                  to={targetPath}
                  className={`px-3.5 py-2 rounded-xl text-[14px] font-semibold transition-all ${
                    isActive
                      ? 'text-[#ff5656] bg-coral-50'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs + Theme Switcher */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all border border-slate-200"
                title="Switch Theme"
              >
                <span>{currentThemeObj?.icon}</span>
                <span className="capitalize">{currentThemeObj?.name?.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 block">
                    Choose Theme
                  </span>
                  {themes?.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        theme === t.id
                          ? 'bg-coral-50 text-[#ff5656]'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{t.icon}</span>
                        <span>{t.name}</span>
                      </span>
                      {theme === t.id && <span className="w-1.5 h-1.5 rounded-full bg-[#ff5656]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/templates"
              className="flex items-center gap-1.5 px-3.5 py-2 text-[14px] font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200"
            >
              <Layout className="w-4 h-4 text-[#ff5656]" />
              Templates
            </Link>

            <Link
              to="/upload"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold bg-[#ff5656] hover:bg-[#ff4242] text-white shadow-lg shadow-[#ff5656]/25 hover:shadow-[#ff5656]/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <UploadCloud className="w-4 h-4" />
              Analyze Resume
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Quick theme cycle on mobile */}
            <button
              onClick={() => {
                const idx = themes.findIndex((t) => t.id === theme);
                const nextTheme = themes[(idx + 1) % themes.length];
                setTheme(nextTheme.id);
              }}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 text-sm"
              title="Toggle Theme"
            >
              {currentThemeObj?.icon}
            </button>
            <Link
              to="/upload"
              className="p-2 rounded-xl bg-coral-50 text-[#ff5656] border border-coral-200"
              aria-label="Upload"
            >
              <UploadCloud className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-950 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[290px] sm:w-[320px] bg-white border-l border-slate-200 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col justify-between p-6 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#ff5656] flex items-center justify-center text-white font-bold text-xs">
                JSR
              </div>
              <span className="font-bold text-lg text-slate-900">
                jsr<span className="text-[#ff5656]">resume</span>
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const targetPath = item.path === '/analysis' ? getAnalysisPath() : item.path;
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.name}
                  to={targetPath}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-coral-50 text-[#ff5656]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Theme Switcher on Mobile Drawer */}
          <div className="pt-4 mt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Theme Mode:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {themes?.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                    theme === t.id
                      ? 'border-[#ff5656] bg-coral-50 text-[#ff5656]'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <Link
            to="/upload"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold bg-[#ff5656] text-white shadow-md shadow-[#ff5656]/25 hover:bg-[#ff4242] transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            Analyze Resume
          </Link>
        </div>
      </div>
    </>
  );
}
