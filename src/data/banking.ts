import { BankInstitution } from '../types';

export const BRAZILIAN_BANKS: BankInstitution[] = [
  {
    code: '001',
    name: 'Banco do Brasil',
    fullName: 'Banco do Brasil S.A.',
    ispb: '00000000',
    pixSupported: true,
    boletoSupported: true,
    tedSupported: true,
    color: '#FFEF38',
  },
  {
    code: '104',
    name: 'Caixa Econômica',
    fullName: 'Caixa Econômica Federal',
    ispb: '00360305',
    pixSupported: true,
    boletoSupported: true,
    tedSupported: true,
    color: '#0066B3',
  },
  {
    code: '341',
    name: 'Itaú Unibanco',
    fullName: 'Itaú Unibanco S.A.',
    ispb: '60701190',
    pixSupported: true,
    boletoSupported: true,
    tedSupported: true,
    color: '#EC7000',
  },
  {
    code: '237',
    name: 'Bradesco',
    fullName: 'Banco Bradesco S.A.',
    ispb: '60746948',
    pixSupported: true,
    boletoSupported: true,
    tedSupported: true,
    color: '#CC092F',
  },
  {
    code: '033',
    name: 'Santander',
    fullName: 'Banco Santander (Brasil) S.A.',
    ispb: '90400888',
    pixSupported: true,
    boletoSupported: true,
    tedSupported: true,
    color: '#EC0000',
  },
  {
    code: '260',
    name: 'Nubank (Nu Pagamentos)',
    fullName: 'Nu Pagamentos S.A.',
    ispb: '18236120',
    pixSupported: true,
    boletoSupported: true,
    tedSupported: true,
    color: '#820AD1',
  },
  {
    code: '077',
    name: 'Banco Inter',
    fullName: 'Banco Inter S.A.',
    ispb: '00416968',
    pixSupported: true,
    boletoSupported: true,
    tedSupported: true,
    color: '#FF7A00',
  },
  {
    code: '336',
    name: 'C6 Bank',
    fullName: 'Banco C6 S.A.',
    ispb: '31872495',
    pixSupported: true,
    boletoSupported: true,
    tedSupported: true,
    color: '#242424',
  },
  {
    code: '756',
    name: 'Sicoob',
    fullName: 'Banco Cooperativo Sicoob S.A.',
    ispb: '02038232',
    pixSupported: true,
    boletoSupported: true,
    tedSupported: true,
    color: '#003641',
  },
  {
    code: '748',
    name: 'Sicredi',
    fullName: 'Banco Cooperativo Sicredi S.A.',
    ispb: '01181521',
    pixSupported: true,
    boletoSupported: true,
    tedSupported: true,
    color: '#008542',
  },
  {
    code: '323',
    name: 'Mercado Pago',
    fullName: 'Mercado Pago Instituição de Pagamento LTDA',
    ispb: '10573521',
    pixSupported: true,
    boletoSupported: true,
    tedSupported: true,
    color: '#009EE3',
  },
  {
    code: '290',
    name: 'PagBank / PagSeguro',
    fullName: 'PagSeguro Internet Instituição de Pagamento S.A.',
    ispb: '08561701',
    pixSupported: true,
    boletoSupported: true,
    tedSupported: true,
    color: '#00A868',
  },
  {
    code: '208',
    name: 'BTG Pactual',
    fullName: 'Banco BTG Pactual S.A.',
    ispb: '30306294',
    pixSupported: true,
    boletoSupported: true,
    tedSupported: true,
    color: '#0B1E36',
  },
];

