import { NextResponse } from 'next/server'
import { Mistral } from '@mistralai/mistralai';

export async function POST(request: Request) {
  console.log("Request received");

  const apiKey = process.env.MISTRAL_API_KEY;
  const agentId = "ag:f59c8e55:20240925:transcribe-old-documents:79d6b2b7";

  if (!apiKey) {
    console.error("Missing MISTRAL_API_KEY");
    return NextResponse.json({ error: "Missing MISTRAL_API_KEY" }, { status: 500 });
  }

  try {
    console.log("Initializing Mistral client");
    const client = new Mistral({ apiKey });

    console.log("Reading form data");
    const data = await request.formData()
    const file = data.get('file') as File;

    console.log("Reading file content");
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileContent = `data:${file.type};base64,${buffer.toString('base64')}`;

    console.log("Calling Mistral API");
    const chatResponse = await client.agents.complete({
      agentId: agentId,
      messages: [{
        role: 'user',
        content: [{
          type: "text",
          text: "transcribe this invoice in a json data structure in JSON format , so i can parse easily your response, and answer only with json response",
        }, {
          type: "image_url",
          imageUrl: fileContent,
        }],
      }]
    });

    console.log("Mistral response:", chatResponse);

    if (chatResponse.choices && chatResponse.choices[0]?.message?.content) {
      const transcribedText = chatResponse.choices[0].message.content;
      try {
        const jsonData = JSON.parse(transcribedText);
        console.log(jsonData);
        return NextResponse.json({ transcribedText: jsonData });
      } catch {
        console.log(transcribedText);
        return NextResponse.json({ transcribedText: transcribedText });
      }
    } else {
      console.error("Transcription failed - no content returned");
      return NextResponse.json({ error: "Transcription failed - no content returned" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error during transcription:", error);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}