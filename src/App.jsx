import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import {
  Accessibility, Bell, CarFront, Eye, Home, Map, MapPin, Menu, Plus, Search,
  ShieldCheck, TriangleAlert, User, Volume2, X, Route
} from 'lucide-react';
import './auth.css';

const accountsKey = 'parkguard.accounts';
const sessionKey = 'parkguard.session';
const initialPlaces = [
  { id: 1, n: 'Estacionamento Central', a: 'Av. Paulista, 1000', d: '120 m', price: 'R$ 12/h', spots: 8, access: true, ramp: true, side: true, type: 'parking', coordinates: [-23.5631, -46.6544] },
  { id: 2, n: 'Garagem Bela Vista', a: 'Rua Itapeva, 220', d: '350 m', price: 'R$ 9/h', spots: 3, access: false, type: 'parking', coordinates: [-23.5597, -46.6524] },
  { id: 3, n: 'Shopping Cidade', a: 'Rua Pamplona, 800', d: '600 m', price: 'R$ 15/h', spots: 12, access: true, ramp: true, side: true, type: 'parking', coordinates: [-23.5656, -46.6531] },
  { id: 4, n: 'Edifício Horizonte', a: 'Alameda Santos, 540', d: '750 m', price: 'R$ 10/h', spots: 2, access: true, side: true, type: 'parking', coordinates: [-23.5621, -46.6591] }
];
const destinationRadius = 1000;

function offsetCoordinates([latitude, longitude], meters, bearingDegrees) {
  const radians = degrees => degrees * Math.PI / 180;
  const earthRadius = 6371000;
  const angularDistance = meters / earthRadius;
  const bearing = radians(bearingDegrees);
  const latitude1 = radians(latitude);
  const longitude1 = radians(longitude);
  const latitude2 = Math.asin(
    Math.sin(latitude1) * Math.cos(angularDistance)
      + Math.cos(latitude1) * Math.sin(angularDistance) * Math.cos(bearing)
  );
  const longitude2 = longitude1 + Math.atan2(
    Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(latitude1),
    Math.cos(angularDistance) - Math.sin(latitude1) * Math.sin(latitude2)
  );
  const longitudeDegrees = (longitude2 * 180 / Math.PI + 540) % 360 - 180;
  return [latitude2 * 180 / Math.PI, longitudeDegrees];
}

function createDemoMapPlaces(center) {
  const rings = [260, 580, 900];
  return rings.flatMap((distance, ringIndex) => Array.from({ length: 8 }, (_, pointIndex) => {
    const index = ringIndex * 8 + pointIndex;
    const type = (ringIndex + pointIndex) % 2 === 0 ? 'street' : 'parking';
    const accessible = pointIndex === 0 || pointIndex === 4;
    const typeLabel = type === 'street' ? 'Vaga de rua' : 'Estacionamento';
    return {
      id: `demo-${index + 1}`,
      n: `${typeLabel} ilustrativa ${String(index + 1).padStart(2, '0')}`,
      a: `Ponto ilustrativo a ${distance} m do destino`,
      d: formatDistance(distance),
      price: 'Demonstração',
      spots: 1,
      access: accessible,
      type,
      isGeneratedDemo: true,
      coordinates: offsetCoordinates(center, distance, pointIndex * 45 + ringIndex * 22.5)
    };
  }));
}

