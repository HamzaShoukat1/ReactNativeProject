import { Slot } from "expo-router";
import { View } from "react-native";
import "../global.css"
import { ClerkProvider } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
export default function RootLayout() {
  const publishedKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
  if(!publishedKey){
    throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY env variable")
  }


  return (
    <ClerkProvider publishableKey={publishedKey} tokenCache={tokenCache}>
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <Slot />
      </View>
    </ClerkProvider>  
  )
}
