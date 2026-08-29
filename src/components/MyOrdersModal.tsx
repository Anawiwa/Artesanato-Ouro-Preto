import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  CreditCard,
  QrCode,
  Building2,
  Phone,
  MessageCircle,
  Hammer,
  Gift,
  RefreshCw,
  Eye,
  Download,
  Share2,
  Zap,
  Info
} from 'lucide-react';
import { CustomerOrder, OrderTrackingEvent, OrderItemDetail, Product } from '../types';
import { getSavedCustomerOrders, saveCustomerOrder } from '../data/ordersData';
import { getSupabase } from '../lib/supabase';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (productId: string) => void;
  onAddToCart?: (product: Product, quantity: number, giftWrap?: boolean) => void;
  allProducts?: Product[];
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onAddToCart,
  allProducts = [],
}) => {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'tracking' | 'certificates' | 'profile'>('orders');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [certificateOrder, setCertificateOrder] = useState<CustomerOrder | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isLoadingSupabase, setIsLoadingSupabase] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState(false);

  // Load orders on open
  useEffect(() => {
    if (isOpen) {
      loadAllOrders();
    }
  }, [isOpen]);

  const loadAllOrders = async () => {
    // 1. Local saved orders
    const localOrders = getSavedCustomerOrders();
    setOrders(localOrders);
    if (!selectedOrder && localOrders.length > 0) {
      setSelectedOrder(localOrders[0]);
    }

    // 2. Try fetching from Supabase if configured
    try {
      const client = getSupabase();
      if (client) {
        setIsLoadingSupabase(true);
        const { data: dbOrders, error } = await client
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });

        if (!error && dbOrders && dbOrders.length > 0) {
          setSupabaseConnected(true);
        }
      }
    } catch (e) {
      console.warn('Supabase orders fetch skipped:', e);
    } finally {
      setIsLoadingSupabase(false);
    }
  };

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Status simulation: Advance order status to showcase tracking steps
  const handleAdvanceStatus = (orderId: string) => {
    const updated = orders.map((o) => {
      if (o.id !== orderId) return o;

      const statuses: CustomerOrder['status'][] = [
        'em_producao',
        'embalado_madeira',
        'despachado_estrada_real',
        'saiu_para_entrega',
        'entregue',
      ];
      const currentIndex = statuses.indexOf(o.status);
      const nextIndex = (currentIndex + 1) % statuses.length;
      const nextStatus = statuses[nextIndex];

      const statusLabels: Record<CustomerOrder['status'], string> = {
        em_producao: 'Em Produção no Ateliê',
        embalado_madeira: 'Embalagem em Engradado de Madeira',
        despachado_estrada_real: 'Despachado pela Estrada Real',
        em_transito: 'Em Trânsito Rodoviário',
        saiu_para_entrega: 'Saiu para Entrega no Casario',
        entregue: 'Entregue com Sucesso',
        cancelado: 'Cancelado',
      };

      const updatedTimeline = o.tracking_timeline.map((event, idx) => {
        const step = idx + 1;
        const targetStep = nextIndex + 1;
        return {
          ...event,
          completed: step < targetStep || nextStatus === 'entregue',
          current: step === targetStep && nextStatus !== 'entregue',
        };
      });

      const newOrderObj: CustomerOrder = {
        ...o,
        status: nextStatus,
        status_label: statusLabels[nextStatus],
        tracking_timeline: updatedTimeline,
        delivered_at: nextStatus === 'entregue' ? new Date().toLocaleString('pt-BR') : undefined,
      };

      saveCustomerOrder(newOrderObj);
      return newOrderObj;
    });

    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(updated.find((o) => o.id === orderId) || null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.displayId.toLowerCase().includes(searchFilter.toLowerCase()) ||
      order.tracking_code.toLowerCase().includes(searchFilter.toLowerCase()) ||
      order.items.some((it) => it.title.toLowerCase().includes(searchFilter.toLowerCase())) ||
      order.items.some((it) => it.artisan.toLowerCase().includes(searchFilter.toLowerCase()));

    if (statusFilter === 'todos') return matchesSearch;
    if (statusFilter === 'em_andamento') return matchesSearch && order.status !== 'entregue' && order.status !== 'cancelado';
    if (statusFilter === 'entregues') return matchesSearch && order.status === 'entregue';
    return matchesSearch;
  });

  const getStatusBadge = (status: CustomerOrder['status']) => {
    switch (status) {
      case 'entregue':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Entregue
          </span>
        );
      case 'saiu_para_entrega':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
            <Truck className="w-3.5 h-3.5 text-amber-700" />
            Saiu para Entrega
          </span>
        );
      case 'despachado_estrada_real':
      case 'em_transito':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300">
            <Truck className="w-3.5 h-3.5 text-blue-700" />
            Em Trânsito Estrada Real
          </span>
        );
      case 'embalado_madeira':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#964B15]/15 text-[#70360D] border border-[#70360D]/30">
            <Package className="w-3.5 h-3.5 text-[#964B15]" />
            Embalado em Engradado
          </span>
        );
      case 'em_producao':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-orange-100 text-orange-900 border border-orange-300">
            <Hammer className="w-3.5 h-3.5 text-orange-600 animate-spin" />
            Em Produção no Ateliê
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="relative w-full max-w-5xl bg-[#FAF8F5] rounded-3xl shadow-2xl border-2 border-[#C59B27]/40 overflow-hidden flex flex-col max-h-[92vh]">
        {/* =========================================================================
            HEADER DA MODAL: PERFIL DO USUÁRIO & NAVEGAÇÃO
        ========================================================================= */}
        <div className="bg-gradient-to-r from-[#2C1E14] via-[#3d2719] to-[#2C1E14] text-white p-5 sm:p-6 border-b border-[#C59B27]/30 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C59B27] to-[#70360D] p-0.5 shadow-lg flex items-center justify-center text-white font-serif text-2xl font-bold">
                  <span>M</span>
                </div>
                <span className="absolute -bottom-1 -right-1 bg-[#2E6B40] text-white p-1 rounded-full border border-white" title="Conta Verificada">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold font-serif tracking-wide text-white">
                    Mariana Silva Alvarenga
                  </h2>
                  <span className="bg-[#C59B27]/25 text-[#E8C547] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#C59B27]/40">
                    Cliente Nobre Colonial
                  </span>
                </div>
                <p className="text-xs text-stone-300 flex items-center gap-2 mt-0.5">
                  <span>mariana.silva@email.com</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#E8C547]">
                    <MapPin className="w-3 h-3" />
                    Ouro Preto, MG (Centro Histórico)
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Stats & Close Button */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <div className="flex items-center gap-3 bg-black/30 px-3.5 py-1.5 rounded-xl border border-white/10 text-xs">
                <div className="text-center">
                  <span className="block font-black text-[#E8C547] text-sm">{orders.length}</span>
                  <span className="text-[10px] text-stone-300 uppercase">Pedidos</span>
                </div>
                <div className="w-px h-6 bg-white/20" />
                <div className="text-center">
                  <span className="block font-black text-emerald-400 text-sm">
                    {orders.filter((o) => o.status !== 'entregue').length}
                  </span>
                  <span className="text-[10px] text-stone-300 uppercase">Em Rota</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="text-stone-400 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 pt-3 border-t border-white/15 overflow-x-auto text-xs font-bold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#C59B27] text-[#2C1E14] shadow-md'
                  : 'text-stone-300 hover:bg-white/10'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Meus Pedidos ({orders.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('tracking');
                if (!selectedOrder && orders.length > 0) setSelectedOrder(orders[0]);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'tracking'
                  ? 'bg-[#C59B27] text-[#2C1E14] shadow-md'
                  : 'text-stone-300 hover:bg-white/10'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Rastreio Estrada Real</span>
            </button>

            <button
              onClick={() => setActiveTab('certificates')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'certificates'
                  ? 'bg-[#C59B27] text-[#2C1E14] shadow-md'
                  : 'text-stone-300 hover:bg-white/10'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Certificados de Autenticidade</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#C59B27] text-[#2C1E14] shadow-md'
                  : 'text-stone-300 hover:bg-white/10'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Endereços & Pagamentos</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            CORPO DA MODAL: TABS
        ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: LISTAGEM DE PEDIDOS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por produto, pedido ou artesão..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" />
                    Status:
                  </span>
                  {(['todos', 'em_andamento', 'entregues'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        statusFilter === st
                          ? 'bg-[#70360D] text-white shadow-2xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {st === 'todos' ? 'Todos' : st === 'em_andamento' ? 'Em Rota' : 'Entregues'}
                    </button>
                  ))}
                  <button
                    onClick={loadAllOrders}
                    className="p-1.5 rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
                    title="Atualizar Pedidos"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSupabase ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Order Cards List */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
                  <Package className="w-12 h-12 text-stone-300 mx-auto" />
                  <h3 className="text-base font-bold text-stone-700">Nenhum pedido colonial encontrado</h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    Não encontramos pedidos para o filtro selecionado. Faça uma nova encomenda de panelas de pedra-sabão ou doces mineiros!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const isExpanded = selectedOrder?.id === order.id;

                    return (
                      <div
                        key={order.id}
                        className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                          isExpanded
                            ? 'border-[#C59B27] shadow-md ring-1 ring-[#C59B27]/30'
                            : 'border-stone-200 hover:border-stone-300 shadow-2xs'
                        }`}
                      >
                        {/* Card Header */}
                        <div className="bg-[#FAF8F5] px-4 py-3 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex flex-wrap items-center gap-4">
                            <div>
                              <span className="text-[10px] text-stone-500 uppercase font-bold block">Pedido Real</span>
                              <strong className="font-mono font-bold text-[#70360D] text-sm">
                                {order.displayId}
                              </strong>
                            </div>

                            <div>
                              <span className="text-[10px] text-stone-500 uppercase font-bold block">Data da Compra</span>
                              <span className="font-medium text-stone-700">
                                {new Date(order.created_at).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] text-stone-500 uppercase font-bold block">Total Pago</span>
                              <span className="font-black text-[#2E6B40] text-sm">
                                R$ {order.total.toFixed(2)}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] text-stone-500 uppercase font-bold block">Forma de Pagamento</span>
                              <span className="font-medium text-stone-700 capitalize flex items-center gap-1">
                                {order.payment.payment_method === 'pix' ? (
                                  <QrCode className="w-3.5 h-3.5 text-[#2E6B40]" />
                                ) : (
                                  <CreditCard className="w-3.5 h-3.5 text-[#B8860B]" />
                                )}
                                {order.payment.payment_method.replace('_', ' ')} ({order.payment.bank_name})
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {getStatusBadge(order.status)}

                            <button
                              onClick={() => setSelectedOrder(isExpanded ? null : order)}
                              className="text-stone-500 hover:text-stone-900 p-1.5 rounded-lg hover:bg-stone-200 transition-colors"
                              title={isExpanded ? 'Recolher detalhes' : 'Ver detalhes'}
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Order Items & Preview */}
                        <div className="p-4 sm:p-5 space-y-4">
                          <div className="space-y-3">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#FCFAF7] border border-stone-100"
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-16 h-16 rounded-xl object-cover border border-stone-200 shadow-2xs shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="space-y-1">
                                    <h4 className="text-xs font-bold text-[#2C1E14] line-clamp-1">
                                      {item.title}
                                    </h4>
                                    <p className="text-[11px] text-stone-500 flex items-center gap-1.5">
                                      <Hammer className="w-3 h-3 text-[#964B15]" />
                                      <span>Feito por <strong>{item.artisan}</strong> • {item.atelier}</span>
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-stone-500">
                                      <span className="bg-stone-200/80 px-1.5 py-0.5 rounded font-medium">
                                        Qtd: {item.quantity}
                                      </span>
                                      {item.weight && (
                                        <span className="bg-stone-200/80 px-1.5 py-0.5 rounded font-medium">
                                          Peso: {item.weight}
                                        </span>
                                      )}
                                      {item.giftWrap && (
                                        <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                                          <Gift className="w-2.5 h-2.5" />
                                          Embalagem Presente Colonial
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right shrink-0 w-full sm:w-auto flex sm:flex-col justify-between sm:justify-center items-center sm:items-end border-t sm:border-0 pt-2 sm:pt-0 border-stone-200">
                                  <span className="text-xs font-black text-[#2C1E14]">
                                    R$ {item.totalPrice.toFixed(2)}
                                  </span>
                                  {onAddToCart && allProducts.find((p) => p.id === item.productId) && (
                                    <button
                                      onClick={() => {
                                        const prod = allProducts.find((p) => p.id === item.productId);
                                        if (prod) onAddToCart(prod, item.quantity, item.giftWrap);
                                      }}
                                      className="mt-1 text-[11px] font-bold text-[#C59B27] hover:text-[#964B15] flex items-center gap-1 cursor-pointer"
                                    >
                                      <RotateCcw className="w-3 h-3" />
                                      Comprar Novamente
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Order Action Strip */}
                          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2 text-stone-600">
                              <MapPin className="w-3.5 h-3.5 text-[#C59B27]" />
                              <span>
                                Entrega em: <strong>{order.shipping_address.street}, {order.shipping_address.number}</strong> ({order.shipping_address.city} - {order.shipping_address.state})
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {/* View Certificate */}
                              <button
                                onClick={() => setCertificateOrder(order)}
                                className="px-3 py-1.5 rounded-xl border border-[#C59B27]/40 bg-[#FAF8F5] hover:bg-[#F2ECE1] text-[#70360D] font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                <Award className="w-3.5 h-3.5 text-[#C59B27]" />
                                <span>Ver Certificado IPHAN</span>
                              </button>

                              {/* View Live Tracking */}
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setActiveTab('tracking');
                                }}
                                className="px-3 py-1.5 rounded-xl bg-[#70360D] hover:bg-[#522709] text-white font-bold text-[11px] flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                              >
                                <Truck className="w-3.5 h-3.5 text-[#E8C547]" />
                                <span>Rastrear Estrada Real</span>
                              </button>
                            </div>
                          </div>

                          {/* Live Simulator for advancing status (Urgency / demo testing) */}
                          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                            <span className="text-stone-500 flex items-center gap-1 font-medium">
                              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                              Status Atual: <strong>{order.status_label}</strong>
                            </span>
                            <button
                              onClick={() => handleAdvanceStatus(order.id)}
                              className="text-[11px] font-bold text-[#70360D] hover:text-[#964B15] underline flex items-center gap-1 cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Avançar Status de Entrega (Simulação)
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RASTREAMENTO AO VIVO DA ESTRADA REAL */}
          {activeTab === 'tracking' && (
            <div className="space-y-6">
              {selectedOrder ? (
                <div className="bg-white rounded-3xl border-2 border-[#C59B27]/40 overflow-hidden shadow-md">
                  {/* Tracking Header */}
                  <div className="bg-[#2C1E14] text-white p-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#E8C547] font-bold uppercase tracking-wider">
                          Rastreamento Oficial Estrada Real
                        </span>
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                      <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                        <span>Pedido {selectedOrder.displayId}</span>
                        <span className="text-xs font-mono font-normal text-stone-300 bg-white/10 px-2 py-0.5 rounded">
                          {selectedOrder.tracking_code}
                        </span>
                      </h3>
                      <p className="text-xs text-stone-300">
                        Transportador: <strong>{selectedOrder.shipping_carrier}</strong> • {selectedOrder.shipping_tier}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 uppercase block">Previsão de Entrega</span>
                      <strong className="text-base text-[#E8C547] font-serif">
                        {selectedOrder.status === 'entregue'
                          ? `Entregue em ${selectedOrder.delivered_at || 'Data Registrada'}`
                          : selectedOrder.estimatedDeliveryDate}
                      </strong>
                    </div>
                  </div>

                  {/* Tracking Stepper Timeline */}
                  <div className="p-6 space-y-6">
                    {/* Visual Progress Line */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#70360D] flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#C59B27]" />
                        Linha do Tempo da Encomenda Colonial
                      </h4>

                      <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-[#C59B27]/40 ml-4">
                        {selectedOrder.tracking_timeline.map((event, idx) => (
                          <div key={idx} className="relative group">
                            {/* Step Indicator Pin */}
                            <div
                              className={`absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                event.completed
                                  ? 'bg-[#2E6B40] text-white ring-4 ring-[#2E6B40]/20'
                                  : event.current
                                  ? 'bg-[#C85A32] text-white ring-4 ring-[#C85A32]/30 animate-pulse'
                                  : 'bg-stone-200 text-stone-500 border border-stone-300'
                              }`}
                            >
                              {event.completed ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <span>{event.step}</span>
                              )}
                            </div>

                            {/* Event Details Box */}
                            <div
                              className={`p-4 rounded-2xl border transition-all ${
                                event.current
                                  ? 'bg-[#FFF9F5] border-[#C85A32] shadow-sm'
                                  : event.completed
                                  ? 'bg-white border-stone-200'
                                  : 'bg-stone-50/70 border-stone-200/60 opacity-60'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <h5 className={`text-xs font-bold ${event.current ? 'text-[#C85A32]' : 'text-[#2C1E14]'}`}>
                                  {event.title}
                                </h5>
                                <span className="text-[11px] text-stone-500 font-mono">
                                  {event.timestamp}
                                </span>
                              </div>

                              <p className="text-xs text-stone-600 mt-1">{event.subtitle}</p>

                              <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-stone-500">
                                <span className="flex items-center gap-1 font-medium text-stone-700">
                                  <MapPin className="w-3 h-3 text-[#C59B27]" />
                                  {event.location}
                                </span>
                                {event.detail && (
                                  <span className="text-stone-500">
                                    • {event.detail}
                                  </span>
                                )}
                              </div>

                              {event.artisanNote && (
                                <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-2">
                                  <Hammer className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                                  <div>
                                    <strong className="block text-[11px] text-[#70360D] uppercase font-bold">Nota do Mestre Artesão:</strong>
                                    <span>"{event.artisanNote}"</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Origin & Destination Map Card */}
                    <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#70360D] text-white flex items-center justify-center font-bold">
                          🏛️
                        </div>
                        <div>
                          <strong className="block text-[#70360D]">Origem do Artesanato:</strong>
                          <span className="text-stone-600">{selectedOrder.artisan_workshop_city}</span>
                        </div>
                      </div>

                      <div className="hidden sm:block text-stone-400 font-bold">
                        ➔ ➔ ➔
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#2E6B40] text-white flex items-center justify-center font-bold">
                          🏡
                        </div>
                        <div>
                          <strong className="block text-[#2E6B40]">Destino da Entrega:</strong>
                          <span className="text-stone-600">
                            {selectedOrder.shipping_address.city} - {selectedOrder.shipping_address.state} ({selectedOrder.shipping_address.cep})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 bg-white rounded-3xl border border-stone-200">
                  <p className="text-xs text-stone-500">Selecione um pedido para visualizar o rastreio da Estrada Real.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CERTIFICADOS DE AUTENTICIDADE IPHAN & ARTESÃOS */}
          {activeTab === 'certificates' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#70360D] to-[#964B15] text-white p-4 sm:p-5 rounded-2xl border border-[#C59B27]/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#E8C547]" />
                    <h3 className="font-serif font-bold text-base text-white">
                      Galeria de Certificados de Procedência Colonial
                    </h3>
                  </div>
                  <p className="text-xs text-amber-100 max-w-xl">
                    Cada peça adquirida em nossa plataforma acompanha laudo de autenticidade emitido em conformidade com as tradições centenárias de Ouro Preto e Minas Gerais.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-4 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#C59B27] font-black block">
                          Certificado Oficial IPHAN / OP
                        </span>
                        <h4 className="text-sm font-bold text-[#2C1E14] font-serif">
                          {order.items[0]?.title || 'Peça em Pedra-Sabão'}
                        </h4>
                        <p className="text-xs text-stone-500">
                          Mestre Artesão: <strong>{order.items[0]?.artisan}</strong>
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#C59B27]/40 flex items-center justify-center text-[#C59B27]">
                        <Award className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="bg-[#FAF8F5] p-3 rounded-xl border border-stone-200 text-xs space-y-1.5 font-mono">
                      <div className="flex justify-between text-stone-500 text-[11px]">
                        <span>Código do Certificado:</span>
                        <strong className="text-[#70360D]">{order.authenticity_certificate_code}</strong>
                      </div>
                      <div className="flex justify-between text-stone-500 text-[11px]">
                        <span>Número do Pedido:</span>
                        <span className="text-stone-800">{order.displayId}</span>
                      </div>
                      <div className="flex justify-between text-stone-500 text-[11px]">
                        <span>Origem do Esteatito/Barro:</span>
                        <span className="text-stone-800">{order.artisan_workshop_city}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setCertificateOrder(order)}
                      className="w-full py-2 bg-[#70360D] hover:bg-[#522709] text-white text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#E8C547]" />
                      <span>Visualizar Certificado em Alta Resolução</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PERFIL, ENDEREÇOS E HISTÓRICO DE PAGAMENTO */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Saved Address */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#70360D] flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C59B27]" />
                      Endereço Principal de Entrega
                    </h4>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Padrão
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200 text-xs space-y-1 text-stone-700">
                    <strong className="block text-sm text-[#2C1E14]">Mariana Silva Alvarenga</strong>
                    <p>Rua Direita, 48 - Casarão Solar das Rosas</p>
                    <p>Centro Histórico • Ouro Preto - MG</p>
                    <p className="font-mono text-stone-500">CEP: 35400-000</p>
                    <div className="pt-2 text-[11px] text-[#C59B27] font-bold flex items-center gap-1">
                      <span>🏛️ Localizado no Circuito do Ouro (Elegível para Carruagem Expressa)</span>
                    </div>
                  </div>
                </div>

                {/* Preferred Payment Method */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#70360D] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#C59B27]" />
                    Formas de Pagamento Salvas
                  </h4>

                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#2E6B40]/15 text-[#2E6B40] flex items-center justify-center font-black">
                          <QrCode className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="block text-[#2C1E14]">PIX Instantâneo (5% OFF)</strong>
                          <span className="text-[11px] text-stone-500">Chave: pix@ouropretominas.com.br</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#2E6B40] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Ativo
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#70360D]/10 text-[#70360D] flex items-center justify-center font-black">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="block text-[#2C1E14]">Mastercard •••• 4821</strong>
                          <span className="text-[11px] text-stone-500">Expira em 08/29 (Itaú Unibanco)</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                        Secundário
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            MODAL INTERNA: CERTIFICADO DE AUTENTICIDADE BARROCO IPHAN
        ========================================================================= */}
        {certificateOrder && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#FCF9F2] w-full max-w-2xl rounded-3xl p-6 sm:p-8 border-4 border-[#C59B27] shadow-2xl relative space-y-6 text-[#2C1E14]">
              <button
                onClick={() => setCertificateOrder(null)}
                className="absolute top-4 right-4 p-2 text-stone-500 hover:text-black rounded-full hover:bg-stone-200/60"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Certificate Header with Baroque Emblem */}
              <div className="text-center space-y-2 border-b-2 border-[#C59B27]/40 pb-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#70360D] text-amber-300 border-2 border-[#C59B27] flex items-center justify-center shadow-md">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#70360D] tracking-wide">
                  CERTIFICADO DE AUTENTICIDADE COLONIAL
                </h3>
                <p className="text-xs text-stone-600 uppercase tracking-widest font-bold">
                  Artesanato de Ouro Preto • Patrimônio Histórico & Cultural
                </p>
              </div>

              {/* Certificate Body Text */}
              <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-stone-800 text-center max-w-lg mx-auto font-serif">
                <p>
                  Certificamos que a peça <strong>"{certificateOrder.items[0]?.title}"</strong> foi legitimamente lavrada e lapidada à mão pelo mestre artesão <strong>{certificateOrder.items[0]?.artisan}</strong>, nas oficinas coloniais de {certificateOrder.artisan_workshop_city}.
                </p>

                <p className="text-xs text-stone-600 italic">
                  A matéria-prima (rocha esteatito / barro nobre) passou por rigorosa curadoria mineralógica, sem adição de produtos químicos nocivos, com cura tradicional em forno e banho de óleo mineral.
                </p>
              </div>

              {/* Serial & Metadata */}
              <div className="bg-[#F2ECE1] p-4 rounded-2xl border border-[#C59B27]/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-stone-500 block">Número de Registro Serial:</span>
                  <strong className="text-[#70360D] text-sm">{certificateOrder.authenticity_certificate_code}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block">Data de Lavratura:</span>
                  <span className="text-stone-800">{new Date(certificateOrder.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block">Titular da Peça:</span>
                  <span className="text-stone-800 font-bold">{certificateOrder.customer_name}</span>
                </div>
              </div>

              {/* Signatures & Seal */}
              <div className="flex items-center justify-between pt-4 border-t border-[#C59B27]/30 text-xs">
                <div className="text-center w-40">
                  <div className="border-b border-stone-400 pb-1 font-serif italic text-stone-700">
                    {certificateOrder.items[0]?.artisan}
                  </div>
                  <span className="text-[10px] text-stone-500">Mestre Artesão</span>
                </div>

                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#C59B27] flex items-center justify-center text-[10px] font-bold text-[#C59B27] text-center p-1 uppercase">
                  Selo Real OP
                </div>

                <div className="text-center w-40">
                  <div className="border-b border-stone-400 pb-1 font-serif italic text-stone-700">
                    Curadoria Ouro Preto
                  </div>
                  <span className="text-[10px] text-stone-500">Comissão de Artesanato</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
