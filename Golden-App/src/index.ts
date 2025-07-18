import Resolver from '@forge/resolver';
import { storage } from '@forge/api';
import { getMapping } from './SetMapping';

const resolver = new Resolver();

resolver.define('getText', async () => {
  const saved = await storage.get('inputValue');
  if (saved) {
    return `Gespeicherter Wert: ${saved}`;
  }
  return "I'm about to start developing a new app - the concept is ready, and now it's time to bring it to life.";
});

resolver.define('getBackendText', async () => {
  const text = "I'm about to start developing a new app - the concept is ready, and now it's time to bring it to life";
  return text;
});

resolver.define('getFilterdValue', async () => {
  const saved = await storage.get('setfilterCharactersId');
  if (saved) {
    return saved;
  }
  return false;
});

resolver.define('saveInputValue', async ({ payload }) => {
  await storage.set('inputValue', payload.inputValue);
  return 'Gespeichert!';
});

resolver.define('saveFilterdValue', async ({payload}) => {
  await storage.set('setfilterCharactersId', payload.value);
  return 'Gespeichert';
})

resolver.define('getDragonballCharacters', async ({ payload }) => {
  const { page } = payload;
  const response = await fetch(`https://dragonball-api.com/api/characters?page=${page}&limit=5`);
  if (!response.ok) {
    console.error('Fetch failed getDragonballCharacters:', response.statusText);
    return [];
  }
  const data = await response.json();
  return data.items;
});

resolver.define('getAllDragonballCharacters', async () => {
  const allCharacters = [];

  for (let page = 1; page <= 6; page++) {
    const response = await fetch(`https://dragonball-api.com/api/characters?page=${page}&limit=50`);

    if (!response.ok) {
      console.error(`Fetch failed on page ${page}:`, response.statusText);
      continue;
    }

    const data = await response.json();
    //chack if affiliation has right value
    const filteredData = data.items.filter((character: any) => (character.affiliation == 'Army of Frieza' || character.affiliation == 'Z Fighter' || character.affiliation == 'Villain'));
    allCharacters.push(...filteredData);
  }
  return allCharacters;
});

resolver.define('filterDragonballCharacters', async ({payload}) =>{
    const { cFilterId } = payload;
    const response = await fetch(`https://dragonball-api.com/api/characters/${cFilterId}`);
    const data = await response.json();
    return data;
});

resolver.define('getDestroyedPlanets', async () => {
  const response = await fetch('https://dragonball-api.com/api/planets?isDestroyed=true');

  if (!response.ok) {
    console.error('Fetch failed getDestroyedPlanets:', response.statusText);
    return [];
  }

  const data = await response.json();
  return data || [];
});

resolver.define('getStrongestFighterOfPlanet', async ({payload}) => {
  const planetId = payload.id;
  const response = await fetch(`https://dragonball-api.com/api/planets/${planetId}`);
  if (!response.ok) {
    console.error('Fetch failed getStrongestFighterOfPlanet:', response);
    return null;
  }

  const data = await response.json();
  return data.characters || [];
});

resolver.define('saveToken', async (payload) => {
  const token = payload.payload.token;
  console.log('Token received:', token);
  storage.setSecret('API_TOKEN', token);
  return 'Token als Secret gespeichert!';
});

resolver.define('getToken', async () => {
  const token = storage.getSecret('API_TOKEN');
  return token || '';
});

resolver.define('saveKey', async (payload) => {
  const key = payload.payload.key;
  console.log('Key received:', key);
  storage.set('API_KEY', key);
  return 'Key gespeichert!';
});

resolver.define('getKey', async () => {
  const key = await storage.get('API_KEY');
  return key || '';
});

resolver.define('getMapping', async (payload) => {
  const key = payload.payload.key;
  await getMapping(key);
  return true;
});

resolver.define('patchMapping', async (payload) => {
  const key = payload.payload.key;
  await getMapping(key, true);
  return true;
});
export const handler = resolver.getDefinitions();