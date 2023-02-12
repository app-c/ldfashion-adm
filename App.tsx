import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Route } from "./src/routes";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333333",
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Route />
        <StatusBar style="auto" />
      </View>
    </NavigationContainer>
  );
}
