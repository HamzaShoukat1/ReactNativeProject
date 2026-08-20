import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff', // Clean white
          borderTopColor: '#f3f4f6',   // Tailwind gray-100 (Very soft separator line)
          elevation: 0,                // Removes Android shadow line
          shadowOpacity: 0,            // Removes iOS shadow line
          height: 60,                  // Gives more breathing room for a premium feel
          paddingBottom: 1,
          paddingTop: 5,
        },
        sceneStyle: {
          backgroundColor: '#f9fafb',  // Tailwind gray-50 (Slightly off-white background looks premium)
        },
        tabBarActiveTintColor: '#2563eb',   // Tailwind blue-600 (Vibrant Royal Blue)
        tabBarInactiveTintColor: '#9ca3af', // Tailwind gray-400 (Muted neutral)
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "wallet" : "wallet-outline"} size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "receipt" : "receipt-outline"} size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="add-transaction"
        options={{
          title: 'Add',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={size + 4} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="assistant"
        options={{
          title: 'AI Coach',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "sparkles" : "sparkles-outline"} size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "person-circle" : "person-circle-outline"} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
