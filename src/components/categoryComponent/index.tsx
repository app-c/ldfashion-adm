import React from "react";

import * as S from "./styles";

interface Props {
  select: boolean;
  title: string;
  pres: () => void;
}

export function CategoryComponent({ select, pres, title }: Props) {
  return (
    <S.container onPress={pres} select={select}>
      <S.title>{title}</S.title>
    </S.container>
  );
}
