import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth, useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  codeSchema,
  CodeSchemaType,
  SignUpSchema,
  SignupSchemaType,
} from "@/lib/schemas/auth";

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");

  const isLoading = fetchStatus === "fetching";

  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<SignupSchemaType>({
    resolver: zodResolver(SignUpSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });
const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control: codeControl,
    handleSubmit: handleCodeSubmit,
    formState: { errors: codeErrors },
  } = useForm<CodeSchemaType>({
    resolver: zodResolver(codeSchema),
    mode: "onBlur",
    defaultValues: {
      code: "",
    },
  });

 const onSignUpPress = async (values: SignupSchemaType) => {
  if (isSubmitting) return;

  setIsSubmitting(true);

  try {
    console.log("========== SIGNUP START ==========");
    console.log("Email:", values.email);

    const result = await signUp.password({
      emailAddress: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
    });

    console.log("SIGNUP PASSWORD RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (result.error) {
      console.error("CLERK SIGNUP ERROR:");
      console.error(JSON.stringify(result.error, null, 2));
      return;
    }

    setEmail(values.email);

    console.log("SIGNUP CREATED");
    console.log("STATUS:", signUp.status);

    console.log("Sending email verification code...");

    const verificationResult =
      await signUp.verifications.sendEmailCode();

    console.log("SEND CODE RESULT:");
    console.log(JSON.stringify(verificationResult, null, 2));

    if (verificationResult.error) {
      console.error(
        "SEND CODE ERROR:",
        JSON.stringify(verificationResult.error, null, 2)
      );

      return;
    }

    console.log("========== CODE SENT ==========");
  } catch (error) {
    console.error("========== SIGNUP EXCEPTION ==========");

    console.error(error);
  } finally {
    setIsSubmitting(false);
  }
};

  const onVerifyPress = async (values: CodeSchemaType) => {
    try {
      const result = await signUp.verifications.verifyEmailCode({
        code: values.code,
      });

      if (result.error) {
        console.error(
          "Verification error:",
          JSON.stringify(result.error, null, 2)
        );
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              return;
            }

            const url = decorateUrl("/");
            router.replace(url as any);
          },
        });

        return;
      }

      console.log("Verification successful but signup is not complete yet");

      console.log({
        status: signUp.status,
        missingFields: signUp.missingFields,
        unverifiedFields: signUp.unverifiedFields,
      });
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  const onResendCode = async () => {
    try {
      await signUp.verifications.sendEmailCode();
      console.log("New verification code sent");
    } catch (error) {
      console.error("Failed to resend code:", error);
    }
  };

  const onStartOver = async () => {
    try {
      await signUp.reset();
      setEmail("");
    } catch (error) {
      console.error("Failed to reset signup:", error);
    }
  };

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-body">
        <ActivityIndicator />
      </View>
    );
  }

  if (isSignedIn || signUp.status === "complete") {
    return null;
  }

  const clerkCodeError = errors.fields?.code?.message;
  const clerkEmailError = errors.fields?.emailAddress?.message;
  const clerkPasswordError = errors.fields?.password?.message;

  /*
   * EMAIL VERIFICATION SCREEN
   */
  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-brand-body"
      >
        <View className="flex-1 justify-center px-6">
          <Image
            source={require("../../assets/images/wealth.png")}
            style={{
              width: 144,
              height: 64,
              alignSelf: "center",
              marginBottom: 32,
            }}
            resizeMode="contain"
          />

          <Text className="text-3xl font-bold text-[#1A1D26] mb-2">
            Verify your account
          </Text>

          <Text className="text-brand-text-muted text-base mb-8">
            We sent a code to {email}
          </Text>

          <Controller
            control={codeControl}
            name="code"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                className="border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 mb-2 text-[#1A1D26]"
                placeholder="Enter verification code"
                placeholderTextColor="#8A8D96"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="number-pad"
                autoCapitalize="none"
              />
            )}
          />

          {codeErrors.code && (
            <Text className="text-brand-coral mb-2 text-sm">
              {codeErrors.code.message}
            </Text>
          )}

          {clerkCodeError && (
            <Text className="text-brand-coral mb-4 text-sm">
              {clerkCodeError}
            </Text>
          )}

          <TouchableOpacity
            onPress={handleCodeSubmit(onVerifyPress)}
            disabled={isLoading}
            className="w-full bg-brand-blue py-4 rounded-xl items-center mb-4"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Verify
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onResendCode}
            disabled={isLoading}
            className="py-2"
          >
            <Text className="text-brand-blue text-sm">
              I need a new code
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onStartOver}
            disabled={isLoading}
            className="py-2"
          >
            <Text className="text-brand-blue text-sm">
              Start over
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  /*
   * SIGN UP SCREEN
   */
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-brand-body"
    >
      <View className="flex-1 justify-center px-6">
        <Image
          source={require("../../assets/images/wealth.png")}
          style={{
            width: 144,
            height: 64,
            alignSelf: "center",
            marginBottom: 32,
          }}
          resizeMode="contain"
        />

        <Text className="text-3xl font-bold text-[#1A1D26] mb-2">
          Create account
        </Text>

        <Text className="text-brand-text-muted text-base mb-8">
          Track your money, powered by AI
        </Text>

       {/* FIRST + LAST NAME ROW CONTAINER */}
