import { ServiceConfig } from "@/config/pricing";

export function calculateAlbumPrice(
  config: ServiceConfig,
  values: Record<string, unknown>
): number {
  const sheetCount = Number(values.sheetCount ?? 0);

  const sheetField = config.inputs.find(
    (input) => input.id === "sheetType"
  );

  const coverField = config.inputs.find(
    (input) => input.id === "coverType"
  );

  const sheetPrice =
    sheetField?.options?.find(
      (option) => option.value === values.sheetType
    )?.price ?? 0;

  const coverPrice =
    coverField?.options?.find(
      (option) => option.value === values.coverType
    )?.price ?? 0;

  return sheetCount * sheetPrice + coverPrice;
}