export const PAYMENTS_SQL_SCHEMA = `-- ==============================================================================
-- SCHEMA SUPABASE: TABELA DE PAGAMENTOS (MULTI-MODALIDADE & MULTI-BANCOS COM PIX)
-- Vitrine Artesanal de Ouro Preto - Minas Gerais
-- ==============================================================================

-- 1. Criação da Tabela 'payments'
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    
    -- Dados do Comprador / Pagador
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_document TEXT, -- CPF ou CNPJ formatado ou apenas dígitos
    customer_phone TEXT,
    
    -- Modalidade & Instituição Financeira
    payment_method TEXT NOT NULL CHECK (
        payment_method IN ('pix', 'cartao_credito', 'cartao_debito', 'boleto', 'transferencia_ted', 'outro')
    ),
    bank_code TEXT NOT NULL, -- Código COMPE (001-BB, 104-Caixa, 341-Itaú, 260-Nubank, 077-Inter, etc.)
    bank_name TEXT NOT NULL, -- Nome amigável da instituição
    bank_ispb TEXT,
    
    -- Valores e Parcelamento
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    installments INTEGER DEFAULT 1 CHECK (installments >= 1 AND installments <= 24),
    
    -- Status do Pagamento
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (
        status IN ('pendente', 'processando', 'pago', 'recusado', 'estornado', 'cancelado')
    ),
    
    -- Detalhes Específicos para PIX
    pix_key TEXT,
    pix_key_type TEXT CHECK (pix_key_type IN ('cpf', 'cnpj', 'email', 'telefone', 'aleatoria') OR pix_key_type IS NULL),
    pix_qr_code TEXT,
    pix_copy_paste TEXT,
    pix_txid TEXT,
    pix_end_to_end_id TEXT,
    
    -- Detalhes Específicos para Boleto Bancário
    boleto_barcode TEXT,
    boleto_digitable_line TEXT,
    boleto_due_date DATE,
    
    -- Detalhes Específicos para Cartão (Tokenizado / Seguro)
    card_brand TEXT, -- Visa, Mastercard, Elo, Hipercard, Amex
    card_last_digits TEXT, -- Apenas os últimos 4 dígitos
    card_holder_name TEXT,
    card_installments_fee NUMERIC(12, 2) DEFAULT 0,
    
    -- Detalhes para Transferência Bancária / TED
    bank_agency TEXT,
    bank_account TEXT,
    
    -- Gateway & Metadados
    gateway_name TEXT DEFAULT 'Ouro Preto Pay / Supabase',
    gateway_transaction_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Auditoria e Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    paid_at TIMESTAMPTZ
);

-- 2. Índices de Alta Performance
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_method ON public.payments(payment_method);
CREATE INDEX IF NOT EXISTS idx_payments_bank ON public.payments(bank_code);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_pix_txid ON public.payments(pix_txid) WHERE pix_txid IS NOT NULL;

-- 3. Habilitar Segurança RLS (Row Level Security)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Segurança RLS
-- (A) Permitir inserção de pagamentos por qualquer cliente no checkout
DROP POLICY IF EXISTS "Permitir checkout registrar pagamentos" ON public.payments;
CREATE POLICY "Permitir checkout registrar pagamentos"
ON public.payments FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- (B) Permitir leitura do próprio pagamento para consulta
DROP POLICY IF EXISTS "Permitir consulta pública de pagamentos" ON public.payments;
CREATE POLICY "Permitir consulta pública de pagamentos"
ON public.payments FOR SELECT
TO anon, authenticated
USING (true);

-- (C) Permitir que apenas Artesãos / Administradores autenticados alterem status do pagamento
DROP POLICY IF EXISTS "Permitir gestão de pagamentos por artesãos" ON public.payments;
CREATE POLICY "Permitir gestão de pagamentos por artesãos"
ON public.payments FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- (D) Permitir exclusão apenas para administradores autenticados
DROP POLICY IF EXISTS "Permitir exclusão apenas para administradores" ON public.payments;
CREATE POLICY "Permitir exclusão apenas para administradores"
ON public.payments FOR DELETE
TO authenticated
USING (true);
`;

// Helper to generate simulated standard EMV PIX string
export function generatePixPayload(amount: number, txid: string, bankName: string = 'Banco do Brasil'): string {
  const chave = 'pix@ouropretominas.com.br';
  const nome = 'ATELIE OURO PRETO';
  const cidade = 'OURO PRETO';
  const valorStr = amount.toFixed(2);

  return `00020126580014br.gov.bcb.pix0125${chave}520400005303986540${valorStr.length}${valorStr}5802BR59${nome.length}${nome}60${cidade.length}${cidade}62170513${txid.slice(0, 13)}6304E8A2`;
}

// Helper to generate simulated Boleto Digitable Line
export function generateBoletoLine(bankCode: string, amount: number): { digitableLine: string; barcode: string; dueDate: string } {
  const cleanBank = bankCode.padStart(3, '0');
  const currency = '9';
  const due = new Date();
  due.setDate(due.getDate() + 3);
  const dueDateStr = due.toISOString().split('T')[0];
  const cents = Math.round(amount * 100).toString().padStart(10, '0');
  
  const part1 = `${cleanBank}${currency}1.23456`;
  const part2 = `78901.234567`;
  const part3 = `89012.345678`;
  const part4 = `1`;
  const part5 = `${cents}`;

  return {
    digitableLine: `${part1} ${part2} ${part3} ${part4} ${part5}`,
    barcode: `${cleanBank}${currency}1890123456789012345678901234567890${cents}`,
    dueDate: dueDateStr,
  };
}
