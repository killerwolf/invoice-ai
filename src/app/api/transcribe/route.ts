import { Mistral } from "@mistralai/mistralai";
import { NextResponse } from "next/server";
import { parseMarkdownJson } from "../../../lib/parseMarkdownJson";

export async function POST(request: Request) {
  console.log("Request received");

  if (process.env.MOCK_TRANSCRIBE === "true") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return NextResponse.json({
      success: true,
      data: {
        invoice_number: "INV-2024-0891",
        date: "2024-10-12",
        due_date: "2024-11-12",
        issuer: {
          name: "Acme Cloud Solutions",
          address: "15 Rue de Rivoli, 75001 Paris",
          vat_id: "FR84920192831",
        },
        client: {
          name: "NexGen Media Inc.",
          address: "42 Boulevard Haussmann, 75009 Paris",
        },
        items: [
          {
            description: "SaaS Enterprise Subscription",
            quantity: 1,
            unit_price: 249.0,
            total: 249.0,
          },
          {
            description: "Document AI API Usage (5k credits)",
            quantity: 5,
            unit_price: 35.0,
            total: 175.0,
          },
          {
            description: "Dedicated Cloud Support",
            quantity: 1,
            unit_price: 99.0,
            total: 99.0,
          },
        ],
        subtotal: 523.0,
        tax_rate: "20%",
        tax_amount: 104.6,
        total: 627.6,
        currency: "EUR",
      },
    });
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  const agentId = "ag:f59c8e55:20240925:transcribe-old-documents:79d6b2b7";

  if (!apiKey) {
    console.error("Missing MISTRAL_API_KEY");
    return NextResponse.json(
      { success: false, error: "Missing MISTRAL_API_KEY" },
      { status: 500 },
    );
  }

  try {
    console.log("Initializing Mistral client");
    const client = new Mistral({ apiKey });

    console.log("Reading form data");
    const data = await request.formData();
    const file = data.get("file") as File;

    console.log("Reading file content");
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileContent = `data:${file.type};base64,${buffer.toString("base64")}`;

    console.log("Calling Mistral API");
    const chatResponse = await client.agents.complete({
      agentId: agentId,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "transcribe this invoice in a json data structure in JSON format , so i can parse easily your response, and answer only with json response",
            },
            {
              type: "image_url",
              imageUrl: fileContent,
            },
          ],
        },
      ],
    });

    console.log("Mistral response:", chatResponse);

    if (chatResponse.choices?.[0]?.message?.content) {
      const transcribedText = chatResponse.choices[0].message.content;
      console.log("Transcribed text content:\n", transcribedText);
      try {
        const jsonData = JSON.parse(transcribedText);
        return NextResponse.json({ success: true, data: jsonData });
      } catch {
        const parsedData = parseMarkdownJson(transcribedText);
        return NextResponse.json({ success: true, data: parsedData });
      }
    } else {
      console.error("Transcription failed - no content returned");
      return NextResponse.json(
        { success: false, error: "Transcription failed - no content returned" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error during transcription:", error);
    return NextResponse.json(
      { success: false, error: "Transcription failed" },
      { status: 500 },
    );
  }
}
