import React, { useState } from 'react';
import { 
  UserCheck, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  ChevronRight,
  Receipt,
  Search,
  Pencil,
  Trash2,
  FileText
} from 'lucide-react';
import { CustomerCredit } from '../types/finance';
import { StatusBadge } from './StatusBadge';
import { EditCustomerDrawer } from './EditCustomerDrawer';

interface FiadoNotebookProps {
  credits: CustomerCredit[];
  sunlightMode: boolean;
  onSettleCredit: (credit: CustomerCredit) => void;
  onAddNewCredit: () => void;
  onUpdateCredit: (updated: CustomerCredit) => void;
  onDeleteCredit: (id: string) => void;
  onOpenCustomerReceipt?: (credit: CustomerCredit) => void;
}

export const FiadoNotebook: React.FC<FiadoNotebookProps> = ({
  credits,
  sunlightMode,
  onSettleCredit,
  onAddNewCredit,
  onUpdateCredit,
  onDeleteCredit,
  onOpenCustomerReceipt,
}) => {
  const [search, setSearch] = useState('');
  const [editingCredit, setEditingCredit] = useState<CustomerCredit | null>(null);
  const [deletingCreditId, setDeletingCreditId] = useState<string | null>(null);

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const filtered = credits.filter((c) =>
    c.customerName.toLowerCase().includes(search.toLowerCase()) ||
    c.customerType.toLowerCase().includes(search.toLowerCase()) ||
    c.customerPhone.includes(search)
  );

  const totalFiado = credits.reduce((sum, c) => sum + c.totalOwed, 0);
  const overdueCount = credits.filter((c) => c.status === 'overdue').length;

  const handleWhatsAppShare = (credit: CustomerCredit) => {
    const text = encodeURIComponent(
      `Olá ${credit.customerName}, tudo bem? Aqui é do Sítio Primavera (AgroHorta). Passando para enviar o extrato atualizado das hortaliças colhidas e entregues. O saldo total pendente é de ${formatBRL(credit.totalOwed)} com vencimento para ${credit.dueDate}. Agradecemos a preferência!`
    );
    window.open(`https://api.whatsapp.com/send?phone=55${credit.customerPhone.replace(/\D/g, '')}&text=${text}`, '_blank');
  };

  const cardBorderClass = sunlightMode ? 'border-2 border-[#1A2E1A]' : 'border-[1.5px] border-[#C8D6C8]';

  return (
    <div className="space-y-4">
      {/* Caderneta Header Overview */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E0E8E0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FBE9E7] text-[#BF360C]">
              <UserCheck className="w-5 h-5 stroke-[2.2]" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#0c200d]">
                Caderneta de Fiado & Contas a Receber
              </h2>
              <p className="text-xs text-[#523327]">
                Controle de entregas a prazo para sacolões, feirantes parceiros e restaurantes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#F8FAF8] p-3 rounded-xl border border-[#E0E8E0]">
          <div>
            <div className="text-[11px] font-bold uppercase text-[#717a6d]">Total na Caderneta</div>
            <div className="text-xl sm:text-2xl font-black text-[#BF360C] tnum">
              {formatBRL(totalFiado)}
            </div>
          </div>
          {overdueCount > 0 && (
            <div className="border-l border-[#c0c9bb] pl-4">
              <div className="text-[11px] font-bold uppercase text-[#C62828] flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Vencidos
              </div>
              <div className="text-xl font-black text-[#C62828] tnum">
                {overdueCount} cliente{overdueCount > 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#717a6d] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar comprador na caderneta..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden text-[#0c200d]"
          />
        </div>

        <button
          onClick={onAddNewCredit}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1B5E20] hover:bg-[#00450d] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Cliente / Débito</span>
        </button>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((credit) => {
          const isOverdue = credit.status === 'overdue';

          return (
            <div
              key={credit.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 ${cardBorderClass} shadow-[0_4px_12px_rgba(27,94,32,0.08)] flex flex-col justify-between relative overflow-hidden`}
            >
              {/* Top Row: Name, Type and Status */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-base font-extrabold text-[#0c200d] block">
                      {credit.customerName}
                    </span>
                    <span className="text-xs font-semibold text-[#523327] inline-block mt-0.5">
                      {credit.customerType} • {credit.customerPhone}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {credit.status === 'overdue' && (
                      <StatusBadge variant="alerta" label="Vencido" />
                    )}
                    {credit.status === 'pending' && (
                      <StatusBadge variant="fiado" label="Em Aberto" />
                    )}
                    {credit.status === 'partial' && (
                      <StatusBadge variant="pendente" label="Parcial" />
                    )}

                    {/* Botão Editar Cliente */}
                    <button
                      onClick={() => setEditingCredit(credit)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-[#1B5E20] hover:bg-[#E8F5E9] transition-colors"
                      title="Editar dados do cliente"
                      aria-label={`Editar ${credit.customerName}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {/* Botão Excluir Cliente */}
                    <button
                      onClick={() => setDeletingCreditId(credit.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#C62828] hover:bg-[#FFEBEE] transition-colors"
                      title="Excluir cliente"
                      aria-label={`Excluir ${credit.customerName}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Amount in Big High-contrast Numbers */}
                <div className="mt-3 bg-[#FBE9E7]/40 p-3 rounded-xl border border-[#ffccbc]/50">
                  <div className="text-[11px] font-bold uppercase text-[#BF360C]">Saldo Devedor</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#BF360C] tnum">
                    {formatBRL(credit.totalOwed)}
                  </div>
                  <div className="text-xs text-[#523327] mt-1 flex items-center justify-between">
                    <span>Última compra: {credit.lastPurchaseDate}</span>
                    <span className={`font-bold ${isOverdue ? 'text-[#C62828]' : 'text-[#41493e]'}`}>
                      Vence em: {credit.dueDate}
                    </span>
                  </div>
                </div>

                {/* Recent Items Preview */}
                <div className="mt-3 space-y-1.5">
                  <div className="text-[11px] font-bold text-[#717a6d] uppercase tracking-wider">
                    Últimas Entregas:
                  </div>
                  {credit.recentItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="text-xs bg-[#f8faf8] px-2.5 py-1.5 rounded-lg border border-[#e0e8e0] flex items-center justify-between"
                    >
                      <span className="text-[#0c200d] font-medium">{item.description}</span>
                      <span className="font-bold text-[#1B5E20] tnum">
                        {formatBRL(item.value)}
                      </span>
                    </div>
                  ))}
                </div>

                {credit.historyNotes && (
                  <p className="mt-2 text-[11px] text-[#523327] italic">
                    Obs: {credit.historyNotes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-[#f1f5f1] flex flex-wrap sm:flex-nowrap items-center gap-2">
                {/* Romaneio / Nota de Entregas */}
                {onOpenCustomerReceipt && (
                  <button
                    onClick={() => onOpenCustomerReceipt(credit)}
                    className="min-h-[44px] px-3 py-2 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-300 flex items-center justify-center gap-1.5 transition-colors"
                    title="Ver Romaneio / Nota de Entregas deste cliente"
                  >
                    <FileText className="w-4 h-4 text-[#1B5E20]" />
                    <span className="hidden sm:inline">Romaneio</span>
                  </button>
                )}

                {/* Cobrar via WhatsApp */}
                <button
                  onClick={() => handleWhatsAppShare(credit)}
                  className="flex-1 min-h-[44px] px-3 py-2 bg-[#E8F5E9] hover:bg-[#c8e6c9] text-[#1B5E20] text-xs font-bold rounded-xl border border-[#c8e6c9] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#2E7D32]" />
                  <span>Cobrar no WhatsApp</span>
                </button>

                {/* Baixar Pagamento */}
                <button
                  onClick={() => onSettleCredit(credit)}
                  className="flex-1 min-h-[44px] px-3 py-2 bg-[#1B5E20] hover:bg-[#00450d] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Receber / Baixar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drawer de Edição do Cliente */}
      <EditCustomerDrawer
        credit={editingCredit}
        onClose={() => setEditingCredit(null)}
        onSave={onUpdateCredit}
        onDelete={onDeleteCredit}
      />

      {/* Diálogo de Confirmação Rápida de Exclusão */}
      {deletingCreditId && (() => {
        const target = credits.find((c) => c.id === deletingCreditId);
        if (!target) return null;

        return (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
            onClick={() => setDeletingCreditId(null)}
          >
            <div 
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-[#ffcdd2] text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-full bg-[#FFEBEE] text-[#C62828] mx-auto flex items-center justify-center">
                <Trash2 className="w-7 h-7 stroke-[2.2]" />
              </div>

              <div>
                <h4 className="text-base font-extrabold text-[#0c200d]">
                  Excluir "{target.customerName}"?
                </h4>
                <p className="text-xs text-[#717a6d] mt-1">
                  O registro deste cliente será removido permanentemente da caderneta de fiado.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingCreditId(null)}
                  className="flex-1 min-h-[46px] rounded-xl border border-gray-300 font-bold text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteCredit(target.id);
                    setDeletingCreditId(null);
                  }}
                  className="flex-1 min-h-[46px] rounded-xl bg-[#C62828] hover:bg-[#b71c1c] text-white font-extrabold text-xs sm:text-sm shadow-md transition-colors"
                >
                  Sim, Excluir
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
