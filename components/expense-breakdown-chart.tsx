import { View, Text } from 'react-native'
import React from 'react'
import { PieChart } from 'react-native-gifted-charts/dist/PieChart'
import { CategoryKey } from '@/constants/Categories'


type ExpenseBreakdownProps = {
  expenseBreakdown: { category: string; amount: number; color: string }[]
  currency: string
  getCategoryConfig: (category: CategoryKey) => { label: string }
  formatPrice: (value: number, currency: string) => string
}

export default function ExpenseBreakDown({ expenseBreakdown, currency, getCategoryConfig, formatPrice }: ExpenseBreakdownProps) {
    if(expenseBreakdown.length === 0) {
        return null
    }


    return (
          <View className="bg-white rounded-[18px] border border-[#E8E6DF] p-4 mb-[18px] m-3">
                      <Text className="text-[#1A1D26] text-sm font-medium mb-3">
                        Expense breakdown (this month)
                      </Text>
                      <View className="flex-row items-center">
                        <PieChart
                          data={expenseBreakdown.map((c) => ({
                            value: c.amount,
                            color: c.color,
                          }))}
                          radius={60}
                          innerRadius={38}
                          innerCircleColor="#fff"
                        />
                        <View className="flex-1 ml-4 gap-1.5">
                          {expenseBreakdown.slice(0, 6).map((c) => (
                            <View
                              key={c.category}
                              className="flex-row items-center justify-between"
                            >
                              <View className="flex-row items-center gap-1.5">
                                <View
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: c.color }}
                                />
                                <Text className="text-brand-text-secondary text-[11px]">
                                  {getCategoryConfig(c.category as any).label}
                                </Text>
                              </View>
                              <Text className="text-brand-bg text-[11px] font-medium">
                                {formatPrice(c.amount, currency)}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
) 
    


}