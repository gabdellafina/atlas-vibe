import { Redirect } from "expo-router";
import { useUser } from "../context/UserContext";

export default function Index() {
  const { isAuthenticated } = useUser();
  
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/login" />;
  }
}