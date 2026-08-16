import { Redirect } from "expo-router";
import "../global.css"
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/expo"
export default function Index() {
    const { isSignedIn, isLoaded } = useAuth()


    if (!isLoaded) {
        return null
    }
    if (isSignedIn) {

        return <Redirect href={"/(root)/(tabs)"} />;
    }
    if (!isSignedIn) {

        return <Redirect href={"/sign-in"} />;
    }

}
