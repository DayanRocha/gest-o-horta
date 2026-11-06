import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, AlertTriangle, UserCheck } from 'lucide-react';
import { CustomerCredit } from '../types/finance';

interface EditCustomerDrawerProps {
  credit: CustomerCredit | null;
  onClose: () => void;
  onSave: (updated: CustomerCredit) => void;
  onDelete: (id: string) => void;
}

export const EditCustomerDrawer: React.FC<EditCustomerDrawerProps> = ({
  credit,
  onClose,
  onSave,
  onDelete,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerType, setCustomerType] = useState<CustomerCredit['customerType']>('Sacolão / Mercado');
  const [customerPhone, setCustomerPhone] = useState('');
  const [totalOwed, setTotalOwed] = useState<number>(0);
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<CustomerCredit['status']>('pending');
  const [historyNotes, setHistoryNotes] = useState('');

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (credit) {
      setCustomerName(credit.customerName);
      setCustomerType(credit.customerType);
      setCustomerPhone(credit.customerPhone);
      setTotalOwed(credit.totalOwed);
      setDueDate(credit.dueDate);
      setStatus(credit.status);
      setHistoryNotes(credit.historyNotes || '');
      setIsConfirmingDelete(false);
    }
  }, [credit]);

  if (!credit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: CustomerCredit = {
      ...credit,
      customerName: customerName.trim(),
      customerType,
      customerPhone: customerPhone.trim(),
      totalOwed: Number(totalOwed),
      dueDate: dueDate.trim(),
      status,
      historyNotes: historyNotes.trim() || undefined,
    };

    onSave(updated);
    onClose();
  };

  const handleDelete = () => {
    onDelete(credit.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0c200d]/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto border border-[#E0E8E0] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#E0E8E0] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#E8F5E9] text-[#1B5E20]">
              <UserCheck className="w-5 h-5 stroke-[2.2]" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#0c200d]">
                Editar Cliente / Caderneta
              </h3>
              <p className="text-xs text-[#523327]">
                Alterar dados cadastrais ou saldo em aberto
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#f1f5f1] hover:bg-[#e1fbdc] flex items-center justify-center text-[#41493e] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal de confirmação de exclusão */}
        {isConfirmingDelete ? (
          <div className="p-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#FFEBEE] text-[#C62828] mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-[#0c200d]">
                Excluir cliente "{credit.customerName}"?
              </h4>
              <p className="text-xs text-[#717a6d] mt-1 max-w-xs mx-auto">
                Essa ação removerá o comprador da caderneta de fiado. Esta operação não pode ser desfeita.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="flex-1 min-h-[48px] rounded-xl border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 min-h-[48px] rounded-xl bg-[#C62828] hover:bg-[#b71c1c] text-white font-extrabold text-sm shadow-md"
              >
                Sim, Excluir Cliente
              </button>
            </div>
          </div>
        ) : (
          /* Formulário de Edição */
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
                className="w-full min-h-[50px] px-3.5 text-sm font-semibold bg-[#F8FAF8] border-[1.5px] border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden text-[#0c200d]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#0c200d] block mb-1">
                  Tipo de Comprador
                </label>
                <select
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value as any)}
                  className="w-full min-h-[50px] px-3 text-xs sm:text-sm font-semibold bg-[#F8FAF8] border-[1.5px] border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden text-[#0c200d]"
                >
                  <option value="Pessoa Física">Pessoa Física (Consumidor Final)</option>
                  <option value="Sacolão / Mercado">Sacolão / Mercado</option>
                  <option value="Restaurante">Restaurante</option>
                  <option value="Cliente de Feira">Cliente de Feira</option>
                  <option value="Distribuidor">Distribuidor</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0c200d] block mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(19) 99888-0000"
                  className="w-full min-h-[50px] px-3.5 text-sm font-semibold bg-[#F8FAF8] border-[1.5px] border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden text-[#0c200d]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#BF360C] block mb-1">
                  Saldo Devedor Atual (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={totalOwed}
                  onChange={(e) => setTotalOwed(parseFloat(e.target.value) || 0)}
                  className="w-full min-h-[50px] px-3.5 text-base font-extrabold text-[#BF360C] bg-[#FBE9E7]/40 border-[1.5px] border-[#ffccbc] focus:border-[#BF360C] rounded-xl outline-hidden tnum"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0c200d] block mb-1">
                  Data de Vencimento
                </label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="w-full min-h-[50px] px-3.5 text-sm font-semibold bg-[#F8FAF8] border-[1.5px] border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden text-[#0c200d]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0c200d] block mb-1">
                Status da Conta
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full min-h-[50px] px-3 text-xs sm:text-sm font-semibold bg-[#F8FAF8] border-[1.5px] border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden text-[#0c200d]"
              >
                <option value="pending">Em Aberto</option>
                <option value="partial">Parcialmente Pago</option>
                <option value="overdue">Vencido</option>
                <option value="settled">Liquidado / Quitado</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0c200d] block mb-1">
                Observações / Histórico
              </label>
              <textarea
                rows={2}
                value={historyNotes}
                onChange={(e) => setHistoryNotes(e.target.value)}
                placeholder="Ex: Paga sempre às sextas-feiras via Pix"
                className="w-full p-3 text-xs sm:text-sm font-semibold bg-[#F8FAF8] border-[1.5px] border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden text-[#0c200d] resize-none"
              />
            </div>

            {/* Ações: Salvar e Excluir */}
            <div className="pt-3 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="w-full sm:w-auto min-h-[52px] px-4 rounded-xl border border-[#ffcdd2] bg-[#FFEBEE] hover:bg-[#ffcdd2] text-[#C62828] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Excluir Cliente</span>
              </button>

              <button
                type="submit"
                className="flex-1 w-full min-h-[52px] bg-[#1B5E20] hover:bg-[#00450d] text-white text-sm font-extrabold rounded-xl shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

