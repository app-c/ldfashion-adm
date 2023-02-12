import React from "react";

import * as S from "./styles";

interface Props {
  title: string;
  select: boolean;
  pres: () => void;
}

export function Select({ title = "Existente", select, pres }: Props) {
  return (
    <S.container onPress={pres}>
      <S.circle>
        <S.box select={select} />
      </S.circle>
      <S.title>{title}</S.title>
    </S.container>
  );
}
