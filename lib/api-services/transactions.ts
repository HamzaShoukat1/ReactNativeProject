import { SupabaseClient } from "@supabase/supabase-js";
import { TransactionType, InputMethod, Transaction, TransactionFilters } from "../types";




// export async function getTransactions(
//     supabase: SupabaseClient,
//     userId: string,
//     filters: TransactionFilters = {}
// ) {
//     let query = supabase.from("transactions").select("*").eq("user_id", userId);

//     if (filters.type) query = query.eq("type", filters.type);
//     if (filters.account_id) query = query.eq("account_id", filters.account_id);

//     const { data, error } = await query.order("date", { ascending: false });

//     if (error) throw error;
//     return data as Transaction[];
// };


export async function getTransactions(
    supabase: SupabaseClient,
    userId: string,
    filters: TransactionFilters = {},
    page: number = 0 // 🌟 Line 1: Accept the current page index (defaults to 0)
) {
    let query = supabase.from("transactions").select("*").eq("user_id", userId);

    if (filters.type) query = query.eq("type", filters.type);
    if (filters.account_id) query = query.eq("account_id", filters.account_id);

    const from = page * 12
    const to = from + 11

    const { data, error } = await query
        .order("date", { ascending: false })
        .range(from, to);

    if (error) throw error;
    return data as Transaction[];
}


export async function deleteTransaction(supabase: SupabaseClient, transactionId: string, accountId: string, amount: number, type: TransactionType) {
    const { error: deleteError } = await supabase.from("transactions").delete().eq("id", transactionId);
    if (deleteError) return { error: deleteError };

    const { data: account, error: AccountError } = await supabase.from("accounts").select("balance").eq("id", accountId).single()
    if (AccountError) return { error: AccountError };

    const deleta = type === "INCOME" ? -amount : amount;


    const { error: BalanceError } = await supabase.from("accounts").update({ balance: account.balance + deleta }).eq("id", accountId);
    if (BalanceError) return { error: BalanceError };
    return { error: null }

}


export async function deletetransaction(supabase: SupabaseClient, transactionId: string) {
    // 1. Securely fetch transaction data directly from the DB instead of trusting function parameters
    const { data: transaction, error: txError } = await supabase
        .from("transactions")
        .select("account_id, amount, type")
        .eq("id", transactionId)
        .single();

    if (txError || !transaction) {
        return { error: txError || new Error("Transaction not found") };
    }

    // 2. Fetch the true current account balance
    const { data: account, error: accountError } = await supabase
        .from("accounts")
        .select("balance")
        .eq("id", transaction.account_id)
        .single();

    if (accountError || !account) {
        return { error: accountError || new Error("Account not found") };
    }

    // 3. Math reversal calculations
    const delta = transaction.type === "INCOME" ? -transaction.amount : transaction.amount;

    // 4. Update the account balance
    const { error: balanceError } = await supabase
        .from("accounts")
        .update({ balance: account.balance + delta })
        .eq("id", transaction.account_id);

    if (balanceError) return { error: balanceError };

    // 5. Delete the transaction entry last
    const { error: deleteError } = await supabase
        .from("transactions")
        .delete()
        .eq("id", transactionId);

    if (deleteError) return { error: deleteError };

    return { error: null };
}
