interface QRVerifyProductPageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function QRVerifyProductPage({ params }: QRVerifyProductPageProps) {
  const awaitedParams = await params;
  const { code } = awaitedParams;

  const isVerified = code.startsWith("1");

  const bgGradient = isVerified
    ? "bg-gradient-to-b from-green-900 via-green-800 to-green-900"
    : "bg-gradient-to-b from-rose-800 via-rose-700 to-rose-800";

  return (
    <div className={`flex items-center justify-center min-h-[calc(100vh-4rem)] px-6 py-12 ${bgGradient}`}>
      <div
        className="bg-white bg-opacity-25 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full p-10 text-center border mt-[-4rem]"
        style={{ borderColor: isVerified ? "rgba(34,197,94,0.95)" : "rgba(244,114,182,0.9)" }}
      >
        <h1
          className={`text-2xl font-extrabold mb-8 tracking-wide uppercase ${
            isVerified ? "text-green-100 drop-shadow-md" : "text-rose-200 drop-shadow-md"
          }`}
        >
          Product Verification
        </h1>

        {isVerified ? (
          <div className="inline-flex flex-col items-center bg-green-900 rounded-xl px-10 py-8 shadow-lg text-green-200 select-none">
            <span className="text-7xl mb-5 animate-pulse drop-shadow-lg">✅</span>
            <p className="text-xl font-extrabold mb-2 drop-shadow-md">Verified Successfully</p>
            <code className="text-base font-mono bg-green-800 rounded px-4 py-2 truncate max-w-full shadow-md">
              {code}
            </code>
          </div>
        ) : (
          <div className="inline-flex flex-col items-center bg-rose-900 rounded-xl px-10 py-8 shadow-lg text-rose-100 select-none">
            <span className="text-7xl mb-5 animate-pulse drop-shadow-lg">❌</span>
            <p className="text-xl font-extrabold mb-2 drop-shadow-md">Verification Failed</p>
            <code className="text-base font-mono bg-rose-800 rounded px-4 py-2 truncate max-w-full shadow-md">
              {code}
            </code>
          </div>
        )}
      </div>
    </div>
  );
}
