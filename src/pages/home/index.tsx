/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import fire from "@react-native-firebase/firestore";
import { FlatList, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Tipo } from "../../components/tipo";
import { ICategory, IModel, IType } from "../../dto";

import * as S from "./styles";
import { CategoryComponent } from "../../components/categoryComponent";
import { Lista } from "../../components/lista";

export function Home() {
  const nv = useNavigation();

  const [selectType, setSelectType] = useState("");
  const [selectCategory, setSelectCategory] = useState("");

  const [type, setType] = useState<IType[]>([]);
  const [category, setCategory] = useState<ICategory[]>([]);
  const [models, setModels] = useState<IModel[]>([]);

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

    fire()
      .collection("model")
      .onSnapshot((j) => {
        const rs = j.docs.map((h) => {
          return {
            ...h.data(),
            id: h.id,
          } as IModel;
        });
        const res = rs
          .filter((h) => h.category === selectCategory)
          .sort((a, b) => {
            if (a.category! < b.category!) {
              return -1;
            }
            return 1;
          });
        setModels(res);
      });
  }, [selectCategory, selectType]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const listCategory = useMemo(() => {
    const ct = category.find((h) => h.category === selectCategory);

    return ct;
  }, [category, selectCategory]);

  const handleDelete = useCallback(
    (item: IModel) => {
      const index = listCategory!.models.findIndex((i) => i.id === item.id);
      const arrIndex = [...listCategory!.models];

      // if (index !== -1) {
      //   arrIndex.map((h) => {
      //     return h.models.splice(index, 1);
      //   });

      //   setCategory(arrIndex);
      // }
    },
    [category, listCategory]
  );

  const handleEdit = useCallback((id: string) => {
    // type: "Blusa",
    // category: "malha",
    // description: "Blusas que cabem no seu corpo",
  });

  return (
    <S.container>
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
                  pres={() => setSelectType(h.type)}
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
          </View>

          <FlatList
            data={models}
            keyExtractor={(h) => h.id}
            renderItem={({ item: h }) => (
              <Lista excluir={() => handleDelete(h)} item={h} />
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
        <S.title>add</S.title>
      </S.bottonAdd>
    </S.container>
  );
}
