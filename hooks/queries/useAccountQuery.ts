import { useUser } from "@clerk/expo";
import { useSuperbase } from "../useSuperbase";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/Tenstack-Query/keys";
import { getAccounts } from "@/lib/api-services/accounts";











export function useAccountQuery() {
    const { user } = useUser();
    const superBase = useSuperbase();




    return useQuery({
        queryKey: queryKeys.accounts(user?.id),
        queryFn: () => getAccounts(superBase, user?.id as string),
        enabled:!!user
    })
}