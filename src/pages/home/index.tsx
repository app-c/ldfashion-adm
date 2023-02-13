/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import fire from "@react-native-firebase/firestore";
import { FlatList, Modal, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import storage from "@react-native-firebase/storage";
import { Tipo } from "../../components/tipo";
import { ICategory, IModel, IType } from "../../dto";

import * as S from "./styles";
import { CategoryComponent } from "../../components/categoryComponent";
import { Lista } from "../../components/lista";
import { cor } from "../../styles";

interface ISelect {
  ct: ICategory;
}

interface PropsMoal {
  itemM?: IModel;
  itemC?: ICategory;
  showM: boolean;
  showC: boolean;
}

export function Home() {
  const nv = useNavigation();

  const [selectType, setSelectType] = useState("");
  const [selectCategory, setSelectCategory] = useState<ISelect>();

  const [type, setType] = useState<IType[]>([]);
  const [category, setCategory] = useState<ICategory[]>([]);
  const [models, setModels] = useState<IModel[]>([]);

  const [modalCat, setModalCat] = useState(false);
  const [modalModels, setModalModels] = useState(false);

  const [qnt, setQnt] = useState("1");
  const [amount, setAmount] = useState("0");
  const [description, setDescription] = useState("");

  const [show, setShow] = useState<PropsMoal>({ showC: false, showM: false });
  const [img, setImg] = useState("");

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

        setCategory(rs);
      });

    fire()
      .collection("model")
      .onSnapshot((j) => {
        const rs = j.docs.map((h) => {
          return {
            ...h.data(),
            id: h.id,
          } as IModel;
        });

        setModels(rs);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const list = useMemo(() => {
    const lc = category
      .filter((h) => h.type === selectType)
      .sort((a, b) => {
        if (a.category < b.category) {
          return -1;
        }
        return 1;
      });

    const lm = models
      .filter((h) => h.category === selectCategory?.ct.category)
      .sort((a, b) => {
        if (a.category! < b.category!) {
          return -1;
        }
        return 1;
      });

    return { lc, lm };
  }, [category, models, selectCategory, selectType]);

  const handleDelete = useCallback((item: IModel) => {
    fire().collection("model").doc(item.id).delete();
  }, []);

  const handleEdit = useCallback(async () => {
    const ref = new Date().getTime();
    const reference = storage().ref(`/image/${ref}.png`);
    let photoUrl = null;

    if (img !== "") {
      await reference.putFile(img);
      photoUrl = await reference.getDownloadURL();
    }

    const image = img === "" ? show?.itemM?.image : photoUrl;

    const ds = {
      amount: Number(amount),
      quantity: Number(qnt),
      image,
    };

    fire()
      .collection("model")
      .doc(show?.itemM!.id)
      .update(ds)
      .then(() => {
        setShow({ showM: false, itemC: {}, itemM: {} });
        setImg("");
      });
  }, [amount, img, qnt, show?.itemM]);

  const handleImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (result.assets) {
      setImg(result.assets[0].uri);
    }
    console.log(result.assets);
  }, []);

  return (
    <S.container>
      <S.contentButon
        style={{ width: "100%", marginTop: 20, marginBottom: 30 }}
      >
        <S.button
          onPress={() => nv.navigate("modelEdit")}
          style={{ backgroundColor: cor.pink[1] }}
        >
          <S.textButon>Pedidos dos clientes</S.textButon>
        </S.button>
      </S.contentButon>

      <S.modal visible={show?.showM} transparent animationType="fade">
        <S.containerModal>
          <S.imput
            keyboardType="numeric"
            onChangeText={setAmount}
            placeholder="digite o valor R$"
          />
          <S.imput
            keyboardType="numeric"
            onChangeText={setQnt}
            placeholder="informe a quantidade no estoque"
          />

          <S.contentButon>
            {img === "" ? <S.imgBox /> : <S.imgBox source={{ uri: img }} />}

            <S.button
              onPress={handleImage}
              style={{
                backgroundColor: cor.pink[3],
                height: 40,
                marginBottom: 10,
              }}
            >
              <S.textButon style={{ color: cor.dark[1] }}>
                adicionar image
              </S.textButon>
            </S.button>
          </S.contentButon>

          <S.contentButon>
            <S.button
              onPress={() =>
                setShow({
                  showM: false,
                  showC: false,
                  itemC: {} as ICategory,
                  itemM: {} as IModel,
                })
              }
            >
              <S.textButon style={{ color: cor.dark[3] }}>cancelar</S.textButon>
            </S.button>

            <S.button onPress={handleEdit}>
              <S.textButon style={{ color: cor.green[3] }}>salvar</S.textButon>
            </S.button>
          </S.contentButon>
        </S.containerModal>
      </S.modal>

      <S.modal visible={false}>
        <S.containerModal>
          <S.title>Alterar descrição</S.title>
          <S.imput placeholder="descrição" />

          <S.button>
            <S.textButon>Salvar</S.textButon>
          </S.button>
        </S.containerModal>
      </S.modal>

      {type ? (
        <View style={{ flex: 1 }}>
          <View>
            <FlatList
              horizontal
              contentContainerStyle={{
                paddingHorizontal: 10,
              }}
              data={type}
              keyExtractor={(h) => h.id}
              renderItem={({ item: h }) => (
                <Tipo
                  pres={() => {
                    setSelectType(h.type);
                  }}
                  title={h.type}
                  select={selectType === h.type}
                />
              )}
            />
          </View>

          <View>
            <FlatList
              horizontal
              contentContainerStyle={{
                paddingHorizontal: 10,
              }}
              data={list.lc}
              keyExtractor={(h) => h.id}
              renderItem={({ item: h }) => (
                <CategoryComponent
                  pres={() => setSelectCategory({ ct: h })}
                  title={h.category}
                  select={selectCategory?.ct.category === h.category}
                />
              )}
            />

            <Text style={{ marginLeft: 20, fontSize: 20 }}>
              {selectCategory?.ct.description}
            </Text>
            <S.button
              style={{
                alignSelf: "flex-start",
                backgroundColor: cor.green[2],
                marginLeft: 20,
              }}
            >
              <S.textButon>Editar descrição</S.textButon>
            </S.button>
          </View>

          <FlatList
            data={list.lm}
            keyExtractor={(h) => h.id}
            renderItem={({ item: h }) => (
              <Lista
                edit={() => setShow({ showM: true, itemM: h, itemC: {} })}
                excluir={() => handleDelete(h)}
                item={h}
              />
            )}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 25, textAlign: "center" }}>
            Você não tem nada cadastrado, clique no botão 'add' para cadastrar
            suas roupas
          </Text>
        </View>
      )}
      <S.bottonAdd onPress={() => nv.navigate("edit")}>
        <S.textButon>add</S.textButon>
      </S.bottonAdd>
    </S.container>
  );
}
