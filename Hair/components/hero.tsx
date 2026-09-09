import { ArrowUpRight } from 'lucide-react';

export default function Hero({ onShop }: { onShop: () => void }) {
  return (
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy"><span className="eyebrow">O SEU PRÓXIMO CABELO FAVORITO</span><h1 id="hero-title">Seu cabelo.<br /><span>Suas regras.</span></h1><p>Perucas e tissagens para cada versão de si.<br />Encontre a sua textura. Crie o seu estilo.</p><a className="button primary" href="#shop" onClick={onShop}>Ver coleção<ArrowUpRight size={19} /></a></div>
        <div className="hero-visual"><img src="/images/campaign.png" alt="Duas mulheres com perucas longas, uma ondulada e outra lisa, num cenário de estúdio rosa" width="1536" height="1024" fetchPriority="high" /></div>
      </section>
  );
}
