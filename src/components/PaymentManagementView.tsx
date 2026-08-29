import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  QrCode, 
  FileText, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Filter, 
  Search, 
  Copy, 
  Check, 
  RefreshCw, 
  Plus, 
  ArrowUpRight, 
  ShieldCheck, 
  DollarSign, 
  Sparkles, 
  Terminal,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { PaymentRecord, PaymentMethod, PaymentStatus, BankInstitution } from '../types';
import { BRAZILIAN_BANKS, PAYMENTS_SQL_SCHEMA, generatePixPayload, generateBoletoLine } from '../data/banking';
import { getSupabase } from '../lib/supabase';

// Mock/Initial sample payments for offline/pre-populated view
const INITIAL_SAMPLE_PAYMENTS: PaymentRecord[] = [
  {
    id: 'PAY-PIX-882194',
    order_id: 'OP-PEDRA-3L-001',
    customer_name: 'Mariana Silva Alvarenga',
    customer_email: 'mariana.silva@email.com',
    customer_document: '***.458.916-**',
    customer_phone: '(31) 98765-4321',
    payment_method: 'pix',
    bank_code: '260',
    bank_name: 'Nubank (Nu Pagamentos)',
    amount: 237.40, // com 5% de desconto PIX
    installments: 1,
    status: 'pago',
    pix_key: 'pix@ouropretominas.com.br',
    pix_key_type: 'email',
    pix_txid: 'TXID-PIX-9841289412',
    pix_end_to_end_id: 'E182361202026082018209841289412',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    paid_at: new Date(Date.now() - 3600000 * 2 + 15000).toISOString(),
    metadata: { atelie: 'Ateliê Mestre Aleijadinho', produto: 'Panela de Pedra-Sabão 3L' },
  },
  {
    id: 'PAY-CARD-449102',
    order_id: 'OP-DOCE-NOZES-500G',
    customer_name: 'Carlos Eduardo Nogueira',
    customer_email: 'carlos.nogueira@gmail.com',
    customer_document: '***.892.106-**',
    customer_phone: '(11) 99123-8877',
    payment_method: 'cartao_credito',
    bank_code: '341',
    bank_name: 'Itaú Unibanco',
    amount: 85.80,
    installments: 2,
    status: 'pago',
    card_brand: 'Mastercard',
    card_last_digits: '4821',
    card_holder_name: 'CARLOS E NOGUEIRA',
    gateway_transaction_id: 'GW-ITAU-889123',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    paid_at: new Date(Date.now() - 3600000 * 5 + 4000).toISOString(),
    metadata: { atelie: 'Doces Coloniais São Bartolomeu' },
  },
  {
    id: 'PAY-BOL-109283',
    order_id: 'OP-SABONET-002',
    customer_name: 'Beatriz Vasconcelos',
    customer_email: 'beatriz.vasc@hotmail.com',
    customer_document: '***.331.706-**',
    payment_method: 'boleto',
    bank_code: '001',
    bank_name: 'Banco do Brasil',
    amount: 149.90,
    installments: 1,
    status: 'pendente',
    boleto_barcode: '00191890123456789012345678901234567890000014990',
    boleto_digitable_line: '00191.23456 78901.234567 89012.345678 1 0000014990',
    boleto_due_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    metadata: { atelie: 'Arte em Sabão de Minas' },
  },
  {
    id: 'PAY-TED-773120',
    order_id: 'OP-CRISTAL-003',
    customer_name: 'Henrique Guimarães',
    customer_email: 'henrique.g@uol.com.br',
    customer_document: '***.129.506-**',
    payment_method: 'transferencia_ted',
    bank_code: '077',
    bank_name: 'Banco Inter',
    amount: 320.00,
    installments: 1,
    status: 'processando',
    bank_agency: '0001',
    bank_account: '984102-3',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    metadata: { comprovante_anexado: true },
  },
];

