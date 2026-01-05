
import React, { useState, useMemo } from 'react';
import { MLPrediction } from '../types';
import { 
  Brain, Zap, TrendingUp, TrendingDown, Target, 
  Newspaper, Clock, Activity, BarChart2, 
  Layers, MousePointer2, Sparkles, Filter
} from 'lucide-react';

interface Props {
  prediction?: MLPrediction;
  currentPrice: number;
  isLoading: boolean;
  t: any;
}

const AIScenarioSimulator: React.FC<Props> = ({ prediction, currentPrice, isLoading, t }) => {
  const [activeScenario, setActiveScenario] = useState<number | null>(null);

  if (isLoading || !prediction) {
    return (
      <div className="h-[600px] animate-pulse bg-slate-950/50 rounded-[4rem] border border-white/5 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 opacity-20">
          <Brain className="w-16 h-16 text-indigo-500 animate-bounce" />
          <span className="text-[10px] font-black uppercase tracking-[0.8em]">{t.calculating}</span>
        </div>
      </div>
    );
  }

  const getVoteColor = (vote: string) => {
    const v = vote.toUpperCase();
    if (v === 'BUY') return 'text-emerald-400';
    if (v === 'SELL') return 'text-rose-400';
    return 'text-slate-400';
  };

  const getVolatilityColor = (vol: string) => {
    if (vol === 'EXTREME') return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
    if (vol === 'HIGH') return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
    return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
  };

  // Probability Distribution Visualization Logic
  const scenarioWeights = useMemo(() => {
    return prediction.scenarios.map(s => ({
      type: s.type,
      prob: s.probability,
      target: s.targetPrice,
      color: s.type === 'BULLISH' ? '#10b981' : s.type === 'BEARISH' ? '#f43f5e' : '#6366f1'
    }));
  }, [prediction]);

  return (
    <div className="cyber-card rounded-[4rem] p-12 border-2 border-white/5 relative overflow-hidden group transition-all duration-700">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000">
        <Sparkles className="w-64 h-64 text-indigo-400" />
      </div>

      <div className="flex items-center justify-between mb-12 flex-wrap gap-8">
        <div className="flex items-center gap-6">
          <div className="p-5 bg-indigo-500/15 rounded-3xl border border-indigo-500/30 shadow-2xl relative">
            <Brain className="w-8 h-8 text-indigo-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <div className="text-start">
            <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
              {t.quantumIntelligence}
            </h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mt-3 italic">
              {t.ensembleVoting} / {t.likelyScenarios}
            </p>
          </div>
        </div>
        
        <div className="flex bg-black/40 rounded-3xl p-1.5 border border-white/10 backdrop-blur-3xl shadow-inner">
          <div className="flex items-center gap-4 px-6 py-2.5">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{t.g8Stable}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        
        {/* Probability Landscape Visualization */}
        <div className="xl:col-span-8 bg-black/40 border-2 border-white/5 rounded-[3.5rem] p-10 relative overflow-hidden shadow-2xl min-h-[400px] flex flex-col group/landscape">
          <div className="absolute top-8 left-10 z-10">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] block mb-2">{t.monteCarloProjection}</span>
            <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Probability Landscape</h4>
          </div>

          <div className="flex-1 flex items-center justify-center relative mt-12">
            {/* SVG Distribution Curve */}
            <svg viewBox="0 0 800 300" className="w-full h-full drop-shadow-[0_0_15px_rgba(99,102,241,0.2)] overflow-visible">
              <defs>
                {scenarioWeights.map((s, i) => (
                  <linearGradient key={`grad-${i}`} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.color} stopOpacity={activeScenario === i ? 0.6 : 0.3} />
                    <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                  </linearGradient>
                ))}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Grid Lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line key={i} x1="0" y1={i * 60} x2="800" y2={i * 60} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              ))}
              
              {/* Distribution Peaks */}
              {scenarioWeights.map((s, i) => {
                const x = 150 + (i * 250);
                const height = (s.prob / 100) * 200;
                const width = 180;
                const path = `M ${x-width} 300 Q ${x} ${300 - height} ${x+width} 300`;
                return (
                  <path
                    key={i}
                    d={path}
                    fill={`url(#grad-${i})`}
                    stroke={s.color}
                    strokeWidth={activeScenario === i ? 4 : 2}
                    className="transition-all duration-700 cursor-pointer"
                    onMouseEnter={() => setActiveScenario(i)}
                    onMouseLeave={() => setActiveScenario(null)}
                    style={{ filter: activeScenario === i ? 'url(#glow)' : 'none' }}
                  />
                );
              })}

              {/* Price Indicators */}
              <ReferenceLine price={currentPrice} x={400} color="#fff" label="Current Price" />
            </svg>

            {/* Price Overlay labels */}
            <div className="absolute inset-0 flex justify-around items-end pb-4 pointer-events-none px-20">
              {scenarioWeights.map((s, i) => (
                <div key={i} className={`flex flex-col items-center transition-all duration-500 ${activeScenario === i ? 'scale-110 opacity-100' : 'opacity-40'}`}>
                  <span className="text-[10px] font-mono font-black text-white bg-black/60 px-3 py-1 rounded-lg border border-white/10 mb-2">
                    ${s.target.toLocaleString()}
                  </span>
                  <div className="w-1 h-4 rounded-full" style={{ backgroundColor: s.color }} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
            <div className="flex gap-8">
              <div className="flex items-center gap-3">
                <BarChart2 className="w-4 h-4 text-indigo-400" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Statistical Variance: <span className="text-white">Low</span></span>
              </div>
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-gold" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Noise Filtration: <span className="text-gold">G8-Active</span></span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-950 bg-indigo-500/20 flex items-center justify-center"><Activity className="w-3 h-3 text-indigo-400" /></div>)}
              </div>
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">{t.engineConfidence}: {prediction.probability}%</span>
            </div>
          </div>
        </div>

        {/* Voting & Scenarios Cards */}
        <div className="xl:col-span-4 space-y-8">
          {/* Ensemble Voting */}
          <div className="bg-slate-950/60 p-8 rounded-[3rem] border border-white/5 shadow-2xl text-start">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] italic">{t.ensembleVoting}</h4>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="space-y-4">
              {[
                { name: `LSTM Agent`, vote: prediction.ensembleVotes.lstm },
                { name: `XGBoost Agent`, vote: prediction.ensembleVotes.xgboost },
                { name: `Transformer Core`, vote: prediction.ensembleVotes.transformer }
              ].map((m, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-900/40 rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-all">
                  <span className="text-[12px] font-black text-white">{m.name}</span>
                  <span className={`text-[10px] font-black font-mono px-3 py-1 rounded-lg bg-black/40 border border-white/10 ${getVoteColor(m.vote)}`}>
                    {t[m.vote.toLowerCase()] || m.vote}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Scenario Quick Selector */}
          <div className="space-y-4">
            {prediction.scenarios.map((s, i) => (
              <div 
                key={i} 
                onMouseEnter={() => setActiveScenario(i)}
                onMouseLeave={() => setActiveScenario(null)}
                className={`p-6 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer relative overflow-hidden group/card ${activeScenario === i ? 'bg-white/5 border-indigo-500/40 translate-x-3 shadow-2xl' : 'bg-slate-950/40 border-white/5 hover:border-white/20'}`}
              >
                <div className="flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeScenario === i ? 'scale-110 shadow-glow' : ''}`} style={{ backgroundColor: `${scenarioWeights[i].color}20`, color: scenarioWeights[i].color }}>
                        {s.type === 'BULLISH' ? <TrendingUp className="w-5 h-5" /> : s.type === 'BEARISH' ? <TrendingDown className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                     </div>
                     <div className="text-start">
                        <span className="text-[12px] font-black text-white uppercase italic tracking-tighter">{t[s.type] || s.type}</span>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">${s.targetPrice.toLocaleString()}</p>
                     </div>
                   </div>
                   <div className="text-right">
                      <span className="text-xl font-black font-mono text-white leading-none">{s.probability}%</span>
                      <p className="text-[8px] text-slate-600 font-bold uppercase mt-1">Weight</p>
                   </div>
                </div>
                {activeScenario === i && (
                  <div className="absolute right-4 bottom-4 opacity-40 animate-pulse">
                    <MousePointer2 className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Matrix Section */}
      <div className="mt-12 pt-12 border-t border-white/5 text-start">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <Newspaper className="w-8 h-8 text-indigo-400" />
            <h4 className="text-lg font-black text-white uppercase tracking-[0.4em] italic">{t.eventResponseMatrix}</h4>
          </div>
          <div className="flex gap-3">
             <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[9px] font-black uppercase text-slate-400 tracking-widest italic">Macro-Scan: Online</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {prediction.newsImpact.map((news, i) => (
             <div key={i} className="bg-slate-950/40 p-8 rounded-[3rem] border border-white/5 flex items-center justify-between group/news hover:border-indigo-500/30 hover:bg-slate-900/40 transition-all shadow-xl">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 group-hover/news:rotate-12 transition-transform shadow-inner">
                    <Clock className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <span className="text-lg font-black text-white uppercase tracking-wider italic leading-none">{news.event}</span>
                    <div className="flex items-center gap-3 mt-3">
                       <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg border italic ${getVolatilityColor(news.expectedVolatility)}`}>
                         {t[news.expectedVolatility] || news.expectedVolatility} VOL
                       </span>
                       <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">ETA: {news.timeUntil}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-2">{t.predictedBias}</span>
                   <div className={`flex items-center gap-3 font-black italic tracking-tighter text-base ${news.bias === 'POSITIVE' ? 'text-emerald-400' : news.bias === 'NEGATIVE' ? 'text-rose-400' : 'text-indigo-400'}`}>
                      {news.bias === 'POSITIVE' ? <TrendingUp className="w-5 h-5" /> : news.bias === 'NEGATIVE' ? <TrendingDown className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                      {t[news.bias] || news.bias}
                   </div>
                </div>
             </div>
           ))}
           <div className="bg-indigo-500/5 p-8 rounded-[3rem] border-2 border-dashed border-indigo-500/10 flex flex-col items-center justify-center gap-4 group/macro transition-all hover:bg-indigo-500/10">
              <div className="flex gap-2">
                {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-500/40 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
              </div>
              <p className="text-[11px] text-slate-600 font-black uppercase tracking-[0.5em] italic">{t.macroCorrelation}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for Price Line in SVG
function ReferenceLine({ price, x, color, label }: any) {
  return (
    <g>
      <line x1={x} y1="40" x2={x} y2="300" stroke={color} strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
      <rect x={x - 40} y="20" width="80" height="20" rx="4" fill="rgba(255,255,255,0.1)" />
      <text x={x} y="33" fontSize="8" fontWeight="900" textAnchor="middle" fill="#fff" className="uppercase tracking-widest">{label}</text>
    </g>
  );
}

export default AIScenarioSimulator;
