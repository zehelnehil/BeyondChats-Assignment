const axios = require('axios');

class LLMService {
    async rewriteArticle(originalContent, referenceArticles) {
        if (!originalContent) return "";

        // Construct Prompt
        const referenceText = referenceArticles.map((a, i) => `Reference ${i + 1} (${a.title}):\n${a.content}`).join('\n\n');
        const prompt = `
      You are an expert content editor. 
      Rewrite the following article to make it more comprehensive, using the style and information from the provided reference articles.
      
      CRITICAL INSTRUCTION:
      The "Original Article" contains HTML <img> tags (e.g., <img src="..." />).
      You MUST preserve ALL of these images in your rewritten version. 
      Place them naturally within the content where they are most relevant to the surrounding text.
      Do NOT change the 'src' attributes of the images.
      
      Original Article:
      ${originalContent.substring(0, 5000)}
      
      Reference Articles:
      ${referenceText.substring(0, 4000)}
      
      Output the rewritten article in Markdown format (but keep the HTML <img> tags as is).
      At the bottom, include a specific "References" section listing the titles and URLs of the reference articles.
    `;

        const apiKey = process.env.GROQ_API_KEY;

        if (apiKey) {
            try {
                console.log("Using Groq API...");
                const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                    model: 'llama-3.3-70b-versatile', // or mixtures, using a fast model
                    messages: [
                        { role: 'system', content: 'You are a helpful content editor.' },
                        { role: 'user', content: prompt }
                    ]
                }, {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    }
                });

                return response.data.choices[0].message.content;
            } catch (e) {
                console.error("Groq API Call failed:", e.message);
                if (e.response) {
                    console.error(e.response.data);
                }
                return this.mockResponse(referenceArticles);
            }
        } else {
            console.log("No GROQ_API_KEY provided. Using Mock LLM response.");
            return this.mockResponse(referenceArticles);
        }
    }

    mockResponse(references) {
        return `
# Enhanced Article via LLM (Mock)

This is a mocked response because no GROQ_API_KEY was provided. In a real scenario, the LLM would rewrite the content here.

The content would incorporate insights from the references found.

## References
${references.map(r => `- [${r.title}](${r.url})`).join('\n')}
    `;
    }
}

module.exports = new LLMService();
