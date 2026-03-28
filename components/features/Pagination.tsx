"use client";

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
    const searchParams = useSearchParams();

    // Helper to create page URLs while preserving filters
    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        return `?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i);
            }

            if (currentPage < totalPages - 2) pages.push('...');
            if (!pages.includes(totalPages)) pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-12 pb-10">
            {/* Previous Button */}
            <Link
                href={currentPage > 1 ? createPageUrl(currentPage - 1) : '#'}
                className={cn(
                    "p-2 rounded-lg glass-card border border-white/10 transition-all duration-300",
                    currentPage > 1
                        ? "text-white hover:bg-gms-neon hover:text-black hover:border-gms-neon"
                        : "text-gray-600 cursor-not-allowed pointer-events-none"
                )}
                aria-disabled={currentPage === 1}
            >
                <ChevronLeft className="h-5 w-5" />
            </Link>

            {/* Page Numbers */}
            <div className="flex items-center gap-2 px-2">
                {getPageNumbers().map((page, index) => (
                    typeof page === 'number' ? (
                        <Link
                            key={index}
                            href={createPageUrl(page)}
                            className={cn(
                                "w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 font-bold",
                                currentPage === page
                                    ? "bg-gms-neon text-black shadow-[0_0_15px_rgba(57,255,20,0.5)]"
                                    : "glass-card text-white hover:bg-white/10 border border-white/10"
                            )}
                        >
                            {page}
                        </Link>
                    ) : (
                        <span key={index} className="text-gray-500 px-1 font-bold">
                            {page}
                        </span>
                    )
                ))}
            </div>

            {/* Next Button */}
            <Link
                href={currentPage < totalPages ? createPageUrl(currentPage + 1) : '#'}
                className={cn(
                    "p-2 rounded-lg glass-card border border-white/10 transition-all duration-300",
                    currentPage < totalPages
                        ? "text-white hover:bg-gms-neon hover:text-black hover:border-gms-neon"
                        : "text-gray-600 cursor-not-allowed pointer-events-none"
                )}
                aria-disabled={currentPage === totalPages}
            >
                <ChevronRight className="h-5 w-5" />
            </Link>
        </div>
    );
}
