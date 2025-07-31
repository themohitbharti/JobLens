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
  };
}

export const extractTextFromPDF = async (
  filePath: string
): Promise<ExtractedContent> => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);

    const fullText = pdfData.text;
    const sections = identifySections(fullText);

    return {
      fullText,
      sections,
      metadata: {
        totalPages: pdfData.numpages,
        wordCount: fullText.split(/\s+/).length,
        characterCount: fullText.length,
      },
    };
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    throw new Error("Failed to extract text from PDF");
  }
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
        /(certifications|certificates|licenses)[\s\S]*?(?=\n.*?(achievements|references|awards))/i,
      ],
    },
    {
      name: "Achievements",
      patterns: [
        /(achievements|awards|accomplishments)[\s\S]*?(?=\n.*?(references|additional))/i,
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
