import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptSwitcher } from './components/PromptSwitcher';
import { BuyBox } from './components/BuyBox';
import { BestSellersGrid } from './components/BestSellersGrid';
import { CopywritingSection } from './components/CopywritingSection';
import { ShoppingCartDrawer } from './components/ShoppingCartDrawer';
import { AdminModal } from './components/AdminModal';
import { Product, CartItem, ActiveTab } from './types';
import { BEST_SELLERS_PRODUCTS, RAW_PROMPT1_BUY_BOX_HTML, RAW_PROMPT2_JSON_STRING } from './data/ouroPretoData';
import { RotatingProductImage } from './components/RotatingProductImage';
import { RecommendationSystem } from './components/RecommendationSystem';
import { CustomerTestimonials } from './components/CustomerTestimonials';
import { ColonialShippingSimulator } from './components/ColonialShippingSimulator';
import { MyOrdersModal } from './components/MyOrdersModal';
import { EstradaRealNewsletter } from './components/EstradaRealNewsletter';
import { getSupabase } from './lib/supabase';
import { Code, FileJson, Feather, Check, Copy, ShieldCheck, Plus, Settings, RotateCcw, LogOut, Edit3, Package } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [isOrdersOpen, setIsOrdersOpen] = useState<boolean>(false);
  
  // Persistent Products state from localStorage (merging defaults)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ouro_preto_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const savedIds = new Set(parsed.map((p: Product) => p.id));
          const missingDefaults = BEST_SELLERS_PRODUCTS.filter(p => !savedIds.has(p.id));
          return [...parsed, ...missingDefaults];
        }
      }
    } catch (err) {
      console.error('Erro ao carregar produtos salvos:', err);
    }
    return BEST_SELLERS_PRODUCTS;
  });

  const [selectedProduct, setSelectedProduct] = useState<Product>(() => products[0] || BEST_SELLERS_PRODUCTS[0]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [adminEditProduct, setAdminEditProduct] = useState<Product | null>(null);
  const [adminCreateNew, setAdminCreateNew] = useState<boolean>(false);
  const [isAdminLogged, setIsAdminLogged] = useState<boolean>(() => {
    return sessionStorage.getItem('ouro_admin_logged') === 'true';
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedP1Code, setCopiedP1Code] = useState(false);
  const [copiedP2Json, setCopiedP2Json] = useState(false);

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ouro_preto_products', JSON.stringify(products));
    } catch (err) {
      console.error('Erro ao salvar produtos no localStorage:', err);
    }
  }, [products]);

  // Try to fetch products from Supabase on mount if configured and merge
  useEffect(() => {
    const fetchSupabaseProducts = async () => {
      try {
        const client = getSupabase();
        if (client) {
          const { data, error } = await client.from('products').select('*');
          if (!error && data && data.length > 0) {
            const supabaseIds = new Set(data.map((p: Product) => p.id));
            const merged = [...data, ...BEST_SELLERS_PRODUCTS.filter((p: Product) => !supabaseIds.has(p.id))];
            setProducts(merged);
            setSelectedProduct((prev) => merged.find((p: Product) => p.id === prev.id) || merged[0]);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar do Supabase:', err);
      }
    };
    fetchSupabaseProducts();
  }, []);

  // Keep admin logged state updated & sync Supabase Auth state listener
  useEffect(() => {
    const checkAdmin = async () => {
      const isLogged = sessionStorage.getItem('ouro_admin_logged') === 'true';
      if (isLogged) {
        setIsAdminLogged(true);
        return;
      }
      try {
        const client = getSupabase();
        if (client) {
          const { data: { session } } = await client.auth.getSession();
          if (session?.user?.email) {
            setIsAdminLogged(true);
            sessionStorage.setItem('ouro_admin_logged', 'true');
            sessionStorage.setItem('ouro_admin_user_email', session.user.email);
            return;
          }
        }
      } catch (e) {
        console.warn('Erro ao verificar sessão do Supabase:', e);
      }
      setIsAdminLogged(false);
    };

    checkAdmin();
    window.addEventListener('storage', checkAdmin);

    // Subscribe to auth state changes from Supabase
    let subscription: { unsubscribe: () => void } | null = null;
    try {
      const client = getSupabase();
      if (client) {
        const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
          if (session?.user?.email) {
            setIsAdminLogged(true);
            sessionStorage.setItem('ouro_admin_logged', 'true');
            sessionStorage.setItem('ouro_admin_user_email', session.user.email);
          } else if (sessionStorage.getItem('ouro_admin_user_email') !== 'admin') {
            setIsAdminLogged(false);
            sessionStorage.removeItem('ouro_admin_logged');
            sessionStorage.removeItem('ouro_admin_user_email');
          }
        });
        subscription = authListener?.subscription || null;
      }
    } catch (err) {
      console.warn('Erro ao registrar listener de autenticação:', err);
    }

    return () => {
      window.removeEventListener('storage', checkAdmin);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [isAdminOpen]);

  // Admin action triggers
  const handleOpenAdminWithProduct = (product: Product) => {
    setAdminEditProduct(product);
    setAdminCreateNew(false);
    setIsAdminOpen(true);
  };

  const handleOpenAdminToCreate = () => {
    setAdminEditProduct(null);
    setAdminCreateNew(true);
    setIsAdminOpen(true);
  };

  const handleOpenAdminGeneral = () => {
    setAdminEditProduct(null);
    setAdminCreateNew(false);
    setIsAdminOpen(true);
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('ouro_admin_logged');
    setIsAdminLogged(false);
  };

  // Product management handlers
  const handleSaveProduct = (savedProduct: Product) => {
    setProducts((prev) => {
      const index = prev.findIndex((p) => p.id === savedProduct.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = savedProduct;
        return updated;
      }
      return [savedProduct, ...prev];
    });
    // Update selected product if it was edited
    if (selectedProduct.id === savedProduct.id) {
      setSelectedProduct(savedProduct);
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (selectedProduct.id === id && products.length > 1) {
      setSelectedProduct(products.find(p => p.id !== id) || products[0]);
    }
  };

  const handleResetProducts = () => {
    if (window.confirm('Deseja realmente restaurar o catálogo de produtos padrão de Ouro Preto?')) {
      setProducts(BEST_SELLERS_PRODUCTS);
      localStorage.removeItem('ouro_preto_products');
      setSelectedProduct(BEST_SELLERS_PRODUCTS[0]);
    }
  };

  // Filter products by category & search
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchCat = selectedCategory === 'Todas' || prod.categoria === selectedCategory;
      const matchSearch =
        !searchQuery ||
        prod.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.categoria.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.artesao.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number, giftWrap: boolean) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        updated[existingIndex].giftWrap = giftWrap || updated[existingIndex].giftWrap;
        return updated;
      }
      return [...prev, { product, quantity, giftWrap }];
    });
  };

  const handleAddMultipleToCart = (productsToAdd: Product[]) => {
    setCartItems((prev) => {
      let updated = [...prev];
      productsToAdd.forEach((prod) => {
        const idx = updated.findIndex((item) => item.product.id === prod.id);
        if (idx > -1) {
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        } else {
          updated.push({ product: prod, quantity: 1, giftWrap: false });
        }
      });
      return updated;
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = (product: Product, quantity: number, giftWrap: boolean) => {
    handleAddToCart(product, quantity, giftWrap);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleToggleGiftWrap = (productId: string) => {
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, giftWrap: !item.giftWrap } : item))
    );
  };

  const handleCopyP1 = () => {
    navigator.clipboard.writeText(RAW_PROMPT1_BUY_BOX_HTML);
    setCopiedP1Code(true);
    setTimeout(() => setCopiedP1Code(false), 3000);
  };

  const handleCopyP2 = () => {
    const jsonStr = JSON.stringify(
      products.map(p => ({
        id: p.id,
        titulo: p.titulo,
        preco: p.preco,
        nota_avaliacao: p.nota_avaliacao,
        quantidade_reviews: p.quantidade_reviews,
        selo_destaque: p.selo_destaque,
      })),
      null,
      2
    );
    navigator.clipboard.writeText(jsonStr);
    setCopiedP2Json(true);
    setTimeout(() => setCopiedP2Json(false), 3000);
  };

  const panelaPedraSabao = products[0] || BEST_SELLERS_PRODUCTS[0];
  const doceDeLeiteNozes = products[1] || BEST_SELLERS_PRODUCTS[1];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EE] text-[#2D3033] font-sans selection:bg-[#C59B27] selection:text-[#1A1810]">
      {/* Admin Floating Control Toolbar when Logged In */}
      {isAdminLogged && (
        <div className="bg-[#1A1810] text-white px-4 py-2.5 border-b-2 border-[#C59B27] shadow-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="bg-[#C59B27] text-[#1A1810] font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                MODO ADMIN ATIVO
              </span>
              <span className="font-semibold text-stone-200 hidden md:inline">
                Acesso total de gestão do catálogo ({products.length} itens no site)
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleOpenAdminToCreate}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Incluir Novo Produto</span>
              </button>
              <button
                onClick={handleOpenAdminGeneral}
                className="bg-[#C59B27] hover:bg-[#b38a1f] text-[#1A1810] font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Gerenciar Catálogo</span>
              </button>
              <button
                onClick={handleResetProducts}
                className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                title="Restaurar Produtos Padrão"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleAdminLogout}
                className="bg-red-900/80 hover:bg-red-800 text-red-100 font-bold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ml-1"
                title="Sair do Administrador"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with Predictive Search Autocomplete */}
      <Header
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={handleOpenAdminGeneral}
        onOpenOrders={() => setIsOrdersOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        products={products}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setActiveTab('prompt3');
        }}
      />

      {/* Interactive Prompt Switcher & Banner */}
      <PromptSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

      {/* MAIN CONTENT ROUTER ACCORDING TO ACTIVE TAB */}
      <main className="flex-1">
        {/* TAB ALL: COMPREHENSIVE AMAZON OURO PRETO EXPERIENCE */}
        {activeTab === 'all' && (
          <div className="space-y-8 pb-12">
            {/* HERO PRODUCT SPOTLIGHT: PANELA DE PEDRA-SABÃO 3L (BUY BOX IN ACTION) */}
            {panelaPedraSabao && (
              <section className="bg-[#FDFBF7] py-8 px-4 border-b border-[#3A3D40]/15">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Product Media & Details Left (8 cols) */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#C59B27] text-[#1A1810] text-xs font-black px-2.5 py-1 rounded">
                          Destaque de Produto
                        </span>
                        <span className="text-xs font-bold text-[#70360D]">
                          Artefato Barroco Autêntico • Ouro Preto - MG
                        </span>
                      </div>

                      {isAdminLogged && (
                        <button
                          onClick={() => handleOpenAdminWithProduct(panelaPedraSabao)}
                          className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-xs px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-800" />
                          <span>Editar Este Item (Admin)</span>
                        </button>
                      )}
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-[#2D3033] leading-tight">
                      {panelaPedraSabao.titulo}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <div>
                        <RotatingProductImage
                          src={panelaPedraSabao.imagem_url}
                          alt={panelaPedraSabao.titulo}
                          heightClass="h-72"
                          autoRotateDefault={true}
                          badgeText="Panela 3D 360°"
                        />
                      </div>
                      <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#3A3D40]/15 text-xs text-[#3A3D40]">
                        <h4 className="font-bold text-sm text-[#70360D] border-b border-stone-100 pb-1">
                          Destaques do Produto:
                        </h4>
                        <ul className="space-y-2">
                          {(panelaPedraSabao.bullet_points || []).slice(0, 3).map((bp, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-[#C59B27] font-bold">✓</span>
                              <span dangerouslySetInnerHTML={{ __html: bp.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => {
                            setSelectedProduct(panelaPedraSabao);
                            setActiveTab('prompt1');
                          }}
                          className="text-[#70360D] font-bold underline hover:text-[#C59B27] block pt-1 text-[11px]"
                        >
                          Ver especificações completas & Caixa de Compra →
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Buy Box */}
                  <div className="lg:col-span-4 flex justify-center">
                    <BuyBox
                      product={panelaPedraSabao}
                      onAddToCart={handleAddToCart}
                      onBuyNow={handleBuyNow}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* COPYWRITING SPOTLIGHT: DOCE DE LEITE COM NOZES */}
            {doceDeLeiteNozes && (
              <section className="bg-[#F8F5EE] py-6 px-4">
                <div className="max-w-7xl mx-auto">
                  <div className="bg-white rounded-3xl p-6 border border-[#3A3D40]/15 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-5">
                      <RotatingProductImage
                        src={doceDeLeiteNozes.imagem_url}
                        alt={doceDeLeiteNozes.titulo}
                        heightClass="h-72"
                        autoRotateDefault={false}
                        badgeText="Doce de Leite 360°"
                      />
                    </div>
                    <div className="lg:col-span-7 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#C85A32] text-white text-[11px] font-bold px-2.5 py-0.5 rounded">
                            Destaque em Copywriting & SEO
                          </span>
                          <span className="text-xs text-[#70360D] font-semibold">
                            Receita Colonial de São Bartolomeu
                          </span>
                        </div>

                        {isAdminLogged && (
                          <button
                            onClick={() => handleOpenAdminWithProduct(doceDeLeiteNozes)}
                            className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-xs px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-800" />
                            <span>Editar Este Item (Admin)</span>
                          </button>
                        )}
                      </div>

                      <h2 className="text-xl font-extrabold text-[#2D3033]">
                        {doceDeLeiteNozes.titulo}
                      </h2>

                      <div className="space-y-2 bg-[#FDFBF7] p-4 rounded-xl border border-[#3A3D40]/10 text-xs text-[#2D3033]">
                        <h4 className="font-bold text-[#70360D]">Primeiros Tópicos de Destaque (Estilo Amazon):</h4>
                        <ul className="space-y-1.5">
                          {(doceDeLeiteNozes.bullet_points || []).slice(0, 2).map((bp, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-[#C59B27]">🍯</span>
                              <span dangerouslySetInnerHTML={{ __html: bp.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#70360D]">$1</strong>') }} />
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedProduct(doceDeLeiteNozes);
                            setActiveTab('prompt3');
                          }}
                          className="bg-[#C59B27] hover:bg-[#b38a1f] text-[#1A1810] px-5 py-2.5 rounded-xl font-bold text-xs shadow transition-all cursor-pointer"
                        >
                          Ver Copywriting Completo & SEO
                        </button>
                        <button
                          onClick={() => handleAddToCart(doceDeLeiteNozes, 1, false)}
                          className="bg-[#C85A32] hover:bg-[#b04c28] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow transition-all cursor-pointer"
                        >
                          Comprar {doceDeLeiteNozes.titulo.slice(0, 25)} (R$ {doceDeLeiteNozes.preco.toFixed(2).replace('.', ',')})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* BEST SELLERS GRID SECTION */}
            <BestSellersGrid
              products={filteredProducts}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                setActiveTab('prompt3');
              }}
              onAddToCart={handleAddToCart}
              onEditProduct={handleOpenAdminWithProduct}
              isAdminLogged={isAdminLogged}
            />

            {/* RECOMMENDATION SYSTEM (AMAZON & MERCADO LIVRE ENGINE) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
              <RecommendationSystem
                currentProduct={panelaPedraSabao}
                allProducts={products}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setActiveTab('prompt3');
                }}
                onAddToCart={handleAddToCart}
                onAddMultipleToCart={handleAddMultipleToCart}
              />
            </div>

            {/* SIMULADOR DE FRETE & LOGÍSTICA COLONIAL (CIDADES HISTÓRICAS DE MINAS GERAIS) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6" id="secao-frete-colonial">
              <ColonialShippingSimulator
                currentProduct={panelaPedraSabao}
                allProducts={products}
              />
            </div>

            {/* CUSTOMER TESTIMONIALS & SOCIAL PROOF COMPONENT WITH GEMINI */}
            <CustomerTestimonials
              products={products}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                setActiveTab('prompt3');
              }}
              onAddToCart={handleAddToCart}
            />
          </div>
        )}

        {/* TAB PROMPT 1: DEDICATED BUY BOX SHOWCASE & CODE INSPECTOR */}
        {activeTab === 'prompt1' && (
          <div className="py-8 px-4 max-w-7xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#3A3D40]/15 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A3D40]/10 pb-4">
                <div>
                  <span className="bg-[#C59B27] text-[#1A1810] text-xs font-black px-2.5 py-1 rounded">
                    Caixa de Compra (Buy Box)
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#2D3033] mt-2">
                    Buy Box de Panela de Pedra-Sabão de 3 Litros
                  </h2>
                  <p className="text-xs text-[#3A3D40]/80 mt-1">
                    Estrutura oficial da Amazon Brasil aplicada estritamente com a Paleta Ouro Preto: Botão Principal em <strong>Ouro Barroco (#C59B27)</strong>, Botão Secundário em <strong>Terracota Mineira (#C85A32)</strong> e fundo em <strong>Branco Colonial (#FDFBF7)</strong>.
                  </p>
                </div>

                <button
                  onClick={handleCopyP1}
                  className="bg-[#2D3033] hover:bg-[#1E2022] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {copiedP1Code ? <Check className="w-4 h-4 text-[#C59B27]" /> : <Copy className="w-4 h-4" />}
                  {copiedP1Code ? 'Código Copiado!' : 'Copiar Código HTML/Tailwind'}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
                <div className="lg:col-span-6 space-y-4">
                  <RotatingProductImage
                    src={panelaPedraSabao.imagem_url}
                    alt={panelaPedraSabao.titulo}
                    heightClass="h-80"
                    autoRotateDefault={true}
                    badgeText="Visualização 360° Buy Box"
                  />
                  <div className="bg-[#F8F5EE] p-4 rounded-xl border border-[#3A3D40]/10 text-xs space-y-2">
                    <h4 className="font-bold text-[#70360D]">Regras de Cores Aplicadas (Ouro Preto):</h4>
                    <ul className="space-y-1 text-[#3A3D40]">
                      <li>• <strong>Fundo da Buy Box:</strong> Branco Colonial (<code>#FDFBF7</code>)</li>
                      <li>• <strong>Botão Adicionar ao Carrinho:</strong> Ouro Barroco (<code>#C59B27</code>)</li>
                      <li>• <strong>Botão Comprar Agora:</strong> Terracota Mineira (<code>#C85A32</code>)</li>
                      <li>• <strong>Frete Grátis e Status Estoque:</strong> Verde Esmeralda (<code>#2E6B40</code>)</li>
                      <li>• <strong>Preço & Vendedor:</strong> Madeira Cobre / Pedra-Sabão Grafite (<code>#70360D</code> e <code>#3A3D40</code>)</li>
                    </ul>
                  </div>
                </div>

                <div className="lg:col-span-6 flex justify-center">
                  <BuyBox product={panelaPedraSabao} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
                </div>
              </div>

              {/* Raw HTML Inspection Block */}
              <div className="mt-8 pt-6 border-t border-[#3A3D40]/15 space-y-3">
                <h3 className="font-extrabold text-sm text-[#2D3033] flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#C59B27]" />
                  Código Fonte HTML e Tailwind CSS Gerado:
                </h3>
                <pre className="whitespace-pre-wrap break-all p-4 bg-[#141517] text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto border border-[#3A3D40]/30">
                  {RAW_PROMPT1_BUY_BOX_HTML}
                </pre>
              </div>
            </div>

            {/* Colonial Shipping Simulator Section for Tab 1 */}
            <ColonialShippingSimulator
              currentProduct={panelaPedraSabao}
              allProducts={products}
            />
          </div>
        )}

        {/* TAB PROMPT 2: DEDICATED JSON DATA ARRAY SHOWCASE */}
        {activeTab === 'prompt2' && (
          <div className="py-8 px-4 max-w-7xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#3A3D40]/15 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A3D40]/10 pb-4">
                <div>
                  <span className="bg-[#70360D] text-white text-xs font-black px-2.5 py-1 rounded">
                    Catálogo em JSON
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#2D3033] mt-2">
                    Catálogo dos Produtos em Ouro Preto ({products.length} itens)
                  </h2>
                  <p className="text-xs text-[#3A3D40]/80 mt-1">
                    Estrutura de dados exata utilizada pela Amazon (id, título longo descritivo, preço, nota de avaliação de 1 a 5, quantidade de reviews, selo_destaque).
                  </p>
                </div>

                <button
                  onClick={handleCopyP2}
                  className="bg-[#C59B27] hover:bg-[#b38a1f] text-[#1A1810] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow cursor-pointer"
                >
                  {copiedP2Json ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedP2Json ? 'JSON Copiado!' : 'Copiar Array JSON'}
                </button>
              </div>

              {/* Visual Display of Products */}
              <BestSellersGrid
                products={products}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setActiveTab('prompt3');
                }}
                onAddToCart={handleAddToCart}
                onEditProduct={handleOpenAdminWithProduct}
                isAdminLogged={isAdminLogged}
              />

              {/* Raw JSON Source */}
              <div className="pt-6 border-t border-[#3A3D40]/15 space-y-3">
                <h3 className="font-extrabold text-sm text-[#2D3033] flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-[#70360D]" />
                  Array JSON Formatado do Catálogo:
                </h3>
                <pre className="whitespace-pre-wrap break-all p-4 bg-[#141517] text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto border border-[#3A3D40]/30">
                  {JSON.stringify(
                    products.map(p => ({
                      id: p.id,
                      titulo: p.titulo,
                      preco: p.preco,
                      nota_avaliacao: p.nota_avaliacao,
                      quantidade_reviews: p.quantidade_reviews,
                      selo_destaque: p.selo_destaque,
                    })),
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB PROMPT 3: DEDICATED COPYWRITING & SEO SHOWCASE */}
        {activeTab === 'prompt3' && (
          <CopywritingSection
            product={selectedProduct || doceDeLeiteNozes}
            allProducts={products}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
            }}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onAddMultipleToCart={handleAddMultipleToCart}
          />
        )}

        {/* Newsletter: Notas da Estrada Real */}
        <EstradaRealNewsletter />
      </main>

      {/* Main Footer */}
      <footer className="bg-[#141517] text-white/70 py-10 px-4 text-xs font-sans border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <span className="font-bold text-white text-base block font-serif tracking-wide text-[#B8860B]">
                Mercado Colonial de Ouro Preto • Artesanato Autêntico de Minas Gerais
              </span>
              <p className="text-white/60 text-xs mt-1">
                Peças exclusivas produzidas à mão por mestres artesãos locais com entrega rápida para todo o Brasil.
              </p>
            </div>

            {/* Prominent Admin Access Button in Footer */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenAdminGeneral}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#B8860B] hover:bg-[#a67c0a] text-[#141517] hover:text-black font-black rounded-xl shadow-lg transition-all transform hover:scale-105 cursor-pointer text-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Acesso Artesão / Admin</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-4 text-white/50 text-[11px] pt-4 border-t border-white/10">
            <div className="flex flex-wrap gap-4">
              <span>IPHAN MG nº 842</span>
              <span>•</span>
              <span>Associação dos Artesãos de Ouro Preto</span>
              <span>•</span>
              <a href="#newsletter-estrada-real" className="text-[#E8C547] hover:underline">
                Inscrição: Notas da Estrada Real
              </a>
              <span>•</span>
              <span>Atendimento Prioritário</span>
            </div>
            <div>
              <span>© {new Date().getFullYear()} Mercado Ouro Preto Artesanal. Todos os direitos reservados.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetProducts={handleResetProducts}
        initialEditProduct={adminEditProduct}
        initialCreateNew={adminCreateNew}
      />

      {/* Shopping Cart Drawer Component */}
      <ShoppingCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        allProducts={products}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onToggleGiftWrap={handleToggleGiftWrap}
        onClearCart={() => setCartItems([])}
        onOpenOrders={() => setIsOrdersOpen(true)}
      />

      {/* Customer Orders & Live Tracking Modal */}
      <MyOrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        allProducts={products}
        onAddToCart={handleAddToCart}
        onSelectProduct={(id) => {
          const p = products.find((prod) => prod.id === id);
          if (p) {
            setSelectedProduct(p);
            setActiveTab('prompt3');
          }
        }}
      />
    </div>
  );
}

