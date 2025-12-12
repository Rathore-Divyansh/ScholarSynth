import { GoogleGenAI, Type, Chat, Modality } from "@google/genai";
import { PaperAnalysis, GeminiResponseSchema, RelatedPaper } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Converts a File object to a Base64 string.
 */
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzePaper = async (file: File): Promise<PaperAnalysis> => {
  // Use gemini-3-pro-preview for complex reasoning tasks like research paper analysis
  const model = "gemini-3-pro-preview";

  const filePart = await fileToGenerativePart(file);

  const prompt = `
    You are an expert academic researcher and tutor. Analyze the provided research paper and extract the following structured information:
    1. Title and Authors.
    2. Citation Metadata: Extract publication date, journal/conference name, and DOI if available.
    3. Objectives: What did the paper aim to achieve? Also provide a simplified "Explain Like I'm 5" (ELI5) version.
    4. Gaps: What research gaps were identified and which ones did this paper fulfill?
    5. Datasets: List all specific datasets used.
    6. Methodology: Describe the architecture, algorithms, or specific approach used.
    7. Evaluation: Specific metrics used and a summary of the results.
    8. Conclusion: A summary of the conclusion (and an ELI5 version), including drawbacks and future work.
    9. Implementation Prototype: 
       - Identify specific models/libraries (e.g. PyTorch, TensorFlow, Scikit-learn).
       - **CRITICAL**: Generate a Python code snippet that initializes the key model architecture or algorithm described. 
       - **IF NO CODE IS IN THE PAPER, YOU MUST WRITE A PLAUSIBLE IMPLEMENTATION BASED ON THE METHODOLOGY DESCRIPTION.** Do not leave this empty.
       - List 3-5 implementation steps.
    10. Study Guide:
       - Equation De-mystifier: Select 2-3 most critical mathematical equations from the paper.
         - Name: Give the equation a standard name (e.g. "Attention Mechanism" or "MSE Loss").
         - Equation: Return the **FULL** mathematical expression in standard LaTeX format. 
           * IMPORTANT: Return ONLY the raw LaTeX string (e.g. "E = mc^2"). 
           * Do NOT enclose it in Markdown code blocks (like \`\`\`latex ... \`\`\`).
           * Do NOT enclose it in "$" or "$$" delimiters.
         - Description: Explain exactly what the equation calculates and its role in the paper.
         - Variables: Define the key symbols.
       - Socratic Quiz: Generate 3 multiple-choice questions to test the user's understanding of the paper's core contribution.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      authors: { type: Type.ARRAY, items: { type: Type.STRING } },
      citation_date: { type: Type.STRING, description: "Year or Date of publication" },
      citation_journal: { type: Type.STRING, description: "Journal or Conference name" },
      citation_doi: { type: Type.STRING },
      objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
      objectives_eli5: { type: Type.STRING, description: "Simplified explanation of objectives for a layperson" },
      gaps_discovered: { type: Type.ARRAY, items: { type: Type.STRING } },
      gaps_fulfilled: { type: Type.ARRAY, items: { type: Type.STRING } },
      datasets_used: { type: Type.ARRAY, items: { type: Type.STRING } },
      methodology_approach_name: { type: Type.STRING },
      methodology_description: { type: Type.STRING },
      methodology_algorithms: { type: Type.ARRAY, items: { type: Type.STRING } },
      methodology_architecture: { type: Type.STRING },
      evaluation_metrics: { type: Type.ARRAY, items: { type: Type.STRING } },
      evaluation_results: { type: Type.STRING },
      conclusion_summary: { type: Type.STRING },
      conclusion_summary_eli5: { type: Type.STRING, description: "Simplified conclusion for a layperson" },
      conclusion_drawbacks: { type: Type.ARRAY, items: { type: Type.STRING } },
      conclusion_future_work: { type: Type.ARRAY, items: { type: Type.STRING } },
      implementation_models: { type: Type.ARRAY, items: { type: Type.STRING } },
      implementation_code: { type: Type.STRING, description: "Python code snippet. If text lacks code, generate a plausible implementation based on the architecture." },
      implementation_steps: { type: Type.ARRAY, items: { type: Type.STRING } },
      study_equations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of the equation concept" },
            equation: { type: Type.STRING, description: "The formula in raw LaTeX format. Do NOT use $ delimiters." },
            description: { type: Type.STRING, description: "Plain English explanation of the equation" },
            variables: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  symbol: { type: Type.STRING },
                  meaning: { type: Type.STRING }
                }
              }
            }
          }
        }
      },
      study_quiz: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correct_index: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          }
        }
      }
    },
    required: ["title", "objectives", "methodology_description", "conclusion_summary", "study_equations", "study_quiz", "implementation_code"],
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
            filePart,
            { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 8192 }, // Enable thinking for deeper analysis
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response generated.");

    const rawData = JSON.parse(text) as GeminiResponseSchema;

    return {
      title: rawData.title || "Untitled Paper",
      authors: rawData.authors || [],
      citation: {
        title: rawData.title,
        authors: rawData.authors || [],
        publicationDate: rawData.citation_date || "N/A",
        journalOrConference: rawData.citation_journal || "N/A",
        doi: rawData.citation_doi || ""
      },
      objectives: rawData.objectives || [],
      objectivesEli5: rawData.objectives_eli5 || "No simplified explanation available.",
      gaps: {
        discovered: rawData.gaps_discovered || [],
        fulfilled: rawData.gaps_fulfilled || [],
      },
      datasets: rawData.datasets_used || [],
      methodology: {
        approachName: rawData.methodology_approach_name || "N/A",
        description: rawData.methodology_description || "",
        keyAlgorithms: rawData.methodology_algorithms || [],
        architectureDetails: rawData.methodology_architecture || "",
      },
      evaluation: {
        metrics: rawData.evaluation_metrics || [],
        resultsSummary: rawData.evaluation_results || "",
      },
      conclusion: {
        summary: rawData.conclusion_summary || "",
        summaryEli5: rawData.conclusion_summary_eli5 || "No simplified conclusion available.",
        drawbacks: rawData.conclusion_drawbacks || [],
        futureWork: rawData.conclusion_future_work || [],
      },
      implementation: {
        models: rawData.implementation_models || [],
        codeSnippet: rawData.implementation_code || "# No code prototype available",
        steps: rawData.implementation_steps || [],
      },
      studyGuide: {
        equations: rawData.study_equations || [],
        quiz: rawData.study_quiz?.map(q => ({
          question: q.question,
          options: q.options,
          correctAnswerIndex: q.correct_index,
          explanation: q.explanation
        })) || []
      }
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze paper.");
  }
};

/**
 * Establish a chat session with the paper context.
 */
export const createPaperChatSession = async (file: File): Promise<Chat> => {
    const filePart = await fileToGenerativePart(file);
    return ai.chats.create({
        model: 'gemini-3-pro-preview', // Use a stronger model for Q&A
        history: [
            {
                role: 'user',
                parts: [
                    filePart,
                    { text: "Here is the research paper I want to discuss. Please answer my questions based on this document." }
                ]
            },
            {
                role: 'model',
                parts: [{ text: "Understood. I have analyzed the paper. What would you like to know?" }]
            }
        ]
    });
};

/**
 * Find related papers using Google Search Grounding.
 */
export const findRelatedPapers = async (title: string, objectives: string[]): Promise<RelatedPaper[]> => {
    const query = `Find 5 recent research papers related to: "${title}". Key objectives involved: ${objectives.slice(0, 2).join(", ")}.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: query,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        // Extract URLs from grounding metadata
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const relatedPapers: RelatedPaper[] = [];

        if (chunks) {
            chunks.forEach((chunk) => {
                if (chunk.web) {
                    relatedPapers.push({
                        title: chunk.web.title || "Unknown Title",
                        uri: chunk.web.uri || "#",
                        source: new URL(chunk.web.uri).hostname.replace('www.', '')
                    });
                }
            });
        }
        
        // Filter duplicates based on URI
        return Array.from(new Map(relatedPapers.map(item => [item.uri, item])).values()).slice(0, 6);

    } catch (e) {
        console.error("Search failed", e);
        return [];
    }
};

/**
 * Generate an audio overview (podcast style) using TTS.
 */
export const generateAudioOverview = async (text: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: {
                parts: [{ text: `Here is a summary of the research paper: ${text}` }]
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) throw new Error("No audio generated");
        return base64Audio;
    } catch (e) {
        console.error("TTS failed", e);
        throw e;
    }
};