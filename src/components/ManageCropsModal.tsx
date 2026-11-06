import React, { useState } from 'react';
import { X, Plus, Trash2, Sprout, Check } from 'lucide-react';
import { CropItem } from '../types/finance';

interface ManageCropsModalProps {
  isOpen: boolean;
  onClose: () => void;
  crops: CropItem[];
  onAddCrop: (crop: CropItem) => void;
  onDeleteCrop: (id: string) => void;
  onSelectCrop?: (crop: CropItem) => void;
}

export const ManageCropsModal: React.FC<ManageCropsModalProps> = ({
  isOpen,
  onClose,
  crops,
  onAddCrop,
  onDeleteCrop,
  onSelectCrop,
}) => {
  const [name, setName] = useState('');
  const [defaultPrice, setDefaultPrice] = useState<number>(3.50);
  const [unit, setUnit] = useState<CropItem['unit']>('maços');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCrop: CropItem = {
      id: `crop-${Date.now()}`,
      name: name.trim(),
      defaultPrice: Number(defaultPrice) || 0,
      unit,
    };

    onAddCrop(newCrop);
    if (onSelectCrop) {
      onSelectCrop(newCrop);
    }

    setName('');
    setDefaultPrice(3.50);
    setUnit('maços');
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
            <span className="p-2 rounded-xl bg-[#E8F5E9] text-[#1B5E20]">
              <Sprout className="w-5 h-5 stroke-[2.2]" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#0c200d]">
                Cadastro de Hortaliças & Culturas
              </h3>
              <p className="text-xs text-[#717a6d]">
                Configure suas verduras, legumes e preços padrão
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

        {/* Formulário de Nova Hortaliça */}
        {isAdding ? (
          <form onSubmit={handleSubmit} className="p-4 bg-[#f8faf8] rounded-2xl border border-[#c8e1c3] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-[#1B5E20]">
                Nova Hortaliça
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
                Nome da Hortaliça *
              </label>
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Alface Americana, Cheiro-Verde, Espinafre"
                className="w-full min-h-[46px] px-3.5 text-sm bg-white border border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden text-[#0c200d]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-[#0c200d] block mb-1">
                  Preço Padrão (R$)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  required
                  value={defaultPrice}
                  onChange={(e) => setDefaultPrice(parseFloat(e.target.value) || 0)}
                  className="w-full min-h-[46px] px-3 text-sm font-bold bg-white border border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden tnum text-[#0c200d]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0c200d] block mb-1">
                  Unidade de Medida
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as any)}
                  className="w-full min-h-[46px] px-2 text-xs font-semibold bg-white border border-[#B0BEC5] focus:border-[#1B5E20] rounded-xl outline-hidden text-[#0c200d]"
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

            <button
              type="submit"
              className="w-full min-h-[48px] bg-[#1B5E20] hover:bg-[#00450d] text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Salvar Hortaliça</span>
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="w-full min-h-[48px] border-2 border-dashed border-[#1B5E20] hover:bg-[#E8F5E9] text-[#1B5E20] rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Cadastrar Nova Hortaliça</span>
          </button>
        )}

        {/* Lista de Hortaliças Cadastradas */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#717a6d] uppercase tracking-wider">
            <span>Hortaliças Ativas ({crops.length})</span>
            <span className="text-[11px] font-normal lowercase">toque para selecionar</span>
          </div>

          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {crops.map((crop) => (
              <div
                key={crop.id}
                className="p-3 bg-[#F8FAF8] hover:bg-[#ebffe5] border border-[#E0E8E0] rounded-xl flex items-center justify-between gap-2 transition-colors group"
              >
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    if (onSelectCrop) {
                      onSelectCrop(crop);
                      onClose();
                    }
                  }}
                >
                  <span className="text-sm font-extrabold text-[#0c200d] block">
                    {crop.name}
                  </span>
                  <span className="text-xs font-bold text-[#1B5E20]">
                    R$ {crop.defaultPrice.toFixed(2)} / {crop.unit}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {onSelectCrop && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCrop(crop);
                        onClose();
                      }}
                      className="px-2.5 py-1.5 bg-[#1B5E20] text-white text-[11px] font-bold rounded-lg shadow-xs"
                    >
                      Usar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDeleteCrop(crop.id)}
                    className="p-2 text-gray-400 hover:text-[#C62828] hover:bg-[#FFEBEE] rounded-lg transition-colors"
                    title={`Excluir ${crop.name}`}
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

