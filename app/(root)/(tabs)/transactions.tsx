import { View, Text, Alert, TouchableOpacity, ActivityIndicator, TextInput, ScrollView, FlatList } from 'react-native'
import React, { useMemo, useState } from 'react'
import { useDeleteTransaction } from '@/hooks/mutations/useTransactionmutaation'
import { useTransactionQuery } from '@/hooks/queries/useTransactionQuery';
import { useAccountQuery } from '@/hooks/queries/useAccountQuery';
import { Transaction, TransactionType } from '@/lib/types';
import { exportTransactionsToCsv } from '@/lib/utils/utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TransactionRow } from '@/components/TransactionRow';
import { RefreshControl } from 'react-native-gesture-handler';
import { BarChart } from "react-native-gifted-charts";
import BarChatComponent from '@/components/BarChat';

const FILTERS = ["All", "Income", "Expense"] as const;



export default function transactions() {
  const router = useRouter();

  const [activeFilter, setactiveFilter] = useState<(typeof FILTERS)[number]>("All");

  const [activeAccountid, setactiveAccountid] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [exporting, setExporting] = useState(false);

  const typeFilter: TransactionType | null =
    activeFilter === "Income"
      ? "INCOME"
      : activeFilter === "Expense"
        ? "EXPENSE"
        : null;

  const {
    data: infiniteData,
    isLoading: transactionsLoading,
    isRefetching: transactionsRefetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError: transactionsError,
    refetch: refetchTransactions,
  } = useTransactionQuery({ type: typeFilter, account_id: activeAccountid });

  const transactions = useMemo(() => {
    if (!infiniteData) return [];
    return infiniteData?.pages.flatMap((page) => page);
  }, [infiniteData]);

  const { data: accounts = [], refetch: refetchAccounts, isError: accountsError } = useAccountQuery();
  const { mutateAsync: removeTransaction } = useDeleteTransaction();


  const loading = transactionsLoading;
  const refreshing = transactionsRefetching;
  const error = transactionsError;


  const loadData = () => {
    refetchTransactions();
    refetchAccounts();
  };

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const { count } = await exportTransactionsToCsv(transactions);
      if (count === 0) {
        Alert.alert("Nothing to export", "No transactions in the export window.");
      }
    } catch (err) {
      console.error("Export failed:", err);
      Alert.alert("Error", "Couldn't export transactions.");
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = (tx: Transaction) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await removeTransaction(tx.id);
              // loadData();
            } catch (err) {
              console.error("Delete failed:", err);
              Alert.alert("Error", "Couldn't delete transaction.");
            }
          },
        },
      ]
    );

  };
  const filteredTransactions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return transactions;
    return transactions.filter(
      (tx) =>
        tx.description?.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q)
    );
  }, [transactions, search]);



  return (
    <SafeAreaView className="flex-1 bg-brand-body" edges={["top"]}>
      <View className="px-5 pt-3 pb-1">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-brand-bg text-xl font-semibold">
            Transactions
          </Text>
          <TouchableOpacity
            onPress={handleExport}
            disabled={exporting}
            className="w-9 h-9 rounded-full bg-white border border-[#E8E6DF] items-center justify-center"
          >
            {exporting ? (
              <ActivityIndicator size="small" color="#5C5F68" />
            ) : (
              <Feather name="download" size={15} color="#5C5F68" />
            )}
          </TouchableOpacity>
        </View>

        {/* //  */}

        <View className="flex-row items-center gap-2 bg-white rounded-xl border border-[#E8E6DF] px-3.5 py-2.5 mb-2.5">
          <Feather name="search" size={15} color="#8A8D96" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search transactions"
            placeholderTextColor="#8A8D96"
            className="flex-1 text-xs text-brand-bg"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x" size={15} color="#8A8D96" />
            </TouchableOpacity>
          )}
        </View>

        {/* //  */}
        <View className="flex-row gap-2 mb-2.5">
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setactiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-full border ${activeFilter === filter
                ? "bg-brand-bg border-brand-bg"
                : "bg-white border-[#E8E6DF]"
                }`}
            >
              <Text
                className={`text-xs ${activeFilter === filter
                  ? "text-white"
                  : "text-brand-text-secondary"
                  }`}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>


      {/* // */}
      {/* // Accounts Filter Section */}
      <View className="mb-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          className="h-11"
        >
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => setactiveAccountid(null)}
              className={`px-3.5 py-1.5 rounded-full border ${activeAccountid === null
                ? "bg-brand-bg border-brand-bg"
                : "bg-white border-[#E8E6DF]"
                }`}
            >
              <Text
                className={`text-xs font-medium ${activeAccountid === null
                  ? "text-white"
                  : "text-brand-text-secondary"
                  }`}
              >
                All Accounts
              </Text>
            </TouchableOpacity>

            {accounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                onPress={() => setactiveAccountid(account.id)}
                className={`px-3.5 py-1.5 rounded-full border ${activeAccountid === account.id
                  ? "bg-brand-bg border-brand-bg"
                  : "bg-white border-[#E8E6DF]"
                  }`}
              >
                <Text
                  className={`text-xs font-medium ${activeAccountid === account.id
                    ? "text-white"
                    : "text-brand-text-secondary"
                    }`}
                >
                  {account.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      {/* //  */}

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#4A9EFF" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-10">
          <Feather name="alert-circle" size={32} color="#FF6B4A" />
          <Text className="text-brand-text-muted text-sm mt-3 text-center">
            Couldn&apos;t load transactions.
          </Text>
          <TouchableOpacity
            onPress={() => loadData()}
            className="mt-4 bg-brand-bg rounded-full px-4 py-2"
          >
            <Text className="text-white text-xs font-medium">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionRow tx={item} onDelete={() => handleDelete(item)} />
          )}
          onEndReached={() => {
            // Uses 'hasNextPage' and 'isFetchingNextPage' to safeguard against double-fetching
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage(); // 👈 Fired to grab the next 20 entries
            }
          }}
          onEndReachedThreshold={0.3}
          ListFooterComponent={() => {
            if (!isFetchingNextPage) return null; // Hide spinner if not loading
            return (
              <View className="py-4 items-center justify-center">
                <ActivityIndicator size="small" color="#5C5F68" />
              </View>
            );
          }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 100,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadData} />
          }
          ListHeaderComponent={
            transactions.length > 0 ? (
              <BarChatComponent transactions={transactions} />

            ) : null
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Feather name="inbox" size={32} color="#BDC3C7" />
              <Text className="text-brand-text-muted text-sm mt-3">
                {search ? "No matching transactions" : "No transactions yet"}
              </Text>
            </View>
          }
        />)


      }



    </SafeAreaView>
  )
}