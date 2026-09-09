import { ArrowUpRight, Heart, ShoppingBag, Search, Menu, X } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

type NavbarProps = {
  count: number;
  favorites: number[];
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  setSearchOpen: Dispatch<SetStateAction<boolean>>;
  setBagOpen: Dispatch<SetStateAction<boolean>>;
  browse: (category?: string) => void;
};
export default function Navbar({ count, favorites, menuOpen, setMenuOpen, setSearchOpen, setBagOpen, browse }: NavbarProps) {
  return <>    <header className="header">
      <a className="wordmark" href="/" aria-label="Hair Kulture, início">Hair Kulture<span>®</span></a>
      <nav className="desktop-nav" aria-label="Navegação principal"><a href="/">Início</a><a href="/shop" onClick={e => { e.preventDefault(); browse(); }}>Loja</a><a href="/wigs" onClick={e => { e.preventDefault(); browse('Perucas'); }}>Perucas</a><a href="/bundles" onClick={e => { e.preventDefault(); browse('Tissagens'); }}>Tissagens</a><a href="/crochets" onClick={e => { e.preventDefault(); browse('Croché'); }}>Croché</a><a href="/about" onClick={e => { e.preventDefault(); document.getElementById('about')?.scrollIntoView(); }}>Sobre</a></nav>
      <div className="nav-actions"><button className="icon-button" aria-label="Pesquisar produtos" onClick={() => { setSearchOpen(x => !x); browse(); }}><Search /></button><button className="icon-button guardados-button" aria-label={'Ver favoritos, ' + favorites.length + ' guardados'} onClick={() => browse('Favoritos')}><Heart /></button><button className="bag-button" aria-label={'Abrir carrinho, ' + count + ' artigos'} onClick={() => setBagOpen(true)}><ShoppingBag /><span className="bag-count">{count}</span></button><button className="icon-button mobile-toggle" aria-label="Abrir ou fechar menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(x => !x)}>{menuOpen ? <X /> : <Menu />}</button></div>
    </header>
    {menuOpen && <nav className="mobile-nav" aria-label="Navegação móvel">{['Todos', 'Perucas', 'Tissagens', 'Ondulados', 'Lisos', 'Cacheados', 'Favoritos', 'Croché'].map(item => <button key={item} onClick={() => browse(item)}>{item}<ArrowUpRight /></button>)}</nav>}

  </>;
}
