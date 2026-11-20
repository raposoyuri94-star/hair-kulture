import { useState } from 'react';
import { getHairPrice, priceLists } from '../src/prices';

const money = new Intl.NumberFormat('pt-MZ', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function PriceSelector({ category, onAdd }: { category: number; onAdd: (length: number, option: number) => void }) {
  const [length, setLength] = useState(10);
  const [option, setOption] = useState(0);
  const list = priceLists[category];
  const price = getHairPrice(category, length, option);

  return <div className="product-options">
    <div className="price-config">
      <div className="price-fields">
        <label>Comprimento<select aria-label="Comprimento" value={length} onChange={e => setLength(Number(e.target.value))}>{list.lengths.map(value => <option key={value} value={value}>{value} polegadas</option>)}</select></label>
        <label>{list.optionLabel}<select aria-label={list.optionLabel} value={option} onChange={e => setOption(Number(e.target.value))}>{list.options.map((value, i) => <option key={value} value={i}>{value}</option>)}</select></label>
      </div>
      <div className="price-result" role="status" aria-live="polite" aria-atomic="true">
        <span>{list.name} · {length}″ · {list.options[option]}</span>
        <strong>{price === null ? 'Preço indisponível' : `${money.format(price)} MT`}</strong>
        <p>{price === null ? 'Esta combinação não tem preço na tabela. Escolha outro comprimento ou acabamento.' : list.note}</p>
      </div>
      {category !== 2 && <p className="price-delivery">Prazo de chegada indicado: 10 dias úteis.</p>}
      <button className="button primary full-width configure-add" disabled={price === null} onClick={() => { if (price !== null) onAdd(length, option); }}>Adicionar ao carrinho</button>
    </div>
  </div>;
}
