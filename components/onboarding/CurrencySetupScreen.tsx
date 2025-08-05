import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from "react-native";
import { OnboardingButton } from "./OnboardingButton";
import { StepIndicator } from "./StepIndicator";
import { theme } from "../../utils/theme";
import { currencies, currencySymbols } from "../../utils/constants";
import { Currency } from "../../utils/types";
import { useSubscriptionsStore } from "../../utils/store";

interface CurrencySetupScreenProps {
  onContinue: () => void;
}

export const CurrencySetupScreen: React.FC<CurrencySetupScreenProps> = ({ 
  onContinue 
}) => {
  const { updateUser, getUser } = useSubscriptionsStore();
  const currentUser = getUser();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currentUser.defaultCurrency);

  const handleContinue = () => {
    // Update the store with the selected currency
    updateUser({ defaultCurrency: selectedCurrency });
    onContinue();
  };

  const renderCurrencyItem = ({ item }: { item: Currency }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.currencyItem,
        {
          backgroundColor: selectedCurrency === item ? theme.colors.primary : theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={() => setSelectedCurrency(item)}
    >
      <Text
        style={[
          styles.currencySymbol,
          {
            color: selectedCurrency === item ? theme.colors.background : theme.colors.text,
          },
        ]}
      >
        {currencySymbols[item]}
      </Text>
      <Text
        style={[
          styles.currencyCode,
          {
            color: selectedCurrency === item ? theme.colors.background : theme.colors.text,
          },
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Choose Your Currency
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>
            This is used to display subscription costs.
          </Text>
        </View>
        
        <View style={styles.body}>
          <View style={styles.currencyContainer}>
            <FlatList
              data={currencies}
              renderItem={renderCurrencyItem}
              keyExtractor={(item) => item}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <OnboardingButton
              title="Continue"
              onPress={handleContinue}
            />
            <StepIndicator currentStep={1} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    textAlign: "center",
    lineHeight: 24,
  },
  body: {
    flex: 1,
    justifyContent: "space-between",
  },
  currencyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  listContainer: {
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  currencyItem: {
    flex: 0.48,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  currencySymbol: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    marginBottom: 8,
  },
  currencyCode: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
});