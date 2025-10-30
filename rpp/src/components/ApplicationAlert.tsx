'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function ApplicationAlert() {
    const searchParams = useSearchParams()
    const [showMessage, setShowMessage] = useState(true)

    const appliedStatus = searchParams.get('applied')
    const errorMessage = searchParams.get('message')

    if (!showMessage || !appliedStatus) {
        return null
    }

    return (
        <>
            {appliedStatus === 'success' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                    <strong className="font-bold">Success! </strong>
                    <span className="block sm:inline">Your application has been submitted.</span>
                    <button
                        onClick={() => setShowMessage(false)}
                        className="absolute top-0 bottom-0 right-0 px-4 py-3 hover:text-green-900"
                    >
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>
            )}

            {appliedStatus === 'error' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <strong className="font-bold">Error! </strong>
                    <span className="block sm:inline">
                        {errorMessage ? decodeURIComponent(errorMessage) : 'Failed to submit application.'}
                    </span>
                    <button
                        onClick={() => setShowMessage(false)}
                        className="absolute top-0 bottom-0 right-0 px-4 py-3 hover:text-red-900"
                    >
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>
            )}
        </>
    )
}
