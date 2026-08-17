import { createClient } from '@supabase/supabase-js'


const superbaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const superbaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY as string;


if (!superbaseUrl || !superbaseKey) {
    throw new Error('Supabase URL or Key is missing in the environment variables');
}


export function createClerkSuperBaseClient(getToken: () => Promise<string | null>) {

    return createClient(superbaseUrl, superbaseKey, {
        async accessToken() {
            return await getToken()
        }

    }
)


}