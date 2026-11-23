import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ---------------------------------------------
// 1. AI COMPANIES / RESEARCH LABS
// ---------------------------------------------

const companies = [
  {
    name: "OpenAI",
    slug: "openai",
    description: "AI research and deployment company.",
    website: "https://openai.com",
  },
  {
    name: "Anthropic",
    slug: "anthropic",
    description: "AI safety and research company developing Claude models.",
    website: "https://anthropic.com",
  },
  {
    name: "Google",
    slug: "google",
    description: "Technology and research company developing Gemini models.",
    website: "https://deepmind.google",
  },
  {
    name: "Meta",
    slug: "meta",
    description: "Technology company developing Llama open-weight models.",
    website: "https://ai.meta.com",
  },
  {
    name: "Mistral AI",
    slug: "mistral-ai",
    description: "AI company developing efficient and open-weight models.",
    website: "https://mistral.ai",
  },
  {
    name: "DeepSeek",
    slug: "deepseek",
    description: "AI research company developing reasoning and language models.",
    website: "https://deepseek.com",
  },
];

// ---------------------------------------------
// 2. AI PROVIDERS
// ---------------------------------------------

const providers = [
  {
    name: "OpenAI API",
    slug: "openai-api",
    description: "Official OpenAI model API.",
    website: "https://platform.openai.com",
  },
  {
    name: "Anthropic API",
    slug: "anthropic-api",
    description: "Official Claude model API.",
    website: "https://console.anthropic.com",
  },
  {
    name: "Google AI Studio",
    slug: "google-ai-studio",
    description: "Google Gemini developer platform.",
    website: "https://aistudio.google.com",
  },
  {
    name: "Together AI",
    slug: "together-ai",
    description: "Cloud inference platform for open models.",
    website: "https://www.together.ai",
  },
  {
    name: "Fireworks AI",
    slug: "fireworks-ai",
    description: "AI inference platform for foundation models.",
    website: "https://fireworks.ai",
  },
  {
    name: "OpenRouter",
    slug: "openrouter",
    description: "Unified API for discovering and accessing AI models.",
    website: "https://openrouter.ai",
  },
];

// ---------------------------------------------
// 3. MODEL CATALOGUE
// All prices and benchmark scores below are
// illustrative demo values, not live quotations.
// Prices are USD per million tokens.
// ---------------------------------------------

