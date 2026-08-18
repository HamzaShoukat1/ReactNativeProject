import { Slot } from "expo-router";
import { View } from "react-native";
import "../global.css"
import { ClerkProvider } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/Tenstack-Query/client";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const publishedKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
  if (!publishedKey) {
    throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY env variable")
  }


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

    <QueryClientProvider client={queryClient}>

      <ClerkProvider publishableKey={publishedKey} tokenCache={tokenCache}>
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
          <Slot />
        </View>
      </ClerkProvider>
    </QueryClientProvider>
    </GestureHandlerRootView>
  )
}
