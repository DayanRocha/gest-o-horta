export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'pix' | 'dinheiro' | 'cartao' | 'fiado';

export type PaymentStatus = 'paid' | 'pending' | 'credit';

export type IncomeCategory = 
  | 'Feira Livre' 
  | 'Venda Direta no Sítio' 
  | 'Atacado / Sacolão' 
  | 'Restaurantes & Buffets' 
  | 'Entrega de Cestas'
  | string;

export interface CropItem {
  id: string;
  name: string;
  defaultPrice: number;
  unit: 'maços' | 'kg' | 'caixas' | 'bandejas' | 'sacos' | 'un';
}

export interface SalesChannel {
  id: string;
  name: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  category?: string;
}

export type ExpenseCategory = 
  | 'Insumos & Adubação Orgânica' 
  | 'Sementes & Mudas' 
  | 'Embalagens & Maços' 
  | 'Combustível & Máquinas' 
  | 'Mão de Obra de Campo' 
  | 'Irrigação & Energia' 
  | 'Defensivos Biológicos' 
  | 'Frete & Transporte';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  cropName?: string;
  bedLocation?: string;
  category: IncomeCategory | ExpenseCategory;
  amount: number;
  unitPrice?: number;
  quantity?: number;
  unitType?: 'maços' | 'kg' | 'caixas' | 'bandejas' | 'sacos' | 'un';
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  customerName?: string;
  customerPhone?: string;
  supplierName?: string;
  date: string; // YYYY-MM-DD
  time: string;
  notes?: string;
}

export interface CustomerCredit {
  id: string;
  customerName: string;
  customerType: 'Pessoa Física' | 'Restaurante' | 'Sacolão / Mercado' | 'Cliente de Feira' | 'Distribuidor' | string;
  customerPhone: string;
  totalOwed: number;
  lastPurchaseDate: string;
  dueDate: string;
  status: 'pending' | 'overdue' | 'partial' | 'settled';
  recentItems: { description: string; quantity: string; value: number; date: string }[];
  historyNotes?: string;
}

export interface BedProfitability {
  id: string;
  bedNumber: string; // ex: "Canteiro 02"
  plotArea: string; // ex: "Setor Sul - Estufa A"
  cropName: string;
  cycleDays: number; // dias no canteiro
  plantedDate: string;
  harvestEstimateDate: string;
  costToDate: number; // Insumos + água + mão de obra
  harvestYieldEstimate: number; // ex: 350 maços
  harvestYieldUnit: string;
  realizedYield?: number;
  realizedRevenue: number;
  status: 'ready' | 'growing' | 'harvested';
  costPerUnit: number; // R$/maço
  suggestedSalePrice: number;
  projectedProfit: number;
}

export interface CashRegisterReport {
  date: string;
  location: string;
  openingCash: number;
  cashSales: number;
  pixSales: number;
  cardSales: number;
  creditGiven: number; // fiado
  cashExpenses: number; // sangria ou despesa paga na hora
  finalCashInHand: number;
  totalSalesVolume: number;
  notes: string;
}
