import { ArrowUpRight } from 'lucide-react';

export default function About({ onGuide }: { onGuide: () => void }) {
  return <div className="about-page">
    <section className="editorial section-wrap" id="about" aria-labelledby="about-title">
      <div className="editorial-image">
        <img src="/images/campaign.png" alt="Pormenor de cabelo ondulado e brilhante com risca lateral" width="700" height="750" loading="lazy" />
          <video
            className="editorial-video"
            src="/videos/kulture-cinematic.mp4"
            poster="/videos/kulture-cinematic-poster.jpg"
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
      </div>
      <div className="editorial-copy">
        {/* Add or edit your brand story in the paragraphs below. */}
        <span className="eyebrow">BEM-VINDA À HAIR KULTURE</span>
        <h1 id="about-title">Mais do que cabelo.<br />Uma nova atitude.</h1>
        <p>A confiança de um novo penteado. A vontade de olhar outra vez ao espelho. Aquela sensação de estar no seu melhor.</p>
        <p>A Hair Kulture é um espaço para experimentar novos penteados, expressar a sua personalidade e viver cada dia à sua maneira.</p>
        <button className="text-link" onClick={onGuide}>Descubra o seu cabelo ideal<ArrowUpRight size={19} /></button>
      </div>
    </section>
  </div>;
}
