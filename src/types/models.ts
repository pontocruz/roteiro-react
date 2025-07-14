//FILE: models.ts

export interface Instrucao {
    id: number;
    cenaId: number;
    ordemCronologica: number;
    TipoDeInstrucao: string;
    texto: string;
    instrucoesPersonagens: InstrucaoPersonagem[];
}

export interface InstrucaoPersonagem {
    personagemId?: number;
    showAll: boolean;
    showAllExcept: boolean;
    personagem?: Personagem;
}

export interface Personagem {
    id: number;
    nome: string;
}