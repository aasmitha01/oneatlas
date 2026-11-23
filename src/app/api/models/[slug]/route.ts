
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const model = await prisma.aIModel.findUnique({
      where: { slug },
      include: {
        company: true,
        providers: {
          include: {
            provider: true,
            pricing: true,
          },
        },
        benchmarks: true,
      },
    });

    if (!model) {
      return NextResponse.json(
        { error: "Model not found" },
        { status: 404 }
      );
    }

    const formattedModel = {
      ...model,
      providers: model.providers.map((link) => ({
        ...link,
        pricing: link.pricing.map((price) => ({
          ...price,
          inputPricePerMillion: Number(price.inputPricePerMillion),
          outputPricePerMillion: Number(price.outputPricePerMillion),
        })),
      })),
    };

    return NextResponse.json({
      data: formattedModel,
    });
  } catch (error) {
    console.error("Model API error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve model details" },
      { status: 500 }
    );
  }
}
