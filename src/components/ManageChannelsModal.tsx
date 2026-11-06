import React, { useState } from 'react';
import { X, Plus, Trash2, Store, Check } from 'lucide-react';
import { SalesChannel } from '../types/finance';

interface ManageChannelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  channels: SalesChannel[];
  onAddChannel: (channel: SalesChannel) => void;
  onDeleteChannel: (id: string) => void;
  onSelectChannel?: (channelName: string) => void;
}

export const ManageChannelsModal: React.FC<ManageChannelsModalProps> = ({
  isOpen,
  onClose,
  channels,
  onAddChannel,
  onDeleteChannel,
  onSelectChannel,
}) => {
  const [name, setName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newChannel: SalesChannel = {
      id: `ch-${Date.now()}`,
      name: name.trim(),
    };

    onAddChannel(newChannel);
    if (onSelectChannel) {
      onSelectChannel(newChannel.name);
    }

    setName('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-[#E0E8E0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#E8F8F5] text-[#00796B]">
              <Store className="w-5 h-5 stroke-[2.2]" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#0c200d]">
                Canais de Destino da Venda
              </h3>
              <p className="text-xs text-[#717a6d]">
                Cadastre os locais e tipos de clientes onde você entrega suas hortaliças
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário de Novo Canal */}
        {isAdding ? (
          <form onSubmit={handleSubmit} className="p-4 bg-[#f8faf8] rounded-2xl border border-[#b2dfdb] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-[#00796B]">
                Novo Canal / Tipo de Venda
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Cancelar
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0c200d] block mb-1">
                Nome do Canal de Venda *
              </label>
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Quitanda São João, Merenda Escolar PNAE, Porta a Porta"
                className="w-full min-h-[46px] px-3.5 text-sm bg-white border border-[#B0BEC5] focus:border-[#00796B] rounded-xl outline-hidden text-[#0c200d]"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] bg-[#00796B] hover:bg-[#004d40] text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Salvar Canal de Venda</span>
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="w-full min-h-[48px] border-2 border-dashed border-[#00796B] hover:bg-[#E8F8F5] text-[#00796B] rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Cadastrar Novo Canal de Venda</span>
          </button>
        )}

        {/* Lista de Canais Cadastrados */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#717a6d] uppercase tracking-wider">
            <span>Canais Cadastrados ({channels.length})</span>
            <span className="text-[11px] font-normal lowercase">toque para selecionar</span>
          </div>

          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {channels.map((ch) => (
              <div
                key={ch.id}
                className="p-3 bg-[#F8FAF8] hover:bg-[#E8F8F5] border border-[#E0E8E0] rounded-xl flex items-center justify-between gap-2 transition-colors"
              >
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    if (onSelectChannel) {
                      onSelectChannel(ch.name);
                      onClose();
                    }
                  }}
                >
                  <span className="text-sm font-extrabold text-[#0c200d] block">
                    {ch.name}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {onSelectChannel && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectChannel(ch.name);
                        onClose();
                      }}
                      className="px-2.5 py-1.5 bg-[#00796B] text-white text-[11px] font-bold rounded-lg shadow-xs"
                    >
                      Usar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDeleteChannel(ch.id)}
                    className="p-2 text-gray-400 hover:text-[#C62828] hover:bg-[#FFEBEE] rounded-lg transition-colors"
                    title={`Excluir ${ch.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

