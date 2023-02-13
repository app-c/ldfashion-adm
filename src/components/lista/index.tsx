import React from "react";
import { IModel } from "../../dto";

import * as S from "./styles";

interface Props {
  item: IModel;
  edit: () => void;
  excluir: () => void;
}

export function Lista({ item = {} as IModel, edit, excluir }: Props) {
  return (
    <S.container>
      <S.box>
        <S.imgBox
          resizeMode="cover"
          resizeMethod="scale"
          source={{ uri: item.image }}
        />

        <S.boxText>
          <S.title>Estoque: {item.quantity}</S.title>
          <S.title>R$ {item.amount}</S.title>

          <S.boxButton>
            <S.button onPress={edit} color="a">
              <S.textButon>Editar</S.textButon>
            </S.button>

            <S.button onPress={excluir} color="b">
              <S.textButon>Excluir</S.textButon>
            </S.button>
          </S.boxButton>
        </S.boxText>
      </S.box>
    </S.container>
  );
}
