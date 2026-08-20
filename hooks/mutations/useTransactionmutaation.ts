import { deletetransaction } from "@/lib/api-services/transactions";
import { useSuperbase } from "../useSuperbase";
import { useMutation, useQueryClient } from "@tanstack/react-query";










export function useDeleteTransaction() {
    const supabase = useSuperbase();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (transactionId: string) => deletetransaction(supabase, transactionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
    });
}