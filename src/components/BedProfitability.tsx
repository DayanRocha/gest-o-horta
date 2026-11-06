import React, { useState } from 'react';
import { Sprout, MapPin, TrendingUp, Calendar, AlertCircle, Sparkles, Plus, ArrowRight } from 'lucide-react';
import { BedProfitability as BedType } from '../types/finance';
import { StatusBadge } from './StatusBadge';

interface BedProfitabilityProps {
  beds: BedType[];
  sunlightMode: boolean;
  onHarvestAndSell: (bed: BedType) => void;
}

export const BedProfitability: React.FC<BedProfitabilityProps> = ({
  beds,
  sunlightMode,
  onHarvestAndSell,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'ready' | 'growing'>('all');

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const filtered = beds.filter((b) => {
    if (filterStatus === 'ready' && b.status !== 'ready') return false;
    if (filterStatus === 'growing' && b.status !== 'growing') return false;
    return true;
  });

  const totalProjectedProfit = beds.reduce((sum, b) => sum + b.projectedProfit, 0);
  const totalCost = beds.reduce((sum, b) => sum + b.costToDate, 0);

  const cardBorderClass = sunlightMode ? 'border-2 border-[#1A2E1A]' : 'border border-[#E0E8E0]';

  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E0E8E0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#E8F8F5] text-[#00796B]">
              <Sprout className="w-5 h-5 stroke-[2.2]" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#0c200d]">
                Rentabilidade por Canteiro & Cultura
              </h2>
              <p className="text-xs text-[#523327]">
                Acompanhe o custo de produção por maço/kg e o lucro real projetado de cada lote.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#F8FAF8] p-3 rounded-xl border border-[#E0E8E0]">
          <div>
            <div className="text-[11px] font-bold uppercase text-[#717a6d]">Lucro Projetado</div>
            <div className="text-xl sm:text-2xl font-black text-[#1B5E20] tnum">
              {formatBRL(totalProjectedProfit)}
            </div>
          </div>
          <div className="border-l border-[#c0c9bb] pl-4">
            <div className="text-[11px] font-bold uppercase text-[#717a6d]">Custo Insumos</div>
            <div className="text-xl font-bold text-[#523327] tnum">
              {formatBRL(totalCost)}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
            filterStatus === 'all'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'bg-white text-[#41493e] border border-[#E0E8E0]'
          }`}
        >
          Todos os Canteiros ({beds.length})
        </button>
        <button
          onClick={() => setFilterStatus('ready')}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            filterStatus === 'ready'
              ? 'bg-[#00796B] text-white shadow-xs'
              : 'bg-white text-[#00796B] border border-[#b2dfdb]'
          }`}
        >
          <Sprout className="w-3.5 h-3.5" />
          <span>Colheita Pronta ({beds.filter((b) => b.status === 'ready').length})</span>
        </button>
        <button
          onClick={() => setFilterStatus('growing')}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
            filterStatus === 'growing'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'bg-white text-[#41493e] border border-[#E0E8E0]'
          }`}
        >
          Em Maturação ({beds.filter((b) => b.status === 'growing').length})
        </button>
      </div>

      {/* Beds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((bed) => {
          const isReady = bed.status === 'ready';
          const marginPercent = ((bed.projectedProfit / bed.realizedRevenue) * 100).toFixed(0);

          return (
            <div
              key={bed.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 ${cardBorderClass} shadow-xs hover:border-[#1B5E20] transition-all flex flex-col justify-between`}
            >
              <div>
                {/* Top: Bed # and Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-extrabold uppercase text-[#795548] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {bed.bedNumber} • {bed.plotArea}
                    </span>
                    <h3 className="text-base font-extrabold text-[#0c200d] mt-0.5">
                      {bed.cropName}
                    </h3>
                  </div>
                  <div>
                    {isReady ? (
                      <StatusBadge variant="colheita" label="Pronto p/ Colher" />
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#f1f5f1] text-[#41493e] border border-[#e0e8e0]">
                        Dia {bed.cycleDays} do ciclo
                      </span>
                    )}
                  </div>
                </div>

                {/* Numbers Row */}
                <div className="mt-4 p-3 rounded-xl bg-[#ebffe5]/60 border border-[#c8e1c3] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#41493e]">Produção Estimada:</span>
                    <span className="text-xs font-extrabold text-[#0c200d] tnum">
                      {bed.harvestYieldEstimate} {bed.harvestYieldUnit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#41493e]">Custo unitário:</span>
                    <span className="text-xs font-extrabold text-[#C62828] tnum">
                      {formatBRL(bed.costPerUnit)} / un
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#41493e]">Preço de venda médio:</span>
                    <span className="text-xs font-extrabold text-[#1B5E20] tnum">
                      {formatBRL(bed.suggestedSalePrice)} / un
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#c0c9bb]/40 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0c200d]">Margem Estimada:</span>
                    <span className="text-sm font-black text-[#1B5E20] tnum">
                      +{marginPercent}% ({formatBRL(bed.projectedProfit)})
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-[#717a6d] flex items-center justify-between">
                  <span>Plantio: {new Date(bed.plantedDate).toLocaleDateString('pt-BR')}</span>
                  <span>Colheita: {new Date(bed.harvestEstimateDate).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="mt-4 pt-3 border-t border-[#f1f5f1]">
                <button
                  onClick={() => onHarvestAndSell(bed)}
                  className={`w-full min-h-[44px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    isReady
                      ? 'bg-[#1B5E20] hover:bg-[#00450d] text-white shadow-xs'
                      : 'bg-[#f1f5f1] hover:bg-[#e1fbdc] text-[#1B5E20]'
                  }`}
                >
                  <Sprout className="w-4 h-4" />
                  <span>{isReady ? 'Lançar Venda deste Canteiro' : 'Registrar Venda Parcial'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
