import { ActivityIndicator, Text } from "react-native";
import { loginStyles } from "../styles/LoginScreenStyles";

interface LoginLoadingProps {
  loading: boolean;
}

export default function LoginLoading({ loading }: LoginLoadingProps) {
  let content = null;

  if (loading) {
    content = <ActivityIndicator color="#fff" />;
  } 
  else {
    content = <Text style={loginStyles.buttonText}>Login</Text>;
  }

  return content;
}
