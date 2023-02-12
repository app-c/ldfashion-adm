export interface IType {
  id: string;
  type: string;
}

export interface IUser {
  nome: string;
  telefone: string;
}

export interface IModel {
  id: string;
  tamanho: "P" | "M" | "G" | "GG" | "EG";
  quantity: number;
  amount: number;
  image: string;
  description?: string;
  category?: string;
  user?: IUser;
  qntBuy?: number;
}

export interface ICategory {
  id: string;
  type: string;
  category: string;
  description: string;
  models: IModel[];
}
