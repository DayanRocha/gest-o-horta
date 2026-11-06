import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  MessageCircle, 
  Copy, 
  Check, 
  Settings, 
  Sprout, 
  Calendar, 
  Clock, 
  Phone, 
  User, 
  FileText,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Transaction, CustomerCredit } from '../types/finance';

export interface ProducerProfile {
  farmName: string;
  producerName: string;
  phone: string;
  pixKey: string;
  cityState: string;
  taxId?: string; // CPF / CNPJ / Inscrição Estadual
}

const DEFAULT_PRODUCER_PROFILE: ProducerProfile = {
  farmName: 'Sítio Primavera • AgroHorta Familiar',
  producerName: 'Dayan - Produtor Rural',
  phone: '(19) 99888-0000',
  pixKey: '(19) 99888-0000 (Chave Celular)',
  cityState: 'Campinas - SP',
  taxId: 'Produtor Rural Familiar',
};

interface SaleReceiptModalProps {
  isOpen: boolean;
  transaction?: Transaction | null;
  creditCustomer?: CustomerCredit | null;
  onClose: () => void;
}

export const SaleReceiptModal: React.FC<SaleReceiptModalProps> = ({
  isOpen,
  transaction,
  creditCustomer,
  onClose,
}) => {
  // Configuração dos dados do produtor (salvo no localStorage)
  const [profile, setProfile] = useState<ProducerProfile>(() => {
    const saved = localStorage.getItem('agrohorta_producer_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCER_PROFILE;
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState<ProducerProfile>(profile);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('agrohorta_producer_profile', JSON.stringify(profile));
  }, [profile]);

  if (!isOpen) return null;
  if (!transaction && !creditCustomer) return null;

  // Formatação de Moeda
  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Identificação do documento
  const docNumber = transaction
    ? (transaction.id.replace(/\D/g, '').slice(-6) || '001')
    : (creditCustomer?.id.replace(/\D/g, '').slice(-6) || '001');

  const customerName = transaction?.customerName || creditCustomer?.customerName || 'Cliente';
  const customerPhone = transaction?.customerPhone || creditCustomer?.customerPhone || '';
  const dateStr = transaction 
    ? new Date(transaction.date).toLocaleDateString('pt-BR') 
    : (creditCustomer?.lastPurchaseDate || new Date().toLocaleDateString('pt-BR'));
  const timeStr = transaction?.time || '10:00';

  const totalAmount = transaction 
    ? transaction.amount 
    : (creditCustomer?.totalOwed || 0);

  const paymentMethodLabel = transaction 
    ? (transaction.paymentMethod === 'pix' ? 'Pix' 
        : transaction.paymentMethod === 'dinheiro' ? 'Dinheiro em Espécie'
        : transaction.paymentMethod === 'cartao' ? 'Cartão de Débito/Crédito'
        : 'A Prazo / Caderneta')
    : 'A Prazo / Caderneta';

  const paymentStatusLabel = transaction
    ? (transaction.paymentStatus === 'paid' ? 'QUITADO / PAGO' : 'PENDENTE DE PAGAMENTO')
    : (creditCustomer?.status === 'settled' ? 'QUITADO' : 'EM ABERTO / A PRAZO');

  // Gerar texto formatado para envio no WhatsApp
  const generateWhatsAppMessage = () => {
    let msg = `🌿 *${profile.farmName.toUpperCase()}*\n`;
    msg += `📄 *ROMANEIO DE ENTREGA & NOTA DO PRODUTOR*\n`;
    msg += `Nº Recibo: #${docNumber}\n`;
    msg += `--------------------------------------\n`;
    msg += `👤 *Cliente:* ${customerName}\n`;
    if (customerPhone) msg += `📞 *Contato:* ${customerPhone}\n`;
    msg += `📅 *Data:* ${dateStr} às ${timeStr}\n`;
    msg += `--------------------------------------\n`;
    msg += `📦 *DISCRIMINAÇÃO DAS HORTALIÇAS:*\n`;

    if (transaction) {
      if (transaction.quantity && transaction.unitPrice) {
        msg += `• ${transaction.cropName || transaction.title}: ${transaction.quantity} ${transaction.unitType || 'un'} x ${formatBRL(transaction.unitPrice)} = *${formatBRL(transaction.amount)}*\n`;
      } else {
        msg += `• ${transaction.title}: *${formatBRL(transaction.amount)}*\n`;
      }
    } else if (creditCustomer && creditCustomer.recentItems.length > 0) {
      creditCustomer.recentItems.forEach((item) => {
        msg += `• ${item.description} (${item.quantity}): *${formatBRL(item.value)}*\n`;
      });
    }

    if (transaction?.notes) {
      msg += `\n📝 *Obs:* ${transaction.notes}\n`;
    }

    msg += `--------------------------------------\n`;
    msg += `💰 *VALOR TOTAL: ${formatBRL(totalAmount)}*\n`;
    msg += `💳 *Forma de Pgto:* ${paymentMethodLabel}\n`;
    msg += `📌 *Situação:* ${paymentStatusLabel}\n`;

    if (profile.pixKey) {
      msg += `🔑 *Chave Pix do Produtor:* ${profile.pixKey}\n`;
    }

    msg += `--------------------------------------\n`;
    msg += `Agradecemos a preferência! Produto fresco colhido direto da horta. 🌱\n`;
    msg += `_Contato: ${profile.phone}_`;

    return msg;
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(generateWhatsAppMessage());
    const cleanPhone = customerPhone.replace(/\D/g, '');
    const phoneParam = cleanPhone.length >= 10 ? `phone=55${cleanPhone}&` : '';
    window.open(`https://api.whatsapp.com/send?${phoneParam}text=${text}`, '_blank');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateWhatsAppMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(tempProfile);
    setIsEditingProfile(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      {/* Estilos para impressão limpa da Nota de Serviço / Romaneio */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #agrohorta-receipt-print, #agrohorta-receipt-print * {
            visibility: visible !important;
          }
          #agrohorta-receipt-print {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div 
        className="w-full max-w-xl bg-white rounded-3xl max-h-[92vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Bar (Não impresso) */}
        <div className="no-print bg-[#1B5E20] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-white/20">
              <FileText className="w-5 h-5 text-white" />
            </span>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Nota de Entrega / Romaneio</h3>
              <p className="text-xs text-green-100">Comprovante de hortaliças para controle de despesas do cliente</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTempProfile(profile);
                setIsEditingProfile(!isEditingProfile);
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-xs font-bold flex items-center gap-1"
              title="Personalizar dados do seu sítio/horta"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Dados do Sítio</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Fechar comprovante"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Formulário de Configuração do Produtor (se ativado) */}
          {isEditingProfile && (
            <form onSubmit={handleSaveProfile} className="no-print p-4 bg-[#F8FAF8] rounded-2xl border-2 border-[#1B5E20] space-y-3 mb-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-1 border-b border-gray-200">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#1B5E20] flex items-center gap-1.5">
                  <Sprout className="w-4 h-4" />
                  Identificação do Produtor / Sítio na Nota
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="text-xs font-bold text-gray-500 hover:text-gray-700"
                >
                  Fechar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-0.5">Nome do Sítio / Horta</label>
                  <input
                    type="text"
                    value={tempProfile.farmName}
                    onChange={(e) => setTempProfile({ ...tempProfile, farmName: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg outline-hidden focus:border-[#1B5E20]"
                    placeholder="Ex: Sítio Primavera • Horta Orgânica"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-0.5">Nome do Produtor Rural</label>
                  <input
                    type="text"
                    value={tempProfile.producerName}
                    onChange={(e) => setTempProfile({ ...tempProfile, producerName: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg outline-hidden focus:border-[#1B5E20]"
                    placeholder="Ex: Dayan"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-0.5">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={tempProfile.phone}
                    onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg outline-hidden focus:border-[#1B5E20]"
                    placeholder="(19) 99888-0000"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-0.5">Chave Pix para Recebimento</label>
                  <input
                    type="text"
                    value={tempProfile.pixKey}
                    onChange={(e) => setTempProfile({ ...tempProfile, pixKey: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg outline-hidden focus:border-[#1B5E20]"
                    placeholder="Chave celular, CPF ou e-mail"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-0.5">Cidade / Estado / Registro</label>
                  <input
                    type="text"
                    value={tempProfile.cityState}
                    onChange={(e) => setTempProfile({ ...tempProfile, cityState: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg outline-hidden focus:border-[#1B5E20]"
                    placeholder="Ex: Campinas - SP • Cadastro de Produtor Rural"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1B5E20] hover:bg-[#00450d] text-white text-xs font-extrabold rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvar Dados do Sítio</span>
                </button>
              </div>
            </form>
          )}

          {/* ============================================================ */}
          {/* COMPROVANTE VISUAL / ÁREA QUE SERÁ IMPRESSA                   */}
          {/* ============================================================ */}
          <div 
            id="agrohorta-receipt-print"
            className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-gray-200 shadow-sm space-y-4 text-[#0c200d]"
          >
            {/* Header da Nota */}
            <div className="border-b-2 border-dashed border-gray-300 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#E8F5E9] text-[#1B5E20]">
                      <Sprout className="w-5 h-5" />
                    </span>
                    <span className="font-black text-lg text-[#1B5E20] tracking-tight">
                      {profile.farmName}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 font-medium mt-1">
                    {profile.producerName} • {profile.cityState}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    Contato: {profile.phone}
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 bg-gray-100 border border-gray-300 text-gray-800 text-[11px] font-black rounded-lg">
                    RECIBO Nº {docNumber}
                  </span>
                  <div className="text-xs text-gray-500 font-bold mt-1">
                    {dateStr} às {timeStr}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-center border-t border-gray-100">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#1B5E20]">
                  ROMANEIO DE ENTREGA & CONTROLE DE DESPESAS DO CLIENTE
                </span>
              </div>
            </div>

            {/* Identificação do Cliente */}
            <div className="bg-[#F8FAF8] p-3 rounded-xl border border-gray-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-gray-500 font-bold block text-[10px] uppercase">Comprador / Estabelecimento:</span>
                <span className="font-extrabold text-sm text-gray-900">{customerName}</span>
              </div>
              {customerPhone && (
                <div>
                  <span className="text-gray-500 font-bold block text-[10px] uppercase">Telefone / WhatsApp:</span>
                  <span className="font-semibold text-gray-800">{customerPhone}</span>
                </div>
              )}
            </div>

            {/* Tabela de Produtos / Hortaliças */}
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-gray-600 mb-2">
                Hortaliças Fornecidas:
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f1f5f1] border-b border-gray-200 text-gray-700 font-bold">
                    <tr>
                      <th className="py-2 px-3">Item / Cultura</th>
                      <th className="py-2 px-2 text-center">Qtd.</th>
                      <th className="py-2 px-2 text-right">Preço Unit.</th>
                      <th className="py-2 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {transaction ? (
                      <tr>
                        <td className="py-2.5 px-3">
                          <span className="font-extrabold text-gray-900 block">
                            {transaction.cropName || transaction.title}
                          </span>
                          {transaction.cropName && transaction.title !== `Venda de ${transaction.cropName}` && (
                            <span className="text-[11px] text-gray-500 block">{transaction.title}</span>
                          )}
                          {transaction.bedLocation && (
                            <span className="text-[10px] text-gray-400">Origem: {transaction.bedLocation}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold text-gray-800">
                          {transaction.quantity ? `${transaction.quantity} ${transaction.unitType || 'un'}` : '1 lote'}
                        </td>
                        <td className="py-2.5 px-2 text-right text-gray-700 tnum">
                          {transaction.unitPrice ? formatBRL(transaction.unitPrice) : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-gray-900 tnum">
                          {formatBRL(transaction.amount)}
                        </td>
                      </tr>
                    ) : creditCustomer && creditCustomer.recentItems.length > 0 ? (
                      creditCustomer.recentItems.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-3 font-extrabold text-gray-900">
                            {item.description}
                            <span className="text-[10px] text-gray-400 block">Data entrega: {item.date}</span>
                          </td>
                          <td className="py-2.5 px-2 text-center font-bold text-gray-800">
                            {item.quantity}
                          </td>
                          <td className="py-2.5 px-2 text-right text-gray-700 tnum">-</td>
                          <td className="py-2.5 px-3 text-right font-black text-gray-900 tnum">
                            {formatBRL(item.value)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-3 px-3 text-center text-gray-400">
                          Nenhum detalhe adicional de produto disponível.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totalizador & Condição de Pagamento */}
            <div className="bg-[#ebffe5]/50 p-4 rounded-xl border border-[#c8e6c9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-gray-600 block">Forma de Pagamento:</span>
                <span className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5 mt-0.5">
                  <span>{paymentMethodLabel}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    transaction?.paymentStatus === 'paid' || creditCustomer?.status === 'settled'
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {paymentStatusLabel}
                  </span>
                </span>
                {profile.pixKey && (
                  <span className="text-xs text-gray-600 mt-1 block">
                    Pix: <strong className="text-[#1B5E20]">{profile.pixKey}</strong>
                  </span>
                )}
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Valor Total do Romaneio
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#1B5E20] tnum">
                  {formatBRL(totalAmount)}
                </span>
              </div>
            </div>

            {/* Observações da Entrega */}
            {transaction?.notes && (
              <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                <strong>Observações:</strong> {transaction.notes}
              </div>
            )}

            {/* Linha de Assinatura para Comprovante Físico */}
            <div className="pt-6 border-t border-gray-200 mt-6 grid grid-cols-2 gap-6 text-center text-[11px] text-gray-500">
              <div>
                <div className="border-t border-gray-400 w-3/4 mx-auto mb-1"></div>
                <span>Assinatura do Produtor</span>
              </div>
              <div>
                <div className="border-t border-gray-400 w-3/4 mx-auto mb-1"></div>
                <span>Recebido por (Cliente)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer / Ações de Envio (Não impressas) */}
        <div className="no-print bg-gray-50 border-t border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <button
            onClick={handleCopyText}
            className="w-full sm:w-auto min-h-[44px] px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial min-h-[44px] px-4 py-2 bg-white hover:bg-[#E8F5E9] border border-[#c8e6c9] text-[#1B5E20] text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={handleSendWhatsApp}
              className="flex-1 sm:flex-initial min-h-[44px] px-5 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Enviar no WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

