import { useUser } from "@clerk/expo";
import { useSuperbase } from "../useSuperbase";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/Tenstack-Query/keys";
import { getTransactions } from "@/lib/api-services/transactions";
import { file } from "zod";
import { TransactionFilters } from "@/lib/types";







export function useTransactionQuery(filters: TransactionFilters = {}) {
    const { user } = useUser();
    const superBase = useSuperbase();


    return useQuery({
        queryKey: queryKeys.transactions(user?.id, filters),
        queryFn: () => getTransactions(superBase, user?.id as string, filters),
        enabled: !!user
    })
}