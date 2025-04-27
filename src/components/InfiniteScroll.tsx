import React, { useCallback, useRef } from "react";

interface InfiniteScrollProps<T> {
  data: T[];
  isLoading: boolean;
  onLoadMore: () => void;
  renderItem: (item: T) => React.ReactNode;
  emptyMessage?: string;
  hasNextPage: boolean;
}

const InfiniteScroll = <T,>({
  data,
  isLoading,
  onLoadMore,
  renderItem,
  emptyMessage = "No items found.",
  hasNextPage,
}: InfiniteScrollProps<T>) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage) {
      onLoadMore();
    }
  }, [onLoadMore, hasNextPage]);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            handleLoadMore();
          }
        },
        { threshold: 1.0 }
      );
      if (node) observer.current.observe(node);
    },
    [isLoading, handleLoadMore]
  );

  if (isLoading && !data.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.length > 0 ? (
        data.map((item, index) => (
          <div
            key={index}
            ref={index === data.length - 3 ? lastElementRef : undefined}
          >
            {renderItem(item)}
          </div>
        ))
      ) : (
        <div className="text-center text-primary-500">{emptyMessage}</div>
      )}
    </div>
  );
};

export default InfiniteScroll;
