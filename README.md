# Hair Kulture

Loja de demonstração em português para perucas e tissagens, com tema rosa e branco.

## Executar localmente

Requisitos: Node.js 22.12 ou superior e npm.

```sh
npm ci
npm --prefix Hair ci
npm run dev
```

Abra o endereço indicado pelo Vite no terminal.

## Compilar

```sh
npm run build
npm run preview
```

A aplicação compilada fica em `Hair/dist`.

## Estrutura

- `Hair/src/App.tsx`: catálogo, filtros, favoritos e carrinho.
- `Hair/components/`: navegação, secção principal e layout.
- `Hair/src/style.css`: estilos e adaptação a dispositivos móveis.
- `Hair/public/images/`: imagens geradas para a demonstração.
- `Hair/tests/storefront.mjs`: verificações com Playwright e Microsoft Edge.

## Testes no navegador

Com o servidor de desenvolvimento em execução:

```sh
cd Hair
node tests/storefront.mjs
```

O teste usa `http://localhost:5176/`; ajuste o endereço no ficheiro se o Vite indicar outra porta. Requer Microsoft Edge instalado.

## Estado da loja

Os produtos, fotografias e preços são ilustrativos. Favoritos e carrinho usam o armazenamento local do navegador. Não existe processamento de pagamentos nem envio de encomendas.

## Vercel

Importe este repositório e mantenha a Root Directory na raiz do repositório (`.`).
O ficheiro `vercel.json` instala as dependências em `Hair`, executa a compilação
 e publica `Hair/dist`. As rotas da aplicação são encaminhadas para `index.html`.
