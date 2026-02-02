'use server'

import { revalidatePath } from 'next/cache'

export async function revalidatePublicPage(usernameOrSlug: string) {
    revalidatePath(`/${usernameOrSlug}`)
}
