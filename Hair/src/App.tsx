import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowUpRight, ArrowRight, Heart, ShoppingBag, Search, X, Plus, Minus, Check, Sparkles, ChevronDown } from 'lucide-react';
import RootLayout from '../components/layout';
import Navbar from '../components/navbar';
import Hero from '../components/hero';
import PriceSelector from '../components/price-selector';
import { getHairPrice, priceLists } from './prices';
import { catalog, money, restoreBag, variantKey } from './catalog';
import type { BagItem } from './catalog';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';

function readStored(key: string): unknown { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } }
function Modal({ title, children, onClose, wide = false }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); const original = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { dialog?.close(); document.body.style.overflow = original; }; }, []);
  return <dialog ref={ref} className={wide ? 'modal wide' : 'modal'} aria-label={title} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="modal-header"><h2>{title}</h2><button className="icon-button" aria-label="Fechar janela" onClick={onClose}><X /></button></div>{children}
  </dialog>;
}
function ProductPhoto({ category }: { category: number }) {
  const item = catalog[category];
  return <div className={'product-photo ' + item.photoClass}><img src={item.image} alt={item.name + ' — imagem ilustrativa'} loading="lazy" width="512" height="680" /></div>;
}
export default function App() {
  const [category, setCategory] = useState('Todos');
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [guide, setGuide] = useState(false);
  const [notice, setNotice] = useState('');
  const [checkout, setCheckout] = useState(false);
  const [favorites, setFavorites] = useState<number[]>(() => { const value = readStored('hk-category-favorites'); return Array.isArray(value) ? value.filter(id => Number.isInteger(id) && catalog.some(item => item.id === id)) : []; });
  const [bag, setBag] = useState<BagItem[]>(() => restoreBag(readStored('hk-variant-bag')));
  useEffect(() => { try { localStorage.setItem('hk-variant-bag', JSON.stringify(bag)); localStorage.setItem('hk-category-favorites', JSON.stringify(favorites)); } catch { /* Storage may be unavailable. */ } }, [bag, favorites]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 3000); return () => clearTimeout(timer); }, [notice]);
  const count = bag.reduce((sum, item) => sum + item.quantity, 0);
  const total = bag.reduce((sum, item) => sum + getHairPrice(item.category, item.length, item.option)! * item.quantity, 0);
  const visible = catalog.filter(item => (category === 'Todos' || category === item.name || category === 'Favoritos' && favorites.includes(item.id)) && (item.name + ' ' + item.description).toLocaleLowerCase('pt-MZ').includes(query.toLocaleLowerCase('pt-MZ')));
  function browse(value = 'Todos') {
    setCategory(value); setQuery(''); setMenuOpen(false);
    document.getElementById('shop')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  function add(category: number, length: number, option: number) {
    if (getHairPrice(category, length, option) === null) return;
    const variant = { category, length, option };
    setBag(current => {
      const exists = current.some(item => variantKey(item) === variantKey(variant));
      return exists ? current.map(item => variantKey(item) === variantKey(variant) ? { ...item, quantity: Math.min(item.quantity + 1, 20) } : item) : [...current, { ...variant, quantity: 1 }];
    });
    setSelected(null); setNotice(catalog[category].name + ' adicionado ao carrinho'); setCheckout(false);
  }
  function favorite(id: number) { setFavorites(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]); }
  function quantity(key: string, delta: number) { setBag(current => current.map(item => variantKey(item) === key ? { ...item, quantity: Math.min(item.quantity + delta, 20) } : item).filter(item => item.quantity > 0)); setCheckout(false); }
  return <RootLayout>
    <a className="skip-link" href="#main">Ir para o conteúdo</a>
    <div className="announcement">CABELO BONITO. BOA ENERGIA. A SUA ESSÊNCIA.</div>
    <Navbar count={count} favorites={favorites} menuOpen={menuOpen} setMenuOpen={setMenuOpen} setSearchOpen={setSearchOpen} setBagOpen={setBagOpen} browse={browse} />
    <main id="main">
      <Hero onShop={() => { setCategory('Todos'); setQuery(''); }} />
      <div className="values-strip"><span>Para todos os seus momentos</span><Sparkles aria-hidden="true" /><span>Um novo penteado. Uma nova energia.</span><Sparkles aria-hidden="true" /><span>Encontre o seu estilo</span></div>
      <section id="shop" className="shop-section section-wrap" aria-labelledby="shop-title">
        <div className="section-heading"><div><h2 id="shop-title">Encontre o seu novo favorito.</h2><p>Escolha o tipo de cabelo. Depois, seleccione o comprimento e adicione ao carrinho.</p></div><button className="text-link" onClick={() => browse()}>Ver todos os produtos<ArrowUpRight size={18} /></button></div>
        <div className="collection-toolbar"><div className="filters" aria-label="Filtrar produtos">{['Todos', ...catalog.map(item => item.name), 'Favoritos'].map(item => <button key={item} aria-pressed={category === item} className={category === item ? 'filter active' : 'filter'} onClick={() => { setCategory(item); setQuery(''); }}>{item}{item === 'Favoritos' && favorites.length > 0 ? ' (' + favorites.length + ')' : ''}</button>)}</div><span className="result-count" aria-live="polite">{visible.length} {visible.length === 1 ? 'tipo de cabelo' : 'tipos de cabelo'}</span></div>
        {searchOpen && <label className="search-field"><Search size={19} /><span className="sr-only">Pesquisar por tipo de cabelo</span><input autoFocus placeholder="Pesquisar por tipo de cabelo..." value={query} onChange={e => setQuery(e.target.value)} /><button className="icon-button" aria-label="Fechar pesquisa" onClick={() => { setSearchOpen(false); setQuery(''); }}><X size={18} /></button></label>}
        <div className="product-grid hair-categories">{visible.map(item => <article className="product-card" key={item.id}>
          <div className="product-image-wrap"><button className="image-button" onClick={() => setSelected(item.id)} aria-label={'Escolher ' + item.name}><ProductPhoto category={item.id} /></button><button className={'favorite ' + (favorites.includes(item.id) ? 'is-saved' : '')} aria-label={(favorites.includes(item.id) ? 'Retirar dos favoritos: ' : 'Guardar nos favoritos: ') + item.name} aria-pressed={favorites.includes(item.id)} onClick={() => favorite(item.id)}><Heart size={19} fill={favorites.includes(item.id) ? 'currentColor' : 'none'} /></button></div>
          <div className="product-title-row"><button onClick={() => setSelected(item.id)}><h3>{item.name}</h3></button></div><p className="category-description">{item.description}</p><p className="category-starting">A partir de {money(item.startingPrice)}</p>
        </article>)}</div>
        {visible.length === 0 && <div className="empty-state"><ShoppingBag size={32} /><h3>{category === 'Favoritos' ? 'Os seus favoritos começam aqui.' : 'Nenhum produto encontrado.'}</h3><p>Explore os três tipos de cabelo e escolha o seu favorito.</p><button className="button primary" onClick={() => browse()}>Ver todos os produtos<ArrowRight size={18} /></button></div>}
      </section>
      <section className="editorial section-wrap" id="about"><div className="editorial-image"><img src="/images/campaign.png" alt="Pormenor de cabelo ondulado e brilhante com risca lateral" width="700" height="750" loading="lazy" />
          <video
            className="editorial-video"
            src="/videos/hero-enhanced.mp4"
            poster="/videos/hero-enhanced-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            preload="auto"
            aria-label="Vídeo da coleção Hair Kulture"
            onError={(event) => { event.currentTarget.hidden = true; }}
          />
        </div><div className="editorial-copy"><span className="eyebrow">BEM-VINDA À HAIR KULTURE</span><h2>Mais do que cabelo.<br />Uma nova atitude.</h2><p>A confiança de um novo penteado. A vontade de olhar outra vez ao espelho. Aquela sensação de estar no seu melhor.</p><p>A Hair Kulture é um espaço para experimentar novos penteados, expressar a sua personalidade e viver cada dia à sua maneira.</p><button className="text-link" onClick={() => setGuide(true)}>Descubra o seu cabelo ideal<ArrowUpRight size={19} /></button></div></section>
      <section className="care-section section-wrap" id="care"><h2>Um pouco de cuidado.<br />Mais dias de cabelo bonito.</h2><div className="faq-list">{[['Devo escolher uma peruca ou tissagens?', 'Escolha uma peruca para um penteado completo que pode colocar e retirar. As tissagens servem para aplicações costuradas ou perucas à medida. Um profissional pode ajudar a escolher comprimentos, fecho e frontal.'], ['Como cuidar das perucas e tissagens?', 'Desembarace suavemente das pontas para a raiz. Guarde as perucas num suporte e as tissagens organizadas. Siga as instruções do produto e confirme o tipo de fibra antes de lavar ou aplicar calor.'], ['Já posso fazer uma encomenda?', 'Esta loja está em demonstração. Pode explorar produtos, guardar favoritos e preparar o carrinho. Os pagamentos e o processamento de encomendas ainda não estão disponíveis.']].map(([q, a]) => <details key={q}><summary>{q}<ChevronDown size={20} /></summary><p>{a}</p></details>)}</div></section>
      <section className="closing section-wrap"><p>O seu próximo visual espera por si.</p><a className="button primary" href="#shop">Ver coleção<ArrowUpRight size={19} /></a></section>
    </main>
    <footer className="footer section-wrap"><div className="footer-top"><a className="wordmark" href="/">Hair Kulture<span>®</span></a><p>Cabelo bonito. À sua maneira. Em Moçambique.</p><div><a href="#shop">Loja</a><a href="#about">A nossa história</a><a href="#care">Cuidados e dúvidas</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Hair Kulture</span><span>Para cada versão de si.</span></div></footer>

    <div className={'toast ' + (notice ? 'visible' : '')} role="status">{notice && <><Check size={18} />{notice}<button onClick={() => { setBagOpen(true); setNotice(''); }}>Ver carrinho</button></>}</div>
    {selected !== null && <Modal title={catalog[selected].name} onClose={() => setSelected(null)} wide><div className="product-detail"><ProductPhoto category={selected} /><PriceSelector key={selected} category={selected} onAdd={(length, option) => add(selected, length, option)} /></div></Modal>}
    {bagOpen && <Modal title={'O seu carrinho (' + count + ')'} onClose={() => setBagOpen(false)}>{bag.length === 0 ? <div className="empty-state"><ShoppingBag size={36} /><h3>Há espaço para um novo visual.</h3><p>Escolha o seu cabelo e o comprimento para começar.</p><button className="button primary" onClick={() => { setBagOpen(false); browse(); }}>Ver todos os produtos<ArrowRight size={18} /></button></div> : <><div className="bag-items">{bag.map(item => {
      const list = priceLists[item.category];
      const key = variantKey(item);
      return <div className="bag-item" key={key}><ProductPhoto category={item.category} /><div><h3>{list.name}</h3><p>{item.length} polegadas · {list.options[item.option]}</p><p>{money(getHairPrice(item.category, item.length, item.option)!)} por {item.category === 1 ? 'conjunto de 2 saias' : 'unidade'}</p><div className="quantity"><button aria-label={'Diminuir quantidade de ' + list.name + ' ' + item.length + ' ' + list.options[item.option]} onClick={() => quantity(key, -1)}><Minus size={15} /></button><span>{item.quantity}</span><button disabled={item.quantity >= 20} aria-label={'Aumentar quantidade de ' + list.name + ' ' + item.length + ' ' + list.options[item.option]} onClick={() => quantity(key, 1)}><Plus size={15} /></button></div></div><strong>{money(getHairPrice(item.category, item.length, item.option)! * item.quantity)}</strong></div>;
    })}</div><div className="subtotal"><span>Subtotal</span><strong>{money(total)}</strong></div><p className="catalog-note">Não será cobrado qualquer valor nesta página.</p><button className="button primary full-width" onClick={() => setCheckout(true)}>Simular encomenda<ArrowRight size={18} /></button>{checkout && <p className="checkout-notice" role="status">O carrinho está pronto. O pagamento ainda não está disponível e nenhuma encomenda foi efectuada. As escolhas ficam guardadas neste dispositivo quando o armazenamento do navegador está disponível.</p>}</>}</Modal>}
    {guide && <Modal title="Descubra o seu cabelo ideal" onClose={() => setGuide(false)}><p className="guide-intro">Que tipo de cabelo procura?</p><div className="guide-options">{catalog.map(item => <button key={item.id} onClick={() => { setGuide(false); browse(item.name); }}><div><strong>{item.name}</strong><span>{item.description}</span></div><ArrowUpRight /></button>)}</div></Modal>}
  </RootLayout>;
}
