import React, { useState } from 'react';
import {
  Accessibility, Bell, CarFront, Eye, Home, Map, MapPin, Menu, Plus, Search,
  ShieldCheck, TriangleAlert, User, Volume2, X, Route
} from 'lucide-react';
import './auth.css';

const accountsKey = 'parkguard.accounts';
const sessionKey = 'parkguard.session';
const initialPlaces = [
  { id: 1, n: 'Estacionamento Central', a: 'Av. Paulista, 1000', d: '120 m', price: 'R$ 12/h', spots: 8, access: true, ramp: true, side: true },
  { id: 2, n: 'Garagem Bela Vista', a: 'Rua Itapeva, 220', d: '350 m', price: 'R$ 9/h', spots: 3, access: false },
  { id: 3, n: 'Shopping Cidade', a: 'Rua Pamplona, 800', d: '600 m', price: 'R$ 15/h', spots: 12, access: true, ramp: true, side: true },
  { id: 4, n: 'Edifício Horizonte', a: 'Alameda Santos, 540', d: '750 m', price: 'R$ 10/h', spots: 2, access: true, side: true }
];
const initialAlerts = [
  { id: 1, t: 'Buraco na via', where: 'Av. Paulista, próximo ao nº 850', kind: 'road', time: 'há 4 min' },
  { id: 2, t: 'Calçada bloqueada', where: 'Rua Augusta, 310', kind: 'access', time: 'há 8 min' },
  { id: 3, t: 'Ponto de alagamento', where: 'Av. 9 de Julho, 1200', kind: 'road', time: 'há 12 min' }
];
const defaultProfile = {
  name: '', email: '', disability: false, wheelchair: false, visual: false,
  hearing: false, voice: true, contrast: false
};

function readAccounts() {
  try {
    return JSON.parse(localStorage.getItem(accountsKey) || '[]');
  } catch {
    throw new Error('Não foi possível ler os dados locais. Limpe os dados do ParkGuard e tente novamente.');
  }
}

function getInitialProfile() {
  const email = localStorage.getItem(sessionKey);
  if (!email) return defaultProfile;
  return readAccounts().find(account => account.email === email)?.profile || defaultProfile;
}

