import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import { theme } from "../../utils/theme";
import { useState } from "react";
import { Octicons } from "@expo/vector-icons";

interface PolicyWebViewProps {
  url: string;
}

export default function PolicyWebView({ url }: PolicyWebViewProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <View style={styles.errorContainer}>
        <Octicons name="alert" size={32} color={theme.colors.error} />
        <Text style={styles.errorText}>Unable to load content</Text>
        <Text style={styles.errorSubtext}>
          Please check your internet connection
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setHasError(false)}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}
        startInLoadingState={true}
        onError={() => setHasError(true)}
        onHttpError={() => setHasError(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  webview: {
    flex: 1,
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    marginTop: 16,
  },
  errorSubtext: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
    marginTop: 8,
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  retryText: {
    color: theme.colors.background,
    fontSize: 16,
    fontFamily: theme.fonts.medium,
  },
});