const models = [
  {
    name: "GPT-4.1",
    slug: "gpt-4-1",
    family: "GPT",
    company: "openai",
    description:
      "A general-purpose model for complex instruction following, coding and long-context tasks.",
    contextWindow: 1047576,
    modelType: "Multimodal",
    inputModalities: ["Text", "Image"],
    outputModalities: ["Text"],
    capabilities: ["Reasoning", "Coding", "Vision", "Tool calling"],
    input: 2,
    output: 8,
    providers: ["openai-api", "openrouter"],
    scores: { intelligence: 91, coding: 88, reasoning: 90, math: 86 },
  },
  {
    name: "GPT-4.1 mini",
    slug: "gpt-4-1-mini",
    family: "GPT",
    company: "openai",
    description:
      "A smaller and faster model for cost-efficient workloads and high-volume applications.",
    contextWindow: 1047576,
    modelType: "Multimodal",
    inputModalities: ["Text", "Image"],
    outputModalities: ["Text"],
    capabilities: ["Coding", "Vision", "Tool calling"],
    input: 0.4,
    output: 1.6,
    providers: ["openai-api", "openrouter"],
    scores: { intelligence: 84, coding: 82, reasoning: 80, math: 78 },
  },
  {
    name: "Claude Sonnet 4",
    slug: "claude-sonnet-4",
    family: "Claude",
    company: "anthropic",
    description:
      "A balanced model for advanced coding, analysis and agentic workflows.",
    contextWindow: 200000,
    modelType: "Multimodal",
    inputModalities: ["Text", "Image"],
    outputModalities: ["Text"],
    capabilities: ["Reasoning", "Coding", "Vision", "Tool calling"],
    input: 3,
    output: 15,
    providers: ["anthropic-api", "openrouter"],
    scores: { intelligence: 93, coding: 95, reasoning: 94, math: 88 },
  },
  {
    name: "Claude 3.7 Sonnet",
    slug: "claude-3-7-sonnet",
    family: "Claude",
    company: "anthropic",
    description:
      "A hybrid reasoning model suited to software engineering and knowledge work.",
    contextWindow: 200000,
    modelType: "Multimodal",
    inputModalities: ["Text", "Image"],
    outputModalities: ["Text"],
    capabilities: ["Reasoning", "Coding", "Vision"],
    input: 3,
    output: 15,
    providers: ["anthropic-api", "openrouter"],
    scores: { intelligence: 88, coding: 91, reasoning: 90, math: 84 },
  },
  {
    name: "Gemini 2.5 Pro",
    slug: "gemini-2-5-pro",
    family: "Gemini",
    company: "google",
    description:
      "A thinking model for complex reasoning, multimodal understanding and long context.",
    contextWindow: 1000000,
    modelType: "Multimodal",
    inputModalities: ["Text", "Image", "Audio", "Video"],
    outputModalities: ["Text"],
    capabilities: ["Reasoning", "Coding", "Vision", "Audio", "Tool calling"],
    input: 1.25,
    output: 10,
    providers: ["google-ai-studio", "openrouter"],
    scores: { intelligence: 94, coding: 91, reasoning: 96, math: 95 },
  },
  {
    name: "Gemini 2.5 Flash",
    slug: "gemini-2-5-flash",
    family: "Gemini",
    company: "google",
    description:
      "A fast model optimized for low-latency multimodal tasks and scalable applications.",
    contextWindow: 1000000,
    modelType: "Multimodal",
    inputModalities: ["Text", "Image", "Audio", "Video"],
    outputModalities: ["Text"],
    capabilities: ["Reasoning", "Coding", "Vision", "Audio"],
    input: 0.3,
    output: 2.5,
    providers: ["google-ai-studio", "openrouter"],
    scores: { intelligence: 87, coding: 85, reasoning: 86, math: 84 },
  },
  {
    name: "Llama 4 Maverick",
    slug: "llama-4-maverick",
    family: "Llama",
    company: "meta",
    description:
      "An open-weight mixture-of-experts model for multimodal assistant applications.",
    contextWindow: 10000000,
    modelType: "Multimodal",
    inputModalities: ["Text", "Image"],
    outputModalities: ["Text"],
    capabilities: ["Reasoning", "Vision", "Tool calling"],
    input: 0.27,
    output: 0.85,
    providers: ["together-ai", "fireworks-ai", "openrouter"],
    scores: { intelligence: 82, coding: 80, reasoning: 81, math: 77 },
  },
  {
    name: "Mistral Large",
    slug: "mistral-large",
    family: "Mistral",
    company: "mistral-ai",
    description:
      "A flagship model for multilingual tasks, coding and enterprise applications.",
    contextWindow: 128000,
    modelType: "Text",
    inputModalities: ["Text"],
    outputModalities: ["Text"],
    capabilities: ["Reasoning", "Coding", "Tool calling"],
    input: 2,
    output: 6,
    providers: ["fireworks-ai", "together-ai", "openrouter"],
    scores: { intelligence: 80, coding: 79, reasoning: 81, math: 76 },
  },
  {
    name: "DeepSeek R1",
    slug: "deepseek-r1",
    family: "DeepSeek",
    company: "deepseek",
    description:
      "A reasoning model focused on mathematics, coding and complex problem solving.",
    contextWindow: 163840,
    modelType: "Text",
    inputModalities: ["Text"],
    outputModalities: ["Text"],
    capabilities: ["Reasoning", "Math", "Coding"],
    input: 0.55,
    output: 2.19,
    providers: ["together-ai", "fireworks-ai", "openrouter"],
    scores: { intelligence: 89, coding: 90, reasoning: 95, math: 96 },
  },
];

// ---------------------------------------------
// 4. BENCHMARK NAME MAPPING
// ---------------------------------------------

const benchmarkNames = {
  intelligence: "Atlas Intelligence Index",
  coding: "Coding Performance",
  reasoning: "Reasoning Performance",
  math: "Mathematical Reasoning",
};

