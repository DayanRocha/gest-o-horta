import React from 'react';
import { CheckCircle2, Clock, UserCheck, Sprout, AlertTriangle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export type BadgeVariant = 'pago' | 'pendente' | 'fiado' | 'colheita' | 'alerta' | 'entrada' | 'saida';

interface StatusBadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ variant, label, className = '' }) => {
  switch (variant) {
    case 'pago':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold leading-none border border-[#c8e6c9] bg-[#E8F5E9] text-[#1B5E20] ${className}`}
          style={{ minHeight: '28px' }}
        >
          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{label || 'Pago'}</span>
        </span>
      );

    case 'pendente':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold leading-none border border-[#ffe0b2] bg-[#FFF3E0] text-[#E65100] ${className}`}
          style={{ minHeight: '28px' }}
        >
          <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{label || 'Pendente'}</span>
        </span>
      );

    case 'fiado':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold leading-none border border-[#ffccbc] bg-[#FBE9E7] text-[#BF360C] ${className}`}
          style={{ minHeight: '28px' }}
        >
          <UserCheck className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{label || 'Fiado / A Prazo'}</span>
        </span>
      );

    case 'colheita':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold leading-none border border-[#b2dfdb] bg-[#E8F8F5] text-[#00796B] ${className}`}
          style={{ minHeight: '28px' }}
        >
          <Sprout className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{label || 'Colheita Pronta'}</span>
        </span>
      );

    case 'alerta':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold leading-none border border-[#ffcdd2] bg-[#FFEBEE] text-[#C62828] ${className}`}
          style={{ minHeight: '28px' }}
        >
          <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{label || 'Atrasado / Atenção'}</span>
        </span>
      );

    case 'entrada':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border border-[#c8e6c9] bg-[#E8F5E9] text-[#1B5E20] ${className}`}
          style={{ minHeight: '26px' }}
        >
          <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{label || 'Entrada'}</span>
        </span>
      );

    case 'saida':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border border-[#ffcdd2] bg-[#FFEBEE] text-[#C62828] ${className}`}
          style={{ minHeight: '26px' }}
        >
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{label || 'Saída'}</span>
        </span>
      );

    default:
      return null;
  }
};
