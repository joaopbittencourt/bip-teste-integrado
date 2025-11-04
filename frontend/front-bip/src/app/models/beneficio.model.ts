export interface Beneficio {
  id?: number; // BIGINT
  nome: string; // VARCHAR(100)
  descricao?: string; // VARCHAR(255)
  valor: number; // DECIMAL(15,2)
  ativo?: boolean; // BOOLEAN
  version?: number; // BIGINT
}
