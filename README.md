# 🚗 ParkGuard AI

> **Mobilidade inteligente, segura e inclusiva.**
> *Não basta chegar. É preciso que todos consigam chegar.*

Projeto desenvolvido para a **Global Solution – FIAP**.

O ParkGuard AI é uma plataforma web de mobilidade urbana. Ela ajuda o motorista a encontrar vagas e estacionamentos perto do destino, mostra alertas de risco nas vias e oferece rotas pensadas para pessoas com deficiência ou mobilidade reduzida.

---

## 📌 Sumário
- [Problema](#-problema)
- [Solução](#-solução)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Como executar](#-como-executar)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [APIs utilizadas](#-apis-utilizadas)
- [Objetivos de Desenvolvimento Sustentável (ODS)](#-objetivos-de-desenvolvimento-sustentável-ods)
- [Limitações do protótipo](#-limitações-do-protótipo)
- [Próximos passos](#-próximos-passos)
- [Integrantes](#-integrantes)

---

## ❗ Problema
- **Tempo e emissões:** motoristas rodam minutos procurando vaga, o que gera congestionamento, gasto de combustível e emissão de CO₂.
- **Insegurança:** faltam informações sobre riscos nas vias, como buracos, alagamentos, má iluminação e ocorrências.
- **Exclusão:** pessoas com deficiência encontram vagas reservadas ocupadas e rotas sem informação confiável de acessibilidade.
- **Informação dispersa:** não existe um lugar único e colaborativo com esses dados.

## 💡 Solução
Uma plataforma que reúne em um só lugar:
1. **Mapa inteligente de vagas:** estacionamentos e vagas de rua em até 1 km do destino.
2. **Alertas na via:** a comunidade compartilha riscos e barreiras de acessibilidade.
3. **Rotas acessíveis:** o planejamento considera as preferências de cada usuário.
4. **Perfil personalizado:** necessidades de acessibilidade configuradas no cadastro.

---

## ✨ Funcionalidades

| Tela | O que faz |
|---|---|
| 🔐 **Login / Cadastro** | Cria uma conta local, com senha protegida por hash SHA-256 com *salt*, e registra as preferências de acessibilidade. |
| 🏠 **Início** | Painel de mobilidade com busca de destino, mapa, vagas próximas, alertas recentes e um destaque de inclusão. |
| 🗺️ **Mapa** | Mapa interativo (Leaflet + OpenStreetMap) com estacionamentos reais do OSM, vagas de rua, sua localização e a rota até o destino. |
| ⚠️ **Alertas na via** | Lista de ocorrências e um botão **Reportar ocorrência**, para riscos e barreiras de acessibilidade. |
| ♿ **Rotas acessíveis** | Preferências (cadeira de rodas, deficiência visual ou auditiva, orientação por áudio, alto contraste) e o planejamento de rota acessível. |
| 🧭 **Meus trajetos** | Histórico da vaga e do trajeto selecionados. |
| 👤 **Perfil** | Edição dos dados e das necessidades de acessibilidade. |

**Destaques técnicos**
- 🔎 Autocomplete de endereços, com consulta cancelável (`AbortController`).
- 📍 Geolocalização do navegador.
- 🛣️ Cálculo de rota real (OSRM) e de distâncias (fórmula de Haversine).
- 🅿️ Estacionamentos reais e vias consultados no OpenStreetMap (Overpass API).
- 💾 Sessão e contas persistidas no `localStorage`.
- 📱 Layout responsivo, com menu lateral recolhível no celular.

---

## 🛠️ Tecnologias
- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Leaflet](https://leafletjs.com/) + [OpenStreetMap](https://www.openstreetmap.org/)
- [Lucide React](https://lucide.dev/) (ícones)
- CSS puro
- Web Crypto API (hash de senha) e Geolocation API

---

## ▶️ Como executar

**Pré-requisitos:** [Node.js](https://nodejs.org/) 18 ou superior.

```bash
# 1. Clonar o repositório
git clone <URL_DO_REPOSITORIO>
cd GS_ParkGuardAI

# 2. Instalar as dependências
npm install

# 3. Rodar em modo de desenvolvimento
npm run dev
```

Depois, acesse **http://localhost:5173** no navegador.

Outros comandos:
```bash
npm run build     # gera a versão de produção em /dist
npm run preview   # serve a build localmente
```

> 💡 Para o mapa, a busca e as rotas funcionarem, é preciso estar conectado à internet. Permita o acesso à localização quando o navegador pedir.

---

## 📁 Estrutura do projeto
```
GS_ParkGuardAI/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx       # ponto de entrada
    ├── App.jsx        # aplicação: login, telas, mapa, rotas
    ├── style.css      # estilos gerais
    ├── map.css        # estilos do mapa
    └── auth.css       # estilos da tela de login
```

---

## 🌐 APIs utilizadas
| API | Uso |
|---|---|
| [OpenStreetMap](https://www.openstreetmap.org/copyright) | Mapa base (tiles) |
| [Nominatim](https://nominatim.org/) | Busca e autocomplete de endereços |
| [Overpass API](https://overpass-api.de/) | Estacionamentos e vias próximas |
| [OSRM](https://project-osrm.org/) | Cálculo de rota |

São APIs gratuitas e públicas, com limite de uso. Dados do mapa © colaboradores do OpenStreetMap.

---

## 🌍 Objetivos de Desenvolvimento Sustentável (ODS)
- **ODS 9:** Indústria, inovação e infraestrutura
- **ODS 10:** Redução das desigualdades (acessibilidade e inclusão)
- **ODS 11:** Cidades e comunidades sustentáveis
- **ODS 13:** Ação contra a mudança global do clima (menos tempo rodando, menos emissões)

---

## ⚠️ Limitações do protótipo
- **Sem backend:** contas, sessão e relatos ficam salvos apenas no navegador. A autenticação é uma simulação para a demo.
- **Disponibilidade simulada:** a ocupação das vagas e as vagas de rua são **ilustrativas**.
- **IA simulada:** a validação inteligente dos relatos ainda é conceitual.
- **Acessibilidade não certificada:** as informações precisam ser validadas com pessoas com deficiência.

---

## 🚀 Próximos passos
- [ ] Backend com autenticação real e banco de dados
- [ ] IA para validar e priorizar relatos (reputação, votos e visão computacional)
- [ ] Detecção de vagas em tempo real por câmeras ou sensores IoT
- [ ] Reserva e pagamento de vagas com estacionamentos parceiros
- [ ] Orientação por voz e modo alto contraste completo
- [ ] Integração com dados abertos da prefeitura
- [ ] Aplicativo mobile

---

## 👥 Integrantes
| Nome | RM |
|---|---|
| Nome do integrante 1 | RM00000 |
| Nome do integrante 2 | RM00000 |
| Nome do integrante 3 | RM00000 |

---

<p align="center">Feito com 💚 para a Global Solution FIAP</p>
