# Proposta Comercial · Avyxyva Marketing Digital

App de apresentação de proposta para chácaras de locação em Socorro/SP.
Site estático, sem build e sem dependências externas em tempo de execução.

## Como funciona

1. **Abertura** com a identidade visual da Avyxyva.
2. **Quiz de 3 perguntas** que engaja e personaliza a leitura apresentada em seguida.
3. **Proposta em telas**, navegada por setas, pontos, teclado ou gesto. A página nunca rola.
4. **CTA final** que gera e baixa a proposta em **PDF de uma página**, montada no navegador
   com jsPDF e a fonte Poppins embutida no documento.

Os valores não aparecem na tela do app: eles vivem apenas no PDF.

## Estrutura

```
index.html
assets/
  css/style.css
  js/app.js              telas, quiz e navegação
  js/pdf.js              montagem do PDF de uma página
  js/logo-b64.js         logo em base64 para o PDF
  js/fonts/poppins-b64.js  Poppins embutida no PDF
  js/vendor/jspdf.umd.min.js
  webfonts/              Poppins para a interface
  img/                   logo e favicon
netlify.toml
```

Os arquivos pesados (`poppins-b64.js`, `jspdf`) são carregados sob demanda,
apenas quando a pessoa clica para baixar a proposta.

## Rodar localmente

Qualquer servidor estático serve:

```bash
npx serve .
```

## Deploy

Publicado no Netlify a partir da raiz do repositório, sem etapa de build.