<View className="flex-row gap-3 mb-2">
  
  {/* First Name Column */}
  <View className="flex-1">
    <Controller
      control={control}
      name="firstName"
      render={({ field: { value, onChange, onBlur } }) => (
        <TextInput
          className="border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 text-[#1A1D26]"
          placeholder="First name"
          placeholderTextColor="#8A8D96"
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          autoCapitalize="words"
        />
      )}
    />
    {formErrors.firstName && (
      <Text className="text-brand-coral mt-1 text-sm">
        {formErrors.firstName.message}
      </Text>
    )}
  </View>

  {/* Last Name Column */}
  <View className="flex-1">
    <Controller
      control={control}
      name="lastName"
      render={({ field: { value, onChange, onBlur } }) => (
        <TextInput
          className="border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 text-[#1A1D26]"
          placeholder="Last name"
          placeholderTextColor="#8A8D96"
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          autoCapitalize="words"
        />
      )}
    />
    {formErrors.lastName && (
      <Text className="text-brand-coral mt-1 text-sm">
        {formErrors.lastName.message}
      </Text>
    )}
  </View>

</View>

        {/* EMAIL */}
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              className="border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 mb-2 text-[#1A1D26]"
              placeholder="Email Address"
              placeholderTextColor="#8A8D96"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          )}
        />

        {formErrors.email && (
          <Text className="text-brand-coral mb-2 text-sm">
            {formErrors.email.message}
          </Text>
        )}

        {clerkEmailError && (
          <Text className="text-brand-coral mb-4 text-sm">
            {clerkEmailError}
          </Text>
        )}

        {/* PASSWORD */}
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              className="border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 mb-2 text-[#1A1D26]"
              placeholder="Password"
              placeholderTextColor="#8A8D96"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              maxLength={20}
              secureTextEntry
              autoComplete="password-new"
            />
          )}
        />

        {formErrors.password && (
          <Text className="text-brand-coral mb-2 text-sm">
            {formErrors.password.message}
          </Text>
        )}

        {clerkPasswordError && (
          <Text className="text-brand-coral mb-4 text-sm">
            {clerkPasswordError}
          </Text>
        )}
        <View nativeID="clerk-captcha" />

        {/* SIGN UP */}
        <TouchableOpacity
          onPress={handleSubmit(onSignUpPress)}
          disabled={isLoading}
          className="w-full bg-brand-blue py-4 rounded-xl items-center mb-4"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        {/* SIGN IN */}
        <View className="flex-row justify-center">
          <Text className="text-brand-text-muted">
            Already have an account?{" "}
          </Text>

          <Link href="/sign-in">
            <Text className="text-brand-blue font-semibold">
              Sign In
            </Text>
          </Link>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}