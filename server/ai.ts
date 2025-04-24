import OpenAI from "openai";
import { config } from './config';

const openai = new OpenAI({ apiKey: config.openai.apiKey });

// the newest OpenAI model "gpt-4o"
export async function generateContent(request: {
  topic: string;
  type: "article" | "script";
  sportType: string;
  tone?: string;
  length: number;
}): Promise<{
  content: string;
  metadata: {
    wordCount: number;
    suggestedTags: string[];
  };
}> {
  const systemPrompt =
    request.type === "article"
      ? "You are a professional sports writer creating engaging articles. Return responses in JSON format."
      : "You are a professional video script writer creating engaging sports content. Return responses in JSON format.";

  const prompt = `
Create a ${
    request.type === "article" ? "detailed article" : "video script"
  } about ${request.topic} 
in the context of ${request.sportType}.
${request.tone ? `Use a ${request.tone} tone.` : ""}
Target length: ${request.length} words.

Return the response as a JSON object with this exact structure:
{
  "content": "The full ${request.type} content here",
  "metadata": {
    "wordCount": number,
    "suggestedTags": ["tag1", "tag2", "tag3"]
  }
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  const parsedResponse = JSON.parse(
    response.choices[0].message.content || "{}"
  );
  if (!parsedResponse.content || !parsedResponse.metadata) {
    throw new Error("Invalid response format from AI");
  }

  return parsedResponse;
}

export async function generateTopicSuggestions(
  sportType: string
): Promise<string[]> {
  const prompt = `
Generate 5 trending and engaging sports content topics for ${sportType}.
Return the response as a JSON object with exactly this structure:
{
  "topics": [
    "topic1",
    "topic2",
    "topic3",
    "topic4",
    "topic5"
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a sports content strategist. Return responses in JSON format.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  const parsedResponse = JSON.parse(
    response.choices[0].message.content || "{}"
  );
  if (!Array.isArray(parsedResponse.topics)) {
    throw new Error("Invalid response format from AI");
  }

  return parsedResponse.topics;
}

export async function analyzeTopicInDepth(
  topic: string,
  sportType: string
): Promise<{
  relevance: number;
  timeliness: number;
  keyAspects: string[];
  relatedSubtopics: string[];
  trendingAngles: string[];
  contentSuggestions: {
    title: string;
    description: string;
    type: "article" | "script";
  }[];
  analysis: string;
}> {
  const prompt = `
Perform an in-depth analysis of the sports topic: "${topic}" in the context of ${sportType}.

Return the response as a JSON object with exactly this structure:
{
  "relevance": number between 1-10 indicating topic relevance,
  "timeliness": number between 1-10 indicating how timely/current the topic is,
  "keyAspects": ["main aspect 1", "main aspect 2", etc],
  "relatedSubtopics": ["related topic 1", "related topic 2", etc],
  "trendingAngles": ["trending angle 1", "trending angle 2", etc],
  "contentSuggestions": [
    {
      "title": "suggested content title",
      "description": "brief description of the content angle",
      "type": "article" or "script"
    }
  ],
  "analysis": "detailed analysis paragraph explaining the topic's significance"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an expert sports analyst with deep knowledge of current sports trends and content strategy. Return responses in JSON format.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  const parsedResponse = JSON.parse(
    response.choices[0].message.content || "{}"
  );
  if (!parsedResponse.relevance || !parsedResponse.analysis) {
    throw new Error("Invalid response format from AI");
  }

  return parsedResponse;
}
