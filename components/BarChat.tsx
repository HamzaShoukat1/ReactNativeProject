import { View, Text, ScrollView } from 'react-native'
import React, { useMemo } from 'react'
import { BarChart } from 'react-native-gifted-charts'
import { eachDayOfInterval, format, startOfDay, startOfMonth } from 'date-fns';
import { Transaction } from '@/lib/types';

function dayKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}


function currentMonthDays() {
  const today = startOfDay(new Date());
  return eachDayOfInterval({ start: startOfMonth(today), end: today }).map(
    (d) => ({ key: dayKey(d), label: format(d, "d MMM") })
  );
}






export default function BarChatComponent({transactions}: {transactions: Transaction[]}) {

      const dailyIncomeExpense = useMemo(() => {
    const days = currentMonthDays();
    return days.flatMap(({ key, label }) => {
      const income = transactions
        .filter(
          (tx) => tx.type === "INCOME" && dayKey(new Date(tx.date)) === key
        )
        .reduce((sum, tx) => sum + tx.amount, 0);
      const expense = transactions
        .filter(
          (tx) => tx.type === "EXPENSE" && dayKey(new Date(tx.date)) === key
        )
        .reduce((sum, tx) => sum + tx.amount, 0);
      return [
        { value: income, label, frontColor: "#3DDC84" },
        { value: expense, frontColor: "#FF6B4A" },
      ];
    });
  }, [transactions]);

  return (
 <View className="bg-white rounded-2xl border border-[#E8E6DF] p-4 mb-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-brand-bg text-xs font-medium">
                  Daily income vs expense
                </Text>
                <View className="flex-row gap-3">
                  <View className="flex-row items-center gap-1">
                    <View className="w-2 h-2 rounded-full bg-brand-success" />
                    <Text className="text-[10px] text-brand-text-secondary">
                      Income
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <View className="w-2 h-2 rounded-full bg-brand-coral" />
                    <Text className="text-[10px] text-brand-text-secondary">
                      Expense
                    </Text>
                  </View>
                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                  data={dailyIncomeExpense}
                  width={Math.max(dailyIncomeExpense.length * 9, 280)}
                  height={120}
                  barWidth={6}
                  spacing={4}
                  hideYAxisText
                  xAxisColor="#E8E6DF"
                  yAxisColor="transparent"
                  rulesColor="#F0EEE7"
                  noOfSections={3}
                  xAxisLabelTextStyle={{ color: "#8A8D96", fontSize: 7 }}
                  isThreeD={false}
                  roundedTop
                />
              </ScrollView>
            </View>
  )
}