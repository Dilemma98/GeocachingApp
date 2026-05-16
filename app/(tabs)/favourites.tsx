import { View } from "react-native";
import FavouritesScreen from "../../screens/FavouritesScreen";

export default function Favourites() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Favourites />
    </View>
  );
}
