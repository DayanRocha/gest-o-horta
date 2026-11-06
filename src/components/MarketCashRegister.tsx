import React, { useState } from 'react';
import { 
  Store, 
  DollarSign, 
  QrCode, 
  CreditCard, 
  Banknote, 
  UserCheck, 
  Coffee, 
  CheckCircle, 
  Calculator,
  Printer,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { CashRegisterReport } from '../types/finance';

interface MarketCashRegisterProps {
  initialReport: CashRegisterReport;
  sunlightMode: boolean;
}

export const MarketCashRegister: React.FC<MarketCashRegisterProps> = ({
  initialReport,
  sunlightMode,
}) => {
  const [report, setReport] = useState<CashRegisterReport>(initialReport);
  const [cashCounted, setCashCounted] = useState<number>(report.finalCashInHand);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const calculatedCashExpected =
    Number(report.openingCash) + Number(report.cashSales) - Number(report.cashExpenses);

  const difference = cashCounted - calculatedCashExpected;

  const totalReceivedDay =
    Number(report.cashSales) + Number(report.pixSales) + Number(report.cardSales);

  const handleSave = () => {
    setReport((prev) => ({
      ...prev,
      finalCashInHand: cashCounted,
    }));
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const cardBorderClass = sunlightMode ? 'border-2 border-[#1A2E1A]' : 'border border-[#E0E8E0]';

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E0E8E0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#dcf5d6] text-[#006e1c]">
              <Store className="w-5 h-5 stroke-[2.2]" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#0c200d]">
                Fechamento de Caixa da Feira Livre / Ponto de Venda
              </h2>
              <p className="text-xs text-[#523327]">
                Conferência diária de fundo de troco, recebimentos em dinheiro, Pix e sangrias.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white hover:bg-[#f1f5f1] border border-[#B0BEC5] text-[#0c200d] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Resumo</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Breakdown & Reconciliation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Entradas do Dia por Meio de Pagamento */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`bg-white rounded-2xl p-4 sm:p-5 ${cardBorderClass} shadow-xs space-y-4`}>
            <h3 className="text-sm font-extrabold text-[#0c200d] flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#1B5E20]" />
              Valores Apurados na Banca ({report.location})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Fundo de Troco */}
              <div className="p-3 bg-[#F8FAF8] rounded-xl border border-[#E0E8E0]">
                <label className="text-[11px] font-bold text-[#717a6d] uppercase block">
                  1. Fundo de Troco Inicial
                </label>
                <div className="mt-1 flex items-center">
                  <span className="text-xs font-bold text-[#717a6d] mr-1.5">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={report.openingCash}
                    onChange={(e) =>
                      setReport({ ...report, openingCash: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full text-lg font-extrabold text-[#0c200d] bg-transparent outline-hidden tnum"
                  />
                </div>
              </div>

              {/* Vendas em Dinheiro */}
              <div className="p-3 bg-[#E8F5E9]/50 rounded-xl border border-[#c8e6c9]">
                <label className="text-[11px] font-bold text-[#1B5E20] uppercase block flex items-center gap-1">
                  <Banknote className="w-3.5 h-3.5" />
                  2. Dinheiro em Espécie Recebido
                </label>
                <div className="mt-1 flex items-center">
                  <span className="text-xs font-bold text-[#1B5E20] mr-1.5">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={report.cashSales}
                    onChange={(e) =>
                      setReport({ ...report, cashSales: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full text-lg font-extrabold text-[#1B5E20] bg-transparent outline-hidden tnum"
                  />
                </div>
              </div>

              {/* Vendas no Pix */}
              <div className="p-3 bg-[#E8F8F5]/60 rounded-xl border border-[#b2dfdb]">
                <label className="text-[11px] font-bold text-[#00796B] uppercase block flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5" />
                  3. Recebimentos no Pix (QR Code)
                </label>
                <div className="mt-1 flex items-center">
                  <span className="text-xs font-bold text-[#00796B] mr-1.5">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={report.pixSales}
                    onChange={(e) =>
                      setReport({ ...report, pixSales: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full text-lg font-extrabold text-[#00796B] bg-transparent outline-hidden tnum"
                  />
                </div>
              </div>

              {/* Vendas no Cartão */}
              <div className="p-3 bg-[#f1f5f1] rounded-xl border border-[#E0E8E0]">
                <label className="text-[11px] font-bold text-[#41493e] uppercase block flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  4. Maquininha Cartão (Débito/Crédito)
                </label>
                <div className="mt-1 flex items-center">
                  <span className="text-xs font-bold text-[#41493e] mr-1.5">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={report.cardSales}
                    onChange={(e) =>
                      setReport({ ...report, cardSales: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full text-lg font-extrabold text-[#41493e] bg-transparent outline-hidden tnum"
                  />
                </div>
              </div>

              {/* Fiado Anotado na Feira */}
              <div className="p-3 bg-[#FBE9E7]/60 rounded-xl border border-[#ffccbc]">
                <label className="text-[11px] font-bold text-[#BF360C] uppercase block flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  5. Fiado Concedido na Feira
                </label>
                <div className="mt-1 flex items-center">
                  <span className="text-xs font-bold text-[#BF360C] mr-1.5">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={report.creditGiven}
                    onChange={(e) =>
                      setReport({ ...report, creditGiven: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full text-lg font-extrabold text-[#BF360C] bg-transparent outline-hidden tnum"
                  />
                </div>
              </div>

              {/* Sangrias e Despesas em Dinheiro */}
              <div className="p-3 bg-[#FFEBEE]/60 rounded-xl border border-[#ffcdd2]">
                <label className="text-[11px] font-bold text-[#C62828] uppercase block flex items-center gap-1">
                  <Coffee className="w-3.5 h-3.5" />
                  6. Sangrias & Gastos no Dinheiro
                </label>
                <div className="mt-1 flex items-center">
                  <span className="text-xs font-bold text-[#C62828] mr-1.5">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={report.cashExpenses}
                    onChange={(e) =>
                      setReport({ ...report, cashExpenses: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full text-lg font-extrabold text-[#C62828] bg-transparent outline-hidden tnum"
                  />
                </div>
              </div>
            </div>

            {/* Total Vendas do Dia */}
            <div className="p-4 bg-[#ebffe5] rounded-xl border border-[#90d689] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#00450d]">
                  Volume Total Faturado no Dia
                </span>
                <p className="text-xs text-[#41493e]">
                  Soma de Dinheiro + Pix + Cartão + Fiados anotados
                </p>
              </div>
              <div className="text-2xl font-black text-[#1B5E20] tnum">
                {formatBRL(totalReceivedDay + Number(report.creditGiven))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Gaveta de Dinheiro & Auditoria */}
        <div className="space-y-4">
          <div className={`bg-white rounded-2xl p-4 sm:p-5 ${cardBorderClass} shadow-xs space-y-4`}>
            <h3 className="text-sm font-extrabold text-[#0c200d] flex items-center gap-2">
              <Banknote className="w-4 h-4 text-[#1B5E20]" />
              Conferência Física da Gaveta
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#E0E8E0]">
                <div className="text-xs text-[#717a6d]">Dinheiro Físico Calculado Esperado:</div>
                <div className="text-xl font-black text-[#0c200d] tnum mt-0.5">
                  {formatBRL(calculatedCashExpected)}
                </div>
                <div className="text-[11px] text-[#717a6d] mt-1">
                  (Fundo R$ {report.openingCash} + Vendas R$ {report.cashSales} - Gastos R$ {report.cashExpenses})
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border-2 border-[#1B5E20]">
                <label className="text-xs font-bold text-[#1B5E20] uppercase block">
                  Dinheiro Contado na Mão:
                </label>
                <div className="mt-1 flex items-center">
                  <span className="text-base font-bold text-[#1B5E20] mr-2">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={cashCounted}
                    onChange={(e) => setCashCounted(parseFloat(e.target.value) || 0)}
                    className="w-full text-2xl font-black text-[#0c200d] outline-hidden tnum"
                  />
                </div>
              </div>

              {/* Difference Status */}
              <div
                className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                  difference === 0
                    ? 'bg-[#E8F5E9] text-[#1B5E20] border-[#c8e6c9]'
                    : difference > 0
                    ? 'bg-[#E8F8F5] text-[#00796B] border-[#b2dfdb]'
                    : 'bg-[#FFEBEE] text-[#C62828] border-[#ffcdd2]'
                }`}
              >
                {difference === 0 ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-[#1B5E20]" />
                    <span>Caixa Fechado com Sucesso! 100% batido.</span>
                  </>
                ) : difference > 0 ? (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span>Sobra de Caixa: +{formatBRL(difference)}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span>Falta de Caixa: {formatBRL(difference)}</span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full min-h-[52px] bg-[#1B5E20] hover:bg-[#00450d] text-white text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Salvar Fechamento de Caixa</span>
            </button>

            {showSavedFeedback && (
              <div className="text-xs font-bold text-[#1B5E20] text-center bg-[#E8F5E9] p-2 rounded-lg border border-[#c8e6c9]">
                Fechamento registrado com sucesso no histórico da safra!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
