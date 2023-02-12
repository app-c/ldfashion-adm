import styled from "styled-components/native";
import { cor } from "../../styles";

export const container = styled.View`
  padding: 20px;
  flex: 1;
`;

export const boxSelect = styled.View`
  margin-top: 20px;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;

export const title = styled.Text``;

export const boxExistent = styled.View`
  border-width: 1px;
  border-color: ${cor.dark[2]};

  margin-top: 20px;
  border-radius: 5px;
`;
export const boxNew = styled.View``;

export const input = styled.TextInput`
  border-width: 1px;
  border-color: ${cor.dark[3]};

  padding: 3px 10px;

  border-radius: 5px;

  margin-top: 10px;
`;

export const bottonImag = styled.TouchableOpacity`
  margin-top: 20px;

  background-color: ${cor.green[2]};
  padding: 5px;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;

export const imgBox = styled.Image`
  width: 150px;
  height: 150px;

  background-color: ${cor.dark[2]};

  margin-top: 20px;
  align-items: center;
  justify-content: center;
`;

export const buttonSave = styled.TouchableOpacity`
  padding: 10px;

  background-color: ${cor.green[3]};
  margin-top: 30px;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;

export const boxTipo = styled.View`
  background-color: ${cor.dark[1]};

  border-radius: 5px;
  margin-top: 30px;
  padding: 10px;
`;

export const titleSave = styled.Text`
  color: ${cor.dark[1]};
  font-weight: 600;
`;

export const contentButton = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
