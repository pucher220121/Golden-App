import { useState, useEffect } from 'react';
import { invoke } from '@forge/bridge';

function App() {

    const [inputValue, setInputValue] = useState('');
    const [backendText, setBackendText] = useState('');
    const [characters, setCharacters] = useState<Character[]>([]);
    const [filterdCharacters, setfilterCharacters] = useState<Character>();
    const [page, setPage] = useState<number>(2);
    const [initialLoaded, setInitialLoaded] = useState<boolean>(false);
    const [showMore, setShowMore] = useState<boolean>(false);
    const [filterdCharactersId, setfilterCharactersId] = useState<number>();
    const [groupedCharacters, setGroupedCharacters] = useState<{ [key: string]: Character[] }>({});
    const [destroyedPlanets, setDestroyedPlanets] = useState<Planet[]>([]);
    const [strongestFighters, setStrongestFighters] = useState<{ [planetId: number]: string }>({});
    const [showMoreCounter, setShowMoreCounter] = useState<number>(0);
    const [key, setKey] = useState("");
    const [token, setToken] = useState("");


    useEffect(() => {
        invoke('getBackendText').then((text) => setBackendText(text as string));
    }, []);
    const handleSaveTextInput = async () => {
        await invoke('saveInputValue', { inputValue });
    };

    useEffect(() => {

        const init = async () => {
            await invoke('getKey')
            .then((saved) => {
                console.log('Key from backend:', saved);
                if (typeof saved === 'string') {
                    setKey(saved);
                }
            })
            .catch((err) => console.error('Error fetching key:', err));

            await invoke('getToken')
                .then((saved) => {
                    console.log('Token from backend:', saved);
                    if (typeof saved === 'string') {
                        setToken(saved);
                    }
                })
                .catch((err) => console.error('Error fetching token:', err));
            }
        init();
    }, []);

    const handleTokenChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setToken(value);
        await invoke('saveToken', { token: value });
    };
    const handleKeyChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setKey(value);
        await invoke('saveKey', { key: value });
    };

    type Character = {
        id: number;
        name: string;
        ki: string;
        maxKi: string;
        affiliation: string;
    };
    type Planet = {
        id: number;
        name: string;
        isDestroyed: boolean;
    };

    const handleShow = async () => {
        if (initialLoaded) return;

        const data = await invoke<Character[]>('getDragonballCharacters', { page: 1 });
        setCharacters(data);
        setInitialLoaded(true);
    };

    useEffect(() => {
        if (showMoreCounter >= 11) {
            setInitialLoaded(false);
        }
    }, [showMoreCounter]);

    const handleShowNext = async () => {
        setShowMore(true);
        const data = await invoke<Character[]>('getDragonballCharacters', { page });
        setCharacters(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
        setShowMore(false);
        setShowMoreCounter(prev => prev + 1);
    };

    useEffect(() => {

        const initData = async () => {
            const saved = await invoke('getFilterdValue');
            setfilterCharactersId(saved as number);
            filterCharacters(saved as number);
        }
        initData();
    }, []);

    const filterCharacters = async (cFilterId: number) => {
        const data = await invoke<Character>('filterDragonballCharacters', { cFilterId });
        setfilterCharacters(data);
    };

    const saveFilterdCharacter = async () => {
        await invoke('saveFilterdValue', { value: filterdCharactersId });
        const saved = await invoke('getFilterdValue');
        setfilterCharactersId(saved as number);
    };

    const listCharacters = async () => {
        const allCharacters = await invoke<Character[]>('getAllDragonballCharacters');
        return allCharacters;
    };

    useEffect(() => {
        const loadAndGroupCharacters = async () => {
            const allChars = await listCharacters();
            const grouped: { [key: string]: Character[] } = {};

            allChars.forEach((char) => {
                if (!grouped[char.affiliation]) {
                    grouped[char.affiliation] = [];
                }
                grouped[char.affiliation].push(char);
            });

            setGroupedCharacters(grouped);
        };

        loadAndGroupCharacters();
    }, []);

    const handleGetDestroyedPlanets = async () => {
        const destroyedPlanets = await invoke<Planet[]>('getDestroyedPlanets');
        return destroyedPlanets;
    };

    useEffect(() => {
        const fetchDestroyedPlanets = async () => {
            const planets = await handleGetDestroyedPlanets();
            setDestroyedPlanets(planets as Planet[]);
        };
        fetchDestroyedPlanets();
    }, []);

    const getStrongestFighter = async (id: number) => {
        const planetFighters = await invoke<Character[]>('getStrongestFighterOfPlanet', { id });

        if (!Array.isArray(planetFighters) || planetFighters.length == 0) {
            return 'unbekannt';
        }
        const strongest = planetFighters.reduce((prev, current) => {
            const prevKi = parseKiValue(prev.maxKi);
            const currKi = parseKiValue(current.maxKi);
            return currKi > prevKi ? current : prev;
        });

        return strongest.name;
    };



    useEffect(() => {
        const loadStrongestFighters = async () => {
            const newStrongest: { [planetId: number]: string } = {};

            for (const planet of destroyedPlanets) {
                const fighterName = await getStrongestFighter(planet.id);
                newStrongest[planet.id] = fighterName;
            }

            setStrongestFighters(newStrongest);
        };

        if (destroyedPlanets.length > 0) {
            loadStrongestFighters();
        }
    }, [destroyedPlanets]);


    const parseKiValue = (kiString: string): number => {
        if (!kiString) return 0;

        const units: { [key: string]: number } = {
            'Thousand': 1e3,
            'Million': 1e6,
            'Billion': 1e9,
            'Trillion': 1e12,
            'Quadrillion': 1e15,
            'Quintillion': 1e18,
            'Sextillion': 1e21,
            'Septillion': 1e24,
            'Octillion': 1e27,
            'Nonillion': 1e30,
            'Decillion': 1e33,
            'Googolplex': 1e100
        };

        const [numberPart, unitPart] = kiString.split(' ');

        const base = parseFloat(numberPart);
        const multiplier = units[unitPart] ?? 1;

        return base * multiplier;
    };

    const getMapping = async (key: string) => {
        const mapping = await invoke('getMapping', { key });
        console.log('Mapping:', mapping);
    };

    const getPatchMapping = async (key: string) => {
        const mapping = await invoke('patchMapping', { key });
        console.log('Patch Mapping:', mapping);
    };
    return (
        <div>
            <p>{backendText}</p>
            <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Eingabe"
                maxLength={10}
            />
            <button onClick={handleSaveTextInput}>Speichern</button>
            <h1>{inputValue}</h1>
            <input
                type="number" min="1" max="78"
                placeholder='Filter'
                onChange={e => {
                    const value = e.target.value;
                    if (value === '') {
                        setfilterCharacters(undefined);
                    } else {
                        filterCharacters(Number(value));
                        setfilterCharactersId(Number(value));
                    }
                }}
            />
            <button onClick={saveFilterdCharacter}>Save</button>
            <p>{filterdCharactersId}</p>
            {filterdCharacters?.id && (
                <ul>
                    <li>
                        {filterdCharacters.id} | {filterdCharacters.name} | {filterdCharacters.ki} | {filterdCharacters.maxKi}
                    </li>
                </ul>
            )}

            {!initialLoaded && (
                <button onClick={handleShow}>
                    Show first 5 characters
                </button>
            )}
            <ul>
                {characters.map((char) => (
                    <li key={char.id}>
                        {char.id} | {char.name} | {char.ki} | {char.maxKi}
                    </li>
                ))}
            </ul>
            {!showMore && initialLoaded && (
                <button onClick={handleShowNext}>
                    Show more
                </button>
            )}

            {Object.entries(groupedCharacters).map(([affiliation, chars]) => (
                <div key={affiliation}>
                    <h3>{affiliation}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Ki</th>
                                <th>Max Ki</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chars
                                .map((char) => (
                                    <tr key={char.id}>
                                        <td>{char.id}</td>
                                        <td>{char.name}</td>
                                        <td>{char.ki}</td>
                                        <td>{char.maxKi}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            ))}

            <h3>Zerstörte Planeten</h3>
            {destroyedPlanets.map((planet) => (
                <div key={planet.id}>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Stärkster Kämpfer</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{planet.id}</td>
                                <td>{planet.name}</td>
                                <td>
                                    {strongestFighters[planet.id]}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ))}
            <div>
                <label className="block font-semibold">Token (secret):</label>
                <input
                    type="text"
                    value={token}
                    onChange={handleTokenChange}
                    className="border px-2 py-1 rounded w-full"
                    placeholder="Enter token"
                />
            </div>
            <div>
                <label className="block font-semibold">Key (max. 5 Zeichen):</label>
                <input
                    type="text"
                    value={key}
                    onChange={handleKeyChange}
                    maxLength={5}
                    className="border px-2 py-1 rounded w-full"
                    placeholder="Enter key"
                />
            </div>
            <button onClick={() => getMapping(token)}>Set Mapping</button> 
            <button onClick={() => getPatchMapping(token)}>Set Patch Mapping</button>
            
        </div>
    );
}
export default App;
