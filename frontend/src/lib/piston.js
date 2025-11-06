const PISTON_API = "https://emkc.org/api/v2/piston";

const LANGUAGE_CONFIG = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
};

export async function executeCode(language, code) {
  try {
    const languageConfig = LANGUAGE_CONFIG[language];

    if (!languageConfig) {
      return {
        success: false,
        error: `Language not supported: ${language}`,
      };
    }

    const response = await fetch(`${PISTON_API}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: languageConfig.language,
        version: languageConfig.version,
        files: [
          {
            name: `main.${getFileExtension(language)}`,
            content: code,
          },
        ],
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error: ${response.status}`,
      };
    }

    const data = await response.json();

    const output =
      data.run?.output ||
      data.run?.stdout ||
      data.run?.stderr ||
      "No output";

    if (data.run?.stderr) {
      return {
        success: false,
        output: output,
        error: data.run.stderr,
      };
    }

    return {
      success: true,
      output: output.trim(),
    };
  } catch (error) {
    return {
      success: false,
      error: `error in executing ${error.message}`,
    };
  }
}

function getFileExtension(language) {
  const extension = {
    javascript: "js",
    python: "py",
    java: "java",
  };
  return extension[language] || "txt";
}
