// Dados fictícios (São Paulo). Substituir por APIs reais no futuro.
export const parkings = [
  { id: 1, name: 'Estacionamento Vila Aurora', dist: 220, price: 12, common: 18, acc: 3, rating: 4.7, hours: '24h', covered: true, sec: true, ev: true, x: 42, y: 38, feat: ['Coberto', 'Segurança 24h', 'Carregador'] },
  { id: 2, name: 'Garagem Jardim Paulistano', dist: 450, price: 9, common: 5, acc: 1, rating: 4.2, hours: '06h–23h', covered: false, sec: false, ev: false, x: 60, y: 55, feat: ['Rampa de acesso'] },
  { id: 3, name: 'Park Praça das Flores', dist: 310, price: 15, common: 22, acc: 2, rating: 4.9, hours: '24h', covered: true, sec: true, ev: false, x: 28, y: 62, feat: ['Coberto', 'Elevador', 'Segurança 24h'] },
  { id: 4, name: 'Pátio Av. Liberdade Sul', dist: 780, price: 7, common: 31, acc: 0, rating: 3.9, hours: '07h–22h', covered: false, sec: false, ev: true, x: 75, y: 30, feat: ['Carregador'] },
]
export const alerts = [
  { id: 1, type: 'Alagamento', addr: 'Av. Brigadeiro Faria Lima, 1200', time: 'há 5 min', sev: 'grave', conf: 14, status: 'confirmado', x: 50, y: 48 },
  { id: 2, type: 'Buraco', addr: 'Rua das Acácias, 88', time: 'há 22 min', sev: 'média', conf: 6, status: 'em validação', x: 35, y: 45 },
  { id: 3, type: 'Calçada bloqueada', addr: 'Rua Dona Marina, 150', time: 'há 40 min', sev: 'média', conf: 9, status: 'confirmado', x: 66, y: 40 },
  { id: 4, type: 'Obras', addr: 'Av. Ipiranga, 300', time: 'há 2 h', sev: 'leve', conf: 3, status: 'novo', x: 22, y: 30 },
  { id: 5, type: 'Acidente', addr: 'Marginal Pinheiros, km 12', time: 'há 3 h', sev: 'grave', conf: 21, status: 'resolvido', x: 80, y: 70 },
]
export const routes = [
  { id: 'acc', title: 'Rota mais acessível', dist: '1,4 km', time: '22 min', score: 96, sidewalk: 'Excelente', ramps: 7, crossings: 4, rests: 3, light: 'Boa', obstacles: 'Nenhum', parking: '80 m da entrada' },
  { id: 'fast', title: 'Rota mais rápida', dist: '1,1 km', time: '15 min', score: 78, sidewalk: 'Regular', ramps: 4, crossings: 2, rests: 0, light: 'Média', obstacles: '1 obra', parking: '150 m da entrada' },
  { id: 'safe', title: 'Rota mais segura', dist: '1,6 km', time: '25 min', score: 91, sidewalk: 'Boa', ramps: 6, crossings: 5, rests: 2, light: 'Excelente', obstacles: 'Nenhum', parking: '100 m da entrada' },
]
export const steps = [
  'Siga por 120 m pela calçada com piso regular.',
  'Há uma rampa acessível à direita.',
  'Atenção: obstáculo temporário a 40 m. Utilize o desvio sugerido.',
  'Vaga acessível disponível a 80 m da entrada principal.',
]
export const profiles = ['Cadeirante', 'Mobilidade reduzida', 'Deficiência visual', 'Pessoa idosa', 'Carrinho de bebê', 'Sem necessidade específica']
export const notifications = [
  'Uma vaga acessível foi liberada a 300 m.',
  'Novo alagamento identificado no seu trajeto.',
  'Sua rota foi recalculada para evitar uma calçada bloqueada.',
]
export const ranking = [
  { name: 'Marina S.', pts: 1280, badge: 'Guardião da Mobilidade' },
  { name: 'Carlos P.', pts: 940, badge: 'Aliado da Acessibilidade' },
  { name: 'Joana T.', pts: 720, badge: 'Olhos na Rua' },
]
export const campaigns = ['Mapeie rampas acessíveis no seu bairro', 'Fotografe calçadas com piso tátil em Pinheiros', 'Sugira rampas para estabelecimentos da Vila Madalena']
