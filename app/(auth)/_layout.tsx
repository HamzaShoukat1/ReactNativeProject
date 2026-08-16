import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { useAuth } from "@clerk/expo"
import { Redirect } from "expo-router"

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth()


  if (!isLoaded) {
    return null
  }
  if (isSignedIn) {

    return <Redirect href={"/(root)/(tabs)"} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    />

  )
}