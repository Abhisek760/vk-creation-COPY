"use client";

interface Props {
  progress: {
    editedPhotos: boolean;
    rawPhotos: boolean;
    cinematicFilm: boolean;
    teaserFilm: boolean;
    instagramReel: boolean;
    album: boolean;
    pendrive: boolean;
    cloudGallery: boolean;
  };
}

const labels: Record<string, string> = {
  editedPhotos: "Edited Photos",
  rawPhotos: "Raw Photos",
  cinematicFilm: "Cinematic Film",
  teaserFilm: "Teaser Film",
  instagramReel: "Instagram Reel",
  album: "Album",
  pendrive: "Pendrive",
  cloudGallery: "Cloud Gallery",
};

export default function DeliveryProgressCard({
  progress,
}: Props) {
  const total = Object.keys(progress).length;

  const completed =
    Object.values(progress).filter(Boolean)
      .length;

  const percentage = Math.round(
    (completed / total) * 100
  );

  return (
    <div className="rounded-2xl border bg-white p-6">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold">
            Delivery Progress
          </h2>

          <p className="text-sm text-gray-500">
            {completed} / {total} Completed
          </p>

        </div>

        <div className="text-3xl font-bold text-indigo-600">
          {percentage}%
        </div>

      </div>

      <div className="mb-6 h-3 overflow-hidden rounded-full bg-gray-200">

        <div
          className="h-full rounded-full bg-green-500 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

      <div className="grid gap-3 md:grid-cols-2">

        {Object.entries(progress).map(
          ([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <span>
                {labels[key]}
              </span>

              <span className="text-xl">
                {value ? "✅" : "⏳"}
              </span>
            </div>
          )
        )}

      </div>

    </div>
  );
}