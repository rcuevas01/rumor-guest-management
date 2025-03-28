"use client";

export function GuestListSkeleton() {
  // Create skeleton rows for loading state
  const renderSkeletonRows = () => {
    return Array.from({ length: 10 }).map((_, index) => (
      <tr key={`skeleton-${index}`} className="relative overflow-hidden">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 w-4 bg-background-muted rounded relative overflow-hidden skeleton-shimmer"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="space-y-2">
            <div className="h-4 bg-background-muted rounded w-32 relative overflow-hidden skeleton-shimmer"></div>
            <div className="h-3 bg-background-muted rounded w-48 relative overflow-hidden skeleton-shimmer"></div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-5 bg-background-muted rounded-full w-20 relative overflow-hidden skeleton-shimmer"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-background-muted rounded w-24 relative overflow-hidden skeleton-shimmer"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-background-muted rounded w-16 relative overflow-hidden skeleton-shimmer"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex flex-wrap gap-2">
            <div className="h-5 bg-background-muted rounded-full w-16 relative overflow-hidden skeleton-shimmer"></div>
            {index % 3 === 0 && <div className="h-5 bg-background-muted rounded-full w-14 relative overflow-hidden skeleton-shimmer"></div>}
            {index % 2 === 0 && <div className="h-5 bg-background-muted rounded-full w-20 relative overflow-hidden skeleton-shimmer"></div>}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right">
          <div className="h-5 w-5 bg-background-muted rounded-full ml-auto relative overflow-hidden skeleton-shimmer"></div>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .skeleton-shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.15) 20%,
            rgba(255, 255, 255, 0.3) 60%,
            rgba(255, 255, 255, 0)
          );
          animation: shimmer 2s infinite;
        }
        
        .dark .skeleton-shimmer::after {
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.05) 20%,
            rgba(255, 255, 255, 0.1) 60%,
            rgba(255, 255, 255, 0)
          );
        }
      `}</style>
      
      <tbody className="bg-background divide-y divide-border">
        {renderSkeletonRows()}
      </tbody>
      <div className="px-4 py-3 flex items-center justify-between border-t border-default">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div className="h-5 bg-background-muted rounded w-56 relative overflow-hidden skeleton-shimmer"></div>
          <div className="h-8 bg-background-muted rounded w-80 relative overflow-hidden skeleton-shimmer"></div>
        </div>
      </div>
    </>
  );
}