async function passwordHash(password, salt) {
  if (!window.crypto?.subtle) {
    throw new Error('Não foi possível proteger sua senha neste navegador. Use uma conexão segura ou localhost.');
  }
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasDisability, setHasDisability] = useState('');
  const [preferences, setPreferences] = useState({ wheelchair: false, visual: false, hearing: false });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const togglePreference = key => setPreferences(current => ({ ...current, [key]: !current[key] }));

  const submit = async event => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const accounts = readAccounts();

      if (mode === 'register') {
        if (hasDisability === '') {
          throw new Error('Informe se você tem alguma deficiência ou necessidade de acessibilidade.');
        }
        if (accounts.some(account => account.email === normalizedEmail)) {
          throw new Error('Já existe uma conta com este e-mail. Entre ou use outro e-mail.');
        }
        const salt = Array.from(window.crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('');
        const account = {
          email: normalizedEmail,
          salt,
          passwordHash: await passwordHash(password, salt),
          profile: {
            ...defaultProfile,
            name: name.trim(),
            email: normalizedEmail,
            disability: hasDisability === 'yes',
            ...preferences,
            voice: true
          }
        };
        localStorage.setItem(accountsKey, JSON.stringify([...accounts, account]));
        onLogin(account.profile);
      } else {
        const account = accounts.find(item => item.email === normalizedEmail);
        if (!account || account.passwordHash !== await passwordHash(password, account.salt)) {
          throw new Error('E-mail ou senha incorretos. Se ainda não tem conta, faça seu cadastro.');
        }
        onLogin(account.profile);
      }
    } catch (submitError) {
      setError(submitError.message || 'Não foi possível concluir. Tente novamente.');
    } finally {
      setBusy(false);
    }
  };

  return <div className="auth-page">
    <section className="auth-visual">
      <div className="auth-brand"><i>P</i><b>PARKGUARD <em>AI</em><small>SMART MOBILITY</small></b></div>
      <div className="auth-message">
        <span className="chip">MOBILIDADE PARA TODOS</span>
        <h1>Sua jornada,<br /><em>sem barreiras.</em></h1>
        <p>Encontre vagas, planeje rotas e receba informações que respeitam as suas necessidades.</p>
        <MapArt center={[-23.5614, -46.6559]} title="Mapa de São Paulo" />
      </div>
      <small className="auth-credit">MAPA © OpenStreetMap contributors</small>
    </section>
    <section className="auth-side">
      <form className="auth-card" onSubmit={submit}>
        <label className="muted">{mode === 'login' ? 'BEM-VINDO DE VOLTA' : 'CRIE SUA CONTA'}</label>
        <h2>{mode === 'login' ? 'Acesse sua conta' : 'Vamos nos conhecer?'}</h2>
        <p>{mode === 'login' ? 'Entre para continuar sua jornada.' : 'Seu perfil ajuda a adaptar rotas e alertas para você.'}</p>
        {mode === 'register' && <label className="auth-label">Nome completo
          <input required autoComplete="name" value={name} onChange={event => setName(event.target.value)} placeholder="Como podemos te chamar?" />
        </label>}
        <label className="auth-label">E-mail
          <input required type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="voce@email.com" />
        </label>
        <label className="auth-label">Senha
          <input required type="password" minLength={8} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={event => setPassword(event.target.value)} placeholder="Mínimo de 8 caracteres" />
        </label>
        {mode === 'register' && <div className="access-form">
          <fieldset>
            <legend>Você tem alguma deficiência ou necessidade de acessibilidade?</legend>
            <label><input type="radio" name="disability" value="yes" checked={hasDisability === 'yes'} onChange={() => setHasDisability('yes')} required /> Sim</label>
            <label><input type="radio" name="disability" value="no" checked={hasDisability === 'no'} onChange={() => setHasDisability('no')} /> Não</label>
          </fieldset>
          <fieldset>
            <legend>O que devemos considerar? <small>(marque todas que se aplicam)</small></legend>
            <label><input type="checkbox" checked={preferences.wheelchair} onChange={() => togglePreference('wheelchair')} /> Mobilidade reduzida ou cadeira de rodas</label>
            <label><input type="checkbox" checked={preferences.visual} onChange={() => togglePreference('visual')} /> Deficiência visual</label>
            <label><input type="checkbox" checked={preferences.hearing} onChange={() => togglePreference('hearing')} /> Deficiência auditiva</label>
          </fieldset>
          <small className="privacy-note">Essas informações ficam salvas apenas neste navegador e podem ser alteradas no perfil.</small>
        </div>}
        {error && <div className="auth-error" role="alert">{error}</div>}
        <button className="auth-submit" disabled={busy}>{busy ? 'Aguarde...' : mode === 'login' ? 'Entrar →' : 'Criar conta →'}</button>
        <div className="auth-switch">
          {mode === 'login' ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}
          <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}> {mode === 'login' ? 'Cadastre-se' : 'Entrar'}</button>
        </div>
        <small className="prototype-note">Protótipo: login e dados são locais; para uso real, conecte um serviço de autenticação seguro.</small>
      </form>
    </section>
  </div>;
}

