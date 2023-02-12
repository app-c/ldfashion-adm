/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { AuthProvider } from "./AuthContext";

const AppProvider: React.FC = ({ children }: any) => (
  <AuthProvider>{children}</AuthProvider>
);

export default AppProvider;
