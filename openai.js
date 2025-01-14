const OpenAI =require("openai");

const token = "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";
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";

async function main() {

  const client = new OpenAI({ baseURL: endpoint, apiKey: token });

  const response = await client.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "What is the capital of France?" },
      { role: "assistant", content: "The capital of France is Paris." },
      { role: "user", content: "What about Spain?" }
      ],
      model: modelName
    });

  console.log(response.choices[0].message.content);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});