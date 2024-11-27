const fs = require("fs");

async function query(filename) {
  const data = fs.readFileSync(filename);
  const response = await fetch(
    "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
    {
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: data,
    }
  );
  const result = await response.json();
  return result;
}

query("test.mp3").then((response) => {
  console.log(JSON.stringify(response));
});
