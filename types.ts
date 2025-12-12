export interface CitationInfo {
  title: string;
  authors: string[];
  publicationDate: string;
  journalOrConference: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
}

export interface EquationExplanation {
  name: string; // Title of the equation (e.g. "Cross Entropy Loss")
  equation: string; // The text representation or LaTeX of the formula
  description: string; // What it does in plain English
  variables: { symbol: string; meaning: string }[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface PaperAnalysis {
  title: string;
  authors: string[];
  citation: CitationInfo;
  objectives: string[];
  objectivesEli5: string;
  gaps: {
    discovered: string[];
    fulfilled: string[];
  };
  datasets: string[];
  methodology: {
    approachName: string;
    description: string;
    keyAlgorithms: string[];
    architectureDetails: string;
  };
  evaluation: {
    metrics: string[];
    resultsSummary: string;
  };
  conclusion: {
    summary: string;
    summaryEli5: string;
    drawbacks: string[];
    futureWork: string[];
  };
  implementation: {
    models: string[];
    codeSnippet: string;
    steps: string[];
  };
  studyGuide: {
    equations: EquationExplanation[];
    quiz: QuizQuestion[];
  };
}

export interface RelatedPaper {
  title: string;
  uri: string;
  source: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

// Helper type for the raw JSON response expected from Gemini
export interface GeminiResponseSchema {
  title: string;
  authors: string[];
  citation_date: string;
  citation_journal: string;
  citation_doi: string;
  objectives: string[];
  objectives_eli5: string;
  gaps_discovered: string[];
  gaps_fulfilled: string[];
  datasets_used: string[];
  methodology_approach_name: string;
  methodology_description: string;
  methodology_algorithms: string[];
  methodology_architecture: string;
  evaluation_metrics: string[];
  evaluation_results: string;
  conclusion_summary: string;
  conclusion_summary_eli5: string;
  conclusion_drawbacks: string[];
  conclusion_future_work: string[];
  implementation_models: string[];
  implementation_code: string;
  implementation_steps: string[];
  study_equations: { name: string; equation: string; description: string; variables: { symbol: string; meaning: string }[] }[];
  study_quiz: { question: string; options: string[]; correct_index: number; explanation: string }[];
}