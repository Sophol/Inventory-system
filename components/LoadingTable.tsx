import { Skeleton } from "./ui/skeleton";

function LoadingTable({ rows }: { rows?: number }) {
  const tableRows = Array.from({ length: rows || 5 }, (_, i) => {
    return (
      <div className="flex-1 w-full text-slate-200  space-y-2 p-4" key={i}>
        <Skeleton className="w-full h-8 rounded" />
      </div>
    );
  });
  return (
    <div className="mt-8 flex w-full flex-col justify-center items-center sm:mt-16">
      {tableRows}
    </div>
  );
}
export default LoadingTable;
