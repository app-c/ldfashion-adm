/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface SignInCred {
  nome: string;
  telefone: string;
}

interface AuthContexData {
  user: SignInCred | null;
  loading: boolean;
  signIn(credential: SignInCred): Promise<void>;
  signOut(): void;
}

const keyUser = "@:ldfashion";

export const AuthContext = createContext<AuthContexData>({} as AuthContexData);

export const AuthProvider: React.FC = ({ children }: any) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SignInCred>(null);

  const LoadingUser = useCallback(async () => {
    setLoading(true);

    const user = await AsyncStorage.getItem(keyUser);
    const us = user ? JSON.parse(user) : null;

    setData(us);
  }, []);

  useEffect(() => {
    LoadingUser();
  }, [LoadingUser]);

  const signIn = useCallback(async ({ nome, telefone }) => {
    const us = { nome, telefone };
    await AsyncStorage.setItem(keyUser, JSON.stringify(us));
    setData(us);
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(keyUser);

    setData(null);
  }, []);

  // const Token = React.useCallback(async () => {
  //   const { status: existingStatus } =
  //     await Notifications.getPermissionsAsync();
  //   let finalStatus = existingStatus;
  //   if (existingStatus !== "granted") {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     finalStatus = status;
  //   }
  //   if (finalStatus !== "granted") {
  //     Alert.alert("Failed to get push token for push notification!");
  //     return;
  //   }
  //   const token = (
  //     await Notifications.getExpoPushTokenAsync({
  //       experienceId: "@app-c/aplicativogeb",
  //     })
  //   ).data;

  //   if (Platform.OS === "android") {
  //     Notifications.setNotificationChannelAsync("default", {
  //       name: "default",
  //       importance: Notifications.AndroidImportance.MAX,
  //       vibrationPattern: [0, 250, 250, 250],
  //       lightColor: "#FF231F7C",
  //     });
  //   }

  //   setExpotoken(token);
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        user: data,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContexData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used with ..");
  }

  return context;
}
