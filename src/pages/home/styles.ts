import styled from "styled-components/native";
import { cor } from "../../styles";

export const container = styled.View`
  padding-top: 40px;
  flex: 1;
`;

export const title = styled.Text`
  font-size: 18px;
  margin-bottom: 20px;
  font-weight: 900;
`;

export const bottonAdd = styled.TouchableOpacity`
  background-color: rgba(169, 7, 190, 0.534);
  width: 70px;
  height: 70px;
  border-radius: 35px;

  align-items: center;
  justify-content: center;

  position: static;
  bottom: 30px;
  left: 20px;
`;

export const imput = styled.TextInput`
  border-width: 1px;
  border-color: ${cor.dark[3]};
  width: 100%;

  padding: 3px 10px;

  margin-bottom: 20px;
`;

export const modal = styled.Modal`
  align-items: center;
  justify-content: center;
`;

export const containerModal = styled.View`
  width: 90%;
  top: 5%;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background-color: ${cor.dark[1]};

  align-self: center;

  border-radius: 5px;
`;

export const contentButon = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 100%;
`;

export const button = styled.TouchableOpacity`
  padding: 10px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
`;

export const textButon = styled.Text`
  font-size: 18px;
`;

export const imgBox = styled.Image`
  width: 120px;
  height: 120px;

  background-color: ${cor.dark[1]};
`;
