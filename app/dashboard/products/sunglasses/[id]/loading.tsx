import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const loading = () => {
    return (
        <div>
            <div className="p-4 space-y-4 ">
                <Skeleton className="h-8 w-1/4 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-4 border rounded-lg shadow">
                            <Skeleton className="h-6 w-3/4 mb-4 rounded" />
                            <Skeleton className="h-4 w-full mb-2 rounded" />
                            <Skeleton className="h-4 w-5/6 mb-2 rounded" />
                            <Skeleton className="h-4 w-2/3 rounded" />
                        </div>
                    ))}
                </div>

                <div>
                    <Skeleton className="h-6 w-1/4 mb-4 rounded" />

                    <Skeleton className="h-52 flex-1 w-full mb-2 rounded" />
                </div>
            </div>
        </div>
    )
}

export default loading