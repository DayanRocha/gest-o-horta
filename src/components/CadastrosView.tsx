import React, { useState } from 'react';
import { 
  Users, 
  Building2, 
  Sprout, 
  Plus, 
  Trash2, 
  Pencil, 
  Search, 
  Phone, 
  Check, 
  AlertTriangle,
  Tag
} from 'lucide-react';
import { CustomerCredit, Supplier, CropItem } from '../types/finance';
import { EditCustomerDrawer } from './EditCustomerDrawer';

interface CadastrosViewProps {
  credits: CustomerCredit[];
  suppliers: Supplier[];
  crops: CropItem[];
  sunlightMode: boolean;
  onAddCredit: (newCredit: CustomerCredit) => void;
  onUpdateCredit: (updatedCredit: CustomerCredit) => void;
  onDeleteCredit: (id: string) => void;
  onAddSupplier: (newSupplier: Supplier) => void;
  onDeleteSupplier: (id: string) => void;
  onAddCrop: (newCrop: CropItem) => void;
  onDeleteCrop: (id: string) => void;
}

export const CadastrosView: React.FC<CadastrosViewProps> = ({
  credits,
  suppliers,
  crops,
  sunlightMode,
  onAddCredit,
  onUpdateCredit,
  onDeleteCredit,
  onAddSupplier,
  onDeleteSupplier,
  onAddCrop,
  onDeleteCrop,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'clientes' | 'fornecedores' | 'hortalicas'>('clientes');
  const [search, setSearch] = useState('');

  // Estados dos formulários de cadastro
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustType, setNewCustType] = useState<CustomerCredit['customerType']>('Sacolão / Mercado');
  const [newCustPhone, setNewCustPhone] = useState('');

  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [newSupName, setNewSupName] = useState('');
  const [newSupCategory, setNewSupCategory] = useState('Insumos & Adubação Orgânica');
  const [newSupPhone, setNewSupPhone] = useState('');

  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [newCropName, setNewCropName] = useState('');
  const [newCropPrice, setNewCropPrice] = useState<number>(3.50);
  const [newCropUnit, setNewCropUnit] = useState<CropItem['unit']>('maços');

  // Edição e exclusão de cliente
  const [editingCredit, setEditingCredit] = useState<CustomerCredit | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<{ id: string; name: string; type: 'cliente' | 'fornecedor' | 'hortalica' } | null>(null);

  // Handlers de submit
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;

    const todayStr = new Date().toLocaleDateString('pt-BR');
    const defaultDue = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');

    const newCustomer: CustomerCredit = {
      id: `cred-${Date.now()}`,
      customerName: newCustName.trim(),
      customerType: newCustType,
      customerPhone: newCustPhone.trim() || '(19) 99999-0000',
      totalOwed: 0,
      lastPurchaseDate: todayStr,
      dueDate: defaultDue,
      status: 'settled',
      recentItems: [],
    };

    onAddCredit(newCustomer);
    setNewCustName('');
    setNewCustPhone('');
    setIsAddingCustomer(false);
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName.trim()) return;

    const newSupplier: Supplier = {
      id: `sup-${Date.now()}`,
      name: newSupName.trim(),
      category: newSupCategory,
      phone: newSupPhone.trim() || undefined,
    };

    onAddSupplier(newSupplier);
    setNewSupName('');
    setNewSupPhone('');
    setIsAddingSupplier(false);
  };

  const handleCreateCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCropName.trim()) return;

    const newCrop: CropItem = {
      id: `crop-${Date.now()}`,
      name: newCropName.trim(),
      defaultPrice: Number(newCropPrice) || 0,
      unit: newCropUnit,
    };

    onAddCrop(newCrop);
    setNewCropName('');
    setNewCropPrice(3.50);
    setNewCropUnit('maços');
    setIsAddingCrop(false);
  };

  const handleExecuteDelete = () => {
    if (!confirmDeleteId) return;

    if (confirmDeleteId.type === 'cliente') {
      onDeleteCredit(confirmDeleteId.id);
    } else if (confirmDeleteId.type === 'fornecedor') {
      onDeleteSupplier(confirmDeleteId.id);
    } else if (confirmDeleteId.type === 'hortalica') {
      onDeleteCrop(confirmDeleteId.id);
    }

    setConfirmDeleteId(null);
  };

  // Filtros de busca
  const filteredCustomers = credits.filter((c) =>
    c.customerName.toLowerCase().includes(search.toLowerCase()) ||
    c.customerType.toLowerCase().includes(search.toLowerCase()) ||
    c.customerPhone.includes(search)
  );

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.category && s.category.toLowerCase().includes(search.toLowerCase())) ||
    (s.phone && s.phone.includes(search))
  );

  const filteredCrops = crops.filter((cr) =>
    cr.name.toLowerCase().includes(search.toLowerCase()) ||
    cr.unit.toLowerCase().includes(search.toLowerCase())
  );

  const cardBorderClass = sunlightMode ? 'border-2 border-[#1A2E1A]' : 'border border-[#E0E8E0]';

  return (
    <div className="space-y-4">
      {/* Cabeçalho da Aba Cadastros */}
      <div className={`bg-white rounded-2xl p-4 sm:p-5 ${cardBorderClass} shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3`}>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#0c200d] flex items-center gap-2">
            <span>Central de Cadastros</span>
          </h2>
          <p className="text-xs text-[#523327] mt-0.5">
            Gerencie facilmente seus clientes, fornecedores e tipos de hortaliças em um único lugar.
          </p>
        </div>

        {/* Campo de Busca Rápida */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-[#717a6d] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cadastro..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F8FAF8] border border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden text-[#0c200d]"
          />
        </div>
      </div>

      {/* Seletor de Categoria de Cadastro (Sub-abas) */}
      <div className="grid grid-cols-3 gap-2 bg-[#f1f5f1] p-1.5 rounded-2xl border border-[#E0E8E0]">
        <button
          type="button"
          onClick={() => {
            setActiveSubTab('clientes');
            setSearch('');
          }}
          className={`min-h-[46px] rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'clientes'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'text-[#41493e] hover:text-[#0c200d]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Clientes ({credits.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('fornecedores');
            setSearch('');
          }}
          className={`min-h-[46px] rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'fornecedores'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'text-[#41493e] hover:text-[#0c200d]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Fornecedores ({suppliers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('hortalicas');
            setSearch('');
          }}
          className={`min-h-[46px] rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'hortalicas'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'text-[#41493e] hover:text-[#0c200d]'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>Hortaliças ({crops.length})</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 1. SEÇÃO DE CLIENTES */}
      {/* ============================================================ */}
      {activeSubTab === 'clientes' && (
        <div className="space-y-4">
          {/* Botão ou Formulário de Novo Cliente */}
          {isAddingCustomer ? (
            <form onSubmit={handleCreateCustomer} className="p-4 bg-white rounded-2xl border-2 border-[#1B5E20] shadow-sm space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-sm font-extrabold text-[#1B5E20] flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  Cadastrar Novo Cliente
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingCustomer(false)}
                  className="text-xs text-gray-500 hover:text-gray-700 font-bold"
                >
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="text-xs font-bold text-[#0c200d] block mb-1">
                    Nome do Cliente / Sacolão *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="Ex: Sacolão Central"
                    className="w-full min-h-[46px] px-3 text-xs sm:text-sm bg-[#F8FAF8] border border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden text-[#0c200d]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0c200d] block mb-1">
                    Tipo de Estabelecimento
                  </label>
                  <select
                    value={newCustType}
                    onChange={(e) => setNewCustType(e.target.value as any)}
                    className="w-full min-h-[46px] px-3 text-xs sm:text-sm bg-[#F8FAF8] border border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden text-[#0c200d]"
                  >
                    <option value="Pessoa Física">Pessoa Física (Consumidor Final)</option>
                    <option value="Sacolão / Mercado">Sacolão / Mercado</option>
                    <option value="Restaurante">Restaurante / Cozinha</option>
                    <option value="Cliente de Feira">Cliente de Feira Livre</option>
                    <option value="Distribuidor">Distribuidor / Atacado</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0c200d] block mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="(19) 99888-7766"
                    className="w-full min-h-[46px] px-3 text-xs sm:text-sm bg-[#F8FAF8] border border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden text-[#0c200d]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1B5E20] hover:bg-[#00450d] text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Salvar Cliente</span>
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingCustomer(true)}
              className="w-full min-h-[50px] bg-white border-2 border-dashed border-[#1B5E20] hover:bg-[#ebffe5] text-[#1B5E20] font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>+ Cadastrar Novo Cliente</span>
            </button>
          )}

          {/* Lista de Clientes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredCustomers.map((cust) => (
              <div
                key={cust.id}
                className={`bg-white rounded-2xl p-4 ${cardBorderClass} shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-base font-extrabold text-[#0c200d] block leading-tight">
                      {cust.customerName}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingCredit(cust)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-[#1B5E20] hover:bg-[#E8F5E9] transition-colors"
                        title="Editar cliente"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId({ id: cust.id, name: cust.customerName, type: 'cliente' })}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#C62828] hover:bg-[#FFEBEE] transition-colors"
                        title="Excluir cliente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <span className="inline-block mt-1 px-2 py-0.5 bg-[#f1f5f1] text-[#41493e] text-[11px] font-bold rounded-md">
                    {cust.customerType}
                  </span>

                  <div className="mt-2 text-xs font-semibold text-[#523327] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#1B5E20]" />
                    <span>{cust.customerPhone}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Saldo atual:</span>
                  <span className={`font-extrabold ${cust.totalOwed > 0 ? 'text-[#BF360C]' : 'text-[#1B5E20]'}`}>
                    {cust.totalOwed > 0 ? `R$ ${cust.totalOwed.toFixed(2)}` : 'Em dia (R$ 0,00)'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredCustomers.length === 0 && (
            <div className="p-8 bg-white rounded-2xl border text-center text-gray-500 text-sm">
              Nenhum cliente encontrado. Clique no botão acima para cadastrar seu primeiro cliente!
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. SEÇÃO DE FORNECEDORES */}
      {/* ============================================================ */}
      {activeSubTab === 'fornecedores' && (
        <div className="space-y-4">
          {/* Botão ou Formulário de Novo Fornecedor */}
          {isAddingSupplier ? (
            <form onSubmit={handleCreateSupplier} className="p-4 bg-white rounded-2xl border-2 border-[#1B5E20] shadow-sm space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-sm font-extrabold text-[#1B5E20] flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  Cadastrar Novo Fornecedor
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingSupplier(false)}
                  className="text-xs text-gray-500 hover:text-gray-700 font-bold"
                >
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0c200d] block mb-1">
                    Nome da Empresa / Fornecedor *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newSupName}
                    onChange={(e) => setNewSupName(e.target.value)}
                    placeholder="Ex: Agropecuária Terra Viva"
                    className="w-full min-h-[46px] px-3 text-xs sm:text-sm bg-[#F8FAF8] border border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden text-[#0c200d]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0c200d] block mb-1">
                    Ramo / Categoria de Insumo
                  </label>
                  <select
                    value={newSupCategory}
                    onChange={(e) => setNewSupCategory(e.target.value)}
                    className="w-full min-h-[46px] px-3 text-xs sm:text-sm bg-[#F8FAF8] border border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden text-[#0c200d]"
                  >
                    <option value="Insumos & Adubação Orgânica">Insumos & Adubação Orgânica</option>
                    <option value="Sementes & Mudas">Sementes & Mudas</option>
                    <option value="Combustível & Máquinas">Combustível & Máquinas / Diesel</option>
                    <option value="Embalagens & Maços">Embalagens, Caixas & Fitas</option>
                    <option value="Defensivos Biológicos">Defensivos Biológicos & Caldas</option>
                    <option value="Manutenção & Ferramentas">Manutenção & Ferramentas</option>
                    <option value="Irrigação & Energia">Irrigação & Energia</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0c200d] block mb-1">
                    Telefone / Contato (Opcional)
                  </label>
                  <input
                    type="text"
                    value={newSupPhone}
                    onChange={(e) => setNewSupPhone(e.target.value)}
                    placeholder="(19) 98111-2233"
                    className="w-full min-h-[46px] px-3 text-xs sm:text-sm bg-[#F8FAF8] border border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden text-[#0c200d]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1B5E20] hover:bg-[#00450d] text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Salvar Fornecedor</span>
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingSupplier(true)}
              className="w-full min-h-[50px] bg-white border-2 border-dashed border-[#1B5E20] hover:bg-[#ebffe5] text-[#1B5E20] font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>+ Cadastrar Novo Fornecedor</span>
            </button>
          )}

          {/* Lista de Fornecedores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredSuppliers.map((sup) => (
              <div
                key={sup.id}
                className={`bg-white rounded-2xl p-4 ${cardBorderClass} shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-base font-extrabold text-[#0c200d] block leading-tight">
                      {sup.name}
                    </span>
                    <button
                      onClick={() => setConfirmDeleteId({ id: sup.id, name: sup.name, type: 'fornecedor' })}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#C62828] hover:bg-[#FFEBEE] transition-colors"
                      title="Excluir fornecedor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {sup.category && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-[#E8F8F5] text-[#00796B] text-[11px] font-bold rounded-md">
                      {sup.category}
                    </span>
                  )}

                  {sup.phone && (
                    <div className="mt-2 text-xs font-semibold text-[#523327] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#1B5E20]" />
                      <span>{sup.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredSuppliers.length === 0 && (
            <div className="p-8 bg-white rounded-2xl border text-center text-gray-500 text-sm">
              Nenhum fornecedor encontrado. Clique no botão acima para cadastrar seu primeiro fornecedor de insumos!
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. SEÇÃO DE HORTALIÇAS */}
      {/* ============================================================ */}
      {activeSubTab === 'hortalicas' && (
        <div className="space-y-4">
          {/* Botão ou Formulário de Nova Hortaliça */}
          {isAddingCrop ? (
            <form onSubmit={handleCreateCrop} className="p-4 bg-white rounded-2xl border-2 border-[#1B5E20] shadow-sm space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-sm font-extrabold text-[#1B5E20] flex items-center gap-1.5">
                  <Sprout className="w-4 h-4" />
                  Cadastrar Tipo de Hortaliça
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingCrop(false)}
                  className="text-xs text-gray-500 hover:text-gray-700 font-bold"
                >
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0c200d] block mb-1">
                    Nome da Hortaliça / Cultura *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    placeholder="Ex: Alface Americana, Cheiro-Verde"
                    className="w-full min-h-[46px] px-3 text-xs sm:text-sm bg-[#F8FAF8] border border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden text-[#0c200d]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0c200d] block mb-1">
                    Preço Padrão de Venda (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    required
                    value={newCropPrice}
                    onChange={(e) => setNewCropPrice(parseFloat(e.target.value) || 0)}
                    className="w-full min-h-[46px] px-3 text-sm font-bold bg-[#F8FAF8] border border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden tnum text-[#0c200d]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0c200d] block mb-1">
                    Unidade de Medida
                  </label>
                  <select
                    value={newCropUnit}
                    onChange={(e) => setNewCropUnit(e.target.value as any)}
                    className="w-full min-h-[46px] px-2 text-xs font-semibold bg-[#F8FAF8] border border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden text-[#0c200d]"
                  >
                    <option value="maços">maços</option>
                    <option value="kg">kg (quilos)</option>
                    <option value="caixas">caixas</option>
                    <option value="bandejas">bandejas</option>
                    <option value="sacos">sacos</option>
                    <option value="un">un (unidades)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1B5E20] hover:bg-[#00450d] text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Salvar Hortaliça</span>
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingCrop(true)}
              className="w-full min-h-[50px] bg-white border-2 border-dashed border-[#1B5E20] hover:bg-[#ebffe5] text-[#1B5E20] font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>+ Cadastrar Tipo de Hortaliça</span>
            </button>
          )}

          {/* Lista de Hortaliças */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredCrops.map((crop) => (
              <div
                key={crop.id}
                className={`bg-white rounded-2xl p-4 ${cardBorderClass} shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-base font-extrabold text-[#0c200d] block leading-tight">
                      {crop.name}
                    </span>
                    <button
                      onClick={() => setConfirmDeleteId({ id: crop.id, name: crop.name, type: 'hortalica' })}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#C62828] hover:bg-[#FFEBEE] transition-colors"
                      title="Excluir hortaliça"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-2 text-sm font-black text-[#1B5E20]">
                    R$ {crop.defaultPrice.toFixed(2)}{' '}
                    <span className="text-xs font-semibold text-[#523327]">/ {crop.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCrops.length === 0 && (
            <div className="p-8 bg-white rounded-2xl border text-center text-gray-500 text-sm">
              Nenhuma hortaliça cadastrada. Clique no botão acima para adicionar sua primeira verdura ou legume!
            </div>
          )}
        </div>
      )}

      {/* Drawer de Edição de Cliente */}
      <EditCustomerDrawer
        credit={editingCredit}
        onClose={() => setEditingCredit(null)}
        onSave={onUpdateCredit}
        onDelete={onDeleteCredit}
      />

      {/* Diálogo de Confirmação de Exclusão */}
      {confirmDeleteId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setConfirmDeleteId(null)}
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
                Excluir {confirmDeleteId.type === 'cliente' ? 'cliente' : confirmDeleteId.type === 'fornecedor' ? 'fornecedor' : 'hortaliça'} "{confirmDeleteId.name}"?
              </h4>
              <p className="text-xs text-[#717a6d] mt-1">
                Esta ação removerá o registro permanentemente do aplicativo.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 min-h-[46px] rounded-xl border border-gray-300 font-bold text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="flex-1 min-h-[46px] rounded-xl bg-[#C62828] hover:bg-[#b71c1c] text-white font-extrabold text-xs sm:text-sm shadow-md transition-colors"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

