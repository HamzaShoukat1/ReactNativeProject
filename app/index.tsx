import { Text, TextInput, TouchableOpacity, View } from "react-native";
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this file.</Text>

      <TouchableOpacity
      onPress={()=> alert('Button pressed!')} >
        <Text className="bg-green-500 flex text-3xl" >Press me</Text>
      </TouchableOpacity>
    </View>
  );
}
