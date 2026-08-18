import { SupabaseClient } from "@supabase/supabase-js";
import { TransactionType, InputMethod, Transaction, TransactionFilters } from "../types";




export async function getTransactions(
    supabase: SupabaseClient,
    userId: string,
    filters: TransactionFilters = {}
) {
    let query = supabase.from("transactions").select("*").eq("user_id", userId);

    if (filters.type) query = query.eq("type", filters.type);
    if (filters.account_id) query = query.eq("account_id", filters.account_id);

    const { data, error } = await query.order("date", { ascending: false });

    if (error) throw error;
    return data as Transaction[];
}
