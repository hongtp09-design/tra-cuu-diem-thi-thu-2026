/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, GraduationCap, BookOpen, Briefcase, Sparkles, Loader2, ChevronRight, User, Calendar, School } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { students, Student } from './data/students';
import { getAIAdvising } from './services/aiService';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAdvising, setIsAdvising] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return students.filter(s => 
      s.name.toLowerCase().includes(term) || 
      s.sbd.includes(term)
    ).slice(0, 5);
  }, [searchTerm]);

  const handleSelectStudent = async (student: Student) => {
    setSelectedStudent(student);
    setSearchTerm('');
    setAdvice(null);
    setIsAdvising(true);
    const result = await getAIAdvising(student);
    setAdvice(result || "Không thể kết nối với AI.");
    setIsAdvising(false);
  };

  const handleRefreshAdvice = async () => {
    if (!selectedStudent) return;
    setIsAdvising(true);
    const result = await getAIAdvising(selectedStudent);
    setAdvice(result || "Không thể kết nối với AI.");
    setIsAdvising(false);
  };

  const subjectLabels: Record<string, string> = {
    toan: "Toán",
    van: "Ngữ Văn",
    ly: "Vật Lý",
    hoa: "Hóa Học",
    sinh: "Sinh Học",
    su: "Lịch Sử",
    dia: "Địa Lý",
    anh: "Tiếng Anh",
    ktpl: "KT & PL",
    tin: "Tin Học",
    cn: "Công Nghệ"
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">EduAdvisor AI</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">THPT Tân Trào</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">Tra cứu</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Hướng nghiệp</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Tài liệu</a>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Search Section */}
        <section className="mb-12 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"
          >
            Tra cứu điểm thi & Tư vấn tương lai
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mb-8 max-w-xl mx-auto"
          >
            Nhập Số báo danh hoặc Họ tên để xem kết quả chi tiết và nhận tư vấn định hướng từ AI.
          </motion.p>

          <div className="relative max-w-2xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Tìm kiếm theo SBD hoặc Tên học sinh..."
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <AnimatePresence>
              {filteredStudents.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-40"
                >
                  {filteredStudents.map((student) => (
                    <button
                      key={student.sbd}
                      onClick={() => handleSelectStudent(student)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm">
                          {student.name.split(' ').pop()?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{student.name}</p>
                          <p className="text-xs text-slate-500">SBD: {student.sbd} • Lớp: {student.class}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Result Section */}
        <AnimatePresence mode="wait">
          {selectedStudent ? (
            <motion.div
              key={selectedStudent.sbd}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Student Info Card */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                      <User size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{selectedStudent.name}</h3>
                      <div className="flex flex-wrap gap-4 mt-1">
                        <span className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Calendar size={14} /> {selectedStudent.dob}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-slate-500">
                          <School size={14} /> Lớp {selectedStudent.class}
                        </span>
                        <span className="text-sm font-bold text-indigo-600">SBD: {selectedStudent.sbd}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleRefreshAdvice}
                    disabled={isAdvising}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-50 hover:bg-indigo-100 disabled:bg-slate-100 text-indigo-600 rounded-xl font-bold transition-all active:scale-95"
                  >
                    {isAdvising ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                    Làm mới tư vấn
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {(Object.entries(selectedStudent.scores) as [string, number][]).map(([key, value]) => (
                    <div key={key} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-indigo-200 transition-colors">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{subjectLabels[key]}</p>
                      <p className={`text-2xl font-black ${value >= 8 ? 'text-emerald-600' : value >= 5 ? 'text-slate-800' : 'text-rose-500'}`}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Advice Section */}
              {isAdvising || advice ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-indigo-900 rounded-3xl p-6 md:p-8 text-white shadow-2xl shadow-indigo-200"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <Sparkles size={20} />
                    </div>
                    <h4 className="text-xl font-bold">Chuyên gia AI Tư vấn</h4>
                  </div>

                  {isAdvising ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <Loader2 className="animate-spin text-indigo-300" size={48} />
                      <p className="text-indigo-200 font-medium animate-pulse">AI đang phân tích kết quả của bạn...</p>
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none prose-p:text-indigo-100 prose-headings:text-white prose-strong:text-white prose-li:text-indigo-100">
                      <div className="whitespace-pre-wrap leading-relaxed text-indigo-50">
                        {advice}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 flex gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 mb-1">Tư vấn học tập</h5>
                      <p className="text-sm text-slate-500">Nhận lộ trình ôn tập cá nhân hóa dựa trên điểm số hiện tại của bạn.</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 flex gap-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 mb-1">Hướng nghiệp</h5>
                      <p className="text-sm text-slate-500">Khám phá các ngành nghề phù hợp với thế mạnh môn học của bạn.</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                <Search size={48} />
              </div>
              <h3 className="text-xl font-bold text-slate-400">Chưa có dữ liệu hiển thị</h3>
              <p className="text-slate-400 max-w-xs mt-2">Hãy tìm kiếm theo tên hoặc SBD để bắt đầu xem kết quả.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            © 2026 Hệ thống Tra cứu Điểm thi THPT Tân Trào. <br />
            Phát triển bởi AI Studio. Dữ liệu chỉ mang tính chất tham khảo.
          </p>
        </div>
      </footer>
    </div>
  );
}
