import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Transaction, CustomerCredit, CropItem, SalesChannel, Supplier } from '../types/finance';

// Converte data pt-BR (dd/mm/yyyy) → ISO (yyyy-mm-dd) para o banco
function toISODate(ptbrDate: string): string | null {
  if (!ptbrDate) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(ptbrDate)) return ptbrDate;
  const [d, m, y] = ptbrDate.split('/');
  if (!d || !m || !y) return null;
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

// Converte data ISO (yyyy-mm-dd) → pt-BR (dd/mm/yyyy) para o app
function toPtBRDate(isoDate: string | null): string {
  if (!isoDate) return new Date().toLocaleDateString('pt-BR');
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(isoDate)) return isoDate;
  const [y, m, d] = isoDate.split('-');
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
}

function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

// Garante que o tipo do cliente atenda estritamente à restrição CHECK do Supabase
function sanitizeCustomerType(type?: string): string {
  if (!type) return 'Pessoa Física';
  const clean = type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (clean.includes('sacol') || clean.includes('mercado')) return 'Sacolão / Mercado';
  if (clean.includes('restauran') || clean.includes('cozinha') || clean.includes('buffet')) return 'Restaurante';
  if (clean.includes('feira')) return 'Cliente de Feira';
  if (clean.includes('distrib') || clean.includes('atac')) return 'Distribuidor';
  return 'Pessoa Física';
}

