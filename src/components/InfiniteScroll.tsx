import React, { useCallback, useRef, ReactNode } from "react";

export interface InfiniteScrollProps<T> {
  data: T[];
  isLoading: boolean;
  onLoadMore: () => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string | ReactNode;
  hasNextPage: boolean;
  loadingIndicator?: ReactNode;
  className?: string;
  itemClassName?: string;
  emptyClassName?: string;
  loadingClassName?: string;
  threshold?: number;
  offset?: number;
  keyExtractor?: (item: T, index: number) => string | number;
}

/**
 * InfiniteScroll component that automatically loads more data when the user scrolls to the bottom
 */
const InfiniteScroll = <T,>({
  data,
  isLoading,
  onLoadMore,
  renderItem,
  emptyMessage = "No items found.",
  hasNextPage,
  loadingIndicator,
  className = "flex flex-col gap-4",
  itemClassName = "",
  emptyClassName = "text-center text-primary-500",
  loadingClassName = "flex justify-center items-center h-52",
  threshold = 1.0,
  offset = 3,
  keyExtractor,
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
        { threshold }
      );
      if (node) observer.current.observe(node);
    },
    [isLoading, handleLoadMore, threshold]
  );

  if (isLoading && !data.length) {
    return (
      <div className={loadingClassName}>{loadingIndicator || "Loading..."}</div>
    );
  }

  return (
    <div className={className}>
      {data.length > 0 ? (
        data.map((item, index) => (
          <div
            key={keyExtractor ? keyExtractor(item, index) : index}
            ref={index === data.length - offset ? lastElementRef : undefined}
            className={itemClassName}
          >
            {renderItem(item, index)}
          </div>
        ))
      ) : (
        <div className={emptyClassName}>{emptyMessage}</div>
      )}
      {isLoading && data.length > 0 && (
        <div className={loadingClassName}>
          {loadingIndicator || "Loading more..."}
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
