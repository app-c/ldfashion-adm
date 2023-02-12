import styled from "styled-components/native";
import { cor } from "../../styles";

interface Props {
  select: boolean;
}

export const container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export const title = styled.Text`
  margin-left: 10px;
`;

export const circle = styled.View`
  width: 30px;
  height: 30px;
  border-radius: 15px;

  border-width: 1px;
  border-color: ${cor.dark[4]};

  align-items: center;
  justify-content: center;
`;

export const box = styled.View<Props>`
  width: 15px;
  height: 15px;
  border-radius: 8px;
  background-color: ${(h) => (h.select ? cor.dark[3] : cor.dark[1])};
`;
