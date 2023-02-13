import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../pages/home";
import { Edit } from "../pages/edit";
import { ModalEdit } from "../pages/modelEdit";

const { Navigator, Screen } = createNativeStackNavigator();

export function Route() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen component={Home} name="home" />
      <Screen component={Edit} name="edit" />
      <Screen component={ModalEdit} name="modelEdit" />
    </Navigator>
  );
}
