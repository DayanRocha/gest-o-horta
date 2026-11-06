/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Sprout, Store, Cloud, WifiOff } from 'lucide-react';
import { Header } from './components/Header';
import { FinancialSummary } from './components/FinancialSummary';
import { TransactionsList } from './components/TransactionsList';
import { FiadoNotebook } from './components/FiadoNotebook';
import { FinancialReports } from './components/FinancialReports';
import { BottomNavigation, NavTab } from './components/BottomNavigation';
import { NewTransactionDrawer } from './components/NewTransactionDrawer';
import { SettleCreditDrawer } from './components/SettleCreditDrawer';
import { NewCreditDrawer } from './components/NewCreditDrawer';
import { ManageCropsModal } from './components/ManageCropsModal';
import { ManageChannelsModal } from './components/ManageChannelsModal';
import { CadastrosView } from './components/CadastrosView';
import { SaleReceiptModal } from './components/SaleReceiptModal';
import { 
  INITIAL_TRANSACTIONS, 
  INITIAL_CREDITS,
  INITIAL_CROPS,
  INITIAL_CHANNELS,
  INITIAL_SUPPLIERS
} from './data/mockFinanceData';
import { 
  Transaction, 
  CustomerCredit, 
  TransactionType, 
  PaymentMethod,
  CropItem,
  SalesChannel,
  Supplier
} from './types/finance';
import { supabaseService } from './services/supabaseService';
import { isSupabaseConfigured } from './lib/supabase';

