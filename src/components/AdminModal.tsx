import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Check, 
  X, 
  AlertCircle, 
  Image as ImageIcon, 
  Tag, 
  DollarSign, 
  Star, 
  Package, 
  User, 
  MapPin, 
  FileText,
  Key,
  Palette,
  Database,
  Mail,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Product } from '../types';
import { ColorPaletteViewer } from './ColorPaletteViewer';
import { SupabaseConnectionTester } from './SupabaseConnectionTester';
import { PaymentManagementView } from './PaymentManagementView';
import { getSupabase } from '../lib/supabase';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onResetProducts: () => void;
  initialEditProduct?: Product | null;
  initialCreateNew?: boolean;
}

const PRESET_IMAGES = [
  { label: 'Pedra-Sabão / Panela', url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80' },
  { label: 'Doce de Leite / Pote', url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80' },
  { label: 'Escultura / Arte', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80' },
  { label: 'Cerâmica / Café', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80' },
  { label: 'Cesta Rústica', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' }
];

// Hash SHA-256 do código de acesso admin local 'ouro123'
const ADMIN_PASSWORD_SHA256 = '9ecff64616744b5d92aa74fce0b108d3cfbbc402657dfabffef1271032d8ae35';

async function hashPasswordSHA256(str: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  onSaveProduct,
  onDeleteProduct,
  onResetProducts,
  initialEditProduct,
  initialCreateNew,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('ouro_admin_logged') === 'true';
  });
  const [currentUserEmail, setCurrentUserEmail] = useState<string>(() => {
    return sessionStorage.getItem('ouro_admin_user_email') || '';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [modalSearch, setModalSearch] = useState('');
  const [adminTab, setAdminTab] = useState<'catalog' | 'payments' | 'supabase' | 'palette'>('catalog');

  // Check active Supabase session on mount or modal open & register real-time auth state changes
  useEffect(() => {
    const checkSession = async () => {
      try {
        const client = getSupabase();
        if (client) {
          const { data: { session } } = await client.auth.getSession();
          if (session?.user?.email) {
            setIsAuthenticated(true);
            setCurrentUserEmail(session.user.email);
            sessionStorage.setItem('ouro_admin_logged', 'true');
            sessionStorage.setItem('ouro_admin_user_email', session.user.email);
          } else {
            const localMaster = sessionStorage.getItem('ouro_admin_user_email') === 'admin';
            if (!localMaster) {
              const wasLogged = sessionStorage.getItem('ouro_admin_logged') === 'true';
              if (!wasLogged) {
                setIsAuthenticated(false);
                setCurrentUserEmail('');
              }
            }
          }
        }
      } catch (err) {
        console.warn('Erro ao verificar sessão Supabase:', err);
      }
    };

    checkSession();

    let subscription: { unsubscribe: () => void } | null = null;
    try {
      const client = getSupabase();
      if (client) {
        const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
          if (session?.user?.email) {
            setIsAuthenticated(true);
            setCurrentUserEmail(session.user.email);
            sessionStorage.setItem('ouro_admin_logged', 'true');
            sessionStorage.setItem('ouro_admin_user_email', session.user.email);
          } else if (sessionStorage.getItem('ouro_admin_user_email') !== 'admin') {
            setIsAuthenticated(false);
            setCurrentUserEmail('');
            sessionStorage.removeItem('ouro_admin_logged');
            sessionStorage.removeItem('ouro_admin_user_email');
          }
        });
        subscription = authListener?.subscription || null;
      }
    } catch (err) {
      console.warn('Erro ao registrar listener de autenticação no modal:', err);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [isOpen]);

  // Effect when modal opens or initial props change
  useEffect(() => {
    if (isOpen) {
      setLoginError('');
      if (initialEditProduct) {
        startEditProduct(initialEditProduct);
      } else if (initialCreateNew) {
        startCreateNew();
      }
    }
  }, [isOpen, initialEditProduct, initialCreateNew]);

  // Editing/Creating product state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields State
  const [formState, setFormState] = useState<Partial<Product>>({
    titulo: '',
    subtitulo: '',
    categoria: 'Panela de Pedra-Sabão',
    preco: 100,
    preco_original: 120,
    nota_avaliacao: 5.0,
    quantidade_reviews: 1,
    selo_destaque: 'Novo Artesanato',
    imagem_url: PRESET_IMAGES[0].url,
    estoque: 10,
    artesao: 'Mestre Artesão Ouro Preto',
    atelie: 'Ateliê Colonial',
    cidade: 'Ouro Preto - MG',
    descricao_detalhada: '',
    bullet_points: ['', '', '', '', ''],
  });

  if (!isOpen) return null;

  // Handle Login: Suporta tanto Usuários do Supabase Auth quanto o acesso local master 'admin / ouro123'
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    try {
      // 1. Tentar Login Local Master (admin / ouro123)
      const hashedInput = await hashPasswordSHA256(cleanPass);
      if (cleanUser.toLowerCase() === 'admin' && hashedInput === ADMIN_PASSWORD_SHA256) {
        setIsAuthenticated(true);
        setCurrentUserEmail('Administrador Master (Local)');
        sessionStorage.setItem('ouro_admin_logged', 'true');
        sessionStorage.setItem('ouro_admin_user_email', 'admin');
        setLoginError('');
        setUsername('');
        setPassword('');
        setIsLoggingIn(false);
        return;
      }

      // 2. Tentar Login via Supabase Authentication
      const client = getSupabase();
      if (!client) {
        throw new Error('Cliente Supabase não está configurado.');
      }

      const { data, error } = await client.auth.signInWithPassword({
        email: cleanUser,
        password: cleanPass,
      });

      if (error) {
        let msg = error.message;
        if (msg.includes('Invalid login credentials')) {
          msg = 'E-mail ou senha incorretos no Supabase. Verifique se o e-mail digitado confere com o usuário cadastrado no Supabase Authentication.';
        } else if (msg.includes('Email not confirmed')) {
          msg = 'E-mail ainda não confirmado no Supabase. Acesse o painel do Supabase > Authentication > Users e confirme o e-mail ou desative "Confirm email" em Authentication > Providers > Email.';
        } else if (msg.includes('Email link is invalid')) {
          msg = 'Credenciais inválidas ou link expirado no Supabase.';
        }
        setLoginError(msg);
        setIsLoggingIn(false);
        return;
      }

      if (data?.user) {
        setIsAuthenticated(true);
        const email = data.user.email || cleanUser;
        setCurrentUserEmail(email);
        sessionStorage.setItem('ouro_admin_logged', 'true');
        sessionStorage.setItem('ouro_admin_user_email', email);
        setLoginError('');
        setUsername('');
        setPassword('');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Erro inesperado ao realizar login.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      const client = getSupabase();
      if (client) {
        await client.auth.signOut();
      }
    } catch (e) {
      console.warn('Erro ao deslogar do Supabase:', e);
    }

    setIsAuthenticated(false);
    setCurrentUserEmail('');
    sessionStorage.removeItem('ouro_admin_logged');
    sessionStorage.removeItem('ouro_admin_user_email');
    setEditingProduct(null);
    setIsCreatingNew(false);
    setUsername('');
    setPassword('');
    setLoginError('');
  };

  const startCreateNew = () => {
    const newId = `OP-ART-${Date.now().toString().slice(-4)}`;
    setFormState({
      id: newId,
      titulo: '',
      subtitulo: '',
      categoria: 'Panela de Pedra-Sabão',
      preco: 150.0,
      preco_original: 180.0,
      desconto_percentual: 16,
      nota_avaliacao: 5.0,
      quantidade_reviews: 12,
      selo_destaque: 'Novo Artesanato Exclusivo',
      imagem_url: PRESET_IMAGES[0].url,
      imagens_galeria: [PRESET_IMAGES[0].url],
      estoque: 8,
      artesao: 'Mestre Artesão Ouro Preto',
      atelie: 'Ateliê Barroco Colonial',
      cidade: 'Ouro Preto - MG',
      especificacoes: {
        'Material': 'Pedra-Sabão / Cobre / Cerâmica',
        'Origem': 'Ouro Preto - MG',
        'Garantia': '12 meses'
      },
      bullet_points: [
        '🌿 PRODUTO AUTÊNTICO DE OURO PRETO: Feito 100% artesanalmente por mestres locais.',
        '✨ ACABAMENTO BARROCO TRADICIONAL: Técnica refinada transmitida por gerações.',
        '🛡️ QUALIDADE CERTIFICADA: Material de alta durabilidade e procedência garantida.',
        '🎁 EMBALAGEM ESPECIAL PARA TRANSPORTE: Selado com segurança para envio rápido.',
        '📜 ACOMPANHA CERTIFICADO DE AUTENTICIDADE: Emitido pela Associação de Artesãos.'
      ],
      descricao_detalhada: 'Peça exclusiva moldada artesanalmente no coração de Ouro Preto. Ideal para apreciadores do artesanato mineiro e da riqueza cultural do Barroco.'
    });
    setEditingProduct(null);
    setIsCreatingNew(true);
  };

  const startEditProduct = (prod: Product) => {
    setIsCreatingNew(false);
    setEditingProduct(prod);
    setFormState({
      ...prod,
      bullet_points: prod.bullet_points.length >= 5 
        ? [...prod.bullet_points] 
        : [...prod.bullet_points, ...Array(5 - prod.bullet_points.length).fill('')]
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.titulo || !formState.preco || !formState.imagem_url) {
      alert('Por favor, preencha o Título, Preço e Imagem do produto.');
      return;
    }

    const price = Number(formState.preco) || 0;
    const origPrice = Number(formState.preco_original) || price;
    const desc = origPrice > price ? Math.round(((origPrice - price) / origPrice) * 100) : 0;

    const savedProduct: Product = {
      id: formState.id || `OP-ITEM-${Date.now()}`,
      titulo: formState.titulo || '',
      subtitulo: formState.subtitulo || '',
      categoria: formState.categoria || 'Geral',
      preco: price,
      preco_original: origPrice,
      desconto_percentual: desc,
      nota_avaliacao: Number(formState.nota_avaliacao) || 5.0,
      quantidade_reviews: Number(formState.quantidade_reviews) || 1,
      selo_destaque: formState.selo_destaque || '',
      imagem_url: formState.imagem_url || PRESET_IMAGES[0].url,
      imagens_galeria: [formState.imagem_url || PRESET_IMAGES[0].url],
      estoque: Number(formState.estoque) || 1,
      artesao: formState.artesao || 'Artesão Local',
      atelie: formState.atelie || 'Ateliê Ouro Preto',
      cidade: formState.cidade || 'Ouro Preto - MG',
      especificacoes: formState.especificacoes || { 'Origem': 'Ouro Preto - MG' },
      bullet_points: (formState.bullet_points || []).filter(bp => bp.trim() !== ''),
      descricao_detalhada: formState.descricao_detalhada || formState.titulo || ''
    };

    onSaveProduct(savedProduct);
    setIsCreatingNew(false);
    setEditingProduct(null);
    setSuccessMessage(`Produto "${savedProduct.titulo.slice(0, 30)}..." salvo com sucesso!`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleDelete = (id: string) => {
    onDeleteProduct(id);
    setDeleteConfirmId(null);
    setSuccessMessage('Produto removido com sucesso!');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FDFBF7] text-[#2C1E14] w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col border border-[#B8860B]/30 overflow-hidden font-sans">
        
        {/* Modal Header */}
        <div className="bg-[#1a130f] text-white px-6 py-4 flex items-center justify-between border-b border-[#3A2D23]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#B8860B]/20 rounded-xl border border-[#B8860B]/40">
              <ShieldCheck className="w-5 h-5 text-[#B8860B]" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                Painel Administrativo
                <span className="text-[10px] bg-[#B8860B] text-black font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Gestão do Catálogo
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Adicione, edite ou remova produtos em tempo real no Mercado Ouro Preto
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-[#2C1E14] text-amber-200 border border-[#B8860B]/40 px-2.5 py-1 rounded-lg">
                  <User className="w-3 h-3 text-[#B8860B]" />
                  <span className="max-w-[180px] truncate">{currentUserEmail || 'admin'}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-800/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair</span>
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-900/20 border border-emerald-600/40 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN SCREEN IF NOT AUTHENTICATED */}
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto my-6 bg-white p-6 rounded-2xl border border-[#E5E0D8] shadow-lg space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-[#B8860B]/10 rounded-full flex items-center justify-center mx-auto text-[#B8860B]">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#2C1E14]">Acesso ao Painel do Administrador</h3>
                <p className="text-xs text-stone-600">
                  Entre com seu <strong>usuário do Supabase</strong> ou com as credenciais administrativas locais.
                </p>
              </div>

              {/* Credentials Help Box */}
              <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#B8860B]/30 text-xs space-y-2">
                <div className="font-bold text-[#70360D] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-[#B8860B]" />
                    <span>Métodos de Autenticação Aceitos:</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
                    🟢 Supabase Auth + Local
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-stone-700">
                  <p>
                    • <strong>Novo Usuário Supabase:</strong> Digite seu <strong>E-mail</strong> e <strong>Senha</strong> cadastrados no painel do Supabase.
                  </p>
                  <p>
                    • <strong>Acesso Master Local:</strong> Usuário <code>admin</code> / Senha <code>ouro123</code>.
                  </p>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2C1E14] mb-1">E-mail (Supabase) ou Usuário:</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="seu-email@exemplo.com ou admin"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-[#FDFBF7] border border-[#E5E0D8] rounded-xl text-sm outline-none focus:border-[#B8860B]"
                      required
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C1E14] mb-1">Senha:</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha cadastrada"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-[#FDFBF7] border border-[#E5E0D8] rounded-xl text-sm outline-none focus:border-[#B8860B]"
                      required
                    />
                    <Key className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-semibold">{loginError}</span>
                      {loginError.includes('confirmado') && (
                        <p className="text-[11px] text-stone-600">
                          💡 Dica: No Supabase, você pode marcar o e-mail do usuário como confirmado clicando no menu de 3 pontos do usuário em <em>Authentication → Users</em> ou desativar temporariamente a confirmação em <em>Authentication → Providers → Email</em>.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 bg-[#B8860B] hover:bg-[#a67c0a] text-white font-bold text-sm rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Autenticando no Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Entrar no Painel</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ADMIN MANAGEMENT VIEW */
            <div className="space-y-6">
              
              {/* Top Action Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E5E0D8] shadow-sm">
                <div>
                  <h3 className="font-bold text-[#2C1E14] text-base">
                    {isCreatingNew 
                      ? 'Adicionar Novo Produto Artesanal' 
                      : editingProduct 
                      ? `Editando: ${editingProduct.titulo.slice(0, 35)}...` 
                      : adminTab === 'payments'
                      ? 'Gestão de Pagamentos & Bancos (PIX / Cartão / Boleto)'
                      : adminTab === 'palette'
                      ? 'Guia da Paleta de Cores & Bento Design'
                      : adminTab === 'supabase'
                      ? 'Integração & Diagnóstico do Supabase'
                      : `Produtos Cadastrados (${products.length})`}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {isCreatingNew || editingProduct 
                      ? 'Preencha os dados do anúncio no padrão Amazon de Ouro Preto' 
                      : adminTab === 'payments'
                      ? 'Monitore transações financeiras, PIX dinâmico, cartões e script da tabela payments'
                      : adminTab === 'palette'
                      ? 'Especificações de cores históricas e diretrizes do design system'
                      : adminTab === 'supabase'
                      ? 'Status da conexão, teste de consultas e sincronização com banco de dados'
                      : 'Gerencie os itens exibidos na vitrine e nos blocos de vendas'}
                  </p>
                </div>

                {!isCreatingNew && !editingProduct && (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={onResetProducts}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all cursor-pointer border border-stone-300"
                      title="Restaura os 4 produtos padrões da aplicação"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restaurar Padrões</span>
                    </button>
                    <button
                      onClick={startCreateNew}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-[#2E6B40] hover:bg-[#235331] text-white rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Incluir Novo Produto</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Tabs */}
              {!isCreatingNew && !editingProduct && (
                <div className="flex flex-wrap border border-[#E5E0D8] bg-white rounded-xl p-1 gap-1 shadow-sm">
                  <button
                    onClick={() => setAdminTab('catalog')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      adminTab === 'catalog'
                        ? 'bg-[#B8860B] text-white shadow-sm'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span>Catálogo ({products.length})</span>
                  </button>
                  <button
                    onClick={() => setAdminTab('payments')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      adminTab === 'payments'
                        ? 'bg-[#B8860B] text-white shadow-sm'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Pagamentos & Bancos (PIX)</span>
                  </button>
                  <button
                    onClick={() => setAdminTab('supabase')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      adminTab === 'supabase'
                        ? 'bg-[#B8860B] text-white shadow-sm'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Database className="w-4 h-4" />
                    <span>Supabase DB & Teste</span>
                  </button>
                  <button
                    onClick={() => setAdminTab('palette')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      adminTab === 'palette'
                        ? 'bg-[#B8860B] text-white shadow-sm'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Palette className="w-4 h-4" />
                    <span>Paleta de Cores</span>
                  </button>
                </div>
              )}

              {/* CREATE OR EDIT FORM */}
              {(isCreatingNew || editingProduct) && (
                <form onSubmit={handleSaveForm} className="bg-white p-6 rounded-2xl border border-[#E5E0D8] shadow-md space-y-6">
                  <div className="flex items-center justify-between border-b pb-3 border-stone-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#B8860B] flex items-center gap-1.5">
                      <Tag className="w-4 h-4" />
                      {isCreatingNew ? 'Novo Item de Catálogo' : `ID: ${formState.id}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => { setIsCreatingNew(false); setEditingProduct(null); }}
                      className="text-xs text-stone-500 hover:text-black font-bold"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#2C1E14] mb-1">
                        Título Longo do Produto (Estilo Amazon): *
                      </label>
                      <input
                        type="text"
                        value={formState.titulo || ''}
                        onChange={(e) => setFormState({ ...formState, titulo: e.target.value })}
                        placeholder="Ex: Panela de Pedra-Sabão Tradicional de Ouro Preto 3.5L com Alça de Cobre"
                        className="w-full px-3.5 py-2 bg-[#FDFBF7] border border-[#E5E0D8] rounded-xl text-xs outline-none focus:border-[#B8860B]"
                        required
                      />
                    </div>

                    {/* Subtitle */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#2C1E14] mb-1">
                        Subtítulo / Chamada Curta:
                      </label>
                      <input
                        type="text"
                        value={formState.subtitulo || ''}
                        onChange={(e) => setFormState({ ...formState, subtitulo: e.target.value })}
                        placeholder="Ex: Feita artesanalmente em rocha esteatito com contorno em cobre polido."
                        className="w-full px-3.5 py-2 bg-[#FDFBF7] border border-[#E5E0D8] rounded-xl text-xs outline-none focus:border-[#B8860B]"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-bold text-[#2C1E14] mb-1">
                        Categoria:
                      </label>
                      <select
                        value={formState.categoria || 'Panela de Pedra-Sabão'}
                        onChange={(e) => setFormState({ ...formState, categoria: e.target.value })}
                        className="w-full px-3.5 py-2 bg-[#FDFBF7] border border-[#E5E0D8] rounded-xl text-xs outline-none focus:border-[#B8860B]"
                      >
                        <option value="Panela de Pedra-Sabão">Panela de Pedra-Sabão</option>
                        <option value="Doces Tradicionais">Doces Tradicionais</option>
                        <option value="Esculturas & Arte Barroca">Esculturas & Arte Barroca</option>
                        <option value="Utensílios & Cerâmica">Utensílios & Cerâmica</option>
                        <option value="Licores & Cachaça">Licores & Cachaça</option>
                        <option value="Outros Artesanatos">Outros Artesanatos</option>
                      </select>
                    </div>

                    {/* Badge */}
                    <div>
                      <label className="block text-xs font-bold text-[#2C1E14] mb-1">
                        Selo de Destaque / Badge:
                      </label>
                      <input
                        type="text"
                        value={formState.selo_destaque || ''}
                        onChange={(e) => setFormState({ ...formState, selo_destaque: e.target.value })}
                        placeholder="Ex: Mais Vendido nº 1, Lançamento, Edição Limitada"
                        className="w-full px-3.5 py-2 bg-[#FDFBF7] border border-[#E5E0D8] rounded-xl text-xs outline-none focus:border-[#B8860B]"
                      />
                    </div>

                    {/* Prices */}
                    <div>
                      <label className="block text-xs font-bold text-[#2C1E14] mb-1">
                        Preço de Venda (R$): *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formState.preco || ''}
                        onChange={(e) => setFormState({ ...formState, preco: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3.5 py-2 bg-[#FDFBF7] border border-[#E5E0D8] rounded-xl text-xs outline-none focus:border-[#B8860B]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2C1E14] mb-1">
                        Preço De / Original (R$):
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formState.preco_original || ''}
                        onChange={(e) => setFormState({ ...formState, preco_original: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3.5 py-2 bg-[#FDFBF7] border border-[#E5E0D8] rounded-xl text-xs outline-none focus:border-[#B8860B]"
                      />
                    </div>

                    {/* Stock & Rating */}
                    <div>
                      <label className="block text-xs font-bold text-[#2C1E14] mb-1">
                        Quantidade em Estoque:
                      </label>
                      <input
                        type="number"
                        value={formState.estoque || 1}
                        onChange={(e) => setFormState({ ...formState, estoque: parseInt(e.target.value) || 1 })}
                        className="w-full px-3.5 py-2 bg-[#FDFBF7] border border-[#E5E0D8] rounded-xl text-xs outline-none focus:border-[#B8860B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2C1E14] mb-1">
                        Nota de Avaliação (1.0 a 5.0):
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        max="5.0"
                        min="1.0"
                        value={formState.nota_avaliacao || 4.9}
                        onChange={(e) => setFormState({ ...formState, nota_avaliacao: parseFloat(e.target.value) || 5 })}
                        className="w-full px-3.5 py-2 bg-[#FDFBF7] border border-[#E5E0D8] rounded-xl text-xs outline-none focus:border-[#B8860B]"
                      />
                    </div>

                    {/* Artisan & Workshop */}
                    <div>
                      <label className="block text-xs font-bold text-[#2C1E14] mb-1">
                        Artesão / Mestre:
                      </label>
                      <input
                        type="text"
                        value={formState.artesao || ''}
                        onChange={(e) => setFormState({ ...formState, artesao: e.target.value })}
                        placeholder="Ex: Mestre Valentim"
                        className="w-full px-3.5 py-2 bg-[#FDFBF7] border border-[#E5E0D8] rounded-xl text-xs outline-none focus:border-[#B8860B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2C1E14] mb-1">
                        Ateliê / Oficina:
                      </label>
                      <input
                        type="text"
                        value={formState.atelie || ''}
                        onChange={(e) => setFormState({ ...formState, atelie: e.target.value })}
                        placeholder="Ex: Ateliê Barroco das Minas"
                        className="w-full px-3.5 py-2 bg-[#FDFBF7] border border-[#E5E0D8] rounded-xl text-xs outline-none focus:border-[#B8860B]"
                      />
                    </div>

                    {/* Image URL & Presets */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#2C1E14] mb-1">
                        URL da Imagem do Produto: *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={formState.imagem_url || ''}
                          onChange={(e) => setFormState({ ...formState, imagem_url: e.target.value })}
                          placeholder="https://..."
                          className="flex-1 px-3.5 py-2 bg-[#FDFBF7] border border-[#E5E0D8] rounded-xl text-xs outline-none focus:border-[#B8860B]"
                          required
                        />
                        {formState.imagem_url && (
                          <img
                            src={formState.imagem_url}
                            alt="Prévia"
                            className="w-10 h-10 object-cover rounded-lg border border-stone-300"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                          />
                        )}
                      </div>
                      
                      {/* Image Presets Selector */}
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] text-stone-500 font-bold">Imagens Sugeridas:</span>
                        {PRESET_IMAGES.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormState({ ...formState, imagem_url: preset.url })}
                            className="text-[10px] bg-stone-100 hover:bg-[#B8860B]/20 text-stone-700 px-2 py-0.5 rounded border border-stone-200 cursor-pointer"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bullet Points */}
                    <div className="md:col-span-2 space-y-2 pt-2">
                      <label className="block text-xs font-bold text-[#2C1E14]">
                        Destaques em Bullet Points (Até 5 Tópicos):
                      </label>
                      {[0, 1, 2, 3, 4].map((idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={(formState.bullet_points || [])[idx] || ''}
                          onChange={(e) => {
                            const newBps = [...(formState.bullet_points || ['', '', '', '', ''])];
                            newBps[idx] = e.target.value;
                            setFormState({ ...formState, bullet_points: newBps });
                          }}
                          placeholder={`Bullet Point ${idx + 1}`}
                          className="w-full px-3 py-1.5 bg-[#FDFBF7] border border-[#E5E0D8] rounded-lg text-xs outline-none focus:border-[#B8860B]"
                        />
                      ))}
                    </div>

                    {/* Detailed Description */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#2C1E14] mb-1">
                        Descrição Detalhada do Produto:
                      </label>
                      <textarea
                        rows={3}
                        value={formState.descricao_detalhada || ''}
                        onChange={(e) => setFormState({ ...formState, descricao_detalhada: e.target.value })}
                        placeholder="Escreva a história e diferenciais deste produto de Ouro Preto..."
                        className="w-full px-3.5 py-2 bg-[#FDFBF7] border border-[#E5E0D8] rounded-xl text-xs outline-none focus:border-[#B8860B]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => { setIsCreatingNew(false); setEditingProduct(null); }}
                      className="px-4 py-2 text-stone-600 hover:text-black font-bold text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#B8860B] hover:bg-[#a67c0a] text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isCreatingNew ? 'Cadastrar e Publicar Item' : 'Salvar Alterações'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* PRODUCT LIST TABULAR GRID */}
              {!isCreatingNew && !editingProduct && adminTab === 'catalog' && (
                <div className="bg-white rounded-2xl border border-[#E5E0D8] shadow-sm overflow-hidden">
                  <div className="p-4 bg-[#FDFBF7] border-b border-[#E5E0D8] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-bold text-stone-600">
                    <div className="flex items-center gap-2">
                      <span>Lista de Produtos no Sistema</span>
                      <span className="bg-[#B8860B] text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                        {products.length} itens
                      </span>
                    </div>
                    <div className="w-full sm:w-64">
                      <input
                        type="text"
                        placeholder="🔍 Buscar produto ou artesão..."
                        value={modalSearch}
                        onChange={(e) => setModalSearch(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-[#E5E0D8] rounded-xl text-xs outline-none focus:border-[#B8860B]"
                      />
                    </div>
                  </div>

                  <div className="divide-y divide-stone-100">
                    {products
                      .filter(p => {
                        if (!modalSearch.trim()) return true;
                        const q = modalSearch.toLowerCase();
                        return (
                          p.titulo.toLowerCase().includes(q) ||
                          p.categoria.toLowerCase().includes(q) ||
                          p.artesao.toLowerCase().includes(q) ||
                          p.id.toLowerCase().includes(q)
                        );
                      })
                      .map((prod) => (
                      <div key={prod.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FDFBF7]/60 transition-colors">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.imagem_url}
                            alt={prod.titulo}
                            className="w-14 h-14 object-cover rounded-xl border border-stone-200 bg-stone-100 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase bg-[#B8860B]/10 text-[#70360D] px-2 py-0.5 rounded border border-[#B8860B]/20">
                                {prod.categoria}
                              </span>
                              <span className="text-[10px] text-stone-400 font-mono">ID: {prod.id}</span>
                            </div>
                            <h4 className="font-bold text-sm text-[#2C1E14] line-clamp-1 mt-0.5">
                              {prod.titulo}
                            </h4>
                            <p className="text-xs text-stone-500">
                              Artesão: <strong>{prod.artesao}</strong> • {prod.atelie}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0">
                          <div className="text-right">
                            <div className="text-sm font-extrabold text-[#70360D]">
                              R$ {prod.preco.toFixed(2).replace('.', ',')}
                            </div>
                            <div className="text-[11px] text-emerald-700 font-bold">
                              Estoque: {prod.estoque} un.
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => startEditProduct(prod)}
                              className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg transition-colors border border-amber-200/60 cursor-pointer"
                              title="Editar Produto"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {deleteConfirmId === prod.id ? (
                              <div className="flex items-center gap-1 animate-fadeIn">
                                <button
                                  onClick={() => handleDelete(prod.id)}
                                  className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 cursor-pointer"
                                >
                                  Confirmar
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-2 py-1 bg-stone-200 text-stone-700 text-xs font-bold rounded hover:bg-stone-300 cursor-pointer"
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmId(prod.id)}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200/60 cursor-pointer"
                                title="Excluir Produto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PAYMENTS & BANKING MANAGEMENT VIEW */}
              {!isCreatingNew && !editingProduct && adminTab === 'payments' && (
                <PaymentManagementView />
              )}

              {/* COLOR PALETTE & DESIGN SYSTEM VIEW */}
              {!isCreatingNew && !editingProduct && adminTab === 'palette' && (
                <div className="rounded-2xl overflow-hidden shadow-sm border border-[#E5E0D8]">
                  <ColorPaletteViewer />
                </div>
              )}

              {/* SUPABASE CONNECTION TESTER & SYNC */}
              {!isCreatingNew && !editingProduct && adminTab === 'supabase' && (
                <SupabaseConnectionTester
                  localProducts={products}
                  onImportFromSupabase={(supabaseProducts) => {
                    supabaseProducts.forEach((prod) => onSaveProduct(prod));
                    setSuccessMessage(`✅ ${supabaseProducts.length} produtos importados do Supabase com sucesso!`);
                    setTimeout(() => setSuccessMessage(''), 5000);
                  }}
                />
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#1a130f] text-stone-400 px-6 py-3 border-t border-[#3A2D23] text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B8860B]" />
            Mercado Colonial Ouro Preto • Gestão Segura de Estoque Local
          </span>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white font-bold cursor-pointer"
          >
            Fechar Janela
          </button>
        </div>

      </div>
    </div>
  );
};
