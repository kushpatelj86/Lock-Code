import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import { initDatabase } from "../utils/database"; // adjust the path if needed

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
      <AppNavigator />
  );
}
