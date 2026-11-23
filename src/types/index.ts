export type ModelCard = {
  id: string; name: string; slug: string; family: string | null; description: string;
  modelType: string; contextWindow: number; capabilities: string[]; featured: boolean;
  company: { name: string; slug: string } | null;
  providers: { provider: { name: string; slug: string }; pricing: { inputPricePerMillion: string | number; outputPricePerMillion: string | number }[] }[];
  benchmarks: { benchmarkName: string; score: number }[];
};
