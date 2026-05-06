/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Calendar, CheckCircle2, Info, Calculator, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type CertType = 'initial' | 'extension';

interface Rule {
  totalHours: number;
  period: string;
  mandatory: {
    label: string;
    hours: number;
    details?: string;
  }[];
  electiveLabel: string;
  applicationReminder: string;
}

const PROFESSIONS = [
  { id: 'md', name: '西醫師', minYears: 0 },
  { id: 'dentist', name: '牙醫師', minYears: 5 },
  { id: 'tcm', name: '中醫師', minYears: 7 },
  { id: 'pharma', name: '藥師', minYears: 4 },
  { id: 'rad', name: '醫事放射師', minYears: 3 },
  { id: 'lab', name: '醫事檢驗師', minYears: 4 },
  { id: 'dental', name: '牙體技術師', minYears: 3 },
  { id: 'nurse', name: '護理師(含專科護理師)', minYears: 3 },
  { id: 'diet', name: '營養師', minYears: 4 },
  { id: 'rt', name: '呼吸治療師', minYears: 3 },
  { id: 'aud', name: '聽力師', minYears: 3 },
  { id: 'pt', name: '物理治療師', minYears: 3 },
  { id: 'ot', name: '職能治療師', minYears: 3 },
  { id: 'cp', name: '臨床心理師', minYears: 4 },
  { id: 'counsel', name: '諮商心理師', minYears: 3 },
  { id: 'slp', name: '語言治療師', minYears: 3 },
  { id: 'other', name: '其他醫事人員', minYears: 0 },
];

const RULES: Record<CertType, Rule> = {
  initial: {
    totalHours: 12,
    period: '2 年內',
    mandatory: [
      { label: '基礎 (1)-(5) 類別', hours: 5, details: '含課程設計、教學技巧、評估技巧、回饋技巧、教材製作 (各至少 1 小時)' },
      { label: '進階 (6) 跨領域團隊', hours: 1, details: '跨領域團隊合作照護教學' },
      { label: '進階 (9) 全人照護', hours: 2, details: '全人照護教學課程' }
    ],
    electiveLabel: '其餘 4 小時可自選 (7, 8, 10, 11 類別或基礎重複修習)',
    applicationReminder: '於每月 15 日前提出申請。'
  },
  extension: {
    totalHours: 6,
    period: '每年 (12 個月)',
    mandatory: [
      { label: '進階 (9) 全人照護', hours: 2, details: '全人照護教學進階課程' }
    ],
    electiveLabel: '其餘 4 小時可自選師資培育相關課程',
    applicationReminder: '依到期日：6/30 到期者 6/1-6/15 申請；12/31 到期者 12/1-12/15 申請。'
  }
};