function distanceInMeters([lat1, lon1], [lat2, lon2]) {
  const radians = degrees => degrees * Math.PI / 180;
  const latitudeDifference = radians(lat2 - lat1);
  const longitudeDifference = radians(lon2 - lon1);
  const haversine = Math.sin(latitudeDifference / 2) ** 2
    + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(longitudeDifference / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function formatDistance(meters) {
  return meters < 1000 ? `${Math.round(meters / 10) * 10} m` : `${(meters / 1000).toFixed(1)} km`;
}

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
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [osmParking, setOsmParking] = useState([]);
  const [osmParkingLoading, setOsmParkingLoading] = useState(false);
  const [osmParkingError, setOsmParkingError] = useState('');
  const osmRequestId = useRef(0);
  const osmRequestController = useRef(null);
  const [mapCenter, setMapCenter] = useState([-23.5614, -46.6559]);
  const [userLocation, setUserLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [mapBusy, setMapBusy] = useState(false);
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

  const loadOsmParking = async coordinates => {
    const requestId = osmRequestId.current + 1;
    osmRequestId.current = requestId;
    osmRequestController.current?.abort();
    setOsmParking([]);
    setOsmParkingError('');
    setOsmParkingLoading(true);
    const [latitude, longitude] = coordinates;
    const query = `[out:json][timeout:15];(nwr["amenity"~"^(parking|parking_space)$"](around:${destinationRadius},${latitude},${longitude}););out center tags;`;
    const controller = new AbortController();
    osmRequestController.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 18000);

    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
        signal: controller.signal
      });
      if (!response.ok) throw new Error('O OpenStreetMap não conseguiu carregar os estacionamentos agora.');
      const data = await response.json();
      if (!Array.isArray(data.elements)) throw new Error('A resposta do OpenStreetMap veio em um formato inválido.');

      const locations = data.elements.map(element => {
        const point = element.type === 'node' ? [element.lat, element.lon] : [element.center?.lat, element.center?.lon];
        if (!Number.isFinite(point[0]) || !Number.isFinite(point[1])) return null;
        const tags = element.tags || {};
        const distance = distanceInMeters(coordinates, point);
        if (distance > destinationRadius) return null;
        const wheelchair = (tags.wheelchair || 'unknown').toLowerCase();
        const address = [tags['addr:street'], tags['addr:housenumber']].filter(Boolean).join(', ')
          || tags['addr:place']
          || 'Endereço não informado';

        return {
          id: `${element.type}-${element.id}`,
          coordinates: point,
          name: tags.name || tags.operator || (tags.amenity === 'parking_space' ? 'Vaga mapeada' : 'Estacionamento mapeado'),
          address,
          distance,
          wheelchair,
          accessible: wheelchair === 'yes',
          kind: tags.amenity === 'parking_space' ? 'Vaga mapeada no OpenStreetMap' : 'Estacionamento mapeado no OpenStreetMap',
          capacity: tags.capacity || ''
        };
      }).filter(Boolean);

      if (requestId === osmRequestId.current) setOsmParking(locations);
    } catch (parkingError) {
      if (requestId === osmRequestId.current) {
        setOsmParkingError(parkingError.name === 'AbortError'
          ? 'A busca no OpenStreetMap demorou demais. Tente novamente.'
          : parkingError.message || 'Não foi possível carregar os estacionamentos do OpenStreetMap.');
      }
    } finally {
      window.clearTimeout(timeout);
      if (requestId === osmRequestId.current) {
        osmRequestController.current = null;
        setOsmParkingLoading(false);
      }
    }
  };

  const locateDestination = async () => {
    if (!destination.trim()) return notify('Informe um endereço para buscar no mapa.');
    setMapBusy(true);
    setRouteCoordinates([]);
    try {
      let coordinates = selectedSuggestion?.label === destination ? selectedSuggestion.coordinates : null;
      if (!coordinates) {
        const searchQuery = selectedSuggestion?.label === destination
          ? selectedSuggestion.geocodeQuery
          : destination;
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=pt-BR&q=${encodeURIComponent(searchQuery)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('O serviço de mapas não respondeu. Tente novamente.');
        const [result] = await response.json();
        if (!result) throw new Error('Endereço não encontrado. Tente informar rua, número e cidade.');
        coordinates = [Number(result.lat), Number(result.lon)];
      }
      setDestinationCoordinates(coordinates);
      setMapCenter(coordinates);
      setTab('Mapa');
      void loadOsmParking(coordinates);

      try {
        if (!navigator.geolocation) {
          throw new Error('Este navegador não permite obter sua localização.');
        }
        const location = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            position => resolve([position.coords.latitude, position.coords.longitude]),
            () => reject(new Error('Permita o acesso à localização para traçar a rota.')),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
          );
        });
        setUserLocation(location);
        const [originLongitude, originLatitude] = location.slice().reverse();
        const [destinationLongitude, destinationLatitude] = coordinates.slice().reverse();
        const routeResponse = await fetch(`https://router.project-osrm.org/route/v1/driving/${originLongitude},${originLatitude};${destinationLongitude},${destinationLatitude}?overview=full&geometries=geojson`);
        if (!routeResponse.ok) throw new Error('Não foi possível calcular a rota agora. Tente novamente.');
        const routeData = await routeResponse.json();
        const route = routeData.routes?.[0]?.geometry?.coordinates;
        if (!route?.length) throw new Error('Não foi encontrada uma rota para esse destino.');
        setRouteCoordinates(route.map(([longitude, latitude]) => [latitude, longitude]));
        notify('Mapa do destino atualizado. Rota de carro exibida.');
      } catch (routeError) {
        notify(`Mapa do destino atualizado. ${routeError.message}`);
      }
    } catch (mapError) {
      notify(mapError.message || 'Não foi possível buscar esse endereço.');
    } finally {
      setMapBusy(false);
    }
  };

  const saveReport = () => {
    if (!where.trim()) return notify('Informe o local da ocorrência.');
    setAlerts(current => [{ id: Date.now(), t: kind, where, kind: kind.includes('Calçada') || kind.includes('rampa') ? 'access' : 'road', time: 'agora' }, ...current]);
    setWhere('');
    setModal(false);
    notify('Relato enviado para validação!');
  };

  const destinationPlaces = destinationCoordinates
    ? places
      .map(place => ({ ...place, distance: distanceInMeters(destinationCoordinates, place.coordinates) }))
      .filter(place => place.distance <= destinationRadius)
      .map(place => ({ ...place, d: formatDistance(place.distance) }))
    : places;
  const filteredPlaces = destinationPlaces.filter(place =>
    (!onlyAccessible || place.access) && `${place.n} ${place.a}`.toLowerCase().includes(query.toLowerCase())
  );
  const filteredOsmParking = osmParking.filter(place =>
    (!onlyAccessible || place.accessible)
      && `${place.name} ${place.address}`.toLowerCase().includes(query.toLowerCase())
  );
  const demoMapPlaces = destinationCoordinates
    ? createDemoMapPlaces(destinationCoordinates).filter(place =>
      (!onlyAccessible || place.access)
        && `${place.n} ${place.a}`.toLowerCase().includes(query.toLowerCase())
    )
    : [];
  const mapPlaces = destinationCoordinates ? [...filteredPlaces, ...demoMapPlaces] : filteredPlaces;
  const nav = [['Início', Home], ['Mapa', Map], ['Alertas na via', TriangleAlert], ['Rotas acessíveis', Accessibility], ['Meus trajetos', Route], ['Perfil', User]];
  const card = place => <article className={`parking ${selected === place.id ? 'sel' : ''}`} key={place.id} onClick={() => setSelected(place.id)}>
    <div className="car"><CarFront /></div>
    <div className="pinfo"><b>{place.n} {place.access && <small className="atag"><Accessibility size={12} /> Acessível</small>}</b>
      <small><MapPin size={12} />{place.a} · {place.d}</small>
      <small className="green">Demonstração{place.ramp ? ' · ✓ Rampa' : ''}{place.side ? ' · ✓ Espaço lateral' : ''}</small>
    </div>
    <div className="price"><b>{place.price}</b><small>{place.spots} vagas (demo)</small>
      <button onClick={event => { event.stopPropagation(); setReservation(place); notify('Vaga selecionada!'); }}>Selecionar</button>
    </div>
  </article>;
  const osmCard = place => <article className="parking" key={place.id}>
    <div className={`car ${place.accessible ? 'osm-accessible' : 'osm-parking'}`}>{place.accessible ? <Accessibility /> : <CarFront />}</div>
    <div className="pinfo"><b>{place.name} {place.accessible && <small className="atag"><Accessibility size={12} /> Acessível</small>}</b>
      <small><MapPin size={12} />{place.address} · {formatDistance(place.distance)}</small>
      <small className="green">{place.kind} · {place.wheelchair === 'limited' ? 'Acessibilidade limitada' : place.accessible ? 'Acessibilidade mapeada' : 'Acessibilidade não informada'}</small>
    </div>
    <div className="price"><b>OpenStreetMap</b><small>{place.capacity ? `Capacidade: ${place.capacity}` : 'Vagas livres não informadas'}</small></div>
  </article>;
  const destinationResults = <>
    <p className="map-status">O mapa inclui {demoMapPlaces.length} pontos ilustrativos: R = vaga de rua, P = estacionamento e ♿ = acessibilidade indicada. Eles não representam vagas reais ou livres.</p>
    {filteredPlaces.length > 0 && <>
      <h4 className="result-group-title">Vagas cadastradas (demonstração)</h4>
      {filteredPlaces.map(card)}
    </>}
    {filteredOsmParking.length > 0 && <>
      <h4 className="result-group-title">Estacionamentos mapeados no OpenStreetMap</h4>
      {filteredOsmParking.map(osmCard)}
    </>}
    {osmParkingLoading && <p className="map-status">Buscando estacionamentos no OpenStreetMap...</p>}
    {osmParkingError && <p className="map-status" role="alert">{osmParkingError}</p>}
    {!osmParkingLoading && !osmParkingError && filteredPlaces.length === 0 && filteredOsmParking.length === 0
      && <p className="map-status">{osmParking.length > 0 ? 'Nenhum local corresponde aos filtros.' : 'Nenhuma vaga ou estacionamento encontrado neste raio.'}</p>}
  </>;
  const destinationSearch = buttonLabel => <AddressAutocomplete
    value={destination}
    onChange={value => { setDestination(value); setSelectedSuggestion(null); }}
    onSelect={suggestion => { setDestination(suggestion.label); setSelectedSuggestion(suggestion); }}
    onSearch={locateDestination}
    center={mapCenter}
    selected={selectedSuggestion?.label === destination}
    busy={mapBusy}
    buttonLabel={buttonLabel}
  />;

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
            {destinationSearch('Buscar →')}
            <small>♿ Rotas acessíveis　　⌖ Alertas inteligentes　　▣ Vagas disponíveis</small></div>
            <MapArt center={mapCenter} title="Mapa de São Paulo" places={destinationCoordinates ? mapPlaces : destinationPlaces} osmParking={filteredOsmParking} userLocation={userLocation} routeCoordinates={routeCoordinates} destinationCoordinates={destinationCoordinates} />
          </section>
          <div className="stats"><Stat n={destinationCoordinates ? filteredPlaces.reduce((sum, place) => sum + place.spots, 0) : places.reduce((sum, place) => sum + place.spots, 0)} t={destinationCoordinates ? 'Vagas (demonstração)' : 'Vagas de demonstração'} /><Stat n={destinationCoordinates ? filteredOsmParking.filter(place => place.accessible).length : places.filter(place => place.access).length} t={destinationCoordinates ? 'Acessibilidade mapeada' : 'Acessíveis (demonstração)'} /><Stat n={alerts.length} t="Alertas ativos" /><Stat n="04" t="Rotas inclusivas" /></div>
          <Section title={destinationCoordinates ? 'Vagas e estacionamentos próximos' : 'Estacionamentos de demonstração'} action="Ver mapa completo" click={() => setTab('Mapa')} />
          <div className="columns"><div>{destinationCoordinates
            ? destinationResults
            : destinationPlaces.slice(0, 3).map(card)}</div><div className="panel"><h3>Mapa inteligente <small>Estacionamentos e ruas · OpenStreetMap</small></h3><MapArt center={mapCenter} title="Mapa inteligente de vagas" places={destinationCoordinates ? mapPlaces : destinationPlaces} osmParking={filteredOsmParking} userLocation={userLocation} routeCoordinates={routeCoordinates} destinationCoordinates={destinationCoordinates} /><Legend osm={Boolean(destinationCoordinates)} /></div></div>
          <Section title="Alertas recentes" action="Ver todos" click={() => setTab('Alertas na via')} />
          <div className="alerts">{alerts.slice(0, 3).map(alert => <Alert key={alert.id} a={alert} />)}</div>
          <div className="inclusive"><Accessibility /><div><label>INCLUSIVE MOBILITY</label><h2>Não basta chegar. É preciso que todos consigam chegar.</h2><p>Vagas acessíveis, rotas sem barreiras e recursos de acessibilidade.</p></div><button onClick={() => setTab('Rotas acessíveis')}>Explorar acessibilidade →</button></div>
        </>}

        {tab === 'Mapa' && <div className="mapgrid"><div className="panel"><h3>{destinationCoordinates ? 'Vagas e estacionamentos em até 1 km do destino' : 'Vagas próximas e sua rota'} <small>Ruas, estacionamentos e acessibilidade · OpenStreetMap</small></h3><MapArt center={mapCenter} title="Mapa de disponibilidade" places={mapPlaces} osmParking={filteredOsmParking} userLocation={userLocation} routeCoordinates={routeCoordinates} destinationCoordinates={destinationCoordinates} /><Legend osm={Boolean(destinationCoordinates)} />{destinationCoordinates && <p className="map-status">R e P identificam pontos ilustrativos; o selo ♿ indica acessibilidade de demonstração. Nenhum ponto ilustrativo confirma vaga real ou livre.</p>}{routeCoordinates.length > 0 && <p className="map-status">Rota de carro exibida a partir da sua localização atual.</p>}</div>
          <div className="panel"><h3>{destinationCoordinates ? 'Locais em até 1 km do destino' : 'Vagas próximas'}</h3><div className="search"><Search /><input placeholder="Buscar estacionamento" value={query} onChange={event => setQuery(event.target.value)} /></div>
            <label className="filter"><span><Accessibility /> Mostrar apenas acessíveis</span><input type="checkbox" checked={onlyAccessible} onChange={event => setOnlyAccessible(event.target.checked)} /></label>
            {destinationCoordinates
              ? destinationResults
              : filteredPlaces.length > 0 ? filteredPlaces.map(card) : <p className="map-status">Nenhuma vaga encontrada.</p>}
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
          </div><div className="panel"><h3>Planejar rota acessível</h3>{destinationSearch('Ver no mapa')}<MapArt center={mapCenter} title="Mapa para planejar rota" places={destinationCoordinates ? mapPlaces : destinationPlaces} osmParking={filteredOsmParking} destinationCoordinates={destinationCoordinates} />
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

function AddressAutocomplete({ value, onChange, onSelect, onSearch, center, selected, busy, buttonLabel }) {
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isDefaultRegion = Math.abs(center[0] + 23.5614) < 0.001 && Math.abs(center[1] + 46.6559) < 0.001;
  const [region, setRegion] = useState(() => isDefaultRegion ? { city: 'São Paulo', uf: 'SP' } : null);
  const [regionLoading, setRegionLoading] = useState(!isDefaultRegion);
  const [regionError, setRegionError] = useState('');
  const query = value.trim();
  const postalCode = query.replace(/\D/g, '');
  const isPostalCode = /^\d{8}$/.test(postalCode);

  useEffect(() => {
    if (isDefaultRegion) {
      setRegion({ city: 'São Paulo', uf: 'SP' });
      setRegionLoading(false);
      setRegionError('');
      return undefined;
    }

    const controller = new AbortController();
    let requestTimedOut = false;
    setRegion(null);
    setRegionLoading(true);
    setRegionError('');
    const timeout = window.setTimeout(() => {
      requestTimedOut = true;
      controller.abort();
    }, 8000);

    const resolveRegion = async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${center[0]}&lon=${center[1]}&zoom=10&addressdetails=1&accept-language=pt-BR`;
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error('Não foi possível identificar a cidade desta região.');
        const result = await response.json();
        const address = result.address || {};
        const city = address.city || address.town || address.municipality || address.village;
        const uf = (address['ISO3166-2-lvl4'] || address.state_code || '').split('-').pop().toUpperCase();
        if (!city || uf.length !== 2) throw new Error('Não foi possível identificar a cidade e a UF deste mapa.');
        setRegion({ city, uf });
      } catch (regionError) {
        if (requestTimedOut) setRegionError('A identificação da região demorou demais. Tente novamente.');
        else if (!controller.signal.aborted) setRegionError(regionError.message || 'Não foi possível identificar a região do mapa.');
      } finally {
        window.clearTimeout(timeout);
        if (!controller.signal.aborted || requestTimedOut) setRegionLoading(false);
      }
    };

    resolveRegion();
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [center, isDefaultRegion]);

  useEffect(() => {
    setSuggestionsLoading(false);
    if (selected || query.length < 3 || (!isPostalCode && !region)) {
      setSuggestions([]);
      setSuggestionsError('');
      setHasSearched(false);
      return undefined;
    }

    const controller = new AbortController();
    let requestTimeout;
    let requestTimedOut = false;
    const debounce = window.setTimeout(async () => {
      setSuggestionsLoading(true);
      setSuggestionsError('');
      setHasSearched(false);
      requestTimeout = window.setTimeout(() => {
        requestTimedOut = true;
        controller.abort();
      }, 8000);

      try {
        const url = isPostalCode
          ? `https://viacep.com.br/ws/${postalCode}/json/`
          : `https://viacep.com.br/ws/${encodeURIComponent(region.uf)}/${encodeURIComponent(region.city)}/${encodeURIComponent(query)}/json/`;
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error('O ViaCEP não conseguiu buscar endereços agora.');
        const result = await response.json();
        const records = Array.isArray(result) ? result : result?.erro ? [] : [result];

        const options = records.slice(0, 10).map((address, index) => {
          if (!address?.cep) return null;
          const cityState = `${address.localidade}/${address.uf}`;
          const title = address.logradouro || address.bairro || `CEP ${address.cep}`;
          const details = [address.complemento, address.bairro, cityState, `CEP ${address.cep}`]
            .filter(Boolean)
            .filter(part => part !== title);

          return {
            id: `${address.cep}-${index}`,
            label: [title, ...details].join(', '),
            detail: details.join(', '),
            geocodeQuery: [address.logradouro, address.bairro, address.localidade, address.uf, 'Brasil'].filter(Boolean).join(', '),
            coordinates: null
          };
        }).filter(Boolean);

        setSuggestions(options);
        setHasSearched(true);
      } catch (suggestionError) {
        if (requestTimedOut) {
          setSuggestionsError('A busca de endereços demorou demais. Tente novamente.');
          setHasSearched(true);
        } else if (!controller.signal.aborted) {
          setSuggestionsError(suggestionError.message || 'Não foi possível buscar sugestões de endereço.');
          setHasSearched(true);
        }
      } finally {
        window.clearTimeout(requestTimeout);
        if (!controller.signal.aborted || requestTimedOut) setSuggestionsLoading(false);
      }
    }, 500);

    return () => {
      window.clearTimeout(debounce);
      window.clearTimeout(requestTimeout);
      controller.abort();
    };
  }, [value, region, selected]);

  const chooseSuggestion = suggestion => {
    onSelect(suggestion);
    setIsOpen(false);
    setSuggestions([]);
  };

  return <div className="destination-search">
    <div className="search">
      <MapPin />
      <input
        value={value}
        onChange={event => { onChange(event.target.value); setIsOpen(true); }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onKeyDown={event => {
          if (event.key !== 'Enter') return;
          event.preventDefault();
          if (isOpen && suggestions.length > 0) chooseSuggestion(suggestions[0]);
          else onSearch();
        }}
        aria-autocomplete="list"
        aria-expanded={isOpen && value.trim().length >= 3}
        aria-controls="destination-suggestions"
        placeholder="Para onde você vai?"
      />
      <button disabled={busy} onClick={() => { setIsOpen(false); onSearch(); }}>{busy ? 'Buscando...' : buttonLabel}</button>
    </div>
    {isOpen && value.trim().length >= 3 && <div className="address-suggestions" id="destination-suggestions" role="listbox">
      <div className="suggestion-region">Sugestões próximas à região do mapa</div>
      {!isPostalCode && regionLoading && <div className="suggestion-message">Identificando cidade e estado...</div>}
      {!isPostalCode && regionError && <div className="suggestion-message" role="alert">{regionError}</div>}
      {!isPostalCode && !regionLoading && !regionError && !region && <div className="suggestion-message">Não foi possível identificar a região deste mapa.</div>}
      {(isPostalCode || region) && suggestionsLoading && <div className="suggestion-message">Buscando endereços no ViaCEP...</div>}
      {suggestionsError && <div className="suggestion-message" role="alert">{suggestionsError}</div>}
      {(isPostalCode || region) && !suggestionsLoading && !suggestionsError && hasSearched && suggestions.length === 0 && <div className="suggestion-message">{isPostalCode ? 'CEP não encontrado.' : 'Nenhum endereço encontrado nesta cidade.'}</div>}
      {suggestions.map(suggestion => <button
        type="button"
        className="address-suggestion"
        role="option"
        aria-selected="false"
        key={suggestion.id}
        onMouseDown={event => event.preventDefault()}
        onClick={() => chooseSuggestion(suggestion)}
      >
        <strong>{suggestion.label}</strong>
        {suggestion.detail && <small>{suggestion.detail}</small>}
      </button>)}
    </div>}
  </div>;
}

