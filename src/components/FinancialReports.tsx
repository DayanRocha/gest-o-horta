import React from 'react';
import { FileText, Download, TrendingUp, PieChart, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { Transaction } from '../types/finance';

interface FinancialReportsProps {
  transactions: Transaction[];
  sunlightMode: boolean;
}

export const FinancialReports: React.FC<FinancialReportsProps> = ({
  transactions,
  sunlightMode,
}) => {
  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const incomeTx = transactions.filter((t) => t.type === 'income');
  const expenseTx = transactions.filter((t) => t.type === 'expense');

  const grossRevenue = incomeTx.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTx.reduce((sum, t) => sum + t.amount, 0);
  const netProfit = grossRevenue - totalExpenses;
  const margin = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : '0';

  // Group expenses by category
  const expensesByCategory: Record<string, number> = {};
  expenseTx.forEach((tx) => {
    expensesByCategory[tx.category] = (expensesByCategory[tx.category] || 0) + tx.amount;
  });

  // Group income by category
  const incomeByCategory: Record<string, number> = {};
  incomeTx.forEach((tx) => {
    incomeByCategory[tx.category] = (incomeByCategory[tx.category] || 0) + tx.amount;
  });

  const cardBorderClass = sunlightMode ? 'border-2 border-[#1A2E1A]' : 'border border-[#E0E8E0]';

  return (
    <div className="space-y-4">
      {/* Title Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E0E8E0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#E8F5E9] text-[#1B5E20]">
              <FileText className="w-5 h-5 stroke-[2.2]" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#0c200d]">
                DRE Simplificado & Livro Caixa do Produtor Rural
              </h2>
              <p className="text-xs text-[#523327]">
                Relatório consolidado para prestação de contas, cooperativas e declaração de safra.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-[#1B5E20] hover:bg-[#00450d] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Exportar Relatório em PDF</span>
        </button>
      </div>

      {/* DRE Structure Card */}
      <div className={`bg-white rounded-2xl p-5 sm:p-6 ${cardBorderClass} shadow-xs space-y-4`}>
        <div className="flex items-center justify-between border-b border-[#E0E8E0] pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#717a6d]">
            Demonstrativo de Resultado da Horta
          </span>
          <span className="text-xs font-bold text-[#1B5E20] bg-[#E8F5E9] px-2.5 py-1 rounded-full">
            Safra Ativa 2026
          </span>
        </div>

        {/* Rows of DRE */}
        <div className="space-y-2 text-sm">
          {/* (+) Receita Bruta de Vendas */}
          <div className="flex items-center justify-between py-2 border-b border-[#f1f5f1]">
            <span className="font-extrabold text-[#0c200d]">
              (+) Receita Bruta da Produção de Hortaliças
            </span>
            <span className="font-extrabold text-[#1B5E20] tnum">{formatBRL(grossRevenue)}</span>
          </div>

          {/* Breakdown of Incomes */}
          <div className="pl-4 space-y-1 text-xs text-[#41493e]">
            {Object.entries(incomeByCategory).map(([cat, val]) => (
              <div key={cat} className="flex items-center justify-between py-0.5">
                <span>• {cat}</span>
                <span className="font-semibold tnum">{formatBRL(val)}</span>
              </div>
            ))}
          </div>

          {/* (-) Custos e Despesas Totais */}
          <div className="flex items-center justify-between py-2 border-b border-[#f1f5f1] pt-3">
            <span className="font-extrabold text-[#C62828]">
              (-) Custos Operacionais & Insumos de Campo
            </span>
            <span className="font-extrabold text-[#C62828] tnum">- {formatBRL(totalExpenses)}</span>
          </div>

          {/* Breakdown of Expenses */}
          <div className="pl-4 space-y-1 text-xs text-[#41493e]">
            {Object.entries(expensesByCategory).map(([cat, val]) => (
              <div key={cat} className="flex items-center justify-between py-0.5">
                <span>• {cat}</span>
                <span className="font-semibold text-[#C62828] tnum">- {formatBRL(val)}</span>
              </div>
            ))}
          </div>

          {/* (=) Lucro Operacional Líquido */}
          <div className="flex items-center justify-between py-4 border-t-2 border-[#1B5E20] bg-[#ebffe5]/50 px-3 rounded-xl mt-3">
            <div>
              <span className="font-black text-base text-[#0c200d] block">
                (=) Resultado Operacional Líquido do Produtor
              </span>
              <span className="text-xs text-[#41493e]">
                Margem Líquida da Horta: <strong className="text-[#1B5E20]">{margin}%</strong>
              </span>
            </div>
            <span className="text-2xl font-black text-[#1B5E20] tnum">
              {formatBRL(netProfit)}
            </span>
          </div>
        </div>
      </div>

      {/* Compliance / Agrarian Certification Tag */}
      <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E0E8E0] flex items-center gap-3 text-xs text-[#523327]">
        <ShieldCheck className="w-5 h-5 text-[#1B5E20] shrink-0" />
        <span>
          Registros em conformidade com o Livro Caixa da Atividade Rural (Lei Federal nº 8.023/90 e IN RFB). Ideal para comprovação de renda em PRONAF, Cédula de Produtor Rural (CPR) e acesso a crédito agropecuário.
        </span>
      </div>
    </div>
  );
};
