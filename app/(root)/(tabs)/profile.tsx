import { View, Text, Alert, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { useAuth, useUser } from '@clerk/expo'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

export default function profile() {
  const {user} = useUser()
  const router = useRouter()
  const {signOut} = useAuth()
  const handleSignOut = async () => {
      if (Platform.OS === 'web') {
    const isConfirmed = window.confirm("Are you sure you want to sign out?");
    if (isConfirmed) {
      try {
        await signOut();
        router.replace("/(auth)/sign-in");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }
    return; // Stop function execution here for web
  }
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut()
            router.replace("/(auth)/sign-in")
          } catch (error) {
            console.error("Error signing out:", error)
          }
        }
      }
    ])
  }

  return (

    <SafeAreaView className="flex-1 items-center justify-center bg-white"
    >
      <TouchableOpacity onPress={handleSignOut} className="bg-blue-500 px-4 py-2 rounded">
        <Text  className="text-white text-lg font-semibold">Sign Out</Text>
      </TouchableOpacity>
    

    </SafeAreaView>
  )
}