import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
  Check, 
  QrCode, 
  Banknote, 
  CreditCard, 
  Clock, 
  MapPin, 
  Tag, 
  Calendar,
  Sprout,
  DollarSign
} from 'lucide-react';
import { Transaction, TransactionType, PaymentMethod, IncomeCategory, ExpenseCategory, CropItem, SalesChannel, Supplier, CustomerCredit } from '../types/finance';
import { ManageCropsModal } from './ManageCropsModal';
import { ManageChannelsModal } from './ManageChannelsModal';

interface NewTransactionDrawerProps {
  isOpen: boolean;
  initialType?: TransactionType;
  initialCrop?: string;
  initialBed?: string;
  crops: CropItem[];
  channels: SalesChannel[];
  customers?: CustomerCredit[];
  suppliers?: Supplier[];
  onAddCrop: (crop: CropItem) => void;
  onDeleteCrop: (id: string) => void;
  onAddChannel: (channel: SalesChannel) => void;
  onDeleteChannel: (id: string) => void;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id'>) => void;
}

export const NewTransactionDrawer: React.FC<NewTransactionDrawerProps> = ({
  isOpen,
  initialType = 'income',
  initialCrop = '',
  initialBed = '',
  crops,
  channels,
  customers = [],
  suppliers = [],
  onAddCrop,
  onDeleteCrop,
  onAddChannel,
  onDeleteChannel,
  onClose,
  onSave,
}) => {
  const [type, setType] = useState<TransactionType>(initialType);
  const [title, setTitle] = useState('');
  const [cropName, setCropName] = useState(initialCrop);
  const [quantity, setQuantity] = useState<number>(50);
  const [unitType, setUnitType] = useState<'maços' | 'kg' | 'caixas' | 'bandejas' | 'un'>('maços');
  const [unitPrice, setUnitPrice] = useState<number>(3.50);
  const [totalAmount, setTotalAmount] = useState<number>(175.00);
  const [manualAmount, setManualAmount] = useState(false);
  const [category, setCategory] = useState<string>(channels[0]?.name || 'Atacado / Sacolão / Mercado');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [notes, setNotes] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');

  // Modais de Cadastro
  const [isManageCropsOpen, setIsManageCropsOpen] = useState(false);
  const [isManageChannelsOpen, setIsManageChannelsOpen] = useState(false);

  // Update defaults when opened with initial props
  useEffect(() => {
    if (initialType) setType(initialType);
    if (initialCrop) setCropName(initialCrop);
    if (initialCrop && !title) {
      setTitle(`Venda de ${initialCrop}`);
    }
  }, [initialType, initialCrop, isOpen]);

  // Recalculate total amount when qty or unit price changes
  useEffect(() => {
    if (!manualAmount && type === 'income' && quantity && unitPrice) {
      setTotalAmount(Number((quantity * unitPrice).toFixed(2)));
    }
  }, [quantity, unitPrice, manualAmount, type]);

  if (!isOpen) return null;

  const handleSelectCrop = (c: CropItem) => {
    setCropName(c.name);
    setUnitPrice(c.defaultPrice);
    setUnitType(c.unit as any);
    if (!title || title.startsWith('Venda de')) {
      setTitle(`Venda de ${c.name}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isFiado = paymentMethod === 'fiado';
    const paymentStatus = isFiado ? 'credit' : 'paid';

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const formattedNotes = [
      invoiceNumber ? `NF/Recibo: ${invoiceNumber}` : '',
      notes
    ].filter(Boolean).join(' • ');

    onSave({
      type,
      title: title || (type === 'income' ? `Venda de ${cropName || 'Hortaliças'}` : 'Despesa / Nota Fiscal'),
      cropName: type === 'income' ? cropName : undefined,
      category: category as any,
      amount: totalAmount,
      quantity: type === 'income' ? quantity : undefined,
      unitPrice: type === 'income' ? unitPrice : undefined,
      unitType: type === 'income' ? unitType : undefined,
      paymentMethod,
      paymentStatus,
      customerName: type === 'income' ? customerName || (paymentMethod === 'fiado' ? 'Cliente a Prazo' : undefined) : undefined,
      customerPhone: customerPhone || undefined,
      supplierName: type === 'expense' ? supplierName : undefined,
      date: dateStr,
      time: timeStr,
      notes: formattedNotes || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0c200d]/60 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Drawer Container */}
      <div 
        className="w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto border border-[#E0E8E0] shadow-2xl flex flex-col"
        style={{ scrollbarGutter: 'stable' }}
      >
        {/* Drawer Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#E0E8E0] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`p-2 rounded-xl ${
                type === 'income' ? 'bg-[#E8F5E9] text-[#1B5E20]' : 'bg-[#FFEBEE] text-[#C62828]'
              }`}
            >
              {type === 'income' ? <Sprout className="w-5 h-5 stroke-[2.2]" /> : <DollarSign className="w-5 h-5 stroke-[2.2]" />}
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#0c200d]">
                {type === 'income' ? 'Registrar Venda no Campo' : 'Lançar Despesa / Custo'}
              </h3>
              <p className="text-xs text-[#523327]">
                Lançamento tátil rápido para celular e campo
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

        {/* Drawer Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Type Toggle: Entrada vs Saída */}
          <div className="grid grid-cols-2 gap-2 bg-[#f1f5f1] p-1.5 rounded-2xl border border-[#E0E8E0]">
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('Feira Livre');
              }}
              className={`min-h-[46px] rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                type === 'income'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-[#41493e] hover:text-[#0c200d]'
              }`}
            >
              <span className="text-base font-black">+</span>
              <span>Venda de Colheita (Entrada)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategory('Insumos & Adubação Orgânica');
              }}
              className={`min-h-[46px] rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                type === 'expense'
                  ? 'bg-[#C62828] text-white shadow-xs'
                  : 'text-[#41493e] hover:text-[#0c200d]'
              }`}
            >
              <span className="text-base font-black">-</span>
              <span>Despesa / Insumo (Saída)</span>
            </button>
          </div>

          {/* Quick Crop Pills (Only for Income) */}
          {type === 'income' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#41493e] uppercase tracking-wider block">
                  Hortaliça / Cultura Colhida:
                </label>
                <button
                  type="button"
                  onClick={() => setIsManageCropsOpen(true)}
                  className="text-xs font-extrabold text-[#1B5E20] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Cadastrar Hortaliça</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {crops.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCrop(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      cropName === c.name
                        ? 'bg-[#1B5E20] text-white border-[#1B5E20] shadow-xs'
                        : 'bg-[#F8FAF8] text-[#0c200d] border-[#B0BEC5] hover:bg-[#ebffe5]'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className={`text-[10px] ${cropName === c.name ? 'text-white/80' : 'text-[#717a6d]'}`}>
                      (R$ {c.defaultPrice.toFixed(2)}/{c.unit})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title / Description */}
          <div>
            <label className="text-xs font-bold text-[#0c200d] block mb-1">
              {type === 'income' ? 'Título do Lote / Descrição da Venda' : 'Descrição da Despesa'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'income' ? 'Ex: 150 maços de alface para Sacolão' : 'Ex: 5 sacos de torta de mamona'}
              className="w-full min-h-[52px] px-3.5 text-sm font-medium bg-[#F8FAF8] border-[1.5px] border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden text-[#0c200d]"
            />
          </div>

          {/* If Income: Quantity Stepper & Price */}
          {type === 'income' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#ebffe5]/50 rounded-2xl border border-[#c8e1c3]">
              {/* Quantity Stepper */}
              <div>
                <label className="text-xs font-bold text-[#00450d] block mb-1">
                  Quantidade Colhida ({unitType})
                </label>
                <div className="flex items-center gap-1">
                  {/* Minus 10 */}
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 10))}
                    className="w-12 h-12 bg-white border border-[#B0BEC5] rounded-xl font-bold text-xs hover:bg-[#f1f5f1] active:bg-[#e0e8e0] shrink-0"
                  >
                    -10
                  </button>
                  {/* Minus 1 */}
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-12 h-12 bg-white border border-[#B0BEC5] rounded-xl flex items-center justify-center font-bold text-lg hover:bg-[#f1f5f1] active:bg-[#e0e8e0] shrink-0"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  {/* Input value */}
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full h-12 text-center text-lg font-black text-[#0c200d] bg-white border-[1.5px] border-[#B0BEC5] rounded-xl tnum"
                  />
                  {/* Plus 1 */}
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-12 h-12 bg-white border border-[#B0BEC5] rounded-xl flex items-center justify-center font-bold text-lg hover:bg-[#f1f5f1] active:bg-[#e0e8e0] shrink-0"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  {/* Plus 10 */}
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 10)}
                    className="w-12 h-12 bg-white border border-[#B0BEC5] rounded-xl font-bold text-xs hover:bg-[#f1f5f1] active:bg-[#e0e8e0] shrink-0"
                  >
                    +10
                  </button>
                </div>
              </div>

              {/* Unit Price */}
              <div>
                <label className="text-xs font-bold text-[#00450d] block mb-1">
                  Preço Unitário (R$ / {unitType})
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#717a6d]">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.05"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                    className="w-full h-12 pl-10 pr-3 text-base font-extrabold text-[#0c200d] bg-white border-[1.5px] border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden tnum"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Total Amount (Editable or Calculated) */}
          <div className="p-3.5 bg-white border-2 border-[#1B5E20] rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
                Valor Total do Lançamento
              </span>
              <p className="text-[11px] text-[#717a6d]">
                {type === 'income' ? 'Cálculo automático: Qtd x Preço unitário' : 'Valor total da despesa/nota'}
              </p>
            </div>
            <div className="flex items-center">
              <span className="text-base font-bold text-[#1B5E20] mr-1.5">R$</span>
              <input
                type="number"
                step="0.01"
                required
                value={totalAmount}
                onChange={(e) => {
                  setManualAmount(true);
                  setTotalAmount(parseFloat(e.target.value) || 0);
                }}
                className="w-36 text-2xl font-black text-[#1A2E1A] bg-transparent text-right outline-hidden tnum"
              />
            </div>
          </div>

          {/* Classificação & Nota Fiscal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {type === 'expense' ? (
              <div>
                <label className="text-xs font-bold text-[#0c200d] block mb-1">
                  Nº da Nota Fiscal / Recibo (Opcional)
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="Ex: NF 10425"
                  className="w-full min-h-[50px] px-3.5 text-xs sm:text-sm font-semibold bg-[#F8FAF8] border-[1.5px] border-[#B0BEC5] rounded-xl outline-hidden text-[#0c200d]"
                />
              </div>
            ) : null}

            {/* Category / Canal de Destino */}
            <div className={type === 'income' ? 'sm:col-span-2' : ''}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#0c200d] block">
                  {type === 'income' ? 'Canal de Destino da Venda' : 'Categoria da Despesa'}
                </label>
                {type === 'income' && (
                  <button
                    type="button"
                    onClick={() => setIsManageChannelsOpen(true)}
                    className="text-xs font-extrabold text-[#00796B] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Cadastrar Canal</span>
                  </button>
                )}
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full min-h-[50px] px-3 text-xs sm:text-sm font-semibold bg-[#F8FAF8] border-[1.5px] border-[#B0BEC5] rounded-xl outline-hidden text-[#0c200d]"
              >
                {type === 'income' ? (
                  channels.map((ch) => (
                    <option key={ch.id} value={ch.name}>
                      {ch.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Insumos & Adubação Orgânica">Insumos & Adubação Orgânica</option>
                    <option value="Sementes & Mudas">Sementes & Mudas</option>
                    <option value="Combustível & Máquinas">Combustível (Diesel/Gasolina) & Trator</option>
                    <option value="Embalagens & Maços">Embalagens, Fitas & Caixas</option>
                    <option value="Mão de Obra de Campo">Mão de Obra / Diária de Campo</option>
                    <option value="Irrigação & Energia">Irrigação & Energia Elétrica</option>
                    <option value="Defensivos Biológicos">Defensivos Biológicos / Caldas</option>
                    <option value="Manutenção & Ferramentas">Manutenção & Ferramentas</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0c200d] uppercase tracking-wider block">
              Forma de Liquidação / Pagamento:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`min-h-[48px] p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'pix'
                    ? 'bg-[#E8F8F5] border-[#00796B] text-[#00796B] shadow-xs'
                    : 'bg-white border-[#B0BEC5] text-[#41493e]'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Pix</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('dinheiro')}
                className={`min-h-[48px] p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'dinheiro'
                    ? 'bg-[#E8F5E9] border-[#1B5E20] text-[#1B5E20] shadow-xs'
                    : 'bg-white border-[#B0BEC5] text-[#41493e]'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Dinheiro</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cartao')}
                className={`min-h-[48px] p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'cartao'
                    ? 'bg-[#f1f5f1] border-[#41493e] text-[#0c200d] shadow-xs'
                    : 'bg-white border-[#B0BEC5] text-[#41493e]'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Cartão</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('fiado')}
                className={`min-h-[48px] p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'fiado'
                    ? 'bg-[#FBE9E7] border-[#BF360C] text-[#BF360C] shadow-xs'
                    : 'bg-white border-[#B0BEC5] text-[#41493e]'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Fiado / Prazo</span>
              </button>
            </div>
          </div>

          {/* Customer / Supplier details if Fiado or specific account */}
          {(paymentMethod === 'fiado' || type === 'income') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#F8FAF8] rounded-2xl border border-[#E0E8E0]">
              <div>
                <label className="text-xs font-bold text-[#0c200d] block mb-1">
                  Nome do Comprador / Estabelecimento {paymentMethod === 'fiado' && <span className="text-[#C62828]">*</span>}
                </label>
                <input
                  type="text"
                  list="customers-list"
                  required={paymentMethod === 'fiado'}
                  value={customerName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomerName(val);
                    const found = customers.find((c) => c.customerName.toLowerCase() === val.toLowerCase());
                    if (found && found.customerPhone) {
                      setCustomerPhone(found.customerPhone);
                    }
                  }}
                  placeholder="Ex: Sacolão São Jorge"
                  className="w-full min-h-[46px] px-3 text-xs sm:text-sm bg-white border border-[#B0BEC5] rounded-xl outline-hidden text-[#0c200d]"
                />
                <datalist id="customers-list">
                  {customers.map((c) => (
                    <option key={c.id} value={c.customerName}>
                      {c.customerType} • {c.customerPhone}
                    </option>
                  ))}
                </datalist>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0c200d] block mb-1">
                  Telefone / WhatsApp (p/ cobrança)
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(19) 99888-7766"
                  className="w-full min-h-[46px] px-3 text-xs sm:text-sm bg-white border border-[#B0BEC5] rounded-xl outline-hidden text-[#0c200d]"
                />
              </div>
            </div>
          )}

          {/* Supplier if Expense */}
          {type === 'expense' && (
            <div>
              <label className="text-xs font-bold text-[#0c200d] block mb-1">
                Nome do Fornecedor / Casa de Insumos
              </label>
              <input
                type="text"
                list="suppliers-list"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="Ex: Agropecuária Terra Viva"
                className="w-full min-h-[46px] px-3 text-xs sm:text-sm bg-[#F8FAF8] border border-[#B0BEC5] rounded-xl outline-hidden text-[#0c200d]"
              />
              <datalist id="suppliers-list">
                {suppliers.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.category || ''}
                  </option>
                ))}
              </datalist>
            </div>
          )}

          {/* Field Notes */}
          <div>
            <label className="text-xs font-bold text-[#0c200d] block mb-1">
              Anotações Rápidas do Campo (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Lote colhido de madrugada com orvalho; nota assinada"
              className="w-full min-h-[46px] px-3 text-xs sm:text-sm bg-[#F8FAF8] border border-[#B0BEC5] rounded-xl outline-hidden text-[#0c200d]"
            />
          </div>

          {/* Primary Action Button (56px high as per AgroHorta spec) */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full min-h-[56px] bg-[#1B5E20] hover:bg-[#00450d] text-white text-base font-extrabold rounded-2xl shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>Confirmar e Gravar no Caixa</span>
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Cadastro de Hortaliças */}
      <ManageCropsModal
        isOpen={isManageCropsOpen}
        onClose={() => setIsManageCropsOpen(false)}
        crops={crops}
        onAddCrop={onAddCrop}
        onDeleteCrop={onDeleteCrop}
        onSelectCrop={(crop) => {
          handleSelectCrop(crop);
          setIsManageCropsOpen(false);
        }}
      />

      {/* Modal de Cadastro de Canais de Venda */}
      <ManageChannelsModal
        isOpen={isManageChannelsOpen}
        onClose={() => setIsManageChannelsOpen(false)}
        channels={channels}
        onAddChannel={onAddChannel}
        onDeleteChannel={onDeleteChannel}
        onSelectChannel={(chName) => {
          setCategory(chName);
          setIsManageChannelsOpen(false);
        }}
      />
    </div>
  );
};