async function main() {
  console.log("Starting OneAtlas database seeding...");
  await prisma.modelPricing.deleteMany({
    where: {
      id: { startsWith: "seed-pricing-" },
    },
  });

  await prisma.modelBenchmark.deleteMany({
    where: {
      id: { startsWith: "seed-benchmark-" },
    },
  });

  // Create or update companies.
  for (const company of companies) {
    await prisma.company.upsert({
      where: { slug: company.slug },
      update: company,
      create: company,
    });
  }

  console.log("Companies created.");

  // Create or update providers.
  for (const provider of providers) {
    await prisma.provider.upsert({
      where: { slug: provider.slug },
      update: provider,
      create: provider,
    });
  }

  console.log("Providers created.");

  // Create models and all their relationships.
  for (const item of models) {
    const {
      company: companySlug,
      providers: providerSlugs,
      input,
      output,
      scores,
      ...modelFields
    } = item;

    const company = await prisma.company.findUniqueOrThrow({
      where: { slug: companySlug },
    });

    const model = await prisma.aIModel.upsert({
      where: { slug: item.slug },
      update: {
        ...modelFields,
        companyId: company.id,
        featured: scores.intelligence >= 90,
      },
      create: {
        ...modelFields,
        companyId: company.id,
        featured: scores.intelligence >= 90,
      },
    });

    // Connect each model to all its supported demo providers.
    for (const providerSlug of providerSlugs) {
      const provider = await prisma.provider.findUniqueOrThrow({
        where: { slug: providerSlug },
      });

      const modelProvider = await prisma.modelProvider.upsert({
        where: {
          modelId_providerId: {
            modelId: model.id,
            providerId: provider.id,
          },
        },
        update: {
          providerModelId: item.slug,
          isAvailable: true,
        },
        create: {
          modelId: model.id,
          providerId: provider.id,
          providerModelId: item.slug,
          isAvailable: true,
        },
      });

      // Upsert provider-specific demo pricing.
      await prisma.modelPricing.upsert({
        where: {
          id: `seed-pricing-${model.id}-${provider.id}`,
        },
        update: {
          inputPricePerMillion: input,
          outputPricePerMillion: output,
          currency: "USD",
        },
        create: {
          id: `seed-pricing-${model.id}-${provider.id}`,
          modelProviderId: modelProvider.id,
          inputPricePerMillion: input,
          outputPricePerMillion: output,
          currency: "USD",
        },
      });
    }

    // Add four benchmark categories per model.
    for (const [category, score] of Object.entries(scores)) {
      const benchmarkId = `seed-benchmark-${model.id}-${category}`;

      await prisma.modelBenchmark.upsert({
        where: { id: benchmarkId },
        update: {
          benchmarkName:
            benchmarkNames[category as keyof typeof benchmarkNames],
          score,
          scoreUnit: "score out of 100",
          source: "OneAtlas illustrative demo dataset",
        },
        create: {
          id: benchmarkId,
          modelId: model.id,
          benchmarkName:
            benchmarkNames[category as keyof typeof benchmarkNames],
          score,
          scoreUnit: "score out of 100",
          source: "OneAtlas illustrative demo dataset",
        },
      });
    }

    console.log(`Processed model: ${item.name}`);
  }

  // ---------------------------------------------
  // 5. FINAL DATABASE SUMMARY
  // ---------------------------------------------

  const [
    companyCount,
    providerCount,
    modelCount,
    relationshipCount,
    pricingCount,
    benchmarkCount,
  ] = await Promise.all([
    prisma.company.count(),
    prisma.provider.count(),
    prisma.aIModel.count(),
    prisma.modelProvider.count(),
    prisma.modelPricing.count(),
    prisma.modelBenchmark.count(),
  ]);

  console.log("\n================================");
  console.log("ONEATLAS SEED COMPLETED");
  console.log("================================");
  console.log(`Companies: ${companyCount}`);
  console.log(`Providers: ${providerCount}`);
  console.log(`AI Models: ${modelCount}`);
  console.log(`Model-provider relationships: ${relationshipCount}`);
  console.log(`Pricing records: ${pricingCount}`);
  console.log(`Benchmark records: ${benchmarkCount}`);
  console.log("================================");
  console.log("Pricing and benchmark data are illustrative.");
}

main()
  .catch((error) => {
    console.error("OneAtlas seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });