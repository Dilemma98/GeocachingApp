// nearby.tsx och profile.tsx — samma innehåll för nu
import { View, Text } from 'react-native';
import Profile from "../../screens/ProfileScreen";

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <Profile />
    </View>
  );
}