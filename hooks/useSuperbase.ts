import { createClerkSuperBaseClient } from "@/lib/superbase";
import {useAuth} from "@clerk/expo"
import { useMemo } from "react";



export function useSuperbase() {
    const {getToken} = useAuth()
    const client = useMemo(() => createClerkSuperBaseClient(getToken), [])
    return client

}