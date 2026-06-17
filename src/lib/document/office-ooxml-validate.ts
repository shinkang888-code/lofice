/**
 * OOXML-lite 적합성 검증 (DVC-lite 패턴)
 */
import JSZip from "jszip";

export type OoxmlValidateResult = {
  score: number;
  passed: boolean;
  issues: string[];
  report: Record<string, unknown>;
};

const REQUIRED_BY_FORMAT: Record<string, string[]> = {
  docx: ["[Content_Types].xml", "word/document.xml", "_rels/.rels"],
  xlsx: ["[Content_Types].xml", "xl/workbook.xml", "_rels/.rels"],
  pptx: ["[Content_Types].xml", "ppt/presentation.xml", "_rels/.rels"],
};

function detectOoxmlKind(names: string[]): "docx" | "xlsx" | "pptx" | null {
  if (names.some((n) => n.startsWith("word/"))) return "docx";
  if (names.some((n) => n.startsWith("xl/"))) return "xlsx";
  if (names.some((n) => n.startsWith("ppt/"))) return "pptx";
  return null;
}

export async function validateOoxmlLite(buffer: ArrayBuffer): Promise<OoxmlValidateResult> {
  const issues: string[] = [];
  let score = 100;

  try {
    const zip = await JSZip.loadAsync(buffer);
    const names = Object.keys(zip.files);
    const kind = detectOoxmlKind(names);
    if (!kind) {
      return {
        score: 0,
        passed: false,
        issues: ["unknown_ooxml_kind"],
        report: { validator: "ooxml-lite" },
      };
    }

    for (const req of REQUIRED_BY_FORMAT[kind]) {
      if (!names.includes(req)) {
        issues.push(`missing:${req}`);
        score -= 20;
      }
    }

    for (const name of names.filter((n) => n.endsWith(".xml"))) {
      try {
        const xml = await zip.file(name)?.async("string");
        if (xml && !xml.trimStart().startsWith("<")) {
          issues.push(`xml_invalid:${name}`);
          score -= 5;
        }
      } catch {
        issues.push(`xml_read:${name}`);
        score -= 5;
      }
    }

    score = Math.max(0, Math.min(100, score));
    return {
      score,
      passed: score >= 70,
      issues,
      report: { validator: "ooxml-lite", kind, file_count: names.length },
    };
  } catch {
    return {
      score: 0,
      passed: false,
      issues: ["bad_zip"],
      report: { validator: "ooxml-lite" },
    };
  }
}
