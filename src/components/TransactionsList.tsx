import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Calendar, 
  MapPin, 
  Tag, 
  DollarSign, 
  Clock, 
  CreditCard, 
  Banknote, 
  QrCode,
  Trash2,
  CheckCircle2,
  Plus,
  FileText
} from 'lucide-react';
import { Transaction } from '../types/finance';
import { StatusBadge } from './StatusBadge';

interface TransactionsListProps {
  transactions: Transaction[];
  sunlightMode: boolean;
  onDeleteTransaction: (id: string) => void;
  onOpenNewTransaction: (type?: 'income' | 'expense') => void;
  onMarkAsPaid: (id: string) => void;
  onOpenReceipt?: (tx: Transaction) => void;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  sunlightMode,
  onDeleteTransaction,
  onOpenNewTransaction,
  onMarkAsPaid,
  onOpenReceipt,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense' | 'fiado'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTransactions = transactions.filter((t) => {
    // Type filter
    if (filterType === 'income' && t.type !== 'income') return false;
    if (filterType === 'expense' && t.type !== 'expense') return false;
    if (filterType === 'fiado' && t.paymentMethod !== 'fiado') return false;

    // Category filter
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchCustomer = t.customerName?.toLowerCase().includes(q);
      const matchCrop = t.cropName?.toLowerCase().includes(q);
      const matchBed = t.bedLocation?.toLowerCase().includes(q);
      const matchNotes = t.notes?.toLowerCase().includes(q);
      if (!matchTitle && !matchCustomer && !matchCrop && !matchBed && !matchNotes) {
        return false;
      }
    }

    return true;
  });

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'pix':
        return <QrCode className="w-3.5 h-3.5 text-[#1B5E20]" />;
      case 'dinheiro':
        return <Banknote className="w-3.5 h-3.5 text-[#2E7D32]" />;
      case 'cartao':
        return <CreditCard className="w-3.5 h-3.5 text-[#006e1c]" />;
      case 'fiado':
        return <Clock className="w-3.5 h-3.5 text-[#BF360C]" />;
      default:
        return <DollarSign className="w-3.5 h-3.5" />;
    }
  };

  const cardBorderClass = sunlightMode ? 'border-2 border-[#1A2E1A]' : 'border border-[#E0E8E0]';

  return (
    <div className="space-y-4">
      {/* Action and Filter Ribbon */}
      <div className="bg-white rounded-2xl p-4 border border-[#E0E8E0] shadow-xs space-y-3">
        {/* Row 1: Search & Type Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Filter Pills */}
          <div className="flex items-center overflow-x-auto gap-1.5 p-1 bg-[#f1f5f1] rounded-xl border border-[#E0E8E0] shrink-0">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                filterType === 'all'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-[#41493e] hover:text-[#0c200d]'
              }`}
            >
              Todos ({transactions.length})
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                filterType === 'income'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-[#41493e] hover:text-[#0c200d]'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Vendas</span>
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                filterType === 'expense'
                  ? 'bg-[#C62828] text-white shadow-xs'
                  : 'text-[#41493e] hover:text-[#0c200d]'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Despesas</span>
            </button>
            <button
              onClick={() => setFilterType('fiado')}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                filterType === 'fiado'
                  ? 'bg-[#BF360C] text-white shadow-xs'
                  : 'text-[#41493e] hover:text-[#0c200d]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Fiado</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#717a6d] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por lote, cultura, cliente ou insumo..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F8FAF8] border border-[#B0BEC5] focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] rounded-xl outline-hidden text-[#0c200d] placeholder-[#717a6d]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#717a6d] hover:text-black"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Cards List */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-[#E0E8E0] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#f1f5f1] mx-auto flex items-center justify-center text-[#717a6d]">
            <Filter className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-[#41493e]">
            Nenhum lançamento financeiro encontrado com os filtros atuais.
          </p>
          <button
            onClick={() => onOpenNewTransaction('income')}
            className="px-4 py-2 bg-[#1B5E20] text-white text-xs font-bold rounded-xl shadow-xs"
          >
            + Registrar Novo Lançamento
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((tx) => {
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className={`bg-white rounded-2xl p-4 sm:p-5 ${cardBorderClass} shadow-xs hover:border-[#1B5E20] transition-all relative overflow-hidden`}
              >
                {/* Visual side accent bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    isIncome ? 'bg-[#1B5E20]' : 'bg-[#C62828]'
                  }`}
                />

                {/* Card Header: Title & Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pl-2">
                  <div className="space-y-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-extrabold text-sm sm:text-base text-[#0c200d]">
                        {tx.title}
                      </span>
                      {tx.cropName && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F8F5] text-[#00796B] border border-[#b2dfdb]">
                          {tx.cropName}
                        </span>
                      )}
                    </div>

                    {/* Metadata Sub-row */}
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-[#41493e]">
                      {tx.bedLocation && (
                        <span className="flex items-center gap-1 font-semibold text-[#523327]">
                          <MapPin className="w-3.5 h-3.5 text-[#795548]" />
                          {tx.bedLocation}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-[#717a6d]" />
                        {tx.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#717a6d]" />
                        {new Date(tx.date).toLocaleDateString('pt-BR')} às {tx.time}
                      </span>
                    </div>
                  </div>

                  {/* Status & Method Badges */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    {tx.paymentStatus === 'paid' && <StatusBadge variant="pago" label="Recebido / Pago" />}
                    {tx.paymentStatus === 'pending' && <StatusBadge variant="pendente" label="Aguardando" />}
                    {tx.paymentStatus === 'credit' && <StatusBadge variant="fiado" label="Fiado / A Prazo" />}
                  </div>
                </div>

                {/* Card Middle: Amount and Volume */}
                <div className="mt-3 pt-3 border-t border-[#f1f5f1] pl-2 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-xl sm:text-2xl font-black tnum ${
                          isIncome ? 'text-[#1B5E20]' : 'text-[#C62828]'
                        }`}
                      >
                        {isIncome ? '+' : '-'} {formatBRL(tx.amount)}
                      </span>
                      {tx.quantity && tx.unitPrice && (
                        <span className="text-xs font-semibold text-[#41493e]">
                          ({tx.quantity} {tx.unitType || 'un'} x {formatBRL(tx.unitPrice)})
                        </span>
                      )}
                    </div>

                    {/* Customer or Supplier info */}
                    {(tx.customerName || tx.supplierName) && (
                      <div className="text-xs font-semibold text-[#0c200d] mt-1 flex items-center gap-1.5">
                        <span className="text-[#717a6d]">
                          {isIncome ? 'Comprador:' : 'Fornecedor:'}
                        </span>
                        <span className="font-bold underline decoration-dotted">
                          {tx.customerName || tx.supplierName}
                        </span>
                        {tx.customerPhone && (
                          <span className="text-[11px] text-[#717a6d]">({tx.customerPhone})</span>
                        )}
                      </div>
                    )}

                    {/* Field Notes */}
                    {tx.notes && (
                      <p className="text-xs text-[#523327] mt-1 italic bg-[#ebffe5]/50 px-2.5 py-1 rounded-lg border border-[#c0c9bb]/40">
                        "{tx.notes}"
                      </p>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Botão Nota / Romaneio de Entrega (Apenas para vendas) */}
                    {isIncome && onOpenReceipt && (
                      <button
                        onClick={() => onOpenReceipt(tx)}
                        className="px-2.5 py-1.5 bg-[#E8F5E9] hover:bg-[#c8e6c9] text-[#1B5E20] border border-[#c8e6c9] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                        title="Gerar Nota de Entrega / Romaneio para o cliente"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Nota / Romaneio</span>
                      </button>
                    )}

                    {/* Payment Method Chip */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f1f5f1] border border-[#E0E8E0] text-xs font-bold text-[#0c200d]">
                      {getPaymentIcon(tx.paymentMethod)}
                      <span className="capitalize">{tx.paymentMethod}</span>
                    </div>

                    {/* Action to Mark as Paid if credit/pending */}
                    {tx.paymentStatus !== 'paid' && (
                      <button
                        onClick={() => onMarkAsPaid(tx.id)}
                        className="px-3 py-1.5 bg-[#1B5E20] hover:bg-[#00450d] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                        title="Registrar recebimento agora"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Baixar</span>
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="p-1.5 text-[#717a6d] hover:text-[#C62828] hover:bg-[#FFEBEE] rounded-lg transition-colors"
                      title="Excluir lançamento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
