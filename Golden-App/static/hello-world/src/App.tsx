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

    useEffect(() => {
        invoke('getText').then((text) => setBackendText(text as string));
    }, []);

    const handleSaveTextInput = async () => {
        await invoke('saveFilterdValue', { inputValue });
        const text = await invoke('getText');
        setBackendText(text as string);
    };
    type Character = {
        id: number;
        name: string;
        Ki: number;
        maxKi: string;
    };

    const handleShow = async () => { 
        if (initialLoaded) return;

        const data = await invoke<Character[]>('getDragonballCharacters', { page: 1 });
        setCharacters(data);
        setInitialLoaded(true);
    };

    const handleShowNext = async () => {
        setShowMore(true);
        const data = await invoke<Character[]>('getDragonballCharacters', { page });
        setCharacters(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
        setShowMore(false);
    };

    useEffect(() => {
        const fetchCharacters = async () => {
            const data = await invoke<Character[]>('getDragonballCharacters');
            console.log(data);
        }

        fetchCharacters();

        const initData = async () => {
            const saved = await invoke('getFilterdValue');
            setfilterCharactersId(saved as number);
        }
        initData();
    });

    const filterCharacters = async (cFilterId: number) => {
        const data = await invoke<Character>('filterDragonballCharacters', { cFilterId });
        setfilterCharacters(data);
    };

    const saveFilterdCharacter = async () => {
        await invoke('saveFilterdValue', { value: filterdCharactersId });
        const saved = await invoke('getFilterdValue');
        setfilterCharactersId(saved as number);
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
                        {filterdCharacters.id} | {filterdCharacters.name} | {filterdCharacters.Ki} | {filterdCharacters.maxKi}
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
                        {char.id} | {char.name} | {char.Ki} | {char.maxKi}
                    </li>
                ))}
            </ul>
            {!showMore && initialLoaded && (
                <button onClick={handleShowNext}>
                    Show more
                </button>
            )}
        </div>
    );
}
export default App;
