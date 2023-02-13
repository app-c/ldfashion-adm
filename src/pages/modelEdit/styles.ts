import styled from "styled-components/native";
import { cor } from "../../styles";

export const container = styled.View`
  flex: 1;
  padding-top: 40px;
`;

export const title = styled.Text``;

export const imput = styled.TextInput`
  padding: 3px 10px;

  border-radius: 5px;
  border-width: 1px;
  border-color: ${cor.dark[2]};

  margin: 10px 0;
`;

export const butonImage = styled.TouchableOpacity`
  background-color: ${cor.dark[3]};

  padding: 5px;
  border-radius: 5px;
`;

export const textButonImg = styled.Text`
  color: #fff;
  font-weight: 800;
`;