export default function App() {
  // Persistence with localStorage fallback
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('agrohorta_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [credits, setCredits] = useState<CustomerCredit[]>(() => {
    const saved = localStorage.getItem('agrohorta_credits');
    return saved ? JSON.parse(saved) : INITIAL_CREDITS;
  });

  // Hortaliças e Canais de Venda configuráveis
  const [crops, setCrops] = useState<CropItem[]>(() => {
    const saved = localStorage.getItem('agrohorta_crops');
    return saved ? JSON.parse(saved) : INITIAL_CROPS;
  });

  const [channels, setChannels] = useState<SalesChannel[]>(() => {
    const saved = localStorage.getItem('agrohorta_channels');
    return saved ? JSON.parse(saved) : INITIAL_CHANNELS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('agrohorta_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  // Supabase sync status
  const [supabaseOnline, setSupabaseOnline] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(isSupabaseConfigured);

  // Carga inicial dos dados do Supabase (se configurado)
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const loadFromSupabase = async () => {
      setLoadingData(true);
      try {
        const [txData, custData, cropsData, channelsData, suppliersData] = await Promise.all([
          supabaseService.getTransactions(),
          supabaseService.getCustomers(),
          supabaseService.getCrops(),
          supabaseService.getChannels(),
          supabaseService.getSuppliers(),
        ]);

        if (txData !== null) setTransactions(txData);
        if (custData !== null) setCredits(custData);
        if (cropsData !== null) setCrops(cropsData);
        if (channelsData !== null) setChannels(channelsData);
        if (suppliersData !== null) setSuppliers(suppliersData);
        setSupabaseOnline(true);
      } catch {
        setSupabaseOnline(false);
      } finally {
        setLoadingData(false);
      }
    };

    loadFromSupabase();
  }, []);

  // UI States
  const [activeTab, setActiveTab] = useState<NavTab>('extrato');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('semana');
  const [sunlightMode, setSunlightMode] = useState<boolean>(false);

  // Modals & Drawers
  const [isNewTxOpen, setIsNewTxOpen] = useState(false);
  const [txInitialType, setTxInitialType] = useState<TransactionType>('income');
  const [txInitialCrop, setTxInitialCrop] = useState('');
  const [txInitialBed, setTxInitialBed] = useState('');

  const [settleCreditTarget, setSettleCreditTarget] = useState<CustomerCredit | null>(null);
  const [isNewCreditOpen, setIsNewCreditOpen] = useState(false);
  const [isHeaderCropsOpen, setIsHeaderCropsOpen] = useState(false);
  const [isHeaderChannelsOpen, setIsHeaderChannelsOpen] = useState(false);

  // Romaneio & Nota de Entrega do Produtor
  const [receiptTx, setReceiptTx] = useState<Transaction | null>(null);
  const [receiptCredit, setReceiptCredit] = useState<CustomerCredit | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const handleOpenReceiptForTx = (tx: Transaction) => {
    setReceiptTx(tx);
    setReceiptCredit(null);
    setIsReceiptOpen(true);
  };

  const handleOpenReceiptForCredit = (credit: CustomerCredit) => {
    setReceiptCredit(credit);
    setReceiptTx(null);
    setIsReceiptOpen(true);
  };

  // Success Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('agrohorta_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('agrohorta_credits', JSON.stringify(credits));
  }, [credits]);

  useEffect(() => {
    localStorage.setItem('agrohorta_crops', JSON.stringify(crops));
  }, [crops]);

  useEffect(() => {
    localStorage.setItem('agrohorta_channels', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('agrohorta_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  // Handlers para Hortaliças, Canais e Fornecedores
  const handleAddCrop = async (newCrop: CropItem) => {
    setCrops((prev) => [...prev, newCrop]);
    const created = await supabaseService.insertCrop(newCrop);
    if (created) {
      setCrops((prev) => prev.map((c) => (c.id === newCrop.id ? created : c)));
    }
    showToast(`Hortaliça "${newCrop.name}" cadastrada com sucesso!`);
  };

  const handleDeleteCrop = (id: string) => {
    const target = crops.find((c) => c.id === id);
    setCrops((prev) => prev.filter((c) => c.id !== id));
    supabaseService.deleteCrop(id, target?.name);
    showToast(`Hortaliça "${target?.name || ''}" removida.`);
  };

  const handleAddChannel = async (newChannel: SalesChannel) => {
    setChannels((prev) => [...prev, newChannel]);
    const created = await supabaseService.insertChannel(newChannel);
    if (created) {
      setChannels((prev) => prev.map((ch) => (ch.id === newChannel.id ? created : ch)));
    }
    showToast(`Canal de venda "${newChannel.name}" cadastrado!`);
  };

  const handleDeleteChannel = (id: string) => {
    const target = channels.find((ch) => ch.id === id);
    setChannels((prev) => prev.filter((ch) => ch.id !== id));
    supabaseService.deleteChannel(id, target?.name);
    showToast(`Canal de venda "${target?.name || ''}" removido.`);
  };

  const handleAddSupplier = async (newSupplier: Supplier) => {
    setSuppliers((prev) => [...prev, newSupplier]);
    const created = await supabaseService.insertSupplier(newSupplier);
    if (created) {
      setSuppliers((prev) => prev.map((s) => (s.id === newSupplier.id ? created : s)));
    }
    showToast(`Fornecedor "${newSupplier.name}" cadastrado com sucesso!`);
  };

  const handleDeleteSupplier = (id: string) => {
    const target = suppliers.find((s) => s.id === id);
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    supabaseService.deleteSupplier(id, target?.name);
    showToast(`Fornecedor "${target?.name || ''}" removido.`);
  };

  const handleUpdateSupplier = (updatedSupplier: Supplier) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === updatedSupplier.id ? updatedSupplier : s))
    );
    supabaseService.updateSupplier(updatedSupplier);
    showToast(`Fornecedor "${updatedSupplier.name}" atualizado com sucesso!`);
  };

  // Handlers for Transactions
  const handleSaveTransaction = async (newTxData: Omit<Transaction, 'id'>) => {
    const tempId = `tx-${Date.now()}`;
    const newTx: Transaction = {
      ...newTxData,
      id: tempId,
    };

    setTransactions((prev) => [newTx, ...prev]);
    const created = await supabaseService.insertTransaction(newTx);
    if (created) {
      setTransactions((prev) => prev.map((t) => (t.id === tempId ? created : t)));
    }

    // If it was a Fiado purchase, update or add to credits notebook
    if (newTx.paymentMethod === 'fiado' && newTx.customerName) {
      setCredits((prevCredits) => {
        const existingIndex = prevCredits.findIndex(
          (c) => c.customerName.toLowerCase() === newTx.customerName?.toLowerCase()
        );

        if (existingIndex >= 0) {
          const updated = [...prevCredits];
          updated[existingIndex] = {
            ...updated[existingIndex],
            totalOwed: updated[existingIndex].totalOwed + newTx.amount,
            lastPurchaseDate: new Date().toLocaleDateString('pt-BR'),
            recentItems: [
              {
                description: newTx.title,
                quantity: newTx.quantity ? `${newTx.quantity} ${newTx.unitType || 'un'}` : 'Lote',
                value: newTx.amount,
                date: new Date().toLocaleDateString('pt-BR').slice(0, 5),
              },
              ...updated[existingIndex].recentItems.slice(0, 3),
            ],
          };
          // Sincroniza cliente atualizado no Supabase
          supabaseService.updateCustomer(updated[existingIndex]);
          return updated;
        } else {
          // Add new customer in credit book
          const newCredit: CustomerCredit = {
            id: `cred-${Date.now()}`,
            customerName: newTx.customerName || 'Cliente a Prazo',
            customerType: 'Sacolão / Mercado',
            customerPhone: newTx.customerPhone || '(19) 99888-0000',
            totalOwed: newTx.amount,
            lastPurchaseDate: new Date().toLocaleDateString('pt-BR'),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
            status: 'pending',
            recentItems: [
              {
                description: newTx.title,
                quantity: newTx.quantity ? `${newTx.quantity} ${newTx.unitType || 'un'}` : 'Lote',
                value: newTx.amount,
                date: new Date().toLocaleDateString('pt-BR').slice(0, 5),
              },
            ],
          };
          // Insere novo cliente no Supabase
          supabaseService.insertCustomer(newCredit);
          return [newCredit, ...prevCredits];
        }
      });
    }

    showToast(
      newTx.type === 'income'
        ? `Venda de R$ ${newTx.amount.toFixed(2)} gravada no caixa!`
        : `Despesa de R$ ${newTx.amount.toFixed(2)} registrada!`
    );
  };

  const handleDeleteTransaction = (id: string) => {
    const target = transactions.find((t) => t.id === id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    supabaseService.deleteTransaction(id, target?.title);
    showToast('Lançamento removido do extrato.');
  };

  const handleMarkAsPaid = (id: string) => {
    const targetTx = transactions.find((t) => t.id === id);
    if (!targetTx) return;

    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, paymentStatus: 'paid' as const } : t))
    );
    supabaseService.updateTransactionStatus(id, 'paid');

    // Se essa transação era de um cliente da caderneta, abater do saldo devedor dele!
    if (targetTx.customerName && targetTx.paymentStatus === 'credit') {
      setCredits((prevCredits) =>
        prevCredits.map((c) => {
          if (c.customerName.toLowerCase() === targetTx.customerName?.toLowerCase()) {
            const newTotal = Math.max(0, c.totalOwed - targetTx.amount);
            const nextStatus: 'settled' | 'partial' = newTotal === 0 ? 'settled' : 'partial';
            const updated = {
              ...c,
              totalOwed: newTotal,
              status: nextStatus,
            };
            supabaseService.updateCustomer(updated);
            return updated;
          }
          return c;
        })
      );
    }

    showToast('Lançamento marcado como Pago / Liquidado.');
  };

  // Handlers for Fiado
  const handleSettleCreditConfirm = (
    creditId: string,
    amountPaid: number,
    method: PaymentMethod,
    notes?: string
  ) => {
    const target = credits.find((c) => c.id === creditId);
    if (!target) return;

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 1. Procurar transações a prazo ('credit') desse cliente para liquidar diretamente
    // Evita duplicar a mesma venda como novo lançamento de receita
    let remainingToSettle = amountPaid;
    const updatedTransactions = transactions.map((tx) => {
      if (
        remainingToSettle > 0 &&
        tx.paymentStatus === 'credit' &&
        tx.customerName &&
        tx.customerName.toLowerCase() === target.customerName.toLowerCase()
      ) {
        if (remainingToSettle >= tx.amount) {
          // Essa venda foi totalmente quitada
          remainingToSettle -= tx.amount;
          const updatedTx: Transaction = {
            ...tx,
            paymentStatus: 'paid' as const,
            paymentMethod: method,
            notes: tx.notes ? `${tx.notes} • Quitado via ${method}` : `Quitado via ${method}`,
          };
          supabaseService.updateTransactionStatus(tx.id, 'paid');
          return updatedTx;
        }
      }
      return tx;
    });

    // Se sobrou algum valor a quitar (ex: pagamento avulso na caderneta sem transação 1:1 vinculada):
    if (remainingToSettle > 0) {
      const settleTx: Transaction = {
        id: `tx-settle-${Date.now()}`,
        type: 'income',
        title: `Recebimento Fiado - ${target.customerName}`,
        category: 'Atacado / Sacolão',
        amount: remainingToSettle,
        paymentMethod: method,
        paymentStatus: 'paid',
        customerName: target.customerName,
        customerPhone: target.customerPhone,
        date: dateStr,
        time: timeStr,
        notes: notes || `Baixa de conta da caderneta. Saldo restante: R$ ${(target.totalOwed - amountPaid).toFixed(2)}`,
      };
      setTransactions([settleTx, ...updatedTransactions]);
      supabaseService.insertTransaction(settleTx);
    } else {
      setTransactions(updatedTransactions);
    }

    // 2. Atualizar o saldo devedor do cliente na caderneta
    setCredits((prev) =>
      prev
        .map((c) => {
          if (c.id === creditId) {
            const newTotal = Math.max(0, c.totalOwed - amountPaid);
            const nextStatus: 'settled' | 'partial' = newTotal === 0 ? 'settled' : 'partial';
            const updated = {
              ...c,
              totalOwed: newTotal,
              status: nextStatus,
            };
            supabaseService.updateCustomer(updated);
            return updated;
          }
          return c;
        })
        .filter((c) => c.totalOwed > 0)
    );

    showToast(`Recebimento de R$ ${amountPaid.toFixed(2)} de ${target.customerName} registrado com sucesso!`);
  };

  const handleAddNewCredit = async (newCred: CustomerCredit) => {
    setCredits((prev) => [newCred, ...prev]);
    const created = await supabaseService.insertCustomer(newCred);
    if (created) {
      setCredits((prev) => prev.map((c) => (c.id === newCred.id ? created : c)));
      showToast(`Cliente "${newCred.customerName}" salvo no Supabase! ☁️`);
    } else {
      showToast(`Cliente "${newCred.customerName}" salvo localmente.`);
    }
  };

  const handleUpdateCredit = (updatedCredit: CustomerCredit) => {
    setCredits((prev) =>
      prev.map((c) => (c.id === updatedCredit.id ? updatedCredit : c))
    );
    supabaseService.updateCustomer(updatedCredit);
    showToast(`Cliente ${updatedCredit.customerName} atualizado com sucesso!`);
  };

  const handleDeleteCredit = (creditId: string) => {
    const target = credits.find((c) => c.id === creditId);
    setCredits((prev) => prev.filter((c) => c.id !== creditId));
    supabaseService.deleteCustomer(creditId, target?.customerName);
    showToast(`Cliente ${target?.customerName || ''} excluído da caderneta.`);
  };

  const openDrawerWith = (type: TransactionType = 'income') => {
    setTxInitialType(type);
    setTxInitialCrop('');
    setTxInitialBed('');
    setIsNewTxOpen(true);
  };

  return (
    <div
      className={`min-h-screen ${
        sunlightMode ? 'bg-[#e1fbdc] text-[#000000]' : 'bg-[#ebffe5] text-[#0c200d]'
      } transition-colors pb-28 sm:pb-32`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1B5E20] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 font-bold text-xs sm:text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#91f78e]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        selectedPeriod={selectedPeriod}
        onSelectPeriod={setSelectedPeriod}
        sunlightMode={sunlightMode}
        onToggleSunlightMode={() => setSunlightMode(!sunlightMode)}
        onOpenNewTransaction={openDrawerWith}
        supabaseOnline={supabaseOnline}
        loadingData={loadingData}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-5">
        {/* Breadcrumb & Screen Indicator & Atalhos de Cadastro */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1B5E20]"></span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#1B5E20]">
              Gestão Financeira • AgroHorta
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsHeaderCropsOpen(true)}
              className="px-3 py-1.5 bg-white hover:bg-[#ebffe5] border border-[#c8e1c3] text-[#1B5E20] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
              title="Cadastrar e gerenciar hortaliças e preços padrão"
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Hortaliças ({crops.length})</span>
            </button>

            <button
              onClick={() => setIsHeaderChannelsOpen(true)}
              className="px-3 py-1.5 bg-white hover:bg-[#e8f8f5] border border-[#b2dfdb] text-[#00796B] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
              title="Cadastrar e gerenciar canais de destino de venda"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Canais de Venda ({channels.length})</span>
            </button>
          </div>
        </div>

        {/* 1. Hero Financial Summary Metrics */}
        <FinancialSummary
          transactions={transactions}
          credits={credits}
          sunlightMode={sunlightMode}
          onOpenFiadoTab={() => setActiveTab('fiado')}
          onOpenNewTransaction={openDrawerWith}
        />

        {/* Screen Body according to Active Tab */}
        <div>
          {activeTab === 'extrato' && (
            <TransactionsList
              transactions={transactions}
              sunlightMode={sunlightMode}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenNewTransaction={openDrawerWith}
              onMarkAsPaid={handleMarkAsPaid}
              onOpenReceipt={handleOpenReceiptForTx}
            />
          )}

          {activeTab === 'cadastros' && (
            <CadastrosView
              credits={credits}
              suppliers={suppliers}
              crops={crops}
              sunlightMode={sunlightMode}
              onAddCredit={handleAddNewCredit}
              onUpdateCredit={handleUpdateCredit}
              onDeleteCredit={handleDeleteCredit}
              onAddSupplier={handleAddSupplier}
              onDeleteSupplier={handleDeleteSupplier}
              onAddCrop={handleAddCrop}
              onDeleteCrop={handleDeleteCrop}
            />
          )}

          {activeTab === 'fiado' && (
            <FiadoNotebook
              credits={credits}
              sunlightMode={sunlightMode}
              onSettleCredit={(credit) => setSettleCreditTarget(credit)}
              onAddNewCredit={() => setIsNewCreditOpen(true)}
              onUpdateCredit={handleUpdateCredit}
              onDeleteCredit={handleDeleteCredit}
              onOpenCustomerReceipt={handleOpenReceiptForCredit}
            />
          )}

          {activeTab === 'dre' && (
            <FinancialReports
              transactions={transactions}
              sunlightMode={sunlightMode}
            />
          )}
        </div>
      </main>

      {/* Navegação Acessível e Completa no Rodapé */}
      <BottomNavigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        transactionsCount={transactions.length}
        creditsCount={credits.length}
        sunlightMode={sunlightMode}
        onOpenNewTransaction={openDrawerWith}
      />

      {/* Modals & Drawers */}
      <NewTransactionDrawer
        isOpen={isNewTxOpen}
        initialType={txInitialType}
        initialCrop={txInitialCrop}
        initialBed={txInitialBed}
        crops={crops}
        channels={channels}
        customers={credits}
        suppliers={suppliers}
        onAddCrop={handleAddCrop}
        onDeleteCrop={handleDeleteCrop}
        onAddChannel={handleAddChannel}
        onDeleteChannel={handleDeleteChannel}
        onClose={() => setIsNewTxOpen(false)}
        onSave={handleSaveTransaction}
      />

      <SettleCreditDrawer
        credit={settleCreditTarget}
        onClose={() => setSettleCreditTarget(null)}
        onConfirmSettlement={handleSettleCreditConfirm}
      />

      <NewCreditDrawer
        isOpen={isNewCreditOpen}
        onClose={() => setIsNewCreditOpen(false)}
        onSave={handleAddNewCredit}
      />

      {/* Modais de Gerenciamento Aberto pelo Topo */}
      <ManageCropsModal
        isOpen={isHeaderCropsOpen}
        onClose={() => setIsHeaderCropsOpen(false)}
        crops={crops}
        onAddCrop={handleAddCrop}
        onDeleteCrop={handleDeleteCrop}
      />

      <ManageChannelsModal
        isOpen={isHeaderChannelsOpen}
        onClose={() => setIsHeaderChannelsOpen(false)}
        channels={channels}
        onAddChannel={handleAddChannel}
        onDeleteChannel={handleDeleteChannel}
      />

      {/* Modal de Romaneio e Nota de Entrega do Produtor */}
      <SaleReceiptModal
        isOpen={isReceiptOpen}
        transaction={receiptTx}
        creditCustomer={receiptCredit}
        onClose={() => {
          setIsReceiptOpen(false);
          setReceiptTx(null);
          setReceiptCredit(null);
        }}
      />
    </div>
  );
}
