import React, { useState } from 'react';
import { 
  Receipt, 
  Users,
  UserCheck, 
  TrendingUp, 
  Plus, 
  Minus,
  X
} from 'lucide-react';
import { TransactionType } from '../types/finance';

export type NavTab = 'extrato' | 'cadastros' | 'fiado' | 'dre';

interface BottomNavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  transactionsCount: number;
  creditsCount: number;
  sunlightMode: boolean;
  onOpenNewTransaction: (type: TransactionType) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onSelectTab,
  transactionsCount,
  creditsCount,
  sunlightMode,
  onOpenNewTransaction,
}) => {
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  return (
    <>
      {/* Menu flutuante de Ação Rápida (Venda / Despesa) acessível */}
      {isActionMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex flex-col justify-end p-4 animate-in fade-in duration-150"
          onClick={() => setIsActionMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Opções de novo lançamento rápido"
        >
          <div 
            className="w-full max-w-md mx-auto bg-white rounded-3xl p-5 shadow-2xl space-y-3 mb-20 border-2 border-[#1B5E20]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="font-extrabold text-base text-[#1B5E20]">Novo Lançamento Rápido</span>
              <button
                onClick={() => setIsActionMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                aria-label="Fechar menu de ações rápidas"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => {
                  setIsActionMenuOpen(false);
                  onOpenNewTransaction('income');
                }}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#1B5E20] hover:bg-[#00450d] text-white font-extrabold text-sm gap-2 shadow-md active:scale-95 transition-all focus:outline-hidden focus:ring-4 focus:ring-green-300"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Plus className="w-6 h-6 stroke-[3]" />
                </div>
                <span>Venda de Hortaliças</span>
                <span className="text-[11px] font-normal opacity-90">Entrada de caixa</span>
              </button>

              <button
                onClick={() => {
                  setIsActionMenuOpen(false);
                  onOpenNewTransaction('expense');
                }}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FFEBEE] hover:bg-[#ffcdd2] text-[#C62828] border-2 border-[#ffcdd2] font-extrabold text-sm gap-2 shadow-sm active:scale-95 transition-all focus:outline-hidden focus:ring-4 focus:ring-red-200"
              >
                <div className="w-12 h-12 rounded-full bg-[#C62828]/10 flex items-center justify-center">
                  <Minus className="w-6 h-6 stroke-[3] text-[#C62828]" />
                </div>
                <span>Nota / Despesa</span>
                <span className="text-[11px] font-normal text-[#C62828]/80">Insumos, adubo, diesel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Rodapé com Grid de 5 colunas simétrico e Botão Lançar 100% Centralizado */}
      <nav
        aria-label="Navegação principal inferior"
        className={`fixed bottom-0 left-0 right-0 z-30 transition-colors ${
          sunlightMode 
            ? 'bg-[#ffffff] border-t-2 border-[#000000] text-[#000000]' 
            : 'bg-white/95 backdrop-blur-md border-t border-[#d8e6d5] text-[#2c3e2d]'
        } shadow-[0_-4px_24px_rgba(0,0,0,0.08)]`}
      >
        <div className="max-w-lg mx-auto px-2 py-1.5 grid grid-cols-5 items-center">
          {/* Coluna 1: Extrato Geral */}
          <button
            onClick={() => onSelectTab('extrato')}
            aria-current={activeTab === 'extrato' ? 'page' : undefined}
            className={`min-h-[56px] py-1 px-0.5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20] ${
              activeTab === 'extrato'
                ? 'bg-[#dcf5d6] text-[#1B5E20] font-black shadow-xs'
                : 'text-[#4e5b4f] hover:bg-black/5 font-semibold'
            }`}
          >
            <div className="relative">
              <Receipt className={`w-5 h-5 ${activeTab === 'extrato' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {transactionsCount > 0 && (
                <span 
                  aria-label={`${transactionsCount} lançamentos`}
                  className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-black flex items-center justify-center bg-[#1B5E20] text-white ring-1 ring-white"
                >
                  {transactionsCount > 99 ? '99+' : transactionsCount}
                </span>
              )}
            </div>
            <span className={`text-[11px] sm:text-xs leading-none tracking-tight ${activeTab === 'extrato' ? 'scale-105' : ''}`}>
              Extrato
            </span>
            {activeTab === 'extrato' && (
              <span className="w-1.5 h-1.5 rounded-full bg-current mt-0.5 animate-pulse" />
            )}
          </button>

          {/* Coluna 2: Cadastros (Clientes, Fornecedores e Hortaliças) */}
          <button
            onClick={() => onSelectTab('cadastros')}
            aria-current={activeTab === 'cadastros' ? 'page' : undefined}
            className={`min-h-[56px] py-1 px-0.5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20] ${
              activeTab === 'cadastros'
                ? 'bg-[#dcf5d6] text-[#1B5E20] font-black shadow-xs'
                : 'text-[#4e5b4f] hover:bg-black/5 font-semibold'
            }`}
          >
            <div className="relative">
              <Users className={`w-5 h-5 ${activeTab === 'cadastros' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            </div>
            <span className={`text-[11px] sm:text-xs leading-none tracking-tight ${activeTab === 'cadastros' ? 'scale-105' : ''}`}>
              Cadastros
            </span>
            {activeTab === 'cadastros' && (
              <span className="w-1.5 h-1.5 rounded-full bg-current mt-0.5 animate-pulse" />
            )}
          </button>

          {/* Coluna 3: BOTÃO CENTRAL "LANÇAR" (EXATAMENTE NO MEIO, 50% DA LARGURA) */}
          <div className="flex flex-col items-center justify-center">
            <button
              onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
              aria-label="Abrir menu de novo lançamento de venda ou despesa"
              aria-expanded={isActionMenuOpen}
              className={`w-13 h-13 -mt-6 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-95 focus:outline-hidden focus:ring-4 focus:ring-[#1B5E20]/40 ${
                isActionMenuOpen 
                  ? 'bg-[#00450d] rotate-45 scale-105' 
                  : 'bg-[#1B5E20] hover:bg-[#00450d] hover:scale-105'
              }`}
            >
              <Plus className="w-7 h-7 stroke-[3] transition-transform" />
            </button>
            <span className="text-[11px] font-black text-[#1B5E20] mt-0.5 tracking-tight">
              Lançar
            </span>
          </div>

          {/* Coluna 4: Caderneta / Fiado */}
          <button
            onClick={() => onSelectTab('fiado')}
            aria-current={activeTab === 'fiado' ? 'page' : undefined}
            className={`min-h-[56px] py-1 px-0.5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all focus:outline-hidden focus:ring-2 focus:ring-[#BF360C] ${
              activeTab === 'fiado'
                ? 'bg-[#FBE9E7] text-[#BF360C] font-black shadow-xs'
                : 'text-[#4e5b4f] hover:bg-black/5 font-semibold'
            }`}
          >
            <div className="relative">
              <UserCheck className={`w-5 h-5 ${activeTab === 'fiado' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {creditsCount > 0 && (
                <span 
                  aria-label={`${creditsCount} fiados pendentes`}
                  className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-black flex items-center justify-center bg-[#BF360C] text-white ring-1 ring-white"
                >
                  {creditsCount > 99 ? '99+' : creditsCount}
                </span>
              )}
            </div>
            <span className={`text-[11px] sm:text-xs leading-none tracking-tight ${activeTab === 'fiado' ? 'scale-105' : ''}`}>
              Caderneta
            </span>
            {activeTab === 'fiado' && (
              <span className="w-1.5 h-1.5 rounded-full bg-current mt-0.5 animate-pulse" />
            )}
          </button>

          {/* Coluna 5: Lucro & DRE */}
          <button
            onClick={() => onSelectTab('dre')}
            aria-current={activeTab === 'dre' ? 'page' : undefined}
            className={`min-h-[56px] py-1 px-0.5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20] ${
              activeTab === 'dre'
                ? 'bg-[#dcf5d6] text-[#1B5E20] font-black shadow-xs'
                : 'text-[#4e5b4f] hover:bg-black/5 font-semibold'
            }`}
          >
            <div className="relative">
              <TrendingUp className={`w-5 h-5 ${activeTab === 'dre' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            </div>
            <span className={`text-[11px] sm:text-xs leading-none tracking-tight ${activeTab === 'dre' ? 'scale-105' : ''}`}>
              Lucro
            </span>
            {activeTab === 'dre' && (
              <span className="w-1.5 h-1.5 rounded-full bg-current mt-0.5 animate-pulse" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
