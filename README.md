ALICE RODRIGUES SOARES - RA: 22400343

# Virtualbum App

Aplicacao mobile desenvolvida com **React Native + Expo** para demonstrar autenticacao, navegacao avancada, consumo de API publica, persistencia remota com Firebase e um mini painel de clima contextual para Brasilia.

## Visao geral

O app atende os requisitos tecnicos obrigatorios da disciplina com:

- autenticacao com email e senha usando Firebase Authentication;
- persistencia de perfil e favoritos usando Firestore;
- navegacao combinando `Stack Navigation` e `Drawer Navigation`;
- consumo de API publica com lista interativa e tela de detalhes;
- estados de carregamento usando `ActivityIndicator`;
- uso de `useState`, `useEffect` e hooks customizados;
- previsao semanal do tempo a partir da Open-Meteo com recomendacoes de atividades.

## Funcionalidades implementadas

- Login e registro com sessao persistida.
- Lista tematica local com 6 imagens, descricoes curtas e narrativas detalhadas.
- Interacao entre lista resumida e lista detalhada por selecao de card.
- Tela principal "Meu Album" com cards da API publica `JSONPlaceholder`.
- Campo de filtro por titulo no dashboard.
- Mini painel de previsao semanal para Brasilia usando dados da Open-Meteo.
- Cards horizontais com data, emoji, rotulo do clima, condicao, temperaturas e chuva.
- Recomendacao textual e lista de acoes sugeridas para cada dia.
- Variacao pseudo-aleatoria das sugestoes por data.
- Tela de detalhes com opcao de favoritar item.
- Tela de perfil com leitura e atualizacao de dados no Firestore.
- Tela de configuracoes com acao de logout e painel com `TextInput`, `Picker`, `Slider`, `Switch` e botoes.
- Drawer lateral com rotas claras e icones.

## Atualizacao da previsao

O projeto inclui:

- `fetch_brasilia_week.js` para buscar a previsao semanal da Open-Meteo;
- `brasilia_week.json` como snapshot local consumido pelo app;
- `npm run weather:brasilia` para regenerar o arquivo local.

## Arquitetura

```text
App
└── RootNavigator
    ├── AuthStack
    │   ├── Login
    │   └── Register
    └── AppDrawer
        ├── DashboardStack
        │   ├── Meu Album
        │   └── Details
        ├── Profile
        └── Settings
```

## Estrutura de pastas

```text
/src
  /components
  /hooks
  /navigation
  /screens
  /services
  /theme
App.js
firebaseConfig.js
fetch_brasilia_week.js
brasilia_week.json
```

## Tecnologias

- React Native
- Expo
- React Navigation
- Firebase Authentication
- Firebase Firestore
- JSONPlaceholder
- Open-Meteo

## Hooks utilizados

- `useState`
- `useEffect`
- `useAuth`
- `usePhotoFeed`

## Checklist de requisitos

- [x] `useState`, `useEffect` e custom hook
- [x] Apenas componentes funcionais
- [x] Stack Navigation
- [x] Drawer Navigation
- [x] Loading com `ActivityIndicator`
- [x] Login/Registro
- [x] Dashboard
- [x] Detalhes
- [x] Perfil/Configuracoes
- [x] Integracao com API publica
- [x] Firebase Authentication
- [x] Firestore
- [x] Drawer com icones e nomes claros

## Requisitos complementares atendidos

- [x] Parte 1: lista com no minimo 5 informacoes e 6 imagens tematicas
- [x] Parte 2: interacao entre listas com 5+ descricoes longas e 150+ palavras no total
- [x] Parte 3: titulo, 4 `TextInput`, 2 `Picker`, 2 `Slider`, 2 `Switch` e 2 botoes com interacao

## Como executar

```bash
npm install
npx expo start
```

Para atualizar a previsao local:

```bash
npm run weather:brasilia
```

## Fluxo principal validado

1. cadastro de usuario;
2. login com conta existente;
3. carregamento da lista da API;
4. filtro dos itens do dashboard;
5. leitura da previsao local de Brasilia;
6. abertura da tela de detalhes;
7. favoritar item no Firestore;
8. edicao de nome no perfil;
9. logout pelo drawer ou configuracoes.

## Melhorias sugeridas

- adicionar testes automatizados para autenticacao, clima e navegacao;
- criar cache local renovavel da previsao;
- permitir escolha de outras cidades;
- migrar para TypeScript;
- adicionar onboarding inicial;
- melhorar validacoes de formulario.
