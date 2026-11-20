import { siteUrl, sitePath } from '../src/urls';
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
      <a className="wordmark" href={siteUrl('/')} aria-label="Hair Kulture, início">Hair Kulture<span>®</span></a>
      <nav className="desktop-nav" aria-label="Navegação principal"><a href={siteUrl('/')}>Início</a><a href={siteUrl('/shop')} onClick={e => { e.preventDefault(); browse(); }}>Loja</a><a href={siteUrl('/wigs')} onClick={e => { e.preventDefault(); browse('Half Wigs'); }}>Half Wigs</a><a href={siteUrl('/bundles')} onClick={e => { e.preventDefault(); browse('Saias'); }}>Saias</a><a href={siteUrl('/laces')} onClick={e => { e.preventDefault(); browse('Closure / Frontal Laces'); }}>Laces</a><a href={siteUrl('/gallery')} aria-current={/^\/gallery\/?$/.test(sitePath()) ? 'page' : undefined}>Galeria</a><a href={siteUrl('/about')} aria-current={/^\/about\/?$/.test(sitePath()) ? 'page' : undefined}>Sobre</a></nav>
      <div className="nav-actions"><button className="icon-button" aria-label="Pesquisar produtos" onClick={() => { if (/^\/(about|gallery)\/?$/.test(sitePath())) { window.location.assign(siteUrl('/?search=1#shop')); return; } setSearchOpen(x => !x); browse(); }}><Search /></button><button className="icon-button saved-button" aria-label={'Ver favoritos, ' + favorites.length + ' guardados'} onClick={() => browse('Favoritos')}><Heart /></button><button className="bag-button" aria-label={'Abrir carrinho, ' + count + ' artigos'} onClick={() => setBagOpen(true)}><ShoppingBag /><span className="bag-count">{count}</span></button><button className="icon-button mobile-toggle" aria-label="Abrir ou fechar menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(x => !x)}>{menuOpen ? <X /> : <Menu />}</button></div>

    {menuOpen && <nav className="mobile-nav" aria-label="Navegação móvel">{['Todos', 'Half Wigs', 'Saias', 'Closure / Frontal Laces', 'Favoritos'].map(item => <button key={item} onClick={() => browse(item)}>{item}<ArrowUpRight /></button>)}<a href={siteUrl('/gallery')}>Galeria<ArrowUpRight /></a><a href={siteUrl('/about')}>Sobre<ArrowUpRight /></a></nav>}

    </header>
  </>;
}
