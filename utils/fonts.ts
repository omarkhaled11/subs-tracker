import * as Font from "expo-font";

export const loadFonts = async () => {
  await Font.loadAsync({
    "Sora-Regular": require("../assets/fonts/Sora-Regular.ttf"),
    "Sora-Bold": require("../assets/fonts/Sora-Bold.ttf"),
  });
};
