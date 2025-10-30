'use server'

import { addStudentToProject } from '../../../lib/projects'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

export async function applyToProject(formData: FormData) {
    const projectId = formData.get('projectId') as string
    const studentId = formData.get('studentId') as string

    if (!projectId || !studentId) {
        throw new Error('Project ID and Student ID are required')
    }

    try {
        await addStudentToProject(studentId, projectId)
        revalidatePath(`/project/${projectId}`)
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

        console.error('Error applying to project:', error)
        redirect(`/project/${projectId}?applied=error&message=${encodeURIComponent((error as Error).message)}`)
    }

    redirect(`/project/${projectId}?applied=success`)
}