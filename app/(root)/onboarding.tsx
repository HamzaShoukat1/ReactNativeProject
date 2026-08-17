import { View, Text, KeyboardAvoidingView, TouchableOpacity, TextInput, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { OnboardingFormValues, onboardingSchema } from '@/lib/schemas/onboarding';
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from 'react-hook-form';
import { ALL_CURRENCIES, CurrencyPicker } from '@/components/currency-picker';
import { Feather } from '@expo/vector-icons';
import { Image } from 'react-native';
import { useSuperbase } from '@/hooks/useSuperbase';
import { useUser } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/Store/userStore';

export default function onboarding() {
  const { user } = useUser()
  const setCurrency = useUserStore((s) => s.setCurrency);
  const setNeedsOnboarding = useUserStore((s) => s.setNeedsOnBoarding);
  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    mode: "onBlur",
    defaultValues: { startingBalance: "" },
  });
  const authSuperbase = useSuperbase()
  const [selectedCurrency, setselectedCurrency] = useState(
    ALL_CURRENCIES.find((c) => c.code === "USD") ?? ALL_CURRENCIES[0]


  )

  const [pickerOpen, setpickerOpen] = useState(false)
  const [saving, setsaving] = useState(false)
  const [error, seterror] = useState("")
  const router = useRouter()

  const handleSave = async ({ startingBalance }: OnboardingFormValues) => {

    const parsed = parseFloat(startingBalance.replace(/,/g, ""));
    setsaving(true);
    seterror("");

    const { error: updateError } = await authSuperbase
      .from("users")
      .update({
        currency: selectedCurrency.code,
      })
      .eq("clerk_id", user!.id);

    if (updateError) {
      setsaving(false);
      seterror("Something went wrong. Please try again.");
      return;
    }

    const { data: defaultAccount, error: accountFetchError } = await authSuperbase
      .from("accounts")
      .select("id, balance")
      .eq("user_id", user!.id)
      .eq("is_default", true)
      .single();

    if (accountFetchError || !defaultAccount) {
      setsaving(false);
      seterror("Something went wrong. Please try again.");
      return;
    }

    const { error: txError } = await authSuperbase.from("transactions").insert({
      user_id: user!.id,
      account_id: defaultAccount.id,
      type: "INCOME",
      amount: parsed,
      category: "other_income",
      description: "Starting balance",
      date: new Date().toISOString(),
      input_method: "MANUAL",
    });

    if (txError) {
      setsaving(false);
      seterror("Something went wrong. Please try again.");
      return;
    }

    const { error: balanceError } = await authSuperbase
      .from("accounts")
      .update({ balance: defaultAccount.balance + parsed })
      .eq("id", defaultAccount.id);

    setsaving(false);

    if (balanceError) {
      seterror("Something went wrong. Please try again.");
      return;
    }

    setCurrency(selectedCurrency.code);
    setNeedsOnboarding(false);
    router.replace("/(root)/(tabs)");
  };


  return (
    <SafeAreaView className="flex-1 bg-brand-body" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6 justify-center -mt-16">
          <Image
            source={require("../../assets/images/wealth.png")}
            className="w-32 h-14 mb-10"
            resizeMode="contain"
            style={{
              width: 140,
              height: 60,
              alignSelf: "center",
              marginBottom: 32,
            }}
          />
          <Text className="text-[#1A1D26] text-3xl font-bold mb-2">
            Let&apos;s get you set up
          </Text>
          <Text className="text-brand-text-muted text-sm mb-10">
            A couple of quick details to personalise your experience.
          </Text>

          {/* Starting balance */}
          <Text className="text-brand-bg text-xs font-medium mb-1.5">
            Starting balance
          </Text>
          <View className="flex-row items-center bg-white border border-[#E8E6DF] rounded-xl px-4 mb-1">
            <Text className="text-brand-text-secondary text-sm mr-2">
              {selectedCurrency.symbol}
            </Text>
            <Controller
              control={control}
              name="startingBalance"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  value={value}
                  onChangeText={(v) => {
                    seterror("");
                    onChange(v);
                  }}
                  placeholder="e.g. 50000"
                  placeholderTextColor="#8A8D96"
                  keyboardType="numeric"
                  returnKeyType="done"
                  className="flex-1 py-3.5 text-sm text-brand-bg"
                />
              )}
            />
          </View>
          {formErrors.startingBalance && (
            <Text className="text-brand-coral text-xs mb-4">
              {formErrors.startingBalance.message}
            </Text>
          )}
          <View className="mb-4" />

          {/* Currency picker */}
          <Text className="text-brand-bg text-xs font-medium mb-1.5">
            Currency
          </Text>
          <TouchableOpacity
            onPress={() => setpickerOpen(true)}
            className="flex-row items-center justify-between bg-white border border-[#E8E6DF] rounded-xl px-4 py-3.5 mb-6"
          >
            <Text className="text-sm text-brand-bg">
              {selectedCurrency.symbol} {selectedCurrency.code} —{" "}
              {selectedCurrency.name}
            </Text>
            <Feather name="chevron-down" size={16} color="#8A8D96" />
          </TouchableOpacity>

          {error ? (
            <Text className="text-brand-coral text-xs mb-4">{error}</Text>
          ) : null}

          <TouchableOpacity
            onPress={handleSubmit(handleSave)}
            disabled={saving}
            className="bg-brand-bg rounded-xl py-4 items-center"
            activeOpacity={0.85}
          >
            <Text className="text-white text-sm font-semibold">
              {saving ? "Saving…" : "Get started"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <CurrencyPicker
        visible={pickerOpen}
        selectedCode={selectedCurrency.code}
        onSelect={(currency) => {
          setselectedCurrency(currency);
          setpickerOpen(false);
        }}
        onClose={() => setpickerOpen(false)}
      />


    </SafeAreaView>
  )
}