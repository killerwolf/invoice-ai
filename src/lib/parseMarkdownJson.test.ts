import { parseMarkdownJson } from "./parseMarkdownJson";

describe("parseMarkdownJson", () => {
  it("should parse valid JSON from markdown format", () => {
    const markdownJson = '```json\n{"key": "value"}\n```';
    const expectedOutput = { key: "value" };
    expect(parseMarkdownJson(markdownJson)).toEqual(expectedOutput);
  });

  it("should parse complex invoice JSON from markdown format", () => {
    const markdownJson =
      '```json\n{\n  "invoice": {\n    "invoice_number": "FR 93-055-0004 CE",\n    "date": "16/11/2022",\n    "client": {\n      "name": "TANG FRERES PANTIN",\n      "address": "210, avenue General Leclerc",\n      "postal_code": "93500",\n      "city": "PANTIN",\n      "phone": "TEL : 01.41.65.74.70",\n      "fax": "FAX : 01.87.14.86.51"\n    }\n  }\n}\n```';
    const result = parseMarkdownJson(markdownJson) as unknown as {
      invoice: {
        invoice_number: string;
        date: string;
        client: { name: string };
      };
    };
    expect(result.invoice.invoice_number).toBe("FR 93-055-0004 CE");
    expect(result.invoice.date).toBe("16/11/2022");
    expect(result.invoice.client.name).toBe("TANG FRERES PANTIN");
  });

  it("should throw an error for invalid JSON", () => {
    const markdownJson = '```json\n{"key": "value"\n```';
    expect(() => parseMarkdownJson(markdownJson)).toThrow(
      "Invalid JSON format",
    );
  });
});
