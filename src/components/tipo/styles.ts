import styled, { css } from "styled-components/native";
import { cor } from "../../styles";

interface PropsSelect {
  select: boolean;
}

export const container = styled.TouchableOpacity<PropsSelect>`
  padding: 10px;
  width: 100px;
  height: 80px;

  margin: 0 10px;

  align-items: center;
  justify-content: center;

  background-color: ${(h) => (h.select ? cor.pink[1] : cor.pink[3])};
  border-radius: 5px;
`;

export const title = styled.Text`
  color: ${cor.dark[1]};
`;
