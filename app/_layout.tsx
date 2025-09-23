import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {

    const isLoggedIn = true;
  return(
      <>
      <Stack>
      <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="(auth)/login" options={{headerTitle: "Connexion"}}/>
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="(auth)/register" options={{headerTitle: "Inscription"}}/>
      </Stack.Protected>

      <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" options={{headerShown: false}} />
      </Stack.Protected>
  </Stack>
      <StatusBar style={"inverted"}  />
          </>
  )
}
