import { createClerkSuperBaseClient } from "@/lib/superbase";
import { useAuth } from "@clerk/expo"
import { useEffect, useMemo, useRef } from "react";



export function useSuperbase() {


    const { getToken } = useAuth()

    const tokenRef = useRef(getToken)
    useEffect(() => {
        tokenRef.current = getToken;
    }, [getToken])

    const client = useMemo(() => createClerkSuperBaseClient(getToken), [])
    return client

}