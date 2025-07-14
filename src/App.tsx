//FILE: App.tsx

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
            {/* ▼ ADD THIS BUTTON/CONTAINER ▼ */}
            {showCreateForm ? (
                <CreateInstructionForm
                    cenaId={1}
                    personagens={personagens}
                    onCreateSuccess={() => {
                        setShowCreateForm(false);
                        // TODO: Refresh instructions list
                    }}
                />
            ) : (
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="create-button"
                >
                    Criar nova instrução
                </button>
            )}
            {/* ▲ FORM TOGGLE ABOVE ▲ */}

            <div className="tabela">
                {instrucoes.length > 0 ? (
                    instrucoes.map(instrucao => (
                        <InstructionRow
                            instrucao={instrucao}
                            onMentionClick={handleMentionClick}
                        />
                    ))
                ) : (
                    <div>No instructions found</div>
                )}
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