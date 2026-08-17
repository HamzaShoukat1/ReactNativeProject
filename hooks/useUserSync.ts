import { useUserStore } from "@/Store/userStore";
import { useUser } from "@clerk/expo";
import { useSuperbase } from "./useSuperbase";
import { useEffect } from "react";

export const useUserSync = () => {
    const { user } = useUser();
    const setCurrency = useUserStore((state) => state.setCurrency);
    const setNeedsOnBoarding = useUserStore((state) => state.setNeedsOnBoarding);

    const authSuperBase = useSuperbase()




    useEffect(() => {
        if (!user) return
        const syncUser = async () => {
            //first sync exist user if exist dont show onboarding 
            try {
                const { data: existingUser, error: fetchError } = await authSuperBase.from("users").select("clerk_id, currency").eq("clerk_id", user.id).single()
                if (fetchError && fetchError.code !== "PGRST116") {
                    console.error("Error fetching user:", fetchError)
                    setNeedsOnBoarding(true)
                    return
                }

                if (existingUser) {
                    setCurrency(existingUser.currency ?? "USD")
                    setNeedsOnBoarding(!existingUser.currency)
                    return

                }
                //this for non existing users, we will insert them into the database and set their currency to USD by default and also to onboarding to new user
                const email = user.emailAddresses[0]?.emailAddress ?? ""
                const { data: newUser, error: insertError } = await authSuperBase.from("users").upsert({
                    clerk_id: user.id,
                    email,
                    name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
                    image_url: user.imageUrl

                },
                    { onConflict: "clerk_id", ignoreDuplicates: false }
                ).select("currency").single()


                if (insertError) {
                    console.error("Error inserting user:", insertError)
                    setNeedsOnBoarding(true)
                    return 
                }

                setCurrency(newUser?.currency ?? "USD")
                setNeedsOnBoarding(!newUser?.currency)


                const {error:accountError} = await authSuperBase.from("accounts").insert({
                    user_id: user.id,
                    name:"Cash",
                    type:"CASH",
                    balance:0,
                    is_default:true
                })
                if(accountError){
                    console.error("Error creating default account:", accountError)
                }

            } catch (error) {
                console.error("Error syncing user:", error)

            }

        }
        syncUser()

    }, [user?.id])



}