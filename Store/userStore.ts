import {create} from "zustand";



interface UserStore {
    currency:string,
    setCurrency:(value:string)=>void,
    needsOnBoarding:boolean  | null,
    setNeedsOnBoarding:(value:boolean | null)=>void

}


export const useUserStore  = create<UserStore>((set:any)=> ({
    currency:"USD",
    setCurrency:(value:string)=> set({currency:value}),
    needsOnBoarding:null,
    setNeedsOnBoarding:(value:boolean | null)=> set({needsOnBoarding:value})


}))