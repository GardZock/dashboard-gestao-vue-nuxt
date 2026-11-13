# Dashboard de Gestão Empresarial

Painel administrativo em Nuxt 3 e Vue 3 para organizar o dia a dia de uma empresa em uma única tela: equipe, produtos e vendas, com indicadores em gráficos.

## Funcionalidades

- **Funcionários:** listagem, cadastro com foto de perfil (convertida para base64 antes do envio), edição e exclusão.
- **Produtos:** listagem e cadastro com nome, categoria (roupas, móveis ou eletrônicos), preço normal, preço com desconto, quantidade em estoque e imagem, com visualização de detalhes.
- **Vendas e indicadores:** gráfico de linha com a quantidade vendida por mês e ranking dos produtos mais vendidos.
- **Interface:** layout de painel com menu lateral, componentes do Nuxt UI e tema claro.

> **Nota:** nesta versão, as vendas exibidas nos gráficos usam dados de exemplo definidos em `components/sales.vue`. Funcionários e produtos são carregados de uma API externa (veja a seção de configuração).

## Stack

- [Nuxt 3](https://nuxt.com/) e [Vue 3](https://vuejs.org/), com TypeScript
- [Nuxt UI](https://ui.nuxt.com/) e Tailwind CSS para componentes e estilo
- [Chart.js](https://www.chartjs.org/) com `vue-chartjs` para os gráficos
- [Axios](https://axios-http.com/) e `$fetch` para as requisições
- [Yup](https://github.com/jquense/yup) para validação de formulários
- [oh-vue-icons](https://github.com/dronsrl/oh-vue-icons) para ícones

## Estrutura

```
pages/
├── index.vue                 # página inicial
└── dashboard/
    ├── index.vue             # painel com gráficos de vendas
    ├── employees.vue         # gestão de funcionários
    ├── products.vue          # gestão de produtos
    └── settings.vue          # configurações
components/                   # navegação, tabelas, modais e gráficos
server/                       # funções que chamam a API e calculam indicadores
├── employer_crud.ts          # CRUD de funcionários
├── interfaces.ts             # tipos de Funcionário, Produto e Venda
├── product_crud.ts           # CRUD de produtos
├── countMonthly.ts           # vendas agrupadas por mês
├── getTopSaled.ts            # produtos mais vendidos
└── processImage.ts           # conversão de imagem para base64
```

## Como executar

### Pré-requisitos

- Node.js 18 ou superior
- Um gerenciador de pacotes: npm, pnpm, yarn ou bun

### 1. Instalar as dependências

```bash
npm install
```

### 2. Configurar a API

As funções em `server/` leem a variável `API_URL` e usam `http://localhost:8080` por padrão. A API precisa expor, pelo menos:

| Método | Rota | Uso |
|---|---|---|
| `GET` | `/employees?id=ALL` ou `/employees?id={id}` | listar ou buscar funcionários |
| `POST` | `/employees` | criar funcionário |
| `DELETE` | `/employees` | excluir funcionário (`id` no corpo) |
| `GET` | `/products?id=ALL` | listar produtos |

Para apontar para outra API:

```bash
API_URL=http://sua-api:8080 npm run dev
```

### 3. Iniciar em modo de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). O painel fica em `/dashboard`.

### Outros comandos

```bash
npm run build      # gera a versão de produção
npm run preview    # serve a versão de produção localmente
npm run generate   # gera o site estático
```

## Próximos passos

- Ligar as vendas a uma API real, no lugar dos dados de exemplo.
- Adicionar autenticação no painel.
- Testes automatizados para as funções de cálculo dos indicadores.

## Licença

Distribuído sob a licença Apache 2.0. Veja o arquivo [LICENSE](LICENSE).
