'use client';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GoBackButton({route} : {route: string}) {
    const router = useRouter();

    return (
        <div className='flex items-center'>

            <button
                onClick={() => router.push(route)}
                className="text-slate-500 font-semibold p-1 hover:cursor-pointer"
            >
                <span className='flex'><ChevronLeft className='text-slate-500' />Go Back</span>
            </button>
        </div>
    );
}
