import React, { useCallback, useEffect, useMemo, useState } from "react";
import fire from "@react-native-firebase/firestore";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
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
import { currency, number } from "../../utils";

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
  tal: "P" | "M" | "G" | "GG" | "G1" | "G2" | "G3";
}

interface PropsSelectType {
  item: IType;
}

interface PropsSelectCateg {
  item: ICategory;
}

export function Edit() {
  const nv = useNavigation();
  const [select, setSelect] = useState(0);
  const [cat, setCat] = useState(0);
  const [tal, setTall] = useState<PropsTall>({ tal: "P" });
  const [stok, setStok] = useState("");
  const [amount, setAmount] = useState("");
  const [load, setLoad] = React.useState(false);

  const [nameType, setNameType] = React.useState("");
  const [nameCategory, setNameCategory] = React.useState("");

  const [tp, setTp] = useState("");
  const [ct, setCt] = useState("");
  const [description, setDescription] = useState("");
  const [model, setModel] = React.useState<IModel[]>([]);

  const [image, setImage] = useState("");

  const [selectType, setSelecttype] = useState<PropsSelectType>({
    item: {} as IType,
  });
  const [selectCateg, setSelectCateg] = useState<PropsSelectCateg>({
    item: {} as ICategory,
  });

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
      .collection("model")
      .get()
      .then((h) => {
        const rs = h.docs.map((p) => {
          return {
            ...p.data(),
            id: p.id,
          } as IModel;
        });
        setModel(rs);
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

        setCategory(rs);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const list = useMemo(() => {
    // setSe({ item: {} as ICategory });
    const lc = category
      .filter((h) => h.type === selectType.item.type)
      .sort((a, b) => {
        if (a.category < b.category) {
          return -1;
        }
        return 1;
      });

    const lmo = model.filter((h) => h.category === selectCateg.item.category);

    return { lc, lmo };
  }, [category, model, selectCateg.item.category, selectType.item.type]);

  const handleImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (result.assets) {
      setImage(result.assets[0].uri);
    }
  }, []);

  const handleExistent = useCallback(async () => {
    setLoad(true);
    if (stok === "" && amount === "" && selectCateg.item.category === "") {
      setLoad(false);
      return Alert.alert("Erro", "Preença os campos volor e estoque");
    }

    const referenc = "lksdflsdfklj";
    // try {
    //   const ref = storage().ref(`image/${image}.png`);
    //   await ref.delete();
    // } catch (error) {
    //   console.log(error);
    // }
    const ref = new Date().getTime();
    const ctg = category.find((h) => h.category === selectCateg.item.category);

    const reference = storage().ref(`/image/${image}`);

    await reference.putFile(image);
    const photoUrl = await reference.getDownloadURL();
    const vl = number(amount);
    const rs = {
      tamanho: tal.tal,
      quantity: stok,
      amount: vl,
      image: photoUrl,
      description: ctg?.description,
      category: selectCateg.item.category,
    };

    console.log(rs);

    fire()
      .collection("model")
      .add(rs)
      .then(() => {
        setLoad(false);
        Alert.alert("Sucesso", "Novo item salvo");
        nv.navigate("home");
      })
      .catch((err) => setLoad(false));
  }, [amount, category, image, nv, selectCateg.item.category, stok, tal.tal]);

  const addType = useCallback(() => {
    fire().collection("type").add({ type: tp });
    setSelect(0);
  }, [tp]);

  const addcategoria = useCallback(
    (item: string) => {
      const rs = {
        type: item,
        description,
        category: ct,
      };

      fire().collection("category").add(rs);
      setCat(0);
    },
    [ct, description]
  );

  const handleEditType = React.useCallback(async () => {
    if (nameType !== "") {
      fire()
        .collection("type")
        .doc(selectType.item.id)
        .update({
          type: nameType,
        })
        .then((h) => {
          list.lc.forEach((p) => {
            fire().collection("category").doc(p.id).update({
              type: nameType,
            });
          });
          setSelect(0);
        });
    }
    //   type: nameType,
    // });
  }, [list.lc, nameType, selectType.item.id]);

  const handleDeleteType = React.useCallback(async () => {
    if (selectType.item.id) {
      fire()
        .collection("type")
        .doc(selectType.item.id)
        .delete()
        .then((h) => {
          list.lc.forEach((p) => {
            fire()
              .collection("category")
              .doc(p.id)
              .delete()
              .then((h) => console.log("ok"));
          });
          setSelect(0);
        });
    }
  }, [list.lc, selectType.item.id]);

  const handleEditCategory = React.useCallback(async () => {
    if (ct !== "") {
      fire()
        .collection("category")
        .doc(selectCateg.item.id)
        .update({
          category: ct,
        })
        .then((h) => {
          console.log("ok");
          list.lmo.forEach((p) => {
            fire().collection("model").doc(p.id).update({
              category: nameCategory,
            });
          });
          setCat(0);
          setSelect(0);
        });
    }
  }, [ct, list.lmo, nameCategory, selectCateg.item.id]);

  const handleDeleteCategory = React.useCallback(async () => {
    if (selectType.item.id) {
      fire()
        .collection("category")
        .doc(selectCateg.item.id)
        .delete()
        .then((h) => {
          list.lc.forEach((p) => {
            fire()
              .collection("model")
              .doc(p.id)
              .delete()
              .then((h) => setCat(0));
          });
          setCat(0);
          setSelect(0);
        });
    }
  }, [list.lc, selectCateg.item.id, selectType.item.id]);

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
                    setSelecttype({ item: h });
                    setSelectCateg({ item: {} as ICategory });
                  }}
                  title={h.type}
                  select={selectType.item.type === h.type}
                />
              )}
            />

            <S.boxSelect>
              <Select
                select={select === 1}
                pres={() => setSelect(1)}
                title="Novo"
              />

              {selectType.item.type && (
                <S.box>
                  <Select
                    select={select === 2}
                    pres={() => {
                      setSelect(2);
                    }}
                    title="Editar"
                  />

                  <Select
                    select={select === 3}
                    pres={() => setSelect(3)}
                    title="Excluir"
                  />
                </S.box>
              )}
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

            {select === 2 && (
              <View>
                <S.input
                  onChangeText={setNameType}
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
                    onPress={handleEditType}
                  >
                    <S.titleSave>Salvar</S.titleSave>
                  </S.buttonSave>
                </S.contentButton>
              </View>
            )}

            {select === 3 && (
              <View>
                <S.contentButton>
                  <S.buttonSave
                    style={{ width: 140, backgroundColor: cor.alert[2] }}
                    onPress={() => setSelect(0)}
                  >
                    <S.titleSave>Cancelar</S.titleSave>
                  </S.buttonSave>

                  <S.buttonSave
                    style={{ width: 140, backgroundColor: cor.green[2] }}
                    onPress={handleDeleteType}
                  >
                    <S.titleSave>Excluir</S.titleSave>
                  </S.buttonSave>
                </S.contentButton>
              </View>
            )}
          </S.boxTipo>

          {/* CATEGORIA */}
          {selectType.item.type && (
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
                data={list.lc}
                keyExtractor={(h) => h.id}
                renderItem={({ item: h }) => (
                  <CategoryComponent
                    pres={() => setSelectCateg({ item: h })}
                    title={h.category}
                    select={selectCateg.item.category === h.category}
                  />
                )}
              />

              <S.boxSelect>
                <Select
                  select={cat === 1}
                  pres={() => setCat(1)}
                  title="Novo"
                />

                {selectCateg.item.category && (
                  <S.box>
                    <Select
                      select={cat === 2}
                      pres={() => setCat(2)}
                      title="Editar"
                    />

                    <Select
                      select={cat === 3}
                      pres={() => setCat(3)}
                      title="Excluir"
                    />
                  </S.box>
                )}
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
                      onPress={() => addcategoria(selectType.item.type)}
                    >
                      <S.titleSave>Salvar</S.titleSave>
                    </S.buttonSave>
                  </S.contentButton>
                </View>
              )}

              {cat === 2 && (
                <View>
                  <S.input
                    onChangeText={setCt}
                    placeholder="digite o nome da categoria"
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
                      onPress={handleEditCategory}
                    >
                      <S.titleSave>Salvar</S.titleSave>
                    </S.buttonSave>
                  </S.contentButton>
                </View>
              )}

              {cat === 3 && (
                <View>
                  <S.contentButton>
                    <S.buttonSave
                      style={{ width: 140, backgroundColor: cor.alert[2] }}
                      onPress={() => setCat(0)}
                    >
                      <S.titleSave>Cancelar</S.titleSave>
                    </S.buttonSave>

                    <S.buttonSave
                      style={{ width: 140, backgroundColor: cor.green[2] }}
                      onPress={handleDeleteCategory}
                    >
                      <S.titleSave>Excluir</S.titleSave>
                    </S.buttonSave>
                  </S.contentButton>
                </View>
              )}
            </S.boxTipo>
          )}

          {cat === 0 && selectCateg.item.category && (
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
              </S.boxSelect>

              <S.boxSelect>
                <Select
                  pres={() => setTall({ tal: "G1" })}
                  select={tal.tal === "G1"}
                  title="G1"
                />
                <Select
                  pres={() => setTall({ tal: "G2" })}
                  select={tal.tal === "G2"}
                  title="G2"
                />

                <Select
                  pres={() => setTall({ tal: "G3" })}
                  select={tal.tal === "G3"}
                  title="G3"
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
            {load ? (
              <ActivityIndicator size={34} color="#fff" />
            ) : (
              <S.titleSave>Salvar</S.titleSave>
            )}
          </S.buttonSave>
        )}
      </ScrollView>
    </S.container>
  );
}
