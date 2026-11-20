import { siteUrl } from '../src/urls';
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const photos = [
  { src: siteUrl('/images/campaign.png'), title: 'O seu estilo, a sua Kulture', alt: 'Duas mulheres com cabelo longo, liso e ondulado, num cenário rosa.' },
  { src: siteUrl('/images/wigs.png'), title: 'Texturas com personalidade', alt: 'Selecção de perucas com diferentes cortes e texturas.' },
  { src: siteUrl('/images/bundles.png'), title: 'Movimento em cada fio', alt: 'Tissagens de cabelo apresentadas em conjuntos.' },
];

const videos = [
  { file: 'gallery-enhanced-1.mp4', poster: siteUrl('/videos/gallery-enhanced-1-poster.jpg'), title: 'Comprimento e movimento' },
  { file: 'gallery-enhanced-2.mp4', poster: siteUrl('/videos/gallery-enhanced-2-poster.jpg'), title: 'Volume com personalidade' },
  { file: 'gallery-enhanced-3.mp4', poster: siteUrl('/videos/gallery-enhanced-3-poster.jpg'), title: 'Caracóis em destaque' },
];

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (selected === null) return;
    const element = dialog.current;
    const trigger = document.activeElement as HTMLElement | null;
    element?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = previous; trigger?.focus(); };
  }, [selected]);

  return <section className="gallery-page section-wrap" aria-labelledby="gallery-title">
    <div className="gallery-heading">
      <div><span className="eyebrow">HAIR KULTURE</span><h1 id="gallery-title">Galeria</h1></div>
      <p>Texturas, movimento e inspiração para o seu próximo penteado. Encontre um estilo que seja seu.</p>
    </div>
    <div className="gallery-videos">{videos.map(video => <figure key={video.file}>
      <video src={siteUrl('/videos/' + video.file)} poster={video.poster} aria-label={video.title} autoPlay muted loop playsInline disablePictureInPicture disableRemotePlayback preload="auto" />
      <figcaption>{video.title}</figcaption>
    </figure>)}</div>
    <h2 className="gallery-photos-title">Inspiração da marca</h2>
    <div className="gallery-grid">{photos.map((photo, index) => <figure key={photo.src}>
      <button className="gallery-photo" aria-label={'Ampliar: ' + photo.title} onClick={() => setSelected(index)}>
        <img src={photo.src} alt={photo.alt} loading={index === 0 ? 'eager' : 'lazy'} />
      </button>
      <figcaption>{photo.title}</figcaption>
    </figure>)}</div>
    <p className="catalog-note">Imagens ilustrativas da marca.</p>
    {selected !== null && <dialog ref={dialog} className="gallery-lightbox" aria-label={photos[selected].title} onCancel={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) setSelected(null); }}>
      <button className="icon-button" aria-label="Fechar imagem" onClick={() => setSelected(null)}><X /></button>
      <img src={photos[selected].src} alt={photos[selected].alt} />
      <p>{photos[selected].title}</p>
    </dialog>}
  </section>;
}
