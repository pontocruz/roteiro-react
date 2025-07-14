//FILE: App.tsx
import { CreateInstructionForm } from './components/CreateInstructionForm'; // Will create this next
import {useState, useEffect} from 'react';
import type {Instrucao} from './types/models';
import './App.css';
import axios from 'axios';
import {MentionParser} from './components/MentionParser';

function App() {
    const [instrucoes, setInstrucoes] = useState<Instrucao[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [personagens, setPersonagens] = useState<{ id: number, nome: string }[]>([]);
    const [showForm, setShowForm] = useState(false);
    const fetchInstrucoes = async () => {
        try {
            const response = await axios.get('https://localhost:7263/Roteiros/GetInstrucoesJson/1');
            setInstrucoes(response.data);
        } catch (err) {
            setError('Failed to refresh data');
        }
    };
    const handleMentionClick = (personagemId: number) => {
        alert(`Personagem ${personagemId} clicked!`); // Temporary
        // Later: Add your logic (filter, highlight, etc.)
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://localhost:7263/Roteiros/GetInstrucoesJson/1`);

                if (response.data) {
                    setInstrucoes(response.data);
                } else {
                    setError('No data received');
                }
            } catch (err) {
                console.error('Full error:', err);
                setError('Failed to load data. Check console and backend.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        fetchInstrucoes();

        const fetchPersonagens = async () => {
            try {
                const response = await axios.get(
                    'https://localhost:7263/Roteiros/GetPersonagensForMentions?cenaId=1'
                );
                setPersonagens(response.data);
            } catch (err) {
                console.error('Failed to fetch personagens:', err);
            }
        };
        fetchPersonagens();

    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="app-container">
            {/* Anti-forgery token (matches your .NET setup) */}
            <input
                type="hidden"
                name="__RequestVerificationToken"
                value={document.querySelector('input[name="__RequestVerificationToken"]')?.value}
            />

            {showForm ? (
                <CreateInstructionForm
                    cenaId={1} // Pass your actual cenaId
                    personagens={personagens}
                    onCreateSuccess={() => {
                        setShowForm(false);
                        // Refresh instructions
                        fetchInstrucoes();
                    }}
                />
            ) : (
                <button
                    onClick={() => setShowForm(true)}
                    className="create-button"
                >
                    Criar nova instrução
                </button>
            )}

            <div className="tabela">
                {instrucoes.map(instrucao => (
                    <InstructionRow key={instrucao.id} instrucao={instrucao} />
                ))}
            </div>
        </div>
    );
}

function InstructionRow({
                            instrucao,
                            onMentionClick
                        }: {
    instrucao: Instrucao;
    onMentionClick?: (id: number) => void;
}) {
    return (
        <div data-id={instrucao.id} className="instrucao-row">
            <div className="ordem">
                <span className="js-ordem">{instrucao.ordemCronologica}</span>
                <br/>
                <span className="js-tipo">[{instrucao.tipoDeInstrucao}]</span>
            </div>
            <div className="texto">
                <strong className="js-personagens">
                    {instrucao.instrucoesPersonagens?.map(ip => (
                        <button
                            key={ip.personagemId}
                            className="personagem-btn"
                            data-personagem-id={ip.personagemId}
                        >
                            {ip.personagem?.nome || `Personagem ${ip.personagemId}`}
                        </button>
                    ))}
                </strong>
                <span className="js-texto"><MentionParser
                    text={instrucao.texto}
                    onMentionClick={onMentionClick}
                /></span>
            </div>
        </div>
    );
}

export default App;