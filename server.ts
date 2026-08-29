import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client safely
  let ai: GoogleGenAI | null = null;
  const getAi = () => {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      }
    }
    return ai;
  };

  // Healthcheck endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI Copywriting Generator Endpoint
  app.post('/api/generate-copy', async (req, res) => {
    try {
      const { productName, productCategory, targetAudience } = req.body;
      const client = getAi();

      if (!client) {
        return res.status(503).json({
          error: 'Chave de API do Gemini não configurada no ambiente.',
        });
      }

      const prompt = `Você é um Copywriter especialista da Amazon Brasil especializado em artesanato tradicional de Ouro Preto e Minas Gerais.
Crie o conteúdo completo de produto para o seguinte item artesanal:
Nome do Produto: "${productName || 'Panela de Pedra-Sabão de Ouro Preto'}"
Categoria: "${productCategory || 'Artesanato em Pedra-Sabão'}"
Público Alvo: "${targetAudience || 'Apreciadores da culinária mineira e artes decorativas'}"

Siga estritamente a estrutura Amazon Brasil:
1. "bulletPoints": exatamente 5 tópicos em marcadores. Cada marcador deve começar com 1 emoji e um TÍTULO EM CAIXA ALTA destacando o benefício ou característica tradicional de Ouro Preto.
2. "description": uma descrição persuasiva de 2 a 3 parágrafos focada em SEO (palavras-chave: Ouro Preto, artesanato mineiro, tradição barroca, feito à mão, culinária mineira) destacando o processo de fabricação artesanal.
3. "seoKeywords": array com 6 a 8 palavras-chave relevantes.
4. "suggestedPrice": preço sugerido em BRL (número).
5. "tagline": frase curta de destaque para a caixa de compra.`;

      const response = await client.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              bulletPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '5 bullet points estilo Amazon com emoji e título em caixa alta',
              },
              description: {
                type: Type.STRING,
                description: 'Descrição longa persuasiva focada em SEO e tradição mineira',
              },
              seoKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              suggestedPrice: {
                type: Type.NUMBER,
              },
              tagline: {
                type: Type.STRING,
              },
            },
            required: ['bulletPoints', 'description', 'seoKeywords', 'suggestedPrice', 'tagline'],
          },
        },
      });

      const jsonText = response.text || '{}';
      const data = JSON.parse(jsonText);
      res.json({ success: true, data });
    } catch (err: any) {
      console.error('Erro ao gerar copy com Gemini:', err);
      res.status(500).json({ success: false, error: err.message || 'Erro interno ao gerar cópia.' });
    }
  });

  // AI Customer Testimonials Generator Endpoint
  app.post('/api/generate-testimonials', async (req, res) => {
    try {
      const { productName, productCategory, targetAudience, tone, count = 3 } = req.body;
      const client = getAi();

      if (!client) {
        return res.status(503).json({
          error: 'Chave de API do Gemini não configurada no ambiente.',
        });
      }

      const prompt = `Você é um gerador de depoimentos e avaliações autênticas de clientes e compradores verificados para a loja de e-commerce "Mercado Colonial de Ouro Preto - Artesanato de Minas Gerais".
Gere exatamente ${count} depoimentos realistas, calorosos e convincentes de clientes brasileiros que compraram artesanato autêntico.

Contexto do Produto:
- Nome do Produto: "${productName || 'Panela de Pedra-Sabão Tradicional 3L'}"
- Categoria: "${productCategory || 'Pedra-Sabão & Culinária Colonial'}"
- Perfil do Comprador / Tom: "${tone || targetAudience || 'Apreciador da culinária mineira, turistas e entusiastas de decoração'}"

Diretrizes para os depoimentos:
1. Cada depoimento deve parecer 100% autêntico e humano, mencionando detalhes reais como: embalagem reforçada (com plástico bolha e caixa segura), o processo de cura da pedra-sabão, o sabor incomparável da comida ou o requinte da peça barroca, o tempo de entrega para estados como SP, RJ, PR, MG, DF, RS, etc., e o atendimento caloroso mineiro.
2. Inclua o nome completo, cidade e estado do cliente (ex: "Juliana Mendes Ferreira - São Paulo, SP", "Chef Marcelo Albuquerque - Belo Horizonte, MG", "Renata Vasconcelos - Niterói, RJ").
3. Nota de 4.8 a 5.0 estrelas.
4. Título curto e chamativo para o review (estilo Amazon).
5. 2 a 3 tags/destaques de avaliação (ex: "Embalagem Impecável", "Cura Fácil", "Sabor Sem Igual", "Entrega Rápida", "Peça de Museu").`;

      const response = await client.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallSummary: {
                type: Type.STRING,
                description: 'Resumo geral do sentimento dos clientes sobre o produto (1 frase)',
              },
              averageRating: {
                type: Type.NUMBER,
                description: 'Média de avaliação calculada (ex: 4.9)',
              },
              testimonials: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    customerName: { type: Type.STRING },
                    cityState: { type: Type.STRING },
                    productPurchased: { type: Type.STRING },
                    rating: { type: Type.NUMBER },
                    date: { type: Type.STRING },
                    title: { type: Type.STRING },
                    comment: { type: Type.STRING },
                    verifiedPurchase: { type: Type.BOOLEAN },
                    tags: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    helpfulCount: { type: Type.INTEGER },
                    artisanOrCategoryMentioned: { type: Type.STRING },
                  },
                  required: [
                    'customerName',
                    'cityState',
                    'productPurchased',
                    'rating',
                    'date',
                    'title',
                    'comment',
                    'verifiedPurchase',
                    'tags',
                    'helpfulCount',
                  ],
                },
              },
            },
            required: ['overallSummary', 'averageRating', 'testimonials'],
          },
        },
      });

      const jsonText = response.text || '{}';
      const data = JSON.parse(jsonText);
      res.json({ success: true, data });
    } catch (err: any) {
      console.error('Erro ao gerar depoimentos com Gemini:', err);
      res.status(500).json({ success: false, error: err.message || 'Erro interno ao gerar depoimentos.' });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Ouro Preto Mercado Colonial rodando na porta ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Erro ao iniciar o servidor:', err);
});
