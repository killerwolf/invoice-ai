import { parseMarkdownJson } from './parseMarkdownJson';

describe('parseMarkdownJson', () => {
  it('should parse valid JSON from markdown format', () => {
    const markdownJson = '```json\n{"key": "value"}\n```';
    const expectedOutput = { key: 'value' };
    expect(parseMarkdownJson(markdownJson)).toEqual(expectedOutput);
  });



  it('should parse valid JSON from markdown format', () => {
    const markdownJson = "```json\n{\n  \"invoice\": {\n    \"invoice_number\": \"FR 93-055-0004 CE\",\n    \"date\": \"16/11/2022\",\n    \"client\": {\n      \"name\": \"TANG FRERES PANTIN\",\n      \"address\": \"210, avenue General Leclerc\",\n      \"postal_code\": \"93500\",\n      \"city\": \"PANTIN\",\n      \"phone\": \"TEL : 01.41.65.74.70\",\n      \"fax\": \"FAX : 01.87.14.86.51\"\n    },\n    \"supplier\": {\n      \"name\": \"HUBERS 93-1000-001-0043\",\n      \"address\": \"110 RUE DE PARIS\",\n      \"postal_code\": \"93-1000-001-0043\",\n      \"client\": \"CLIENT: 48009/AIMING MY STORY\",\n      \"address\": \"133 BOULEVARD BEAN DAURES\",\n      \"postal_code\": \"92110\",\n      \"city\": \"CLICHY\",\n      \"phone\": \"TEL: 0642171426\"\n    },\n    \"items\": [\n      {\n        \"description\": \"PHOE CURRY VERT COQ/10X12/200G\",\n        \"quantity\": \"147369/1\",\n        \"price\": \"30.40EUR\",\n        \"total\": \"30.40EUR\"\n      },\n      {\n        \"description\": \"PHOE CURRY ROUGE COQ/10X12/200G\",\n        \"quantity\": \"147370/1\",\n        \"price\": \"30.40EUR\",\n        \"total\": \"30.40EUR\"\n      },\n      {\n        \"description\": \"GUITANATE AJINOMOTO 48/20G\",\n        \"quantity\": \"131217/1\",\n        \"price\": \"49.00EUR\",\n        \"total\": \"49.00EUR\"\n      },\n      {\n        \"description\": \"KIKKOMAN SOUCE SOJA 500ML\",\n        \"quantity\": \"124304/1\",\n        \"price\": \"39.00EUR\",\n        \"total\": \"39.00EUR\"\n      },\n      {\n        \"description\": \"SAUCE TERIYAKI 450G\",\n        \"quantity\": \"124310/1\",\n        \"price\": \"36.40EUR\",\n        \"total\": \"36.40EUR\"\n      }\n    ],\n    \"totals\": {\n      \"net_amount\": \"217.49EUR\",\n      \"tax_amount\": \"217.49EUR\",\n      \"total_amount\": \"217.49EUR\"\n    },\n    \"payment\": {\n      \"method\": \"CB\",\n      \"amount\": \"217.49EUR\"\n    },\n    \"taxes\": {\n      \"taux\": \"5.50%\",\n      \"ht\": \"206.14EUR\",\n      \"tva\": \"11.24EUR\",\n      \"ttc\": \"217.49EUR\"\n    },\n    \"notes\": \"MERCI DE VOTRE VISITE\",\n    \"footer\": \"Cette facture nette de tout escompte est payable au comptant ce jour\"\n  }\n}\n```";
    const expectedOutput = { 
      invoice: {
        client:{
          
        } } };
    console.log(parseMarkdownJson(markdownJson));
    expect(parseMarkdownJson(markdownJson)).toEqual(expectedOutput);
  });

  


  it('should throw an error for invalid JSON', () => {
    const markdownJson = '```json\n{"key": "value"\n```';
    expect(() => parseMarkdownJson(markdownJson)).toThrow('Invalid JSON format');
  });
});