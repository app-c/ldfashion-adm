import React from "react";
import { IModel } from "../../dto";

import * as S from "./styles";

interface Props {
  item: IModel;
  salvar: () => void;
  excluir: () => void;
}

export function Pdidos({ item = {} as IModel, salvar, excluir }: Props) {
  return (
    <S.container>
      <S.box>
        <S.imgBox
          resizeMode="cover"
          resizeMethod="scale"
          source={{ uri: item.image }}
        />

        <S.boxText>
          <S.title>Cliente: {item.user?.nome} </S.title>
          <S.title>Contato: {item.user?.telefone} </S.title>
          <S.title>
            Produto: {"\n"} {(item.category, item.tamanho)}{" "}
          </S.title>
          <S.title>Total R$ {item.amount}</S.title>
        </S.boxText>
      </S.box>

      <S.boxButton>
        <S.button onPress={salvar} color="a">
          <S.textButon>aprovar compra</S.textButon>
        </S.button>

        <S.button onPress={excluir} color="b">
          <S.textButon>Excluir</S.textButon>
        </S.button>
      </S.boxButton>
    </S.container>
  );
}
