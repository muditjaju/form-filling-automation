import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { pruneHtml } from '@/lib/llm-utils';
import { CustomerDataTableType } from '@/types/CustomerDataTable.type';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { htmlString, customerData } = await req.json() as { 
      htmlString: string; 
      customerData: CustomerDataTableType 
    };

    if (!htmlString || !customerData) {
      return NextResponse.json(
        { error: 'Missing htmlString or customerData' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const prunedHtml = pruneHtml(htmlString);

    const systemPrompt = `
      You are an expert field mapper. You will be given:
      1. A pruned HTML DOM string containing form fields (inputs, selects, etc.).
      2. A customer data object.

      Your task is to analyze the HTML fields (using their IDs, labels, names, and context) and map them to the corresponding values from the customer data.

      Return a JSON object where:
      - Keys are the "id" of the HTML input field.
      - Values are the corresponding data from the customer object that should fill that field.

      Only include fields that you are confident about correctly mapping.
      If a field cannot be mapped, do not include it in the output.
      The output must be a pure JSON object.
    `;

    const userPrompt = `
      Customer Data: ${JSON.stringify(customerData, null, 2)}

      Pruned HTML DOM:
      ${prunedHtml}
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
    });

    const mapping = JSON.parse(response.choices[0].message.content || '{}');

    return NextResponse.json(mapping);
  } catch (error: any) {
    console.error('LLM Mapper Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
