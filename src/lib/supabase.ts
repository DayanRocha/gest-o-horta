import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (Prioriza variáveis de ambiente do Vite/Vercel, com fallback automático)
const DEFAULT_SUPABASE_URL = 'https://cyifowxlsnqgvazfekil.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aWZvd3hsc25xZ3ZhemZla2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM5MTE4MTAsImV4cCI6MjEwOTQ4NzgxMH0.h0QtiB_dJGXYR7gfI58hbP7VXnxLQxBfy9xVWGN_ews';

const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Se as variáveis de ambiente estiverem vazias ou forem placeholders, usa as credenciais padrão do projeto
const supabaseUrl = (envUrl && !envUrl.includes('SEU_PROJETO')) ? envUrl : DEFAULT_SUPABASE_URL;
const supabaseAnonKey = (envKey && !envKey.includes('SUA_CHAVE')) ? envKey : DEFAULT_SUPABASE_ANON_KEY;

// Validação segura para saber se as chaves reais foram preenchidas
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 20
);

// Cliente Supabase instanciado com fallback seguro
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
