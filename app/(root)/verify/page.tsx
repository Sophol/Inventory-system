import {
  incrementViews,
  verifyProductQr,
} from "@/lib/actions/serialNumber.action";

interface QRVerifyProductPageProps {
  searchParams: Promise<{
    p?: string;
  }>;
}

export default async function QRVerifyProductPage({
  searchParams,
}: QRVerifyProductPageProps) {
  const { p } = await searchParams;
  const code = p ?? "";
  await incrementViews({ serial: code });
  const { data, success } = await verifyProductQr({ serial: code });

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-6 py-12">
      <div
        className="bg-white bg-opacity-25 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full p-10 text-center border mt-[-4rem]"
        style={{
          borderColor: success
            ? "rgba(34,197,94,0.95)"
            : "rgba(244,114,182,0.9)",
        }}
      >
        <h1 className="text-2xl font-extrabold mb-8 tracking-wide uppercase drop-shadow-md">
          Product Verification
        </h1>

        {code ? (
          success ? (
            <div className="inline-flex flex-col items-center bg-green-900 rounded-xl px-6 py-6 shadow-lg text-green-200 select-none">
              <span className="text-4xl mb-4 animate-pulse drop-shadow-lg">
                ✅
              </span>
              <p className="text-xl font-extrabold mb-2 drop-shadow-md">
                Verified Successfully
              </p>
              <code className="text-base font-mono bg-green-800 rounded px-4 py-2 truncate max-w-full shadow-md mb-4">
                {data?.product_code}
              </code>
              <h2 className="text-lg font-bold text-green-100">
                {data?.product_name}
              </h2>
              <h2 className="text-xs font-bold text-green-100">
                {data?.encrypt_serial}
              </h2>
            </div>
          ) : (
            <div className="inline-flex flex-col items-center bg-rose-900 rounded-xl px-10 py-8 shadow-lg text-rose-100 select-none">
              <span className="text-7xl mb-5 animate-pulse drop-shadow-lg">
                ❌
              </span>
              <p className="text-xl font-extrabold mb-2 drop-shadow-md">
                Verification Failed
              </p>
              <code className="text-xs font-mono bg-rose-800 rounded px-4 py-2 truncate max-w-full shadow-md">
                {code}
              </code>
            </div>
          )
        ) : (
          <p className="text-white font-medium">No code provided</p>
        )}
      </div>
    </div>
  );
}
