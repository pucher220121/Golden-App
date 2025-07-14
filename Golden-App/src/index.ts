import Resolver from '@forge/resolver';
import { storage } from '@forge/api';

const resolver = new Resolver();

resolver.define('getText', async () => {
  const saved = await storage.get('inputValue');
  if (saved) {
    return `Gespeicherter Wert: ${saved}`;
  }
  return "I'm about to start developing a new app - the concept is ready, and now it's time to bring it to life.";
});

resolver.define('getFilterdValue', async () => {
  const saved = await storage.get('filterdCharactersId') as number;
  if (saved) {
    return `Gespeicherter Wert: ${saved}`;
  }
  return "Not filterd";
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
    console.error('Fetch failed:', response.statusText);
    return [];
  }
  const data = await response.json();
  return data.items;
});

resolver.define('filterDragonballCharacters', async ({payload}) =>{
    const { cFilterId } = payload;
    const response = await fetch(`https://dragonball-api.com/api/characters/${cFilterId}`);
    const data = await response.json();
    return data;
});
export const handler = resolver.getDefinitions();