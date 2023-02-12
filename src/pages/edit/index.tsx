import React, { useCallback, useEffect, useState } from "react";
import fire from "@react-native-firebase/firestore";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import storage from "@react-native-firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { CategoryComponent } from "../../components/categoryComponent";
import { Select } from "../../components/select";
import { Tipo } from "../../components/tipo";

import * as S from "./styles";
import { ICategory, IModel, IType } from "../../dto";
import { cor } from "../../styles";

interface PropsType {
  type: IType[];
  select: string;
}

interface PropsCategory {
  category: ICategory[];
  select: string;
  one: ICategory;
}

interface PropsTall {
  tal: "P" | "M" | "G" | "GG" | "EG";
}

export function Edit() {
  const nv = useNavigation();
  const [select, setSelect] = useState(0);
  const [cat, setCat] = useState(0);
  const [tal, setTall] = useState<PropsTall>({ tal: "P" });
  const [stok, setStok] = useState("");
  const [amount, setAmount] = useState("");

  const [tp, setTp] = useState("");
  const [ct, setCt] = useState("");
  const [description, setDescription] = useState("");

  const [image, setImage] = useState("");
  const [selectType, setSelecttype] = useState("");
  const [selectCategory, setSelectCategory] = useState("");

  const [type, setType] = useState<IType[]>([]);
  const [category, setCategory] = useState<ICategory[]>([]);

  const loadData = useCallback(() => {
    fire()
      .collection("type")
      .onSnapshot((j) => {
        const rs = j.docs.map((h) => {
          return {
            ...h.data(),
            id: h.id,
          } as IType;
        });
        const res = rs.sort((a, b) => {
          if (a.type < b.type) {
            return -1;
          }
          return 1;
        });
        setType(res);
      });

    fire()
      .collection("category")
      .onSnapshot((j) => {
        const rs = j.docs.map((h) => {
          return {
            ...h.data(),
            id: h.id,
          } as ICategory;
        });
        const res = rs
          .filter((h) => h.type === selectType)
          .sort((a, b) => {
            if (a.category < b.category) {
              return -1;
            }
            return 1;
          });
        setCategory(res);
      });
  }, [selectType]);

  console.log(selectType);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (result.assets) {
      setImage(result.assets[0].uri);
    }
    console.log(result.assets);
  }, []);

  const handleExistent = useCallback(async () => {
    if (stok === "" && amount === "" && category.one.category) {
      return Alert.alert("Erro", "Preença os campos volor e estoque");
    }

    // try {
    //   const ref = storage().ref(`image/${image}.png`);
    //   await ref.delete();
    // } catch (error) {
    //   console.log(error);
    // }

    // const reference = storage().ref(`/image/${image}.png`);

    // await reference.putFile(image);
    // const photoUrl = await reference.getDownloadURL();

    const ctg = category.find((h) => h.category === selectCategory);

    const rs = {
      tamanho: tal.tal,
      quantity: stok,
      amount,
      image: "photoUrl",
      description: ctg?.description,
      category: selectCategory,
    };

    fire()
      .collection("model")
      .add(rs)
      .then(() => {
        Alert.alert("Sucesso", "Novo item salvo");
        nv.navigate("home");
      });
  }, [amount, category, nv, selectCategory, stok, tal.tal]);

  const addType = useCallback(() => {
    fire().collection("type").add({ type: tp });
    setSelect(0);
  }, [tp]);

  const addcategoria = useCallback(
    (type: string) => {
      const rs = {
        type,
        description,
        category: ct,
      };

      fire().collection("category").add(rs);
      setCat(0);
      setSelectCategory("");
    },
    [ct, description]
  );

  return (
    <S.container>
      <ScrollView>
        <S.boxExistent>
          {/* TIPO DE ROUTE */}
          <S.boxTipo>
            <S.title
              style={{
                marginBottom: 10,
                alignSelf: "center",
                color: cor.dark[4],
                fontWeight: "900",
                fontSize: 18,
              }}
            >
              Tipo de roupa disponíveis
            </S.title>
            <FlatList
              horizontal
              contentContainerStyle={{
                paddingHorizontal: 5,
              }}
              data={type}
              keyExtractor={(h) => h.id}
              renderItem={({ item: h }) => (
                <Tipo
                  pres={() => {
                    setSelecttype(h.type);
                    setSelectCategory("");
                  }}
                  title={h.type}
                  select={selectType === h.type}
                />
              )}
            />

            <S.boxSelect>
              <Select
                select={select === 1}
                pres={() => setSelect(1)}
                title="Adicionar um novo TIPO de roupa"
              />
            </S.boxSelect>

            {select === 1 && (
              <View>
                <S.input
                  onChangeText={setTp}
                  placeholder="digite o nome do TIPO de roupa"
                />
                <S.contentButton>
                  <S.buttonSave
                    style={{ width: 140, backgroundColor: cor.alert[2] }}
                    onPress={() => setSelect(0)}
                  >
                    <S.titleSave>Cancelar</S.titleSave>
                  </S.buttonSave>

                  <S.buttonSave
                    style={{ width: 140, backgroundColor: cor.green[2] }}
                    onPress={addType}
                  >
                    <S.titleSave>Salvar</S.titleSave>
                  </S.buttonSave>
                </S.contentButton>
              </View>
            )}
          </S.boxTipo>

          {/* CATEGORIA */}
          {selectType !== "" && (
            <S.boxTipo>
              <S.title
                style={{
                  marginBottom: 10,
                  alignSelf: "center",
                  color: cor.dark[4],
                  fontWeight: "900",
                  fontSize: 18,
                }}
              >
                Categorias disponiveis
              </S.title>

              <FlatList
                horizontal
                contentContainerStyle={{
                  paddingHorizontal: 5,
                }}
                data={category}
                keyExtractor={(h) => h.id}
                renderItem={({ item: h }) => (
                  <CategoryComponent
                    pres={() => setSelectCategory(h.category)}
                    title={h.category}
                    select={selectCategory === h.category}
                  />
                )}
              />

              <S.boxSelect>
                <Select
                  select={cat === 1}
                  pres={() => setCat(1)}
                  title="Adicionar nova categoria"
                />
              </S.boxSelect>

              {cat === 1 && (
                <View>
                  <S.input
                    onChangeText={setCt}
                    placeholder="digite o nome da categoria"
                  />
                  <S.input
                    onChangeText={setDescription}
                    placeholder="escreva uma descriçao"
                  />

                  <S.contentButton>
                    <S.buttonSave
                      style={{ width: 140, backgroundColor: cor.alert[2] }}
                      onPress={() => setCat(0)}
                    >
                      <S.titleSave>Cancelar</S.titleSave>
                    </S.buttonSave>

                    <S.buttonSave
                      style={{ width: 140, backgroundColor: cor.green[2] }}
                      onPress={() => addcategoria(selectType)}
                    >
                      <S.titleSave>Salvar</S.titleSave>
                    </S.buttonSave>
                  </S.contentButton>
                </View>
              )}
            </S.boxTipo>
          )}

          {cat === 0 && selectCategory !== "" && (
            <S.boxTipo>
              <S.title
                style={{
                  marginBottom: 10,
                  alignSelf: "center",
                  color: cor.dark[4],
                  fontWeight: "900",
                  fontSize: 18,
                }}
              >
                Adicionar novo item
              </S.title>
              <S.input
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="valor R$"
              />
              <S.input
                placeholder="Estoque"
                onChangeText={setStok}
                keyboardType="numeric"
              />

              <S.boxSelect>
                <Select
                  pres={() => setTall({ tal: "P" })}
                  select={tal.tal === "P"}
                  title="P"
                />
                <Select
                  pres={() => setTall({ tal: "M" })}
                  select={tal.tal === "M"}
                  title="M"
                />
                <Select
                  pres={() => setTall({ tal: "G" })}
                  select={tal.tal === "G"}
                  title="G"
                />
                <Select
                  pres={() => setTall({ tal: "GG" })}
                  select={tal.tal === "GG"}
                  title="GG"
                />
                <Select
                  pres={() => setTall({ tal: "EG" })}
                  select={tal.tal === "EG"}
                  title="EG"
                />
              </S.boxSelect>

              {image === "" ? (
                <S.imgBox resizeMode="contain" />
              ) : (
                <S.imgBox resizeMode="contain" source={{ uri: `${image}` }} />
              )}

              <S.bottonImag onPress={handleImage}>
                <S.title>Adicionar image</S.title>
              </S.bottonImag>
            </S.boxTipo>
          )}
        </S.boxExistent>

        {cat === 0 && (
          <S.buttonSave onPress={handleExistent}>
            <S.titleSave>Salvar</S.titleSave>
          </S.buttonSave>
        )}
      </ScrollView>
    </S.container>
  );
}
