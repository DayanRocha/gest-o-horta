import React, { useState } from 'react';
import { X, UserPlus, Check, Phone, DollarSign } from 'lucide-react';
import { CustomerCredit } from '../types/finance';

interface NewCreditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (credit: CustomerCredit) => void;
}

export const NewCreditDrawer: React.FC<NewCreditDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerType, setCustomerType] = useState<CustomerCredit['customerType']>('Sacolão / Mercado');
  const [customerPhone, setCustomerPhone] = useState('');
  const [initialAmount, setInitialAmount] = useState<number>(300.00);
  const [description, setDescription] = useState('100 maços de alface e cheiro-verde');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const todayStr = new Date().toLocaleDateString('pt-BR');
    const defaultDue = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');

    const newCredit: CustomerCredit = {
      id: `cred-${Date.now()}`,
      customerName,
      customerType,
      customerPhone: customerPhone || '(19) 99999-0000',
      totalOwed: initialAmount,
      lastPurchaseDate: todayStr,
      dueDate: dueDate || defaultDue,
      status: 'pending',
      recentItems: [
        {
          description: description || 'Entrega de hortaliças variadas',
          quantity: 'Lote campo',
          value: initialAmount,
          date: todayStr.slice(0, 5),
        },
      ],
      historyNotes: notes || undefined,
    };

    onSave(newCredit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0c200d]/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto border border-[#E0E8E0] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#E0E8E0] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FBE9E7] text-[#BF360C]">
              <UserPlus className="w-5 h-5 stroke-[2.2]" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#0c200d]">
                Novo Cliente na Caderneta (Fiado)
              </h3>
              <p className="text-xs text-[#523327]">
                Registrar comprador com saldo devedor a prazo
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
          <div>
            <label className="text-xs font-bold text-[#0c200d] block mb-1">
              Nome do Cliente / Comprador *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ex: Mercadinho da Vila, Restaurante Sabor do Campo"
              className="w-full min-h-[50px] px-3.5 text-sm font-semibold bg-[#F8FAF8] border-[1.5px] border-[#B0BEC5] rounded-xl outline-hidden text-[#0c200d]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#0c200d] block mb-1">
                Tipo de Estabelecimento
              </label>
              <select
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value as any)}
                className="w-full min-h-[50px] px-3 text-xs sm:text-sm font-semibold bg-[#F8FAF8] border-[1.5px] border-[#B0BEC5] rounded-xl outline-hidden text-[#0c200d]"
              >
                <option value="Pessoa Física">Pessoa Física (Consumidor Final)</option>
                <option value="Sacolão / Mercado">Sacolão / Mercado</option>
                <option value="Restaurante">Restaurante</option>
                <option value="Cliente de Feira">Cliente de Feira</option>
                <option value="Distribuidor">Distribuidor CEASA</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0c200d] block mb-1">
                WhatsApp / Celular
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="(19) 99876-5432"
                className="w-full min-h-[50px] px-3 text-xs sm:text-sm bg-[#F8FAF8] border-[1.5px] border-[#B0BEC5] rounded-xl outline-hidden text-[#0c200d]"
              />
            </div>
          </div>

          {/* Initial Debt Amount */}
          <div className="p-3.5 bg-white border-2 border-[#BF360C] rounded-2xl">
            <label className="text-xs font-bold text-[#BF360C] uppercase block">
              Valor Inicial do Fiado (R$)
            </label>
            <div className="mt-1 flex items-center">
              <span className="text-base font-bold text-[#BF360C] mr-2">R$</span>
              <input
                type="number"
                step="0.01"
                required
                value={initialAmount}
                onChange={(e) => setInitialAmount(parseFloat(e.target.value) || 0)}
                className="w-full text-2xl font-black text-[#0c200d] outline-hidden tnum"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0c200d] block mb-1">
              Hortaliças Entregues Neste Lote
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: 80 maços de couve e 10 caixas de tomate"
              className="w-full min-h-[46px] px-3 text-xs sm:text-sm bg-[#F8FAF8] border border-[#B0BEC5] rounded-xl outline-hidden text-[#0c200d]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#0c200d] block mb-1">
                Data Prometida de Acerto / Vencimento
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="Ex: 12/11/2026"
                className="w-full min-h-[46px] px-3 text-xs sm:text-sm bg-[#F8FAF8] border border-[#B0BEC5] rounded-xl outline-hidden text-[#0c200d]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#0c200d] block mb-1">
                Condições de Pagamento
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Paga quinzenal via Pix"
                className="w-full min-h-[46px] px-3 text-xs sm:text-sm bg-[#F8FAF8] border border-[#B0BEC5] rounded-xl outline-hidden text-[#0c200d]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full min-h-[56px] bg-[#1B5E20] hover:bg-[#00450d] text-white text-base font-extrabold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>Gravar na Caderneta</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
