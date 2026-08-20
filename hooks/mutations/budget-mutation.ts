
import { useUser } from "@clerk/expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSuperbase } from "../useSuperbase";
import { upsertBudget } from "@/lib/api-services/budgets";

export function useUpsertBudget() {
    const supabase = useSuperbase();
    const { user } = useUser();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (amount: number) => upsertBudget(supabase, user!.id, amount),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budget"] });
        },
    });
}