import React, { useCallback, useEffect, useState } from "react";
import fire from "@react-native-firebase/firestore";
import { FlatList } from "react-native";
import { Pdidos } from "../../components/pedidos";

import * as S from "./styles";
import { IModel } from "../../dto";

export function ModalEdit() {
  const [data, setData] = useState<IModel[]>([]);

  const loadData = useCallback(() => {
    fire()
      .collection("order")
      .onSnapshot((j) => {
        const rs = j.docs.map((h) => {
          return {
            ...h.data(),
            id: h.id,
          } as IModel;
        });

        setData(rs);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleValidate = useCallback((item: IModel) => {
    fire()
      .collection("model")
      .get()
      .then((j) => {
        const rs = j.docs.find((h) => h.id === item.buyItemid);
        const { quantity } = rs?.data() as IModel;

        fire()
          .collection("model")
          .doc(item.buyItemid)
          .update({
            quantity: quantity - item.qntBuy!,
          });
      });

    fire().collection("order").doc(item.id).delete();
  }, []);

  const handleDelet = useCallback((item: IModel) => {
    fire().collection("order").doc(item.id).delete();
  }, []);

  return (
    <S.container>
      <FlatList
        data={data}
        keyExtractor={(h) => h.id}
        renderItem={({ item: h }) => (
          <Pdidos
            item={h}
            salvar={() => {
              handleValidate(h);
            }}
            excluir={() => {
              handleDelet(h);
            }}
          />
        )}
      />
    </S.container>
  );
}