export const PaymentManagementView: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('ouro_saved_payments');
    return saved ? JSON.parse(saved) : INITIAL_SAMPLE_PAYMENTS;
  });

  const [loading, setLoading] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<string>('');
  const [tableExists, setTableExists] = useState<boolean | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [filterBank, setFilterBank] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);
  const [testSuccessMessage, setTestSuccessMessage] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ouro_saved_payments', JSON.stringify(payments));
  }, [payments]);

  // Load from Supabase on mount
  useEffect(() => {
    fetchPaymentsFromSupabase();
  }, []);

  const fetchPaymentsFromSupabase = async () => {
    setLoading(true);
    setSupabaseStatus('Consultando tabela payments no Supabase...');
    try {
      const client = getSupabase();
      if (!client) {
        setSupabaseStatus('Supabase não configurado. Exibindo dados locais.');
        setTableExists(false);
        setLoading(false);
        return;
      }

      const { data, error } = await client
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST205' || error.message.includes('not find the table')) {
          setTableExists(false);
          setSupabaseStatus('Tabela "payments" ainda não foi criada no Supabase. Use o script SQL abaixo para criá-la.');
        } else {
          setSupabaseStatus(`Erro na consulta: ${error.message}`);
        }
      } else {
        setTableExists(true);
        if (data && data.length > 0) {
          // Merge with unique IDs
          const map = new Map<string, PaymentRecord>();
          data.forEach((p: PaymentRecord) => map.set(p.id, p));
          payments.forEach((p) => {
            if (!map.has(p.id)) map.set(p.id, p);
          });
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
          );
          setPayments(merged);
          setSupabaseStatus(`✅ Conectado ao Supabase! ${data.length} pagamentos sincronizados em tempo real.`);
        } else {
          setSupabaseStatus('Tabela "payments" existe no Supabase (0 registros remotos no momento).');
        }
      }
    } catch (e: any) {
      setSupabaseStatus(`Erro ao conectar: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(PAYMENTS_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleCreateTestPayment = async (method: PaymentMethod = 'pix') => {
    setLoading(true);
    const randomBank = BRAZILIAN_BANKS[Math.floor(Math.random() * BRAZILIAN_BANKS.length)];
    const id = `PAY-${method.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderId = `OP-TEST-${Date.now().toString().slice(-4)}`;
    const amount = Number((50 + Math.random() * 450).toFixed(2));
    const now = new Date().toISOString();

    let newRecord: PaymentRecord = {
      id,
      order_id: orderId,
      customer_name: 'Comprador Teste Ouro Preto',
      customer_email: 'teste.pagamento@artesanato.mg.gov.br',
      customer_document: '123.456.789-00',
      customer_phone: '(31) 98888-7777',
      payment_method: method,
      bank_code: randomBank.code,
      bank_name: randomBank.name,
      amount,
      installments: method === 'cartao_credito' ? 3 : 1,
      status: method === 'pix' ? 'pago' : 'pendente',
      created_at: now,
    };

    if (method === 'pix') {
      newRecord.pix_key = 'pix@ouropretominas.com.br';
      newRecord.pix_key_type = 'email';
      newRecord.pix_txid = `TXID-${Date.now()}`;
      newRecord.pix_copy_paste = generatePixPayload(amount, newRecord.pix_txid, randomBank.name);
      newRecord.paid_at = now;
    } else if (method === 'boleto') {
      const bInfo = generateBoletoLine(randomBank.code, amount);
      newRecord.boleto_barcode = bInfo.barcode;
      newRecord.boleto_digitable_line = bInfo.digitableLine;
      newRecord.boleto_due_date = bInfo.dueDate;
    } else if (method === 'cartao_credito' || method === 'cartao_debito') {
      newRecord.card_brand = 'Mastercard';
      newRecord.card_last_digits = '5519';
      newRecord.card_holder_name = 'TESTE COMPRADOR';
      newRecord.gateway_transaction_id = `AUTH-${Date.now()}`;
      newRecord.status = 'pago';
      newRecord.paid_at = now;
    } else if (method === 'transferencia_ted') {
      newRecord.bank_agency = '0001';
      newRecord.bank_account = '12345-6';
    }

    // Try inserting into Supabase
    try {
      const client = getSupabase();
      if (client) {
        const { error } = await client.from('payments').insert([newRecord]);
        if (!error) {
          setTestSuccessMessage(`✅ Pagamento teste gravado com sucesso no Supabase (${method.toUpperCase()} - ${randomBank.name})!`);
        } else {
          console.warn('Inserção local fallback (Supabase returned error):', error.message);
          setTestSuccessMessage(`ℹ️ Pagamento registrado localmente (Tabela Supabase pendente de criação).`);
        }
      }
    } catch (e) {
      console.warn('Erro ao inserir teste no Supabase:', e);
    }

    setPayments((prev) => [newRecord, ...prev]);
    setLoading(false);
    setTimeout(() => setTestSuccessMessage(''), 5000);
  };

  const handleUpdateStatus = async (paymentId: string, newStatus: PaymentStatus) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: newStatus,
              paid_at: newStatus === 'pago' ? new Date().toISOString() : p.paid_at,
            }
          : p
      )
    );

    try {
      const client = getSupabase();
      if (client) {
        await client
          .from('payments')
          .update({
            status: newStatus,
            paid_at: newStatus === 'pago' ? new Date().toISOString() : null,
          })
          .eq('id', paymentId);
      }
    } catch (err) {
      console.warn('Erro ao atualizar status no Supabase:', err);
    }
  };

  // Stats
  const totalAmount = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalPix = payments.filter((p) => p.payment_method === 'pix').reduce((acc, p) => acc + p.amount, 0);
  const totalCards = payments
    .filter((p) => p.payment_method === 'cartao_credito' || p.payment_method === 'cartao_debito')
    .reduce((acc, p) => acc + p.amount, 0);
  const totalBoletos = payments.filter((p) => p.payment_method === 'boleto').reduce((acc, p) => acc + p.amount, 0);

  // Filtered payments
  const filteredPayments = payments.filter((p) => {
    if (filterMethod !== 'all' && p.payment_method !== filterMethod) return false;
    if (filterBank !== 'all' && p.bank_code !== filterBank) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.customer_name.toLowerCase().includes(q);
      const matchDoc = p.customer_document?.toLowerCase().includes(q);
      const matchId = p.id.toLowerCase().includes(q);
      const matchTxid = p.pix_txid?.toLowerCase().includes(q);
      if (!matchName && !matchDoc && !matchId && !matchTxid) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner with Supabase Schema Status & Action */}
      <div className="bg-[#1a130f] text-white p-5 rounded-2xl border border-[#B8860B]/40 shadow-lg space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B8860B]/20 border border-[#B8860B]/40 flex items-center justify-center text-[#B8860B] shrink-0 mt-0.5">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-amber-100">
                  Gestão Financeira & Tabela de Pagamentos Multi-Bancos
                </h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full font-bold">
                  PIX Instantâneo Ativo
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1 max-w-2xl">
                Suporte nativo a <strong>PIX</strong>, <strong>Cartões de Crédito/Débito</strong>, <strong>Boleto Bancário</strong> e <strong>TED</strong> integrado às principais instituições financeiras do Brasil (Nubank, Banco do Brasil, Itaú, Inter, Bradesco, Caixa, C6 e mais).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowSqlModal(true)}
              className="px-3.5 py-2 bg-[#B8860B] hover:bg-[#a37609] text-stone-950 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Terminal className="w-4 h-4" />
              <span>Ver Script SQL da Tabela</span>
            </button>

            <button
              onClick={fetchPaymentsFromSupabase}
              disabled={loading}
              className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sincronizar Supabase</span>
            </button>
          </div>
        </div>

        {/* Database Connection Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-stone-800 text-xs">
          <div className="flex items-center gap-2 text-stone-300">
            <span className={`w-2 h-2 rounded-full ${tableExists ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{supabaseStatus}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400 text-[11px]">Gerar Teste Rápido:</span>
            <button
              onClick={() => handleCreateTestPayment('pix')}
              disabled={loading}
              className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-amber-300 text-[11px] font-bold rounded-lg border border-amber-500/30 cursor-pointer"
            >
              + PIX
            </button>
            <button
              onClick={() => handleCreateTestPayment('cartao_credito')}
              disabled={loading}
              className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-blue-300 text-[11px] font-bold rounded-lg border border-blue-500/30 cursor-pointer"
            >
              + Cartão
            </button>
            <button
              onClick={() => handleCreateTestPayment('boleto')}
              disabled={loading}
              className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-emerald-300 text-[11px] font-bold rounded-lg border border-emerald-500/30 cursor-pointer"
            >
              + Boleto
            </button>
          </div>
        </div>
      </div>

      {testSuccessMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{testSuccessMessage}</span>
          </div>
          <button onClick={() => setTestSuccessMessage('')} className="text-emerald-700 hover:text-emerald-950">
            ×
          </button>
        </div>
      )}

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>Total Transacionado</span>
            <DollarSign className="w-4 h-4 text-[#B8860B]" />
          </div>
          <div className="text-xl font-extrabold text-stone-900">
            {totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="text-[11px] text-stone-400">
            {payments.length} transações registradas
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
            <span>Volume PIX (Instantâneo)</span>
            <QrCode className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-900">
            {totalPix.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold">
            {payments.filter((p) => p.payment_method === 'pix').length} pagamentos PIX
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/30 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-blue-800 text-xs font-bold">
            <span>Cartões (Crédito / Débito)</span>
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-extrabold text-blue-900">
            {totalCards.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="text-[11px] text-blue-700 font-semibold">
            {payments.filter((p) => p.payment_method.includes('cartao')).length} transações com cartão
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
            <span>Boletos & TED Bancário</span>
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-900">
            {totalBoletos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold">
            {payments.filter((p) => p.payment_method === 'boleto' || p.payment_method === 'transferencia_ted').length} emitidos
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cliente, CPF, ID do pagamento ou TxID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Method Filter */}
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="px-2.5 py-2 text-xs border border-stone-200 rounded-lg bg-stone-50 font-bold text-stone-700 cursor-pointer focus:outline-none focus:border-[#B8860B]"
          >
            <option value="all">Todas as Modalidades</option>
            <option value="pix">⚡ PIX</option>
            <option value="cartao_credito">💳 Cartão de Crédito</option>
            <option value="cartao_debito">💳 Cartão de Débito</option>
            <option value="boleto">📄 Boleto Bancário</option>
            <option value="transferencia_ted">🏛️ TED / Transferência</option>
          </select>

          {/* Bank Filter */}
          <select
            value={filterBank}
            onChange={(e) => setFilterBank(e.target.value)}
            className="px-2.5 py-2 text-xs border border-stone-200 rounded-lg bg-stone-50 font-bold text-stone-700 cursor-pointer focus:outline-none focus:border-[#B8860B]"
          >
            <option value="all">Todos os Bancos ({BRAZILIAN_BANKS.length})</option>
            {BRAZILIAN_BANKS.map((b) => (
              <option key={b.code} value={b.code}>
                {b.code} - {b.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-2 text-xs border border-stone-200 rounded-lg bg-stone-50 font-bold text-stone-700 cursor-pointer focus:outline-none focus:border-[#B8860B]"
          >
            <option value="all">Todos os Status</option>
            <option value="pago">🟢 Pago</option>
            <option value="pendente">🟡 Pendente</option>
            <option value="processando">🔵 Processando</option>
            <option value="recusado">🔴 Recusado</option>
            <option value="cancelado">⚫ Cancelado</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#B8860B]" />
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Registros de Pagamentos ({filteredPayments.length})
            </h4>
          </div>
          <span className="text-[11px] text-stone-500">
            Clique em qualquer linha para ver os detalhes completos
          </span>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Building2 className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-sm font-bold text-stone-700">Nenhum pagamento encontrado com os filtros selecionados.</p>
            <p className="text-xs text-stone-400">
              Gere um pagamento de teste ou altere os filtros de modalidade e banco.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/70 text-stone-600 uppercase text-[10px] font-bold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Identificador & Data</th>
                  <th className="py-3 px-4">Cliente / Pagador</th>
                  <th className="py-3 px-4">Modalidade</th>
                  <th className="py-3 px-4">Instituição Bancária</th>
                  <th className="py-3 px-4 text-right">Valor / Parcelas</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredPayments.map((p) => {
                  const bank = BRAZILIAN_BANKS.find((b) => b.code === p.bank_code);
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedPayment(p)}
                      className="hover:bg-amber-50/40 transition-colors cursor-pointer"
                    >
                      {/* ID & Date */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-stone-900 text-[11px]">{p.id}</div>
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          {p.created_at ? new Date(p.created_at).toLocaleString('pt-BR') : 'Data não informada'}
                        </div>
                        {p.order_id && (
                          <span className="text-[9px] text-[#B8860B] font-semibold block mt-0.5">
                            Ref: {p.order_id}
                          </span>
                        )}
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900">{p.customer_name}</div>
                        <div className="text-[10px] text-stone-500">{p.customer_document || 'CPF não inf.'}</div>
                        {p.customer_email && (
                          <div className="text-[10px] text-stone-400 truncate max-w-[150px]">{p.customer_email}</div>
                        )}
                      </td>

                      {/* Modality */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {p.payment_method === 'pix' && (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px] border border-emerald-200">
                              <QrCode className="w-3 h-3" />
                              PIX
                            </span>
                          )}
                          {p.payment_method === 'cartao_credito' && (
                            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold text-[10px] border border-blue-200">
                              <CreditCard className="w-3 h-3" />
                              Crédito {p.card_brand ? `(${p.card_brand})` : ''}
                            </span>
                          )}
                          {p.payment_method === 'cartao_debito' && (
                            <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold text-[10px] border border-indigo-200">
                              <CreditCard className="w-3 h-3" />
                              Débito
                            </span>
                          )}
                          {p.payment_method === 'boleto' && (
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold text-[10px] border border-amber-200">
                              <FileText className="w-3 h-3" />
                              Boleto
                            </span>
                          )}
                          {p.payment_method === 'transferencia_ted' && (
                            <span className="inline-flex items-center gap-1 bg-stone-200 text-stone-800 px-2 py-0.5 rounded-full font-bold text-[10px] border border-stone-300">
                              <Building2 className="w-3 h-3" />
                              TED / Pix
                            </span>
                          )}
                        </div>
                        {p.card_last_digits && (
                          <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                            Final: **** {p.card_last_digits}
                          </div>
                        )}
                      </td>

                      {/* Banking Institution */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: bank?.color || '#B8860B' }}
                          />
                          <div>
                            <span className="font-bold text-stone-800 text-[11px] block">{p.bank_name}</span>
                            <span className="text-[10px] text-stone-400 font-mono">COMPE: {p.bank_code}</span>
                          </div>
                        </div>
                      </td>

                      {/* Amount & Installments */}
                      <td className="py-3 px-4 text-right">
                        <div className="font-extrabold text-stone-900 text-sm">
                          {p.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                        <div className="text-[10px] text-stone-500 font-medium">
                          {p.installments > 1 ? `${p.installments}x de R$ ${(p.amount / p.installments).toFixed(2)}` : 'À vista'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                            p.status === 'pago'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : p.status === 'pendente'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : p.status === 'processando'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={p.status}
                          onChange={(e) => handleUpdateStatus(p.id, e.target.value as PaymentStatus)}
                          className="text-[10px] font-bold p-1 bg-stone-50 border border-stone-200 rounded cursor-pointer text-stone-700"
                        >
                          <option value="pago">Marcar Pago</option>
                          <option value="pendente">Pendente</option>
                          <option value="processando">Processando</option>
                          <option value="estornado">Estornado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Payment Inspector Drawer/Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-[#B8860B] rounded-xl">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">Detalhes do Pagamento</h4>
                  <span className="text-[11px] text-stone-400 font-mono">{selectedPayment.id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-100"
              >
                ✕
              </button>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Cliente / Pagador:</span>
                <span className="font-bold text-stone-800">{selectedPayment.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">CPF / Documento:</span>
                <span className="font-mono text-stone-800">{selectedPayment.customer_document || 'Não informado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Instituição Bancária:</span>
                <span className="font-bold text-stone-800">{selectedPayment.bank_name} (Cód {selectedPayment.bank_code})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Modalidade:</span>
                <span className="font-bold uppercase text-[#B8860B]">{selectedPayment.payment_method.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold">
                <span>Valor Total:</span>
                <span className="text-emerald-700">{selectedPayment.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
            </div>

            {/* PIX Specifics */}
            {selectedPayment.payment_method === 'pix' && (
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 space-y-2 text-xs text-emerald-900">
                <div className="font-bold flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-700" />
                  <span>Dados da Transação PIX</span>
                </div>
                {selectedPayment.pix_txid && (
                  <div>
                    <span className="text-[10px] text-emerald-700 block">TxID / Identificador:</span>
                    <code className="text-[11px] font-mono">{selectedPayment.pix_txid}</code>
                  </div>
                )}
                {selectedPayment.pix_end_to_end_id && (
                  <div>
                    <span className="text-[10px] text-emerald-700 block">EndToEnd ID (BACEN):</span>
                    <code className="text-[10px] font-mono break-all">{selectedPayment.pix_end_to_end_id}</code>
                  </div>
                )}
                {selectedPayment.pix_copy_paste && (
                  <div className="pt-2">
                    <span className="text-[10px] text-emerald-700 block mb-1">Código PIX Copia e Cola:</span>
                    <textarea
                      readOnly
                      value={selectedPayment.pix_copy_paste}
                      className="w-full text-[10px] font-mono p-2 bg-white rounded border border-emerald-300 h-16 resize-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Boleto Specifics */}
            {selectedPayment.payment_method === 'boleto' && selectedPayment.boleto_digitable_line && (
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 space-y-2 text-xs text-amber-900">
                <div className="font-bold flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-700" />
                  <span>Linha Digitável do Boleto</span>
                </div>
                <div className="bg-white p-2 rounded border border-amber-300 font-mono text-[11px] select-all">
                  {selectedPayment.boleto_digitable_line}
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Vencimento:</span>
                  <span className="font-bold">{selectedPayment.boleto_due_date || '3 dias'}</span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-bold hover:bg-stone-900"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SQL SCHEMA MODAL */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-stone-900 text-stone-100 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col border border-stone-700 shadow-2xl overflow-hidden font-mono">
            <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Terminal className="w-4 h-4" />
                <span>Script SQL Oficial: Tabela 'payments' (Supabase / PostgreSQL)</span>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 text-[11px] leading-relaxed text-emerald-300 bg-stone-900 select-all">
              <pre className="whitespace-pre-wrap">{PAYMENTS_SQL_SCHEMA}</pre>
            </div>

            <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs font-sans">
              <span className="text-stone-400 text-[11px]">
                Copie e cole este script no <strong>SQL Editor</strong> do seu Supabase Dashboard.
              </span>
              <button
                onClick={handleCopySql}
                className="px-4 py-2 bg-[#B8860B] hover:bg-[#a37609] text-stone-950 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow"
              >
                {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Copiado para a Área de Transferência!' : 'Copiar Script SQL'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
