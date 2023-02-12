import styled from "styled-components/native";
import { cor } from "../../styles";

type Color = "a" | "b";

interface PropsColar {
  color: Color;
}

const variant = {
  a: cor.green[3],
  b: cor.alert[1],
};

export const container = styled.View`
  padding: 20px;
`;

export const box = styled.View`
  flex-direction: row;
`;

export const imgBox = styled.View`
  width: 150px;
  height: 100px;

  background-color: ${cor.dark[2]};
  border-radius: 5px;
`;

export const boxText = styled.View`
  left: 10px;
  width: 50%;
`;

export const boxButton = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

export const button = styled.TouchableOpacity<PropsColar>`
  padding: 5px 10px;
  background-color: ${(h) => variant[h.color]};
  border-radius: 5px;
`;

export const textButon = styled.Text`
  color: ${cor.dark[1]};
`;

export const title = styled.Text`
  font-size: 20px;
`;
