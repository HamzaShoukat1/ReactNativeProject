import { useUser } from "@clerk/expo";
import { useSuperbase } from "../useSuperbase";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/Tenstack-Query/keys";
import { getBudget } from "@/lib/api-services/budgets";







export function useBudgetsQuery() {
    const { user } = useUser();
    const superBase = useSuperbase();


    return useQuery({
        queryKey: queryKeys.budget(user?.id),
        queryFn: () => getBudget(superBase, user?.id as string),
        enabled: !!user
    })
}