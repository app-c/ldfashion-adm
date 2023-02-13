import styled, { css } from "styled-components/native";
import { cor } from "../../styles";

interface PropsSelect {
  select: boolean;
}

export const container = styled.TouchableOpacity<PropsSelect>`
  padding: 10px;
  height: 40px;

  margin: 20px 10px;

  align-items: center;
  justify-content: center;

  background-color: ${(h) => (h.select ? cor.green[1] : cor.green[4])};
  border-radius: 5px;
`;

export const title = styled.Text`
  color: ${cor.dark[1]};
`;
