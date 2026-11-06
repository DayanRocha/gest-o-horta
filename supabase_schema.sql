-- ==============================================================================
-- SCHEMA DO BANCO DE DADOS SUPABASE (PostgreSQL)
-- Aplicação: AgroHorta - Gestão Financeira Rural
-- ==============================================================================
-- Instruções:
-- 1. Acesse o painel do Supabase (https://supabase.com/dashboard)
-- 2. Vá em "SQL Editor" (ícone de terminal à esquerda)
-- 3. Clique em "+ New Query"
-- 4. Cole todo este código e clique em "Run"
-- ==============================================================================

-- 1. Habilitar extensão para geração de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABELA: Hortaliças & Culturas (crops)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    default_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    unit TEXT NOT NULL DEFAULT 'maços' CHECK (unit IN ('maços', 'kg', 'caixas', 'bandejas', 'sacos', 'un')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.crops IS 'Cadastro de hortaliças, verduras, legumes e preços unitários padrão.';

-- ==============================================================================
-- 3. TABELA: Canais de Destino de Venda (sales_channels)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.sales_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.sales_channels IS 'Canais de escoamento e venda da produção (Ex: Sacolão, PNAE, Feira, etc).';

-- ==============================================================================
-- 4. TABELA: Fornecedores de Insumos & Custos (suppliers)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT DEFAULT 'Insumos & Adubação Orgânica',
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.suppliers IS 'Fornecedores de sementes, adubos, combustível, ferramentas e embalagens.';

-- ==============================================================================
-- 5. TABELA: Clientes & Caderneta de Fiado (customers)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_type TEXT NOT NULL DEFAULT 'Pessoa Física' CHECK (customer_type IN ('Pessoa Física', 'Sacolão / Mercado', 'Restaurante', 'Cliente de Feira', 'Distribuidor')),
    customer_phone TEXT,
    total_owed NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    last_purchase_date DATE DEFAULT CURRENT_DATE,
    due_date DATE DEFAULT (CURRENT_DATE + INTERVAL '7 days'),
    status TEXT NOT NULL DEFAULT 'settled' CHECK (status IN ('pending', 'partial', 'overdue', 'settled')),
    history_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.customers IS 'Clientes compradores com controle de saldo devedor e contas a receber a prazo.';

-- ==============================================================================
-- 6. TABELA: Extrato de Transações (transactions - Vendas e Notas de Despesas)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    title TEXT NOT NULL,
    crop_id UUID REFERENCES public.crops(id) ON DELETE SET NULL,
    crop_name TEXT,
    category TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    quantity NUMERIC(10,2),
    unit_price NUMERIC(10,2),
    unit_type TEXT,
    payment_method TEXT NOT NULL DEFAULT 'pix' CHECK (payment_method IN ('pix', 'dinheiro', 'cartao', 'fiado')),
    payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('paid', 'pending', 'credit')),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT,
    customer_phone TEXT,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
    supplier_name TEXT,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    transaction_time TIME NOT NULL DEFAULT CURRENT_TIME,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.transactions IS 'Extrato de fluxo de caixa: Vendas de colheita (entradas) e Notas de despesa (saídas).';

-- ==============================================================================
-- 7. ÍNDICES PARA CONSULTAS RÁPIDAS
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions (transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions (type);
CREATE INDEX IF NOT EXISTS idx_customers_status ON public.customers (status);
CREATE INDEX IF NOT EXISTS idx_customers_name ON public.customers (customer_name);

-- ==============================================================================
-- 8. FUNÇÃO E TRIGGER AUTOMÁTICO DE ATUALIZAÇÃO (updated_at)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_crops_updated_at ON public.crops;
CREATE TRIGGER set_crops_updated_at
BEFORE UPDATE ON public.crops
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_suppliers_updated_at ON public.suppliers;
CREATE TRIGGER set_suppliers_updated_at
BEFORE UPDATE ON public.suppliers
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_customers_updated_at ON public.customers;
CREATE TRIGGER set_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 9. SEGURANÇA: HABILITAÇÃO DO ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso Total para clientes autorizados (anon e authenticated)
CREATE POLICY "Permitir acesso total a crops" ON public.crops FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso total a sales_channels" ON public.sales_channels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso total a suppliers" ON public.suppliers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso total a customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso total a transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 10. CARGA INICIAL DE DADOS PADRÃO (SEEDS)
-- ==============================================================================

-- Hortaliças Iniciais
INSERT INTO public.crops (name, default_price, unit)
VALUES
    ('Alface Crespa', 3.50, 'maços'),
    ('Rúcula Gigante', 3.50, 'maços'),
    ('Tomate Cereja', 24.00, 'caixas'),
    ('Couve-Manteiga', 3.00, 'maços'),
    ('Cheiro-Verde', 2.50, 'maços'),
    ('Cenoura Nantes', 6.00, 'kg')
ON CONFLICT DO NOTHING;

-- Canais de Venda Iniciais
INSERT INTO public.sales_channels (name)
VALUES
    ('Atacado / Sacolão / Mercado'),
    ('Restaurantes & Buffets'),
    ('Venda Direta no Sítio'),
    ('Feira Livre'),
    ('Entrega de Cestas')
ON CONFLICT (name) DO NOTHING;

-- Fornecedores Iniciais
INSERT INTO public.suppliers (name, phone, category)
VALUES
    ('Agropecuária Terra Viva', '(19) 98111-2233', 'Insumos & Adubação Orgânica'),
    ('Sementes Feltrin & Mudas', '(19) 98222-3344', 'Sementes & Mudas'),
    ('Posto Rodoviário (Diesel Trator)', '(19) 98333-4455', 'Combustível & Máquinas'),
    ('Embalagens São Paulo (Fitas & Caixas)', '(19) 98444-5566', 'Embalagens & Maços')
ON CONFLICT DO NOTHING;

-- Clientes Iniciais de Demonstração
INSERT INTO public.customers (customer_name, customer_type, customer_phone, total_owed, status, history_notes)
VALUES
    ('Dona Maria (Vizinha)', 'Pessoa Física', '(19) 99777-1122', 45.00, 'pending', 'Pega cestas quinzenais de verduras'),
    ('Sacolão São Jorge', 'Sacolão / Mercado', '(19) 99821-4455', 880.00, 'pending', 'Entrega semanal às terças e sextas'),
    ('Restaurante Sabor da Roça', 'Restaurante', '(19) 99732-1100', 0.00, 'settled', 'Pagamento pontual via Pix toda semana')
ON CONFLICT DO NOTHING;

