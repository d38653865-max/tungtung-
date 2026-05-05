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
  { id: 'md', name: '醫師', minYears: 0 },
  { id: 'nurse', name: '護理師', minYears: 2 },
  { id: 'pharma', name: '藥師', minYears: 2 },
  { id: 'rad', name: '醫事放射師', minYears: 2 },
  { id: 'lab', name: '醫事檢驗師', minYears: 2 },
  { id: 'ot', name: '職能治療師', minYears: 2 },
  { id: 'pt', name: '物理治療師', minYears: 2 },
  { id: 'cp', name: '臨床心理師', minYears: 2 },
  { id: 'rt', name: '呼吸治療師', minYears: 2 },
  { id: 'diet', name: '營養師', minYears: 2 },
  { id: 'slp', name: '語言治療師', minYears: 2 },
  { id: 'dental', name: '牙體技術師', minYears: 2 },
  { id: 'other', name: '其他醫事人員', minYears: 2 },
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

  const selectedProfession = PROFESSIONS.find(p => p.id === professionId);

  const handleCalculate = () => {
    if (!expiryDate) {
      alert('請輸入日期');
      return;
    }
    
    // Validate seniority for initial application
    if (!hasCertificate || type === 'initial') {
      const years = parseFloat(seniority);
      if (isNaN(years)) {
        alert('請輸入專業年資');
        return;
      }
      
      if (selectedProfession && years < selectedProfession.minYears) {
        alert(`依規定，${selectedProfession.name}須具備滿 ${selectedProfession.minYears} 年以上專業服務年資方可申請。`);
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
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-brand p-8 text-white">
          <h1 id="app-title" className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            臨床教師取證(初階)小幫手
          </h1>
          <p className="text-white/80 mt-2 text-sm opacity-90">
            教師培育中心作業辦法認證計算
          </p>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="profession" className="text-sm font-medium text-gray-600 ml-1">
                申請職類
              </label>
              <select
                id="profession"
                value={professionId}
                onChange={(e) => setProfessionId(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all text-sm"
              >
                {PROFESSIONS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="seniority" className="text-sm font-medium text-gray-600 ml-1">
                專業年資 (年)
              </label>
              <input
                id="seniority"
                type="number"
                step="0.1"
                placeholder="例如: 2.5"
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-600 ml-1">是否已持有臨床教師證？</label>
            <div className="flex bg-gray-100 p-1 rounded-2xl">
              <button
                id="has-cert-yes"
                onClick={() => handleCertificateToggle(true)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  hasCertificate
                    ? 'bg-white text-brand shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                已取得
              </button>
              <button
                id="has-cert-no"
                onClick={() => handleCertificateToggle(false)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  !hasCertificate
                    ? 'bg-white text-brand shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                尚未取得
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="expiry-date" className="text-sm font-medium text-gray-600 ml-1">
              {hasCertificate ? '現有證書到期日' : '預計申請認證日期'}
            </label>
            <input
              id="expiry-date"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
            />
          </div>

          {hasCertificate && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3 overflow-hidden"
            >
              <label className="text-sm font-medium text-gray-600 ml-1">認證類別</label>
              <div className="flex bg-gray-100 p-1 rounded-2xl">
                <button
                  id="type-initial"
                  onClick={() => setType('initial')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    type === 'initial'
                      ? 'bg-white text-brand shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  初次
                </button>
                <button
                  id="type-extension"
                  onClick={() => setType('extension')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    type === 'extension'
                      ? 'bg-white text-brand shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  展延
                </button>
              </div>
            </motion.div>
          )}

          {!hasCertificate && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 flex gap-2">
              <Info className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-yellow-700">您目前尚未取證，系統將依據「初次認證」標準進行計算。</p>
            </div>
          )}

          <button
            id="calc-button"
            onClick={handleCalculate}
            className="w-full bg-brand hover:bg-brand/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Calculator className="w-5 h-5" />
            開始計算
          </button>

          {/* Results Area */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="pt-6 border-t border-dashed border-gray-200"
              >
                <div id="result-container" className="bg-brand/5 border border-brand/10 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-brand font-bold text-lg">計算結果</span>
                    <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {type === 'initial' ? '初次認證' : '年度展延'}
                    </span>
                  </div>

                  {/* Seniority Warning */}
                  {(!hasCertificate || type === 'initial') && selectedProfession && (
                    <div className={`p-3 rounded-xl flex gap-2 ${
                      (parseFloat(seniority) || 0) < selectedProfession.minYears 
                        ? 'bg-red-50 border border-red-100 text-red-700' 
                        : 'bg-green-50 border border-green-100 text-green-700'
                    }`}>
                      { (parseFloat(seniority) || 0) < selectedProfession.minYears ? (
                        <>
                          <Info className="w-4 h-4 shrink-0 mt-0.5" />
                          <p className="text-xs">資格不足：{selectedProfession.name}申請初次認證須滿 {selectedProfession.minYears} 年資。</p>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                          <p className="text-xs">年資符合：已達 {selectedProfession.name}申請門檻 ({selectedProfession.minYears} 年)。</p>
                        </>
                      )}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-baseline gap-2">
                       <span className="text-3xl font-black text-brand">{result.totalHours}</span>
                       <span className="text-brand font-medium">總時數 / {result.period}</span>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-bold text-brand opacity-60 uppercase">重要規範提醒</p>
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-gray-700">申請時程提醒</p>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {type === 'extension' && expiryDate ? (() => {
                              const date = new Date(expiryDate);
                              const m = date.getMonth() + 1;
                              const d = date.getDate();
                              if (m === 6 && d === 30) return '您的證書於 6/30 到期，請於 6/1-6/15 提出申請。';
                              if (m === 12 && d === 31) return '您的證書於 12/31 到期，請於 12/1-12/15 提出申請。';
                              return result.applicationReminder;
                            })() : result.applicationReminder}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs font-bold text-brand opacity-60 uppercase pt-2">必修類別明細</p>
                      {result.mandatory.map((m, idx) => (
                        <div key={idx} className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-gray-700">{m.label}: {m.hours} 小時</p>
                            {m.details && <p className="text-xs text-gray-500 leading-relaxed">{m.details}</p>}
                          </div>
                        </div>
                      ))}
                      
                      <div className="flex gap-3 pt-2">
                        <Info className="w-5 h-5 text-brand/60 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-gray-700">選修項目</p>
                          <p className="text-xs text-gray-500 leading-relaxed">{result.electiveLabel}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-2 border-t border-brand/10 flex items-center justify-between">
                      <p className="text-[10px] text-brand/60">時數計算基準日：{expiryDate}</p>
                      <div className="flex items-center gap-1 text-[10px] text-brand font-bold">
                        詳細規範請參閱作業辦法 <ChevronRight className="w-3 h-3" />
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
