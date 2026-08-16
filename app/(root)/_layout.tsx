import { useAuth } from "@clerk/expo";
import { Redirect, Slot } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
    const { isSignedIn, isLoaded } = useAuth()
  
  
    if (!isLoaded) {
      return null
    }
    if (!isSignedIn) {
  
      return <Redirect href={"/sign-in"} />;
    }
  

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Slot />
    </View>

  )
}