export const supabaseService = {
  // ==========================================
  // TRANSAÇÕES (Vendas e Notas de Despesas)
  // ==========================================
  async getTransactions(): Promise<Transaction[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: false })
        .order('transaction_time', { ascending: false });

      if (error) {
        console.warn('Erro ao carregar transações do Supabase:', error.message);
        return null;
      }

      return data.map((t) => ({
        id: t.id,
        type: t.type,
        title: t.title,
        cropName: t.crop_name,
        category: t.category,
        amount: Number(t.amount),
        quantity: t.quantity ? Number(t.quantity) : undefined,
        unitPrice: t.unit_price ? Number(t.unit_price) : undefined,
        unitType: t.unit_type,
        paymentMethod: t.payment_method,
        paymentStatus: t.payment_status,
        customerName: t.customer_name,
        customerPhone: t.customer_phone,
        supplierName: t.supplier_name,
        date: t.transaction_date,
        time: t.transaction_time?.slice(0, 5) || '12:00',
        notes: t.notes,
      }));
    } catch (err) {
      console.warn('Falha de rede ao buscar transações no Supabase:', err);
      return null;
    }
  },

  async insertTransaction(tx: Transaction): Promise<Transaction | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            type: tx.type,
            title: tx.title,
            crop_name: tx.cropName || null,
            category: tx.category,
            amount: tx.amount,
            quantity: tx.quantity || null,
            unit_price: tx.unitPrice || null,
            unit_type: tx.unitType || null,
            payment_method: tx.paymentMethod,
            payment_status: tx.paymentStatus,
            customer_name: tx.customerName || null,
            customer_phone: tx.customerPhone || null,
            supplier_name: tx.supplierName || null,
            transaction_date: tx.date,
            transaction_time: tx.time || '12:00:00',
            notes: tx.notes || null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.warn('Erro ao gravar transação no Supabase:', error.message);
        return null;
      }

      return {
        ...tx,
        id: data.id,
      };
    } catch (err) {
      console.warn('Falha de rede ao inserir transação no Supabase:', err);
      return null;
    }
  },

  async deleteTransaction(id: string, title?: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      let query;
      if (isValidUUID(id)) {
        query = supabase.from('transactions').delete().eq('id', id);
      } else if (title) {
        query = supabase.from('transactions').delete().eq('title', title);
      } else {
        query = supabase.from('transactions').delete().eq('id', id);
      }

      const { error } = await query;
      return !error;
    } catch {
      return false;
    }
  },

  async updateTransactionStatus(id: string, paymentStatus: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      if (!isValidUUID(id)) return false;
      const { error } = await supabase
        .from('transactions')
        .update({ payment_status: paymentStatus })
        .eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // ==========================================
  // CLIENTES (Caderneta de Fiado)
  // ==========================================
  async getCustomers(): Promise<CustomerCredit[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('customer_name', { ascending: true });

      if (error) return null;

      return data.map((c) => ({
        id: c.id,
        customerName: c.customer_name,
        customerType: c.customer_type,
        customerPhone: c.customer_phone || '(19) 99999-0000',
        totalOwed: Number(c.total_owed || 0),
        lastPurchaseDate: toPtBRDate(c.last_purchase_date),
        dueDate: toPtBRDate(c.due_date),
        status: c.status || 'settled',
        recentItems: [],
        historyNotes: c.history_notes,
      }));
    } catch {
      return null;
    }
  },

  async insertCustomer(c: CustomerCredit): Promise<CustomerCredit | null> {
    if (!isSupabaseConfigured || !supabase) {
      console.warn('Supabase não está configurado. Salvamento de cliente será apenas local.');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([
          {
            customer_name: c.customerName,
            customer_type: sanitizeCustomerType(c.customerType),
            customer_phone: c.customerPhone,
            total_owed: c.totalOwed,
            last_purchase_date: toISODate(c.lastPurchaseDate),
            due_date: toISODate(c.dueDate),
            status: c.status,
            history_notes: c.historyNotes || null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Erro ao inserir cliente no Supabase:', error.message, error.details);
        return null;
      }

      return {
        id: data.id,
        customerName: data.customer_name,
        customerType: data.customer_type,
        customerPhone: data.customer_phone || c.customerPhone,
        totalOwed: Number(data.total_owed || 0),
        lastPurchaseDate: toPtBRDate(data.last_purchase_date),
        dueDate: toPtBRDate(data.due_date),
        status: data.status,
        recentItems: c.recentItems || [],
        historyNotes: data.history_notes,
      };
    } catch (err) {
      console.error('Exceção ao inserir cliente no Supabase:', err);
      return null;
    }
  },

  async updateCustomer(c: CustomerCredit): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      let query;
      if (isValidUUID(c.id)) {
        query = supabase
          .from('customers')
          .update({
            customer_name: c.customerName,
            customer_type: sanitizeCustomerType(c.customerType),
            customer_phone: c.customerPhone,
            total_owed: c.totalOwed,
            last_purchase_date: toISODate(c.lastPurchaseDate),
            due_date: toISODate(c.dueDate),
            status: c.status,
            history_notes: c.historyNotes || null,
          })
          .eq('id', c.id);
      } else {
        query = supabase
          .from('customers')
          .update({
            customer_type: sanitizeCustomerType(c.customerType),
            customer_phone: c.customerPhone,
            total_owed: c.totalOwed,
            last_purchase_date: toISODate(c.lastPurchaseDate),
            due_date: toISODate(c.dueDate),
            status: c.status,
            history_notes: c.historyNotes || null,
          })
          .eq('customer_name', c.customerName);
      }

      const { error } = await query;
      if (error) {
        console.warn('Erro ao atualizar cliente:', error.message);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  async deleteCustomer(id: string, customerName?: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      let query;
      if (isValidUUID(id)) {
        query = supabase.from('customers').delete().eq('id', id);
      } else if (customerName) {
        query = supabase.from('customers').delete().eq('customer_name', customerName);
      } else {
        query = supabase.from('customers').delete().eq('id', id);
      }

      const { error } = await query;
      if (error) {
        console.warn('Erro ao deletar cliente no Supabase:', error.message);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  // ==========================================
  // HORTALIÇAS & CULTURAS (crops)
  // ==========================================
  async getCrops(): Promise<CropItem[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .order('name', { ascending: true });

      if (error) return null;

      return data.map((cr) => ({
        id: cr.id,
        name: cr.name,
        defaultPrice: Number(cr.default_price),
        unit: cr.unit,
      }));
    } catch {
      return null;
    }
  },

  async insertCrop(crop: CropItem): Promise<CropItem | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('crops')
        .insert([
          {
            name: crop.name,
            default_price: crop.defaultPrice,
            unit: crop.unit,
          },
        ])
        .select()
        .single();

      if (error) return null;
      return {
        id: data.id,
        name: data.name,
        defaultPrice: Number(data.default_price),
        unit: data.unit,
      };
    } catch {
      return null;
    }
  },

  async updateCrop(crop: CropItem): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      let query;
      if (isValidUUID(crop.id)) {
        query = supabase
          .from('crops')
          .update({ name: crop.name, default_price: crop.defaultPrice, unit: crop.unit })
          .eq('id', crop.id);
      } else {
        query = supabase
          .from('crops')
          .update({ default_price: crop.defaultPrice, unit: crop.unit })
          .eq('name', crop.name);
      }

      const { error } = await query;
      return !error;
    } catch {
      return false;
    }
  },

  async deleteCrop(id: string, name?: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      let query;
      if (isValidUUID(id)) {
        query = supabase.from('crops').delete().eq('id', id);
      } else if (name) {
        query = supabase.from('crops').delete().eq('name', name);
      } else {
        query = supabase.from('crops').delete().eq('id', id);
      }
      const { error } = await query;
      return !error;
    } catch {
      return false;
    }
  },

  // ==========================================
  // FORNECEDORES (suppliers)
  // ==========================================
  async getSuppliers(): Promise<Supplier[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name', { ascending: true });

      if (error) return null;

      return data.map((s) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        phone: s.phone,
      }));
    } catch {
      return null;
    }
  },

  async insertSupplier(supplier: Supplier): Promise<Supplier | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert([
          {
            name: supplier.name,
            category: supplier.category || null,
            phone: supplier.phone || null,
          },
        ])
        .select()
        .single();

      if (error) return null;
      return {
        id: data.id,
        name: data.name,
        category: data.category,
        phone: data.phone,
      };
    } catch {
      return null;
    }
  },

  async updateSupplier(supplier: Supplier): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      let query;
      if (isValidUUID(supplier.id)) {
        query = supabase
          .from('suppliers')
          .update({ name: supplier.name, category: supplier.category || null, phone: supplier.phone || null })
          .eq('id', supplier.id);
      } else {
        query = supabase
          .from('suppliers')
          .update({ category: supplier.category || null, phone: supplier.phone || null })
          .eq('name', supplier.name);
      }

      const { error } = await query;
      return !error;
    } catch {
      return false;
    }
  },

  async deleteSupplier(id: string, name?: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      let query;
      if (isValidUUID(id)) {
        query = supabase.from('suppliers').delete().eq('id', id);
      } else if (name) {
        query = supabase.from('suppliers').delete().eq('name', name);
      } else {
        query = supabase.from('suppliers').delete().eq('id', id);
      }
      const { error } = await query;
      return !error;
    } catch {
      return false;
    }
  },

  // ==========================================
  // CANAIS DE VENDA (sales_channels)
  // ==========================================
  async getChannels(): Promise<SalesChannel[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('sales_channels')
        .select('*')
        .order('name', { ascending: true });

      if (error) return null;

      return data.map((ch) => ({
        id: ch.id,
        name: ch.name,
      }));
    } catch {
      return null;
    }
  },

  async insertChannel(channel: SalesChannel): Promise<SalesChannel | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('sales_channels')
        .insert([
          {
            name: channel.name,
          },
        ])
        .select()
        .single();

      if (error) return null;
      return {
        id: data.id,
        name: data.name,
      };
    } catch {
      return null;
    }
  },

  async deleteChannel(id: string, name?: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      let query;
      if (isValidUUID(id)) {
        query = supabase.from('sales_channels').delete().eq('id', id);
      } else if (name) {
        query = supabase.from('sales_channels').delete().eq('name', name);
      } else {
        query = supabase.from('sales_channels').delete().eq('id', id);
      }
      const { error } = await query;
      return !error;
    } catch {
      return false;
    }
  },
};