function MapArt({ center, title, places = [], osmParking = [], userLocation, routeCoordinates = [], destinationCoordinates }) {
  const mapElement = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapElement.current) return undefined;
    const map = L.map(mapElement.current).setView(center, 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);
    mapInstance.current = map;
    return () => {
      map.stop();
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    const layers = L.featureGroup().addTo(map);
    places.filter(place => place.spots > 0).forEach(place => {
      const isStreet = place.type === 'street';
      const typeLabel = isStreet ? 'Vaga de rua' : 'Estacionamento';
      const marker = L.marker(place.coordinates, {
        icon: L.divIcon({
          className: `parking-map-icon demo-${isStreet ? 'street' : 'parking'}-map-icon`,
          html: `<span>${isStreet ? 'R' : 'P'}${place.access ? '<i class="demo-access-badge">♿</i>' : ''}</span>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        })
      }).addTo(layers);
      const popup = document.createElement('div');
      const name = document.createElement('strong');
      name.textContent = place.n;
      const detail = document.createElement('p');
      detail.textContent = place.isGeneratedDemo
        ? `${typeLabel} ilustrativa · não representa vaga confirmada ou livre`
        : `${typeLabel} · ${place.spots} vagas em dado de demonstração · ${place.price}`;
      const address = document.createElement('small');
      address.textContent = place.a;
      const accessibility = document.createElement('p');
      accessibility.textContent = place.access
        ? 'Acessibilidade indicada em dado de demonstração'
        : 'Acessibilidade não informada em dado de demonstração';
      popup.append(name, detail, address, accessibility);
      marker.bindPopup(popup);
    });

    osmParking.forEach(place => {
      const marker = L.marker(place.coordinates, {
        icon: L.divIcon({
          className: place.accessible ? 'osm-parking-map-icon osm-accessible-map-icon' : 'osm-parking-map-icon',
          html: `<span>${place.accessible ? '♿' : 'P'}</span>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        })
      }).addTo(layers);
      const popup = document.createElement('div');
      const name = document.createElement('strong');
      name.textContent = place.name;
      const kind = document.createElement('p');
      kind.textContent = place.kind;
      const address = document.createElement('small');
      address.textContent = `${place.address} · ${formatDistance(place.distance)}`;
      const accessibility = document.createElement('p');
      accessibility.textContent = place.accessible
        ? 'Acessibilidade mapeada'
        : place.wheelchair === 'limited'
          ? 'Acessibilidade limitada'
          : place.wheelchair === 'no'
            ? 'Acessibilidade não disponível (mapeado)'
            : 'Acessibilidade não informada';
      popup.append(name, kind, address, accessibility);
      if (place.capacity) {
        const capacity = document.createElement('small');
        capacity.textContent = `Capacidade total mapeada: ${place.capacity} (não indica vagas livres)`;
        popup.append(capacity);
      }
      marker.bindPopup(popup);
    });

    if (userLocation) {
      L.marker(userLocation, {
        icon: L.divIcon({ className: 'user-map-icon', html: '<span></span>', iconSize: [22, 22], iconAnchor: [11, 11] }),
        zIndexOffset: 1000
      }).bindPopup('Você está aqui').addTo(layers);
    }

    if (routeCoordinates.length > 0) {
      L.polyline(routeCoordinates, { color: '#f22d85', weight: 5, opacity: 0.9 }).addTo(layers);
    }

    const destinationCircle = destinationCoordinates
      ? L.circle(destinationCoordinates, {
        radius: destinationRadius,
        color: '#f22d85',
        fillColor: '#f22d85',
        fillOpacity: 0.08,
        weight: 2
      }).addTo(layers)
      : null;

    if (destinationCoordinates) {
      L.marker(destinationCoordinates, {
        icon: L.divIcon({ className: 'destination-map-icon', html: '<span>Destino</span>', iconSize: [66, 26], iconAnchor: [33, 13] })
      }).addTo(layers);
    } else if (routeCoordinates.length > 0) {
      L.marker(routeCoordinates[routeCoordinates.length - 1], {
        icon: L.divIcon({ className: 'destination-map-icon', html: '<span>Destino</span>', iconSize: [66, 26], iconAnchor: [33, 13] })
      }).addTo(layers);
    }

    if (destinationCircle) {
      map.fitBounds(destinationCircle.getBounds().pad(0.12), { maxZoom: 16, animate: false });
    } else if (layers.getLayers().length > 0) {
      map.fitBounds(layers.getBounds().pad(0.18), { maxZoom: routeCoordinates.length > 0 ? 14 : 16, animate: false });
    } else {
      map.setView(center, 15);
    }
    return () => map.removeLayer(layers);
  }, [center, places, osmParking, userLocation, routeCoordinates, destinationCoordinates]);

  return <div className="map-frame" role="region" aria-label={title}><div className="leaflet-map" ref={mapElement} /></div>;
}

function Stat({ n, t }) { return <div className="stat"><b>{n}</b><small>{t}</small></div>; }
function Section({ title, action, click }) { return <div className="section"><h2>{title}</h2><button onClick={click}>{action} →</button></div>; }
function Alert({ a }) { return <div className="alert"><i>{a.kind === 'access' ? <Accessibility /> : <TriangleAlert />}</i><div><b>{a.t}</b><small>{a.where} · {a.time}</small></div><span>{a.kind === 'access' ? 'Acessibilidade' : 'Atenção'}</span></div>; }
function Note({ title, children }) { return <div className="note"><b>{title}</b><p>{children}</p></div>; }
function Legend({ osm = false }) {
  return <div className="legend">
    {osm
      ? <><span>R = Vaga de rua · P = Estacionamento (demonstração)</span><span>♿ = Acessibilidade indicada (demonstração)</span><span>P = Estacionamento mapeado no OSM</span><span>♿ = Acessibilidade mapeada no OSM</span><span>Ruas do OpenStreetMap</span></>
      : <><span>P = Estacionamento (demonstração)</span><span>♿ = Acessibilidade indicada (demonstração)</span><span>⚠ Alerta</span></>}
  </div>;
}
