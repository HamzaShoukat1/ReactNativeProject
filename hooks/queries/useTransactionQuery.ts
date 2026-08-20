import { useUser } from "@clerk/expo";
import { useSuperbase } from "../useSuperbase";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/Tenstack-Query/keys";
import { getTransactions } from "@/lib/api-services/transactions";
import { TransactionFilters } from "@/lib/types";






import { useInfiniteQuery } from '@tanstack/react-query';

export function useTransactionQuery(filters: TransactionFilters = {}) {
    const { user } = useUser();
    const superBase = useSuperbase();

    return useInfiniteQuery({
        queryKey: [...queryKeys.transactions(user?.id, filters), "infinite"],
        
        // Pass the internal pageParam down to your updated getTransactions function
        queryFn: ({ pageParam = 0 }) => 
            getTransactions(superBase, user?.id as string, filters, pageParam),
            
        enabled: !!user,
        initialPageParam: 0,
        
        // Automatically check if another page needs to be requested
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage || lastPage.length < 12) return undefined; // No more items left
            return allPages.length; // Next page index count (0, 1, 2...)
            
            
        }
    });
}
