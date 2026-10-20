export default function SystemStatus() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#161b22] p-6">

      <h2 className="mb-5 text-xl font-semibold text-white">
        System Status
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between">

          <span className="text-gray-400">
            Builder
          </span>

          <span className="text-green-400">
            ● Online
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-gray-400">
            PDF Engine
          </span>

          <span className="text-green-400">
            ● Ready
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-gray-400">
            Local Storage
          </span>

          <span className="text-green-400">
            ● Connected
          </span>

        </div>

      </div>

    </div>
  );
}