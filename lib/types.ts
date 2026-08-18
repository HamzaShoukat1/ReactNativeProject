import { CategoryKey } from "@/constants/Categories";


export type AccountType = "CASH" | "BANK" | "CREDIT_CARD" | "SAVINGS"


export type Account = {
    id: string,
    user_id: string,
    name: string,
    type: AccountType,
    balance: number,
    is_default: boolean,
    created_at: string,
}


export type TransactionType = "INCOME" | "EXPENSE";
export type InputMethod = "MANUAL" | "RECEIPT_SCAN" | "VOICE"

export type Transaction = {
    id: string,
    user_id: string,
    account_id: string,
    type: TransactionType,
    amount: number,
    category: CategoryKey,
    description: string | null,
    date: string,
    status: string,
    input_method: InputMethod,
    voice_transcript: string | null,
    is_flagged: boolean,
    flag_reason: boolean,
    created_at: string,
    updated_at: string
}

export type TransactionFilters = {
    type?: TransactionType | null,
    account_id?: string | null,

}


export type Budget = {
    id: string,
    user_id: string,
    amount: string,
    last_alert_sent: string | null,
    created_at: string,
    updated_at: string
}