export default function App() {
  const [profile, setProfile] = useState(getInitialProfile);
  const [authenticated, setAuthenticated] = useState(() => Boolean(getInitialProfile().email));
  const [tab, setTab] = useState('Início');
  const [places] = useState(initialPlaces);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [query, setQuery] = useState('');
  const [onlyAccessible, setOnlyAccessible] = useState(false);
  const [selected, setSelected] = useState(1);
  const [destination, setDestination] = useState('Hospital das Clínicas');
  const [mapCenter, setMapCenter] = useState([-23.5614, -46.6559]);
  const [modal, setModal] = useState(false);
  const [kind, setKind] = useState('Buraco na via');
  const [where, setWhere] = useState('');
  const [toast, setToast] = useState('');
  const [menu, setMenu] = useState(false);
  const [reservation, setReservation] = useState(null);

  const notify = message => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2400);
  };

  const login = nextProfile => {
    setProfile(nextProfile);
    setOnlyAccessible(Boolean(nextProfile.wheelchair));
    localStorage.setItem(sessionKey, nextProfile.email);
    setAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(sessionKey);
    setAuthenticated(false);
  };

  const saveProfile = () => {
    try {
      const accounts = readAccounts();
      const updatedAccounts = accounts.map(account => account.email === profile.email ? { ...account, profile } : account);
      localStorage.setItem(accountsKey, JSON.stringify(updatedAccounts));
      notify('Preferências atualizadas.');
    } catch (saveError) {
      notify(saveError.message || 'Não foi possível salvar as preferências.');
    }
  };

  const locateDestination = async () => {
    if (!destination.trim()) return notify('Informe um endereço para buscar no mapa.');
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=pt-BR&q=${encodeURIComponent(destination)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('O serviço de mapas não respondeu. Tente novamente.');
      const [result] = await response.json();
      if (!result) throw new Error('Endereço não encontrado. Tente informar rua, número e cidade.');
      setMapCenter([Number(result.lat), Number(result.lon)]);
      setTab('Mapa');
      notify('Local encontrado no mapa.');
    } catch (mapError) {
      notify(mapError.message || 'Não foi possível buscar esse endereço.');
    }
  };

  const saveReport = () => {
    if (!where.trim()) return notify('Informe o local da ocorrência.');
    setAlerts(current => [{ id: Date.now(), t: kind, where, kind: kind.includes('Calçada') || kind.includes('rampa') ? 'access' : 'road', time: 'agora' }, ...current]);
    setWhere('');
    setModal(false);
    notify('Relato enviado para validação!');
  };

  const filteredPlaces = places.filter(place =>
    (!onlyAccessible || place.access) && `${place.n} ${place.a}`.toLowerCase().includes(query.toLowerCase())
  );
  const nav = [['Início', Home], ['Mapa', Map], ['Alertas na via', TriangleAlert], ['Rotas acessíveis', Accessibility], ['Meus trajetos', Route], ['Perfil', User]];
  const card = place => <article className={`parking ${selected === place.id ? 'sel' : ''}`} key={place.id} onClick={() => setSelected(place.id)}>
    <div className="car"><CarFront /></div>
    <div className="pinfo"><b>{place.n} {place.access && <small className="atag"><Accessibility size={12} /> Acessível</small>}</b>
      <small><MapPin size={12} />{place.a} · {place.d}</small>
      <small className="green">{place.ramp ? '✓ Rampa · ' : ''}{place.side ? '✓ Espaço lateral' : ''}</small>
    </div>
    <div className="price"><b>{place.price}</b><small>{place.spots} vagas</small>
      <button onClick={event => { event.stopPropagation(); setReservation(place); notify('Vaga selecionada!'); }}>Selecionar</button>
    </div>
  </article>;

  if (!authenticated) return <AuthScreen onLogin={login} />;

  return <div className="app">
    <aside className={menu ? 'sidebar show' : 'sidebar'}>
      <div className="brand"><i>P</i><b>PARKGUARD <em>AI</em><small>SMART MOBILITY</small></b><button className="x" onClick={() => setMenu(false)}><X /></button></div>
      <label className="muted">MENU PRINCIPAL</label>
      {nav.map(([label, Icon]) => <button key={label} className={`nav ${tab === label ? 'active' : ''}`} onClick={() => { setTab(label); setMenu(false); }}>
        <Icon />{label}{label === 'Alertas na via' && <small>{alerts.length}</small>}
      </button>)}
      <div className="device"><ShieldCheck /><span><b>ParkGuard Device</b><small>● Sistema conectado</small></span></div>
    </aside>
    {menu && <div className="shade" onClick={() => setMenu(false)} />}
    <main>
      <header><button className="hamb" onClick={() => setMenu(true)}><Menu /></button><span>PARKGUARD AI　/　{tab}</span>
        <div className="right"><small>● Sistema operacional</small><Bell /><i>{profile.name[0] || 'P'}</i><button className="logout" onClick={logout}>Sair</button></div>
      </header>
      <div className="content">
        <div className="heading"><div><label className="muted">CONECTANDO PESSOAS E CIDADES</label>
          <h1>{{ 'Início': 'Painel de mobilidade', 'Mapa': 'Mapa inteligente', 'Alertas na via': 'Inteligência nas vias', 'Rotas acessíveis': 'Mobilidade inclusiva', 'Meus trajetos': 'Meus trajetos', 'Perfil': 'Meu perfil' }[tab]}</h1>
          <p>Estacione. Dirija. Acesse. Para todos.</p></div><span className="demo">● OPENSTREETMAP</span></div>

        {tab === 'Início' && <>
          <section className="hero"><div><label className="chip">● INTELIGÊNCIA URBANA</label><h2>Sua jornada,<br /><em>sem barreiras.</em></h2>
            <p>Encontre vagas, evite riscos e descubra rotas acessíveis. Tudo conectado em um só lugar.</p>
            <div className="search"><MapPin /><input value={destination} onChange={event => setDestination(event.target.value)} onKeyDown={event => event.key === 'Enter' && locateDestination()} placeholder="Para onde você vai?" /><button onClick={locateDestination}>Buscar →</button></div>
            <small>♿ Rotas acessíveis　　⌖ Alertas inteligentes　　▣ Vagas disponíveis</small></div>
            <MapArt center={mapCenter} title="Mapa de São Paulo" />
          </section>
          <div className="stats"><Stat n={places.reduce((sum, place) => sum + place.spots, 0)} t="Vagas no mapa" /><Stat n={places.filter(place => place.access).length} t="Vagas acessíveis" /><Stat n={alerts.length} t="Alertas ativos" /><Stat n="04" t="Rotas inclusivas" /></div>
          <Section title="Estacionamentos próximos" action="Ver mapa completo" click={() => setTab('Mapa')} />
          <div className="columns"><div>{places.slice(0, 3).map(card)}</div><div className="panel"><h3>Mapa inteligente <small>São Paulo · OpenStreetMap</small></h3><MapArt center={mapCenter} title="Mapa inteligente de vagas" /><Legend /></div></div>
          <Section title="Alertas recentes" action="Ver todos" click={() => setTab('Alertas na via')} />
          <div className="alerts">{alerts.slice(0, 3).map(alert => <Alert key={alert.id} a={alert} />)}</div>
          <div className="inclusive"><Accessibility /><div><label>INCLUSIVE MOBILITY</label><h2>Não basta chegar. É preciso que todos consigam chegar.</h2><p>Vagas acessíveis, rotas sem barreiras e recursos de acessibilidade.</p></div><button onClick={() => setTab('Rotas acessíveis')}>Explorar acessibilidade →</button></div>
        </>}

        {tab === 'Mapa' && <div className="mapgrid"><div className="panel"><h3>Mapa de disponibilidade <small>OpenStreetMap · São Paulo</small></h3><MapArt center={mapCenter} title="Mapa de disponibilidade" /><Legend /></div>
          <div className="panel"><h3>Vagas próximas</h3><div className="search"><Search /><input placeholder="Buscar estacionamento" value={query} onChange={event => setQuery(event.target.value)} /></div>
            <label className="filter"><span><Accessibility /> Mostrar apenas acessíveis</span><input type="checkbox" checked={onlyAccessible} onChange={event => setOnlyAccessible(event.target.checked)} /></label>
            {filteredPlaces.map(card)}
          </div></div>}

        {tab === 'Alertas na via' && <><div className="action"><div><h2>Informação que protege pessoas.</h2><p>Compartilhe riscos nas vias e barreiras de acessibilidade.</p></div><button onClick={() => setModal(true)}><Plus size={14} /> Reportar ocorrência</button></div>
          <div className="alerts all">{alerts.map(alert => <Alert key={alert.id} a={alert} />)}</div><Note title="Validação inteligente">Neste protótipo, os relatos ficam salvos apenas durante esta sessão. Uma versão conectada poderá cruzar sensores e confirmações para reduzir falsos alertas.</Note></>}

        {tab === 'Rotas acessíveis' && <><div className="accesshero"><Accessibility /><div><label>INCLUSIVE MOBILITY</label><h2>Uma rota boa é aquela que funciona para você.</h2><p>Preferências de acessibilidade configuradas no cadastro e editáveis a qualquer momento.</p></div></div>
          <div className="columns"><div className="panel"><h3>Preferências de acessibilidade</h3>
            {[
              ['wheelchair', 'Mobilidade reduzida / cadeira de rodas', Accessibility],
              ['visual', 'Deficiência visual · orientação por voz', Volume2],
              ['hearing', 'Deficiência auditiva · alertas visuais', Eye],
              ['voice', 'Orientação por áudio', Volume2],
              ['contrast', 'Alto contraste', Eye]
            ].map(([key, label, Icon]) => <label className="pref" key={key}><Icon />{label}<input type="checkbox" checked={Boolean(profile[key])} onChange={event => setProfile(current => ({ ...current, [key]: event.target.checked }))} /></label>)}
          </div><div className="panel"><h3>Planejar rota acessível</h3><div className="search"><MapPin /><input value={destination} onChange={event => setDestination(event.target.value)} placeholder="Destino" /><button onClick={locateDestination}>Ver no mapa</button></div><MapArt center={mapCenter} title="Mapa para planejar rota" />
            <p className="green">✓ {profile.wheelchair ? 'Exibir vagas acessíveis primeiro' : 'Preferências de mobilidade aplicadas'}<br />ⓘ As condições precisam de confirmação local</p>
            <button className="wide" onClick={locateDestination}>Buscar destino no mapa →</button>
          </div></div><Note title="Inclusão de verdade">As informações precisam ser validadas com pessoas com deficiência. O mapa não certifica a acessibilidade real dos locais.</Note></>}

        {tab === 'Meus trajetos' && <div className="panel"><h3>Atividade recente</h3>{reservation ? <p>▣ {reservation.n} · {reservation.a} · vaga selecionada</p> : <p className="muted">Nenhum trajeto iniciado. Selecione uma vaga no mapa para vê-la aqui.</p>}</div>}

        {tab === 'Perfil' && <div className="panel profile"><div className="avatar">{profile.name[0] || 'P'}</div><h2>{profile.name}</h2><p>{profile.email}</p>
          <h3>Preferências de acessibilidade</h3><label className="pref"><Accessibility /> Tenho deficiência ou necessidade de acessibilidade<input type="checkbox" checked={Boolean(profile.disability)} onChange={event => setProfile(current => ({ ...current, disability: event.target.checked }))} /></label>
          {[
            ['wheelchair', 'Mobilidade reduzida / cadeira de rodas'],
            ['visual', 'Deficiência visual'],
            ['hearing', 'Deficiência auditiva']
          ].map(([key, label]) => <label className="pref" key={key}>{label}<input type="checkbox" checked={Boolean(profile[key])} onChange={event => setProfile(current => ({ ...current, [key]: event.target.checked }))} /></label>)}
          <button onClick={saveProfile}>Salvar perfil</button>
        </div>}
      </div>
    </main>
    {modal && <div className="backdrop"><div className="modal"><div className="modalhead"><h2>Reportar ocorrência</h2><button className="x" onClick={() => setModal(false)}><X /></button></div>
      <p>Ajude a comunidade informando um problema.</p><label>Tipo<select value={kind} onChange={event => setKind(event.target.value)}>{['Buraco na via', 'Alagamento', 'Acidente', 'Obstáculo na pista', 'Calçada bloqueada', 'Rampa inacessível'].map(option => <option key={option}>{option}</option>)}</select></label>
      <label>Localização<input value={where} onChange={event => setWhere(event.target.value)} placeholder="Ex.: Av. Paulista, 1000" /></label>
      <div className="modalactions"><button className="secondary" onClick={() => setModal(false)}>Cancelar</button><button onClick={saveReport}>Enviar ocorrência</button></div>
    </div></div>}
    {toast && <div className="toast">✓ {toast}</div>}
  </div>;
}

function MapArt({ center, title }) {
  const [latitude, longitude] = center;
  const delta = 0.012;
  const bounds = `${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}`;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bounds}&layer=mapnik&marker=${latitude},${longitude}`;
  return <div className="map-frame"><iframe title={title} src={mapUrl} loading="lazy" referrerPolicy="no-referrer" /><a href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`} target="_blank" rel="noreferrer">Abrir mapa ↗</a></div>;
}

function Stat({ n, t }) { return <div className="stat"><b>{n}</b><small>{t}</small></div>; }
function Section({ title, action, click }) { return <div className="section"><h2>{title}</h2><button onClick={click}>{action} →</button></div>; }
function Alert({ a }) { return <div className="alert"><i>{a.kind === 'access' ? <Accessibility /> : <TriangleAlert />}</i><div><b>{a.t}</b><small>{a.where} · {a.time}</small></div><span>{a.kind === 'access' ? 'Acessibilidade' : 'Atenção'}</span></div>; }
function Note({ title, children }) { return <div className="note"><b>{title}</b><p>{children}</p></div>; }
function Legend() { return <div className="legend"><span>♿ Vaga acessível</span><span>● Estacionamento</span><span>⚠ Alerta</span></div>; }
