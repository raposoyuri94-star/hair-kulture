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
        <span className="eyebrow">BEM-VINDA À HAIR KULTURE</span>
        <h1 id="about-title">Mais do que cabelo.<br />Uma nova atitude.</h1>
        <p>Sou a Kéllyn dos Santos Guirrugo, CEO e criadora da Hair Kulture. Criei esta marca com o desejo de ajudar cada pessoa a expressar a sua identidade e a sentir-se confiante através do seu cabelo.</p>
        <p>Na Hair Kulture, dedicamo-nos à venda de cabelo em Moçambique, com opções de half wigs, saias, closures e frontal laces. Queremos que encontre o comprimento, a textura e o estilo que combinam consigo.</p>
        <p>Mais do que um novo penteado, queremos fazer parte da confiança com que vive cada dia. O seu estilo, a sua essência, a sua Kulture.</p>
        <button className="text-link" onClick={onGuide}>Descubra o seu cabelo ideal<ArrowUpRight size={19} /></button>
      </div>
    </section>
  </div>;
}