export default function App() {
  const [professionId, setProfessionId] = useState<string>('md');
  const [seniority, setSeniority] = useState<string>('');
  const [hasCertificate, setHasCertificate] = useState<boolean>(true);
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [type, setType] = useState<CertType>('initial');
  const [result, setResult] = useState<Rule | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const selectedProfession = PROFESSIONS.find(p => p.id === professionId);

  const handleCalculate = () => {
    setErrorStatus(null);

    if (!expiryDate) {
      setErrorStatus('請輸入日期');
      return;
    }
    
    // Validate seniority for initial application
    if (!hasCertificate || type === 'initial') {
      const years = parseFloat(seniority);
      if (isNaN(years)) {
        setErrorStatus('請輸入專業年資');
        return;
      }
      
      if (selectedProfession && years < selectedProfession.minYears) {
        setErrorStatus('無法申請');
        // We still let them see the hours, but seniority is important
      }
    }

    setResult(RULES[type]);
  };

  const handleCertificateToggle = (val: boolean) => {
    setHasCertificate(val);
    if (!val) {
      setType('initial');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-br from-brand-dark to-brand p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <h1 id="app-title" className="text-2xl font-extrabold flex items-center gap-3 tracking-tight">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <Calendar className="w-6 h-6" />
            </div>
            臨床教師取證小幫手
          </h1>
          <p className="text-brand-light/80 mt-3 text-sm font-medium tracking-wide">
            童綜合醫院教學部 · 認證計算工具
          </p>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6">
          {/* Custom Notification for Errors */}
          <AnimatePresence>
            {errorStatus && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600 shadow-sm"
              >
                <div className="bg-rose-100 p-1.5 rounded-xl">
                  <Info className="w-4 h-4" />
                </div>
                <span className="font-black text-sm tracking-tight">{errorStatus}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="profession" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                申請職類
              </label>
              <select
                id="profession"
                value={professionId}
                onChange={(e) => {
                  setProfessionId(e.target.value);
                  setErrorStatus(null);
                }}
                className="w-full p-4 bg-[#f8f9f8] border border-[#e2e8e4] rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all text-sm font-bold text-slate-600 appearance-none cursor-pointer"
              >
                {PROFESSIONS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="seniority" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                專業年資 (年)
              </label>
              <input
                id="seniority"
                type="number"
                step="0.1"
                placeholder="例如: 2.5"
                value={seniority}
                onChange={(e) => {
                  setSeniority(e.target.value);
                  setErrorStatus(null);
                }}
                className="w-full p-4 bg-[#f8f9f8] border border-[#e2e8e4] rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all font-bold text-slate-600"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">是否已持有臨床教師證？</label>
            <div className="grid grid-cols-2 gap-2 bg-[#f0f2f0] p-1.5 rounded-2xl">
              <button
                id="has-cert-yes"
                onClick={() => handleCertificateToggle(true)}
                className={`py-3 px-4 rounded-xl text-xs font-black transition-all ${
                  hasCertificate
                    ? 'bg-white text-brand shadow-md shadow-brand/5'
                    : 'text-slate-400 hover:text-brand-dark'
                }`}
              >
                已取得
              </button>
              <button
                id="has-cert-no"
                onClick={() => handleCertificateToggle(false)}
                className={`py-3 px-4 rounded-xl text-xs font-black transition-all ${
                  !hasCertificate
                    ? 'bg-white text-brand shadow-md shadow-brand/5'
                    : 'text-slate-400 hover:text-brand-dark'
                }`}
              >
                尚未取得
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="expiry-date" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
              {hasCertificate ? '現有證書到期日' : '預計申請認證日期'}
            </label>
            <input
              id="expiry-date"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all font-medium text-slate-700"
            />
          </div>

          {hasCertificate && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3 overflow-hidden"
            >
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">認證類別</label>
                <div className="grid grid-cols-2 gap-2 bg-[#f0f2f0] p-1.5 rounded-2xl">
                  <button
                    id="type-initial"
                    onClick={() => setType('initial')}
                    className={`py-3 px-4 rounded-xl text-xs font-black transition-all ${
                      type === 'initial'
                        ? 'bg-white text-brand shadow-md shadow-brand/5'
                        : 'text-slate-400 hover:text-brand-dark'
                    }`}
                  >
                    初次
                  </button>
                  <button
                    id="type-extension"
                    onClick={() => setType('extension')}
                    className={`py-3 px-4 rounded-xl text-xs font-black transition-all ${
                      type === 'extension'
                        ? 'bg-white text-brand shadow-md shadow-brand/5'
                        : 'text-slate-400 hover:text-brand-dark'
                    }`}
                  >
                    展延
                  </button>
                </div>
            </motion.div>
          )}

          {!hasCertificate && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-700 font-medium leading-relaxed">您目前尚未取證，系統將自動切換為「初次認證」標準進行計算。</p>
            </div>
          )}

          <button
            id="calc-button"
            onClick={handleCalculate}
            className="w-full bg-morandi-blue hover:bg-[#7a8f9f] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-morandi-blue/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
          >
            <Calculator className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span className="text-base tracking-[0.1em]">計算規範時數</span>
          </button>

          {/* Results Area */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="pt-6 border-t border-slate-100"
              >
                <div id="result-container" className="bg-brand-light/40 border border-brand/5 backdrop-blur-sm rounded-[2.5rem] p-8 space-y-8">
                  <div className="flex justify-between items-center">
                    <span className="text-brand-dark font-black text-xl tracking-tight">計算結果</span>
                    <span className="bg-morandi-blue text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-md shadow-morandi-blue/20">
                      {type === 'initial' ? '初次認證' : '年度展延'}
                    </span>
                  </div>

                  {/* Seniority Warning */}
                  {(!hasCertificate || type === 'initial') && selectedProfession && (
                    <div className={`p-5 rounded-[1.8rem] flex gap-4 items-center transition-colors ${
                      (parseFloat(seniority) || 0) < selectedProfession.minYears 
                        ? 'bg-rose-100/50 border border-rose-200 text-rose-700' 
                        : 'bg-brand/10 border border-brand/20 text-brand-dark'
                    }`}>
                      { (parseFloat(seniority) || 0) < selectedProfession.minYears ? (
                        <>
                          <div className="bg-rose-500 text-white p-1.5 rounded-full">
                            <Info className="w-4 h-4" />
                          </div>
                          <p className="text-sm font-extrabold tracking-tight">無法申請：年資未達門檻</p>
                        </>
                      ) : (
                        <>
                          <div className="bg-brand text-white p-1.5 rounded-full">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <p className="text-sm font-extrabold tracking-tight">資格符合：已達申請年資</p>
                        </>
                      )}
                    </div>
                  )}

                  <div className="space-y-8">
                    <div className="flex items-baseline gap-4">
                       <span className="text-6xl font-black text-brand-dark tracking-tighter drop-shadow-sm">{result.totalHours}</span>
                       <div className="flex flex-col">
                         <span className="text-brand-dark font-black text-lg leading-none">小時</span>
                         <span className="text-stone-400 font-bold text-[10px] uppercase tracking-widest">{result.period}</span>
                       </div>
                    </div>

                    <div className="space-y-6">
                      <div className="group">
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 ml-1 opacity-60">規則明細與提醒</p>
                        
                        <div className="space-y-4">
                          <div className="bg-white/60 p-5 rounded-[2rem] border border-white/40 shadow-sm flex gap-4 transition-transform hover:scale-[1.02]">
                            <div className="w-12 h-12 bg-amber-100/80 rounded-[1.2rem] flex items-center justify-center shrink-0">
                               <Calendar className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-black text-stone-700">申請時程</p>
                              <p className="text-xs text-stone-500 leading-relaxed font-bold">
                                {type === 'extension' && expiryDate ? (() => {
                                  const date = new Date(expiryDate);
                                  const m = date.getMonth() + 1;
                                  const d = date.getDate();
                                  if (m === 6 && d === 30) return '證書於 6/30 到期，請於 6/1-6/15 前往中心。';
                                  if (m === 12 && d === 31) return '證書於 12/31 到期，請於 12/1-12/15 前往中心。';
                                  return result.applicationReminder;
                                })() : result.applicationReminder}
                              </p>
                            </div>
                          </div>

                          {result.mandatory.map((m, idx) => (
                            <div key={idx} className="bg-white/60 p-5 rounded-[2rem] border border-white/40 shadow-sm flex gap-4 transition-transform hover:scale-[1.02]">
                              <div className="w-12 h-12 bg-brand/10 rounded-[1.2rem] flex items-center justify-center shrink-0">
                                 <CheckCircle2 className="w-6 h-6 text-brand-dark" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-black text-stone-700">{m.label}: {m.hours} 小時</p>
                                {m.details && <p className="text-xs text-stone-500 leading-relaxed font-bold">{m.details}</p>}
                              </div>
                            </div>
                          ))}
                          
                          <div className="bg-white/60 p-5 rounded-[2rem] border border-white/40 shadow-sm flex gap-4 transition-transform hover:scale-[1.02]">
                            <div className="w-12 h-12 bg-morandi-blue/10 rounded-[1.2rem] flex items-center justify-center shrink-0">
                               <Info className="w-6 h-6 text-morandi-blue" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-black text-stone-700">選修項目</p>
                              <p className="text-xs text-stone-500 leading-relaxed font-bold">{result.electiveLabel}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-brand/10 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                          <p className="text-[10px] font-bold text-stone-400 italic">計算基準：{expiryDate}</p>
                        </div>
                        <button className="text-[11px] font-black text-brand-dark hover:text-brand flex items-center gap-1 transition-colors">
                          作業辦法詳情 <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
