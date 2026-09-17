

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="SignIn" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="OtpVerify" />
      <Stack.Screen name="complete-profile" />
         <Stack.Screen name="ForgotPassword" />
         <Stack.Screen name="ForgotVerifyOtp" />
         <Stack.Screen name="ResetPassword" />
      <Stack.Screen name="drawer" />

        <Stack.Screen name="MoreInformation" />
      <Stack.Screen name="ApplyScreen" />
    </Stack>
  );
}




