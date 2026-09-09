import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowUpRight, ArrowRight, Heart, ShoppingBag, Search, X, Plus, Minus, Check, Sparkles, ChevronDown } from 'lucide-react';
import RootLayout from '../components/layout';
import Navbar from '../components/navbar';
import Hero from '../components/hero';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';

type Product = { id: number; name: string; kind: 'Perucas' | 'Tissagens'; type: string; price: number; length: string; image: string; position: string; description: string };
const products: Product[] = [
  { id: 1, name: 'Protagonista', kind: 'Perucas', type: 'Ondulados', price: 185, length: '22 polegadas', image: 'wigs', position: '0%', description: 'Ondas suaves e amplas para dar movimento ao dia a dia. Tom preto natural intenso, com risca ao meio.' },
  { id: 2, name: 'Corte Perfeito', kind: 'Perucas', type: 'Lisos', price: 125, length: '10 polegadas', image: 'wigs', position: '50%', description: 'Um corte curto e liso que emoldura o rosto. Uma silhueta elegante, prática e cheia de presença.' },
  { id: 3, name: 'Cachos de Sonho', kind: 'Perucas', type: 'Cacheados', price: 195, length: '20 polegadas', image: 'wigs', position: '100%', description: 'Cachos volumosos e definidos num tom chocolate profundo. Textura e personalidade para qualquer ocasião.' },
  { id: 4, name: 'Noite Fora', kind: 'Perucas', type: 'Lisos', price: 175, length: '24 polegadas', image: 'campaign', position: '100%', description: 'Cabelo longo e liso, com brilho e risca ao meio. O toque final para uma noite especial.' },
  { id: 5, name: 'Kit de Tissagens Onduladas', kind: 'Tissagens', type: 'Ondulados', price: 145, length: '18 / 20 / 22 polegadas', image: 'bundles', position: '50%', description: 'Kit de três tissagens onduladas (bundles) para aplicação costurada ou confeção de peruca. Este exemplo inclui comprimentos de 18, 20 e 22 polegadas; não inclui fecho nem frontal.' },
];
type BagItem = { id: number; quantity: number };
function readStored<T>(key: string, fallback: T): T { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; } }
function Modal({ title, children, onClose, wide = false }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); const original = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { dialog?.close(); document.body.style.overflow = original; }; }, []);
  return <dialog ref={ref} className={wide ? 'modal wide' : 'modal'} aria-label={title} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="modal-header"><h2>{title}</h2><button className="icon-button" aria-label="Fechar janela" onClick={onClose}><X /></button></div>{children}
  </dialog>;
}
function ProductPhoto({ product }: { product: Product }) { return <div className={'product-photo ' + product.image}><img src={'/images/' + product.image + '.png'} alt={product.name + ', ' + product.type.toLowerCase() + (product.kind === 'Tissagens' ? ' tissagens de cabelo' : ' peruca')} style={{ objectPosition: product.position + ' center' }} loading="lazy" width="512" height="680" /></div>; }
export default function App() {
  const [category, setCategory] = useState('Todos');
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [guide, setGuide] = useState(false);
  const [notice, setNotice] = useState('');
  const [checkout, setCheckout] = useState(false);
  const [favorites, setFavorites] = useState<number[]>(() => { const data = readStored<unknown>('hk-favorites', []); return Array.isArray(data) ? data.filter(x => typeof x === 'number' && products.some(p => p.id === x)) : []; });
  const [bag, setBag] = useState<BagItem[]>(() => { const data = readStored<unknown>('hk-bag', []); return Array.isArray(data) ? data.filter(x => x && products.some(p => p.id === x.id) && Number.isInteger(x.quantity) && x.quantity > 0 && x.quantity <= 20) : []; });
  useEffect(() => { try { localStorage.setItem('hk-bag', JSON.stringify(bag)); localStorage.setItem('hk-favorites', JSON.stringify(favorites)); } catch { /* Shopping still works when browser storage is unavailable. */ } }, [bag, favorites]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 3000); return () => clearTimeout(timer); }, [notice]);
  const count = bag.reduce((sum, item) => sum + item.quantity, 0);
  const total = bag.reduce((sum, item) => sum + products.find(p => p.id === item.id)!.price * item.quantity, 0);
  const visible = products.filter(p => (category === 'Todos' || category === p.kind || category === p.type || category === 'Favoritos' && favorites.includes(p.id)) && (p.name + ' ' + p.type + ' ' + p.kind).toLowerCase().includes(query.toLowerCase()));
  function browse(value = 'Todos') { setCategory(value); setQuery(''); setMenuOpen(false); document.getElementById('shop')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }
  function add(product: Product) { setBag(current => { const exists = current.find(item => item.id === product.id); return exists ? current.map(item => item.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, 20) } : item) : [...current, { id: product.id, quantity: 1 }]; }); setNotice(product.name + ' adicionado ao carrinho'); setCheckout(false); }
  function favorite(id: number) { setFavorites(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]); }
  function quantity(id: number, delta: number) { setBag(current => current.map(item => item.id === id ? { ...item, quantity: Math.min(item.quantity + delta, 20) } : item).filter(item => item.quantity > 0)); setCheckout(false); }
  return <RootLayout>
    <a className="skip-link" href="#main">Ir para o conteúdo</a>
    <div className="announcement">CABELO BONITO. BOA ENERGIA. A SUA ESSÊNCIA.</div>
    <Navbar count={count} favorites={favorites} menuOpen={menuOpen} setMenuOpen={setMenuOpen} setSearchOpen={setSearchOpen} setBagOpen={setBagOpen} browse={browse} />
    <main id="main">
      <Hero onShop={() => { setCategory('Todos'); setQuery(''); }} />
      <div className="values-strip"><span>Para todos os seus momentos</span><Sparkles aria-hidden="true" /><span>Um novo visual. Uma nova energia.</span><Sparkles aria-hidden="true" /><span>Encontre o seu estilo</span></div>
      <section id="shop" className="shop-section section-wrap" aria-labelledby="shop-title">
        <div className="section-heading"><div><h2 id="shop-title">Encontre o seu novo favorito.</h2><p>Perucas e tissagens. A sua textura, o seu comprimento, o seu estilo.</p></div><button className="text-link" onClick={() => browse()}>Ver todos os produtos<ArrowUpRight size={18} /></button></div>
        <div className="collection-toolbar"><div className="filters" aria-label="Filtrar produtos">{['Todos', 'Perucas', 'Tissagens', 'Ondulados', 'Lisos', 'Cacheados', 'Favoritos'].map(item => <button key={item} aria-pressed={category === item} className={category === item ? 'filter active' : 'filter'} onClick={() => { setCategory(item); setQuery(''); }}>{item}{item === 'Favoritos' && favorites.length > 0 ? ' (' + favorites.length + ')' : ''}</button>)}</div><span className="result-count" aria-live="polite">{visible.length} produtos</span></div>
        {searchOpen && <label className="search-field"><Search size={19} /><span className="sr-only">Pesquisar por estilo ou nome</span><input autoFocus placeholder="Pesquisar por estilo ou nome..." value={query} onChange={e => setQuery(e.target.value)} /><button className="icon-button" aria-label="Fechar pesquisa" onClick={() => { setSearchOpen(false); setQuery(''); }}><X size={18} /></button></label>}
        <div className="product-grid">{visible.map(product => <article className="product-card" key={product.id}>
          <div className="product-image-wrap"><button className="image-button" onClick={() => setSelected(product)} aria-label={'Ver ' + product.name}><ProductPhoto product={product} /></button><button className={'favorite ' + (favorites.includes(product.id) ? 'is-saved' : '')} aria-label={(favorites.includes(product.id) ? 'Retirar dos favoritos: ' : 'Guardar nos favoritos: ') + product.name} aria-pressed={favorites.includes(product.id)} onClick={() => favorite(product.id)}><Heart size={19} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} /></button></div>
          <div className="product-meta"><span>{product.kind} / {product.type}</span><span>{product.length}</span></div><div className="product-title-row"><button onClick={() => setSelected(product)}><h3>{product.name}</h3></button><span>${product.price}</span></div><button className="add-button" onClick={() => add(product)}>Adicionar ao carrinho<Plus size={17} /></button>
        </article>)}</div>
        {visible.length === 0 && <div className="empty-state"><ShoppingBag size={32} /><h3>{category === 'Favoritos' ? 'Os seus favoritos começam aqui.' : category === 'Croché' ? category + ' em breve.' : 'Nenhum produto encontrado.'}</h3><p>{category === 'Favoritos' ? 'Toque no coração de uma peruca ou de um kit de tissagens para guardar nos favoritos.' : 'Explore perucas e tissagens para encontrar o seu próximo visual.'}</p><button className="button primary" onClick={() => browse()}>Ver todos os produtos<ArrowRight size={18} /></button></div>}
        <p className="catalog-note">Coleção de demonstração. Imagens e preços ilustrativos; ainda não aceitamos encomendas.</p>
      </section>
      <section className="editorial section-wrap" id="about"><div className="editorial-image"><img src="/images/campaign.png" alt="Pormenor de cabelo ondulado e brilhante com risca lateral" width="700" height="750" loading="lazy" /></div><div className="editorial-copy"><span className="eyebrow">BEM-VINDA À HAIR KULTURE</span><h2>Mais que cabelo.<br />Uma nova atitude.</h2><p>A confiança de um novo penteado. A vontade de olhar outra vez ao espelho. Aquela sensação de estar no seu melhor.</p><p>A Hair Kulture é um espaço para experimentar novos visuais, expressar a sua personalidade e viver cada dia à sua maneira.</p><button className="text-link" onClick={() => setGuide(true)}>Descubra o seu cabelo ideal<ArrowUpRight size={19} /></button></div></section>
      <section className="care-section section-wrap" id="care"><h2>Um pouco de cuidado.<br />Mais dias de cabelo bonito.</h2><div className="faq-list">{[['Devo escolher uma peruca ou tissagens?', 'Escolha uma peruca para um penteado completo que pode colocar e retirar. As tissagens servem para aplicações costuradas ou perucas à medida. Um profissional pode ajudar a escolher comprimentos, fecho e frontal.'], ['Como cuidar das perucas e tissagens?', 'Desembarace suavemente das pontas para a raiz. Guarde as perucas num suporte e as tissagens organizadas. Siga as instruções do produto e confirme o tipo de fibra antes de lavar ou aplicar calor.'], ['Já posso fazer uma encomenda?', 'Esta loja está em demonstração. Pode explorar produtos, guardar favoritos e preparar o carrinho. Os pagamentos e o processamento de encomendas ainda não estão disponíveis.']].map(([q, a]) => <details key={q}><summary>{q}<ChevronDown size={20} /></summary><p>{a}</p></details>)}</div></section>
      <section className="closing section-wrap"><p>O seu próximo visual espera por si.</p><a className="button primary" href="#shop">Ver coleção<ArrowUpRight size={19} /></a></section>
    </main>
    <footer className="footer section-wrap"><div className="footer-top"><a className="wordmark" href="/">Hair Kulture<span>®</span></a><p>Cabelo bonito. À sua maneira.</p><div><a href="#shop">Loja</a><a href="#about">A nossa história</a><a href="#care">Cuidados e dúvidas</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Hair Kulture</span><span>Para cada versão de si.</span></div></footer>
    <div className={'toast ' + (notice ? 'visible' : '')} role="status">{notice && <><Check size={18} />{notice}<button onClick={() => { setBagOpen(true); setNotice(''); }}>Ver carrinho</button></>}</div>
    {selected && <Modal title={selected.name} onClose={() => setSelected(null)} wide><div className="product-detail"><ProductPhoto product={selected} /><div><p className="eyebrow">{selected.kind} / {selected.type} / {selected.length}</p><h3>${selected.price}</h3><p>{selected.description}</p><p className="catalog-note">Produto e preço de exemplo. As características finais serão confirmadas no lançamento da loja.</p><button className="button primary" onClick={() => { add(selected); setSelected(null); }}>Adicionar ao carrinho<Plus size={18} /></button></div></div></Modal>}
    {bagOpen && <Modal title={'O seu carrinho (' + count + ')'} onClose={() => setBagOpen(false)}>{bag.length === 0 ? <div className="empty-state"><ShoppingBag size={36} /><h3>Há espaço para um novo visual.</h3><p>Explore a coleção e adicione os seus favoritos.</p><button className="button primary" onClick={() => { setBagOpen(false); browse(); }}>Ver todos os produtos<ArrowRight size={18} /></button></div> : <><div className="bag-items">{bag.map(item => { const product = products.find(p => p.id === item.id)!; return <div className="bag-item" key={item.id}><ProductPhoto product={product} /><div><h3>{product.name}</h3><p>{product.kind} / {product.type} / {product.length}</p><div className="quantity"><button aria-label={'Diminuir quantidade de ' + product.name} onClick={() => quantity(item.id, -1)}><Minus size={15} /></button><span>{item.quantity}</span><button disabled={item.quantity >= 20} aria-label={'Aumentar quantidade de ' + product.name} onClick={() => quantity(item.id, 1)}><Plus size={15} /></button></div></div><strong>${product.price * item.quantity}</strong></div>; })}</div><div className="subtotal"><span>Subtotal</span><strong>${total}</strong></div><p className="catalog-note">Carrinho de demonstração. Não será cobrado qualquer valor.</p><button className="button primary full-width" onClick={() => setCheckout(true)}>Simular encomenda<ArrowRight size={18} /></button>{checkout && <p className="checkout-notice" role="status">O carrinho está pronto. O pagamento ainda não está disponível e nenhuma encomenda foi efetuada. As escolhas ficam guardadas neste dispositivo quando o armazenamento do navegador está disponível.</p>}</>}</Modal>}
    {guide && <Modal title="Descubra o seu cabelo ideal" onClose={() => setGuide(false)}><p className="guide-intro">Qual é o seu estilo no dia a dia?</p><div className="guide-options">{[['Ondulados', 'Movimento suave e um toque de glamour'], ['Lisos', 'Um visual liso e elegante'], ['Cacheados', 'Volume e muita personalidade']].map(([type, description]) => <button key={type} onClick={() => { setGuide(false); browse(type); }}><div><strong>{type}</strong><span>{description}</span></div><ArrowUpRight /></button>)}</div></Modal>}
  </RootLayout>;
}
