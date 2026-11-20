# Kulture — A tua essência. Em cada fio.

Campanha original de tissagens/bundles em português para **@hairkulture.mz**, com o logótipo fornecido e a sua paleta de rosa antigo.

## Ficheiros prontos a usar

- `video/kulture-campaign-1080x1920.mp4`: filme vertical de 18 segundos, 1080 × 1920, 30 fps, H.264 + áudio AAC. Movimento de câmara simulado sobre imagens, abertura de papel animada, transições suaves e banda sonora instrumental original.
- `instagram/01-volume.png`: post 1080 × 1350.
- `instagram/02-assinatura.png`: post 1080 × 1350.
- `instagram/03-presenca.png`: post 1080 × 1350.
- `instagram/04-capa-reel.png`: capa vertical 1080 × 1920.
- `instagram/preview.png`: vista conjunta dos três posts, para revisão.
- `video/storyboard.jpg`: sequência de imagens extraídas do MP4 final.
- `legendas.md`: legendas em português e textos alternativos.

## Direcção criativa

Versão com preços: `video/kulture-campaign-prices-1080x1920.mp4` (24 segundos). Abertura directa com três planos de cabelo sincronizados com “Volume / Textura / Kulture”, seguida dos planos de tissagens e da marca. A tabela de preços fica estática entre 14 e 24 segundos. Os 24 valores em MT foram transcritos da imagem fornecida para `assets/prices.json`, mantendo a condição de 2 saias e o prazo de 10 dias úteis. O contacto usado é @hairkulture.mz, conforme indicado na conversa. Exportar com `python campaign/source/score.py --prices` e `node campaign/source/render.mjs --prices`. A tabela também está disponível em `video/kulture-price-end-card.png`.

Versão com revelação de luz: `video/kulture-campaign-light-reveal-1080x1920.mp4`. Uma curva de luz rosa percorre um plano de cabelo; um flash suave e uma abertura luminosa revelam o logótipo, seguidos de um reflexo de estúdio sobre a marca. Mantém apenas imagens de cabelo no filme e usa novos efeitos sonoros de ar e brilho. Exportar com `python campaign/source/score.py --light-reveal` e `node campaign/source/render.mjs --light-reveal`.

Versão adicional só com cabelo: `video/kulture-campaign-hair-only-1080x1920.mp4`. Substitui o retrato entre 11,3 e 14,2 segundos por um plano aproximado das tissagens, mantendo o texto, o logótipo e a banda sonora. Exportar com `node campaign/source/render.mjs --hair-only`. A versão original e os posts mantêm-se disponíveis.

A referência de vídeo inspirou o gesto de rasgar papel para revelar a marca. A execução é uma animação original: abertura em rosa antigo, revelação do logótipo, planos aproximados de tissagens e ondas, retrato editorial e assinatura final. Não foi reutilizada a marca nem o áudio do vídeo de referência.

O logótipo original foi composto directamente nos materiais, sem ser redesenhado. As três fotografias foram criadas com a ferramenta integrada image_gen; representam o conceito da campanha, não fotografias verificadas dos produtos reais. A música e os efeitos foram sintetizados especificamente para este filme. Não foram acrescentados preços, contactos inventados nem afirmações sobre origem ou qualidade do cabelo.

## Guião do filme

| Tempo | Plano e texto |
| --- | --- |
| 0–1,35 s | Papel rosa: “A tua próxima assinatura.” |
| 1,35–4,7 s | Abertura do papel e revelação do logótipo original |
| 4,7–8,5 s | Tissagens, aproximação suave: “Volume que se sente.” |
| 8,5–11,3 s | Pormenor das ondas: “Ondas com presença.” |
| 11,3–14,2 s | Retrato: “O teu look. A tua assinatura.” |
| 14,2–18 s | Marca: “A tua essência. Em cada fio.” / @hairkulture.mz |

## Editar e voltar a exportar

Os ficheiros `source/creative.html` e `source/render.mjs` contêm a composição e a exportação. `source/score.py` contém a música original. `source/prompts.md` regista os prompts finais e o modo de geração. `assets/` guarda as imagens e o logótipo original.

Requer Node.js, as dependências existentes em `Hair/node_modules`, Microsoft Edge e FFmpeg (no PATH, via `imageio_ffmpeg` do Python ou indicado em `KULTURE_FFMPEG`). A tipografia usa Garamond instalada no Windows e Outfit do projecto.

Na raiz do projecto:

```sh
python campaign/source/score.py
node campaign/source/render.mjs
```

Para exportar apenas os posts e a capa:

```sh
node campaign/source/render.mjs --stills-only
```

Os ficheiros da loja existente não foram alterados. Os materiais estão nesta pasta; nenhum foi publicado no Instagram.
