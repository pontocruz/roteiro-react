import { useState } from 'react';
import axios from 'axios';
import type { TipoDeInstrucao } from '../types/models';

interface Props {
    cenaId: number;
    personagens: { id: number; nome: string }[];
    onCreateSuccess: () => void;
}

export function CreateInstructionForm({ cenaId, personagens, onCreateSuccess }: Props) {
    const [tipo, setTipo] = useState<TipoDeInstrucao>('Dialogo');
    const [texto, setTexto] = useState('');
    const [personagemIds, setPersonagemIds] = useState<number[]>([0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post('/Roteiros/CreateInstrucao', {
                CenaId: cenaId,
                TipoDeInstrucao: tipo,
                Texto: texto,
                personagemIds: personagemIds.filter(id => id > 0)
            }, {
                headers: {
                    'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]')?.value
                }
            });

            if (response.data.success) {
                onCreateSuccess();
                setTexto('');
                setPersonagemIds([0]);
            } else {
                setError(response.data.error || 'Failed to create instruction');
            }
        } catch (err) {
            setError('Network error');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="instruction-form">
            <div className="form-group">
                <label>Tipo:</label>
                <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as TipoDeInstrucao)}
                    required
                >
                    <option value="Dialogo">Diálogo</option>
                    <option value="Acao">Ação</option>
                    {/* Add other enum values */}
                </select>
            </div>

            <div className="form-group">
                <label>Personagens:</label>
                {personagemIds.map((id, index) => (
                    <div key={index} className="personagem-select-group">
                        <select
                            value={id}
                            onChange={(e) => {
                                const newIds = [...personagemIds];
                                newIds[index] = Number(e.target.value);
                                setPersonagemIds(newIds);
                            }}
                        >
                            <option value="0">-- Selecione --</option>
                            {personagens.map(p => (
                                <option key={p.id} value={p.id}>{p.nome}</option>
                            ))}
                            <option value="-1">TODOS</option>
                            <option value="-2">TODOS exceto</option>
                        </select>
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => setPersonagemIds(personagemIds.filter((_, i) => i !== index))}
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
                {personagemIds.length < 10 && (
                    <button
                        type="button"
                        onClick={() => setPersonagemIds([...personagemIds, 0])}
                    >
                        + Add Personagem
                    </button>
                )}
            </div>

            <div className="form-group">
                <label>Texto:</label>
                <textarea
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    required
                />
            </div>

            {error && <div className="error">{error}</div>}

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Criando...' : 'Criar Instrução'}
            </button>
        </form>
    );
}