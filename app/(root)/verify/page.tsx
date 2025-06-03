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
        {code ? (
          success ? (
            <div className="pb-2">
              <span className="text-2xl mb-4 animate-pulse drop-shadow-lg">
                ✅
              </span>
            </div>
          ) : (
            <div className="pb-2">
              <span className="text-2xl mb-4 animate-pulse drop-shadow-lg">
                ❌
              </span>
            </div>
          )
        ) : null}

        <h1 className="text-xl font-extrabold mb-4 tracking-wide uppercase drop-shadow-md">
          ការផ្ទៀងផ្ទាត់ផលិតផល
        </h1>

        {code ? (
          success ? (

            <div className="inline-flex flex-col items-center bg-green-900 rounded-xl px-6 py-6 shadow-lg text-green-200 select-none">

<div className="w-14 h-14 mb-4 shadow-xl bg-white rounded-full flex items-center justify-center ring-1 ring-gray-200">
  <img
    src="/_next/image?url=%2Fimages%2Flogo.png&w=96&q=75"
    alt="Logo"
    className="w-12 h-12 object-contain"
  />
</div>

              <p className="text-sm font-extrabold mb-2 drop-shadow-md">
                ផលិតផលពិតប្រាកដលេខសម្គាល់
              </p>

              <code className="text-sm font-mono bg-green-800 rounded px-4 py-2 max-w-full shadow-md mb-4 overflow-x-auto break-all whitespace-break-spaces">
                {data?.raw_serial}
              </code>
              <h2 className="text-sm font-bold text-green-100 break-all">
                {/* {data?.product_name} */}
              </h2>
            </div>
          ) : (
            <div className="inline-flex flex-col items-center bg-rose-900 rounded-xl px-10 py-8 shadow-lg text-rose-100 select-none">
 <div className="w-14 h-14 mb-4 shadow-xl bg-white rounded-full flex items-center justify-center ring-1 ring-gray-200">
  <img
    src="/_next/image?url=%2Fimages%2Flogo.png&w=96&q=75"
    alt="Logo"
    className="w-12 h-12 object-contain"
  />
</div>

              <p className="text-sm font-extrabold mb-2 drop-shadow-md">
                ផលិតផលក្លែងក្លាយ ឬ កូដមិនត្រឹមត្រូវ
              </p>
            </div>
          )
        ) : (
          <p className="text-white font-medium">មិនបានបញ្ចូលកូដ</p>
        )}
      </div>
    </div>
  );
}
