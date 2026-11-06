import React from 'react';
import { Sprout, Sun, Wifi, Calendar, Sparkles, TrendingUp } from 'lucide-react';

interface HeaderProps {
  selectedPeriod: string;
  onSelectPeriod: (period: string) => void;
  sunlightMode: boolean;
  onToggleSunlightMode: () => void;
  onOpenNewTransaction: (type?: 'income' | 'expense') => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedPeriod,
  onSelectPeriod,
  sunlightMode,
  onToggleSunlightMode,
  onOpenNewTransaction,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[#E0E8E0] shadow-xs">
      {/* Top Banner / Field Status Info */}
      <div className="bg-[#1B5E20] text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#91f78e] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#91f78e]"></span>
          </span>
          <span className="tracking-wide">Modo Campo Operacional • Offline Ativo</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#90d689] hidden sm:inline">Sítio Primavera • Canoinhas/SP</span>
          <button
            onClick={onToggleSunlightMode}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
              sunlightMode
                ? 'bg-[#ffffff] text-[#00450d]'
                : 'bg-[#00450d] text-[#e1fbdc] hover:bg-[#213521]'
            }`}
            title="Alternar modo de alto contraste para sol forte"
          >
            <Sun className="w-3 h-3" />
            <span>{sunlightMode ? 'Sol Forte: ON' : 'Contraste Normal'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left: Branding & Current Screen Tag */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#1B5E20] flex items-center justify-center text-white shadow-sm shrink-0">
            <Sprout className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-[#0c200d]">AgroHorta</span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#dcf5d6] text-[#006e1c] border border-[#c0c9bb]">
                v2.4 Campo
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#41493e]">
              <span className="text-[#1B5E20]">2. Gestão Financeira</span>
              <span>•</span>
              <span className="font-normal text-[#523327]">Caixa, Vendas de Colheita e Fiado</span>
            </div>
          </div>
        </div>

        {/* Right: Period Filter and Quick Action Button */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Period Dropdown */}
          <div className="flex items-center bg-[#f1f5f1] p-1 rounded-xl border border-[#E0E8E0]">
            {(['hoje', 'semana', 'mes', 'safra'] as const).map((period) => {
              const labels = {
                hoje: 'Hoje',
                semana: 'Esta Semana',
                mes: 'Mês Atual',
                safra: 'Safra Atual',
              };
              const active = selectedPeriod === period;
              return (
                <button
                  key={period}
                  onClick={() => onSelectPeriod(period)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    active
                      ? 'bg-[#1B5E20] text-white shadow-xs'
                      : 'text-[#41493e] hover:text-[#0c200d] hover:bg-white/60'
                  }`}
                >
                  {labels[period]}
                </button>
              );
            })}
          </div>

          {/* Quick Add Button */}
          <button
            onClick={() => onOpenNewTransaction('income')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1B5E20] hover:bg-[#00450d] active:scale-[0.98] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm"
          >
            <span className="text-base leading-none font-black">+</span>
            <span>Registrar Venda</span>
          </button>
        </div>
      </div>
    </header>
  );
};
