import React, { useState } from 'react';
import { X, CheckCircle2, Receipt, QrCode, Banknote, CreditCard, UserCheck, DollarSign } from 'lucide-react';
import { CustomerCredit, PaymentMethod } from '../types/finance';

interface SettleCreditDrawerProps {
  credit: CustomerCredit | null;
  onClose: () => void;
  onConfirmSettlement: (creditId: string, amountPaid: number, method: PaymentMethod, notes?: string) => void;
}

export const SettleCreditDrawer: React.FC<SettleCreditDrawerProps> = ({
  credit,
  onClose,
  onConfirmSettlement,
}) => {
  if (!credit) return null;

  const [amount, setAmount] = useState<number>(credit.totalOwed);
  const [method, setMethod] = useState<PaymentMethod>('pix');
  const [receiptNote, setReceiptNote] = useState('');

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const isFullSettlement = amount >= credit.totalOwed;
  const remaining = Math.max(0, credit.totalOwed - amount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    onConfirmSettlement(credit.id, amount, method, receiptNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0c200d]/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto border border-[#E0E8E0] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#E0E8E0] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#E8F5E9] text-[#1B5E20]">
              <Receipt className="w-5 h-5 stroke-[2.2]" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#0c200d]">
                Baixar Pagamento da Caderneta
              </h3>
              <p className="text-xs text-[#523327]">
                Registrar recebimento de {credit.customerName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#f1f5f1] hover:bg-[#e1fbdc] flex items-center justify-center text-[#41493e]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Customer Summary Box */}
          <div className="p-4 bg-[#FBE9E7]/50 rounded-2xl border border-[#ffccbc] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#BF360C] uppercase block">
                Saldo Devedor Atual
              </span>
              <span className="text-sm font-extrabold text-[#0c200d]">
                {credit.customerName} ({credit.customerType})
              </span>
            </div>
            <div className="text-2xl font-black text-[#BF360C] tnum">
              {formatBRL(credit.totalOwed)}
            </div>
          </div>

          {/* Quick settlement buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAmount(credit.totalOwed)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                amount === credit.totalOwed
                  ? 'bg-[#1B5E20] text-white border-[#1B5E20]'
                  : 'bg-white text-[#41493e] border-[#B0BEC5]'
              }`}
            >
              Quitação Total ({formatBRL(credit.totalOwed)})
            </button>
            <button
              type="button"
              onClick={() => setAmount(Math.round(credit.totalOwed / 2))}
              className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                amount === Math.round(credit.totalOwed / 2)
                  ? 'bg-[#1B5E20] text-white border-[#1B5E20]'
                  : 'bg-white text-[#41493e] border-[#B0BEC5]'
              }`}
            >
              50% Parcial ({formatBRL(Math.round(credit.totalOwed / 2))})
            </button>
          </div>

          {/* Amount Input */}
          <div className="p-3.5 bg-white border-2 border-[#1B5E20] rounded-2xl">
            <label className="text-xs font-bold text-[#1B5E20] uppercase block">
              Valor Efetivamente Recebido
            </label>
            <div className="mt-1 flex items-center">
              <span className="text-base font-bold text-[#1B5E20] mr-2">R$</span>
              <input
                type="number"
                step="0.01"
                max={credit.totalOwed}
                required
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full text-2xl font-black text-[#0c200d] bg-transparent outline-hidden tnum"
              />
            </div>
            <div className="mt-1 text-xs text-[#717a6d] flex items-center justify-between">
              <span>{isFullSettlement ? 'Liquidação completa da conta' : 'Pagamento parcial'}</span>
              <span>Restará a pagar: <strong className="text-[#BF360C]">{formatBRL(remaining)}</strong></span>
            </div>
          </div>

          {/* Method Received */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0c200d] uppercase tracking-wider block">
              Como o cliente pagou?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('pix')}
                className={`min-h-[48px] p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  method === 'pix'
                    ? 'bg-[#E8F8F5] border-[#00796B] text-[#00796B]'
                    : 'bg-white border-[#B0BEC5] text-[#41493e]'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Pix</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('dinheiro')}
                className={`min-h-[48px] p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  method === 'dinheiro'
                    ? 'bg-[#E8F5E9] border-[#1B5E20] text-[#1B5E20]'
                    : 'bg-white border-[#B0BEC5] text-[#41493e]'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Dinheiro</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('cartao')}
                className={`min-h-[48px] p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  method === 'cartao'
                    ? 'bg-[#f1f5f1] border-[#41493e] text-[#0c200d]'
                    : 'bg-white border-[#B0BEC5] text-[#41493e]'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Cartão</span>
              </button>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="text-xs font-bold text-[#0c200d] block mb-1">
              Observação do Recibo (Opcional)
            </label>
            <input
              type="text"
              value={receiptNote}
              onChange={(e) => setReceiptNote(e.target.value)}
              placeholder="Ex: Pago na entrega da feira de quarta"
              className="w-full min-h-[46px] px-3 text-xs sm:text-sm bg-[#F8FAF8] border border-[#B0BEC5] rounded-xl outline-hidden text-[#0c200d]"
            />
          </div>

          {/* Confirm Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full min-h-[56px] bg-[#1B5E20] hover:bg-[#00450d] text-white text-base font-extrabold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>Confirmar Recebimento e Entrar no Caixa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
