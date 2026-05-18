export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-5">
        Crypto AI Trading Assistant
      </h1>

      <p className="mb-5">
        Upload your chart screenshot below.
      </p>

      <input type="file" />
    </main>
  );
}
