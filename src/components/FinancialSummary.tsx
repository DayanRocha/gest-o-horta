import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Wallet, UserCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { Transaction, CustomerCredit } from '../types/finance';

interface FinancialSummaryProps {
  transactions: Transaction[];
  credits: CustomerCredit[];
  sunlightMode: boolean;
  onOpenFiadoTab: () => void;
  onOpenNewTransaction: (type: 'income' | 'expense') => void;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  transactions,
  credits,
  sunlightMode,
  onOpenFiadoTab,
  onOpenNewTransaction,
}) => {
  // Calculations: Saldo em Caixa Real (apenas entradas e saídas efetivamente pagas/recebidas)
  // Vendas a prazo (fiado pendente) NÃO entram no caixa até serem recebidas
  const paidIncomeTx = transactions.filter(
    (t) => t.type === 'income' && t.paymentStatus === 'paid'
  );
  const totalIncome = paidIncomeTx.reduce((acc, t) => acc + t.amount, 0);

  const paidExpenseTx = transactions.filter(
    (t) => t.type === 'expense' && (t.paymentStatus === 'paid' || !t.paymentStatus)
  );
  const totalExpense = paidExpenseTx.reduce((acc, t) => acc + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // Total a receber na caderneta (créditos)
  const totalCreditOwed = credits.reduce((acc, c) => acc + c.totalOwed, 0);
  const overdueCredits = credits.filter((c) => c.status === 'overdue');

  // Quantidade de vendas no fiado aguardando recebimento
  const pendingFiadoTx = transactions.filter(
    (t) => t.type === 'income' && t.paymentStatus === 'credit'
  );
  const pendingFiadoTotal = pendingFiadoTx.reduce((acc, t) => acc + t.amount, 0);

  const profitMargin = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : '0';

  // Format currency helper
  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const cardBorder = sunlightMode ? 'border-2 border-[#1A2E1A]' : 'border border-[#E0E8E0]';
  const cardShadow = sunlightMode ? 'shadow-md' : 'shadow-xs';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Saldo Líquido em Caixa (Hero Card) */}
      <div
        className={`bg-white rounded-2xl p-4 sm:p-5 ${cardBorder} ${cardShadow} relative overflow-hidden flex flex-col justify-between`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#41493e] flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-[#1B5E20]" />
            Saldo em Caixa
          </span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F5E9] text-[#1B5E20] border border-[#c8e6c9]">
            +14,2% semana
          </span>
        </div>

        <div className="my-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1A2E1A] tnum tracking-tight">
            {formatBRL(netBalance)}
          </div>
          <div className="text-xs font-medium text-[#41493e] mt-1 flex items-center gap-1">
            <span>Margem da Horta:</span>
            <span className="font-extrabold text-[#1B5E20]">{profitMargin}% líquida</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#f1f5f1] flex items-center justify-between text-xs font-semibold text-[#523327]">
          <span>Disponível p/ Insumos</span>
          <span className="text-[#1B5E20] font-bold tnum">Operacional Ativo</span>
        </div>
      </div>

      {/* 2. Total Vendas e Entradas */}
      <div
        className={`bg-white rounded-2xl p-4 sm:p-5 ${cardBorder} ${cardShadow} relative overflow-hidden flex flex-col justify-between`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#41493e] flex items-center gap-1.5">
            <ArrowDownLeft className="w-4 h-4 text-[#1B5E20]" />
            Entradas em Caixa
          </span>
          <span className="text-[11px] font-bold text-[#1B5E20] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
            {paidIncomeTx.length} recebidas
          </span>
        </div>

        <div className="my-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1B5E20] tnum tracking-tight">
            {formatBRL(totalIncome)}
          </div>
          <div className="text-xs text-[#41493e] mt-1">
            {pendingFiadoTotal > 0 ? (
              <span className="text-[#BF360C] font-semibold">
                + {formatBRL(pendingFiadoTotal)} a receber na caderneta
              </span>
            ) : (
              'Valores efetivamente recebidos no caixa'
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#f1f5f1] flex items-center justify-between">
          <button
            onClick={() => onOpenNewTransaction('income')}
            className="text-xs font-bold text-[#1B5E20] hover:underline flex items-center gap-1"
          >
            + Lançar Venda de Hoje
          </button>
        </div>
      </div>

      {/* 3. Total Custos e Despesas */}
      <div
        className={`bg-white rounded-2xl p-4 sm:p-5 ${cardBorder} ${cardShadow} relative overflow-hidden flex flex-col justify-between`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#41493e] flex items-center gap-1.5">
            <ArrowUpRight className="w-4 h-4 text-[#C62828]" />
            Custos & Despesas
          </span>
          <span className="text-[11px] font-bold text-[#C62828] bg-[#FFEBEE] px-2 py-0.5 rounded-full">
            {transactions.filter((t) => t.type === 'expense').length} saídas
          </span>
        </div>

        <div className="my-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-[#C62828] tnum tracking-tight">
            {formatBRL(totalExpense)}
          </div>
          <div className="text-xs text-[#41493e] mt-1">
            Adubos, sementes, combustível e mão de obra
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#f1f5f1] flex items-center justify-between">
          <button
            onClick={() => onOpenNewTransaction('expense')}
            className="text-xs font-bold text-[#C62828] hover:underline flex items-center gap-1"
          >
            - Lançar Despesa / Nota
          </button>
        </div>
      </div>

      {/* 4. Caderneta de Fiado (Crédito a Receber) */}
      <div
        className={`bg-white rounded-2xl p-4 sm:p-5 ${cardBorder} ${cardShadow} relative overflow-hidden flex flex-col justify-between`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#41493e] flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-[#BF360C]" />
            Fiado / A Receber
          </span>
          {overdueCredits.length > 0 && (
            <span className="text-[11px] font-extrabold text-[#C62828] bg-[#FFEBEE] px-2 py-0.5 rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {overdueCredits.length} vencido
            </span>
          )}
        </div>

        <div className="my-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-[#BF360C] tnum tracking-tight">
            {formatBRL(totalCreditOwed)}
          </div>
          <div className="text-xs text-[#41493e] mt-1">
            {credits.length} clientes na caderneta
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#f1f5f1] flex items-center justify-between">
          <button
            onClick={onOpenFiadoTab}
            className="text-xs font-bold text-[#BF360C] hover:underline flex items-center gap-1"
          >
            Cobrar / Ver Caderneta &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
