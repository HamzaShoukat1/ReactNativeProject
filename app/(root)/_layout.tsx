import { useUserSync } from "@/hooks/useUserSync";
import { useUserStore } from "@/Store/userStore";
import { useAuth } from "@clerk/expo";
import { Redirect, Slot, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const { isSignedIn, isLoaded } = useAuth()
  const needsOnBoarding = useUserStore((state) => state.needsOnBoarding)
  const pathName = usePathname()
  const [minLoadDone, setminLoadDone] = useState(false)



  useUserSync()


  useEffect(() => {
    const t = setTimeout(() => setminLoadDone(true), 1500)
    return () => clearTimeout(t)


  }, [])




  if (!isLoaded) return null
  if (!isSignedIn) return <Redirect href={"/sign-in"} />;

  if (!minLoadDone || needsOnBoarding === null) {
    return (
      <View className="flex-1 bg-brand-body items-center justify-center">
        <ActivityIndicator size="large" color="#1A1D26" />

      </View>
    )
  }


  if (needsOnBoarding && pathName !== "/onboarding") {
    return <Redirect href="/(root)/onboarding" />
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Slot />
    </View>

  )
}