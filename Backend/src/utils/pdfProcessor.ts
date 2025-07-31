import pdf from "pdf-parse";
import fs from "fs";

export interface ExtractedContent {
  fullText: string;
  sections: {
    sectionName: string;
    content: string;
    startIndex: number;
    endIndex: number;
  }[];
  metadata: {
    totalPages: number;
    wordCount: number;
    characterCount: number;
    isTruncated: boolean; // New field to indicate if content was truncated
    originalWordCount: number; // Original count before truncation
  };
}

// Content limits configuration
const CONTENT_LIMITS = {
  MAX_WORDS: 4000, // Maximum words to process
  MAX_CHARS: 15000, // Maximum characters to process
  MIN_WORDS: 50, // Minimum words required
};

export const extractTextFromPDF = async (
  filePath: string
): Promise<ExtractedContent> => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);

    const originalText = pdfData.text;
    const originalWordCount = originalText
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    // Validate minimum content
    if (originalWordCount < CONTENT_LIMITS.MIN_WORDS) {
      throw new Error(
        `Resume too short. Minimum ${CONTENT_LIMITS.MIN_WORDS} words required, found ${originalWordCount} words.`
      );
    }

    // Truncate content if too long
    const { truncatedText, isTruncated } = truncateContent(originalText);

    const sections = identifySections(truncatedText);

    return {
      fullText: truncatedText,
      sections,
      metadata: {
        totalPages: pdfData.numpages,
        wordCount: truncatedText.split(/\s+/).filter((word) => word.length > 0)
          .length,
        characterCount: truncatedText.length,
        isTruncated,
        originalWordCount,
      },
    };
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    throw new Error("Failed to extract text from PDF");
  }
};

// Content truncation function
const truncateContent = (
  text: string
): { truncatedText: string; isTruncated: boolean } => {
  const words = text.split(/\s+/).filter((word) => word.length > 0);

  // Check if truncation is needed
  if (
    words.length <= CONTENT_LIMITS.MAX_WORDS &&
    text.length <= CONTENT_LIMITS.MAX_CHARS
  ) {
    return { truncatedText: text, isTruncated: false };
  }

  // Truncate by word count first
  let truncatedWords = words.slice(0, CONTENT_LIMITS.MAX_WORDS);
  let truncatedText = truncatedWords.join(" ");

  // If still too long by character count, truncate further
  if (truncatedText.length > CONTENT_LIMITS.MAX_CHARS) {
    truncatedText = truncatedText.substring(0, CONTENT_LIMITS.MAX_CHARS);

    // Find last complete word to avoid cutting words in half
    const lastSpaceIndex = truncatedText.lastIndexOf(" ");
    if (lastSpaceIndex > 0) {
      truncatedText = truncatedText.substring(0, lastSpaceIndex);
    }
  }

  return {
    truncatedText: truncatedText + "...[Content truncated for analysis]",
    isTruncated: true,
  };
};

const identifySections = (text: string) => {
  // Common resume section headers
  const sectionPatterns = [
    {
      name: "Contact Information",
      patterns: [
        /^.*?(?=\n.*?(experience|education|skills|summary|objective))/i,
      ],
    },
    {
      name: "Professional Summary",
      patterns: [
        /(summary|profile|objective)[\s\S]*?(?=\n.*?(experience|education|skills|employment))/i,
      ],
    },
    {
      name: "Work Experience",
      patterns: [
        /(experience|employment|work history|professional experience)[\s\S]*?(?=\n.*?(education|skills|projects|certifications))/i,
      ],
    },
    {
      name: "Education",
      patterns: [
        /(education|academic|qualifications)[\s\S]*?(?=\n.*?(skills|projects|certifications|achievements))/i,
      ],
    },
    {
      name: "Skills",
      patterns: [
        /(skills|technical skills|competencies)[\s\S]*?(?=\n.*?(projects|certifications|achievements|references))/i,
      ],
    },
    {
      name: "Projects",
      patterns: [
        /(projects|portfolio)[\s\S]*?(?=\n.*?(certifications|achievements|references|awards))/i,
      ],
    },
    {
      name: "Certifications",
      patterns: [
        /(certifications|course|certificates|licenses)[\s\S]*?(?=\n.*?(achievements|references|awards))/i,
      ],
    },
    {
      name: "Achievements",
      patterns: [
        /(achievements|awards|achieved|secured|accompalishments)[\s\S]*?(?=\n.*?(references|additional))/i,
      ],
    },
  ];

  const sections: ExtractedContent["sections"] = [];

  sectionPatterns.forEach(({ name, patterns }) => {
    patterns.forEach((pattern) => {
      const match = text.match(pattern);
      if (match) {
        const startIndex = match.index || 0;
        const content = match[0].trim();
        sections.push({
          sectionName: name,
          content,
          startIndex,
          endIndex: startIndex + content.length,
        });
      }
    });
  });

  // If no sections found, create a fallback structure
  if (sections.length === 0) {
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    paragraphs.forEach((paragraph, index) => {
      sections.push({
        sectionName: `Section ${index + 1}`,
        content: paragraph.trim(),
        startIndex: text.indexOf(paragraph),
        endIndex: text.indexOf(paragraph) + paragraph.length,
      });
    });
  }

  return sections.sort((a, b) => a.startIndex - b.startIndex);
};
