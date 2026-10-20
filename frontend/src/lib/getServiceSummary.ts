export function getServiceSummary(service: any, pricingConfig: any = {}) {
  if (!service || !service.serviceId) return [];
  const config = pricingConfig[service.serviceId];
  if (!config || !Array.isArray(config.inputs)) return [];

  return config.inputs.map((input: any) => {
    const value = service.values?.[input.key];
    if (value === undefined) return null;
    let label = String(value);
    if (Array.isArray(input.options)) {
      const opt = input.options.find((option: any) => option.value === value);
      if (opt) label = opt.label;
    }
    return { label: input.label || input.key, value: label };
  }).filter(Boolean);
}
export default getServiceSummary;
