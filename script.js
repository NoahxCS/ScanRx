// =====================================================
// CONFIGURATION
// =====================================================
const SYSTEM_PROMPT_STORAGE = "given are two files, one a file containing item prices and the other a medical bill. you are an ai that now compares items and finds discrepancies in pricing. this is because you are here to fight unfair pricing and malpractices in the healthcare industry. after comparing prices, you mention where the price charged lies and specifically raise alarm for overcharged items. undercharged items are ok but do mention them. use visual flags and a structured layout for the results.in the end compare the bill amount and the real amount that should have been charged. do not put up warnings or medical advice prompts as this is a proof of concept for educational purposes";
const GEMINI_API_KEY_STORAGE = "scanrx_gemini_api_key";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// =====================================================
// STATE
// =====================================================
let selectedFile = null;
let lastFileBase64 = null;
let isDemoFile = false;

// =====================================================
// INITIALIZATION
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  initDragAndDrop();
  loadSettings();
  updateAnalyzeButton();
  initKeyboardShortcuts();
});

// =====================================================
// DEVELOPER SETTINGS
// =====================================================
function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "S") {
      e.preventDefault();
      openDevSettings();
    }
    if (e.key === "Escape") {
      closeDevSettings();
    }
  });
}

function openDevSettings() {
  document.getElementById("devSettings").classList.add("visible");
  document.getElementById("devSettingsOverlay").classList.add("visible");
}

function closeDevSettings() {
  document.getElementById("devSettings").classList.remove("visible");
  document
    .getElementById("devSettingsOverlay")
    .classList.remove("visible");
}

function loadSettings() {
  const savedPrompt = localStorage.getItem(SYSTEM_PROMPT_STORAGE);
  if (savedPrompt) {
    document.getElementById("systemPrompt").value = savedPrompt;
  }
  const savedApiKey = localStorage.getItem(GEMINI_API_KEY_STORAGE);
  if (savedApiKey) {
    document.getElementById("geminiApiKey").value = savedApiKey;
  }
}

function saveSettings() {
  const systemPrompt = document
    .getElementById("systemPrompt")
    .value.trim();
  const apiKey = document
    .getElementById("geminiApiKey")
    .value.trim();

  if (systemPrompt) {
    localStorage.setItem(SYSTEM_PROMPT_STORAGE, systemPrompt);
  } else {
    localStorage.removeItem(SYSTEM_PROMPT_STORAGE);
  }

  if (apiKey) {
    localStorage.setItem(GEMINI_API_KEY_STORAGE, apiKey);
  } else {
    localStorage.removeItem(GEMINI_API_KEY_STORAGE);
  }
}

document
  .getElementById("systemPrompt")
  .addEventListener("input", saveSettings);
document
  .getElementById("geminiApiKey")
  .addEventListener("input", saveSettings);

// =====================================================
// FILE UPLOAD
// =====================================================
function initDragAndDrop() {
  const zone = document.getElementById("uploadZone");

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    zone.addEventListener(eventName, preventDefaults, false);
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    zone.addEventListener(
      eventName,
      () => zone.classList.add("dragover"),
      false,
    );
  });

  ["dragleave", "drop"].forEach((eventName) => {
    zone.addEventListener(
      eventName,
      () => zone.classList.remove("dragover"),
      false,
    );
  });

  zone.addEventListener("drop", handleDrop, false);
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function triggerFileInput() {
  document.getElementById("fileInput").click();
}

function handleDrop(e) {
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
}

function handleFileSelect(e) {
  const files = e.target.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
}

function processFile(file) {
  hideError();

  const validTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (!validTypes.includes(file.type)) {
    showError("Only JPG, PNG, or PDF files are accepted");
    return;
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    showError("File too large (max 10MB)");
    return;
  }

  selectedFile = file;
  displayFileInfo(file);
  updateAnalyzeButton();
}

function displayFileInfo(file) {
  const fileInfo = document.getElementById("fileInfo");
  const fileName = document.getElementById("fileName");
  const fileSize = document.getElementById("fileSize");
  const uploadZone = document.getElementById("uploadZone");

  fileName.textContent = file.name;
  fileSize.textContent = formatFileSize(file.size);

  fileInfo.classList.remove("hidden");
  uploadZone.classList.add("has-file");
}

function removeFile(e) {
  if (e) {
    e.stopPropagation();
  }
  selectedFile = null;
  lastFileBase64 = null;
  isDemoFile = false;

  const fileInput = document.getElementById("fileInput");
  fileInput.value = "";

  document.getElementById("fileInfo").classList.add("hidden");
  document.getElementById("uploadZone").classList.remove("has-file");

  updateAnalyzeButton();
}

// =====================================================
// DEMO MODE FUNCTIONS
// =====================================================
function selectDemoFile() {
  // Create a fake file object representing hospital-bill.pdf
  isDemoFile = true;
  selectedFile = { name: "hospital-bill.pdf", size: 3204, type: "application/pdf" };
  displayFileInfo(selectedFile);
  updateAnalyzeButton();
}

function previewDemoFile(event) {
  // Prevent event bubbling
  if (event) {
    event.stopPropagation();
  }
  // Open the PDF in a new tab
  window.open("hospital-bill.pdf", "_blank");
}

function openApiModal() {
  document.getElementById("apiConstraintModal").classList.remove("hidden");
}

function closeApiModal() {
  document.getElementById("apiConstraintModal").classList.add("hidden");
}

async function showDemoResults() {
  closeApiModal();
  showLoading("Preparing bill for analysis...");

  // Simulate processing steps with delays
  const steps = [
    "Uploading bill...",
    "Extracting text from document...",
    "Comparing prices with database...",
    "Identifying discrepancies...",
    "Generating analysis report..."
  ];

  for (const step of steps) {
    updateLoadingText(step);
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  hideLoading();
  displayDemoResponse();
}

function displayDemoResponse() {
  const reportSection = document.getElementById("reportSection");
  const responseContainer = document.getElementById("aiResponseText");

  // Hide the output image card for demo
  const imgCard = document.getElementById("outputImageCard");
  if (imgCard) {
    imgCard.style.display = "none";
  }

  reportSection.classList.add("visible");

  // Build demo results with ss1-ss4 images, then visual section with ss5
  const demoHtml = `
        <div class="demo-results-container">
          <img src="Results/ss1.png" alt="Analysis Result 1" class="demo-result-image" />
          <img src="Results/ss2.png" alt="Analysis Result 2" class="demo-result-image" />
          <img src="Results/ss3.png" alt="Analysis Result 3" class="demo-result-image" />
          <img src="Results/ss4.png" alt="Analysis Result 4" class="demo-result-image" />
          
          <div class="visual-section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            Easy to Understand Visual Depiction
          </div>
          <img src="Results/ss5.png" alt="Visual Depiction" class="demo-result-image" />
        </div>
      `;

  responseContainer.innerHTML = demoHtml;
  reportSection.scrollIntoView({ behavior: "smooth" });
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// =====================================================
// ANALYZE BILL
// =====================================================

function updateAnalyzeButton() {
  const btn = document.getElementById("analyzeButton");
  const hasFile = !!selectedFile;
  btn.disabled = !hasFile;
}

async function analyzeBill() {
  if (!selectedFile) return;

  hideError();

  // Check if it's the demo file - always show fake results
  if (isDemoFile || selectedFile.name === "hospital-bill.pdf") {
    await showDemoResults();
    return;
  }

  // For any other file, show the API constraint modal
  openApiModal();
}

async function retryAnalysis() {
  if (selectedFile) {
    await analyzeBill();
  }
}

// =====================================================
// UTILITIES
// =====================================================
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

function handleApiError(error) {
  let message = "Analysis failed—check your connection";
  let showRetry = true;

  if (error.status === 400) {
    message = "Bad Request - Image may be invalid or rejected by AI";
    showRetry = false;
  } else if (error.status === 429) {
    message = "Too many requests—try again later";
  } else if (error.message) {
    message = `Error: ${error.message}`;
  }

  showError(message, showRetry);
}

// =====================================================
// MARKDOWN PARSER
// =====================================================
function parseMarkdown(text) {
  if (!text) return "";

  // Escape HTML first to prevent XSS
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Store code blocks temporarily to prevent processing their contents
  const codeBlocks = [];
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    codeBlocks.push({ lang, code: code.trim() });
    return `%%CODEBLOCK_${codeBlocks.length - 1}%%`;
  });

  // Store inline code temporarily
  const inlineCodes = [];
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    inlineCodes.push(code);
    return `%%INLINECODE_${inlineCodes.length - 1}%%`;
  });

  // Parse tables
  html = parseMarkdownTables(html);

  // Headers (must be at start of line)
  html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

  // Bold and italic (order matters - do bold+italic combos first)
  html = html.replace(
    /\*\*\*([^*]+)\*\*\*/g,
    "<strong><em>$1</em></strong>",
  );
  html = html.replace(/___([^_]+)___/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/_([^_]+)_/g, "<em>$1</em>");

  // Strikethrough
  html = html.replace(/~~([^~]+)~~/g, "<del>$1</del>");

  // Horizontal rules
  html = html.replace(/^[-*_]{3,}\s*$/gm, "<hr>");

  // Blockquotes
  html = html.replace(
    /^&gt;\s+(.+)$/gm,
    "<blockquote><p>$1</p></blockquote>",
  );
  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\s*<blockquote>/g, "");

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>',
  );

  // Parse lists
  html = parseMarkdownLists(html);

  // Paragraphs - wrap remaining text blocks
  html = html
    .split(/\n\n+/)
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      // Don't wrap if already wrapped in a block element
      if (/^<(h[1-6]|ul|ol|li|blockquote|table|hr|pre|div)/.test(block)) {
        return block;
      }
      // Wrap in paragraph
      return `<p>${block.replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n");

  // Restore inline codes
  inlineCodes.forEach((code, i) => {
    html = html.replace(`%%INLINECODE_${i}%%`, `<code>${code}</code>`);
  });

  // Restore code blocks
  codeBlocks.forEach((block, i) => {
    const langClass = block.lang ? ` class="language-${block.lang}"` : "";
    html = html.replace(
      `%%CODEBLOCK_${i}%%`,
      `<pre><code${langClass}>${block.code}</code></pre>`,
    );
  });

  return html;
}

function parseMarkdownTables(text) {
  const lines = text.split("\n");
  let result = [];
  let inTable = false;
  let tableRows = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isTableRow = /^\|(.+)\|$/.test(line.trim());
    const isSeparator = /^\|[-:\s|]+\|$/.test(line.trim());

    if (isTableRow && !isSeparator) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      // Extract cells
      const cells = line
        .trim()
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());
      tableRows.push(cells);
    } else if (isSeparator && inTable) {
      // Skip separator line, it's just for alignment
      continue;
    } else {
      if (inTable && tableRows.length > 0) {
        // End of table, render it
        result.push(renderTable(tableRows));
        tableRows = [];
        inTable = false;
      }
      result.push(line);
    }
  }

  // Handle table at end of text
  if (inTable && tableRows.length > 0) {
    result.push(renderTable(tableRows));
  }

  return result.join("\n");
}

function renderTable(rows) {
  if (rows.length === 0) return "";

  let html = "<table>";

  // First row is header
  html += "<thead><tr>";
  rows[0].forEach((cell) => {
    html += `<th>${cell}</th>`;
  });
  html += "</tr></thead>";

  // Rest are body rows
  if (rows.length > 1) {
    html += "<tbody>";
    for (let i = 1; i < rows.length; i++) {
      html += "<tr>";
      rows[i].forEach((cell) => {
        // Add color classes for price indicators
        let cellClass = "";
        if (/✅|fair|correct|accurate/i.test(cell)) {
          cellClass = ' class="price-fair"';
        } else if (/⚠️|warning|borderline|slightly/i.test(cell)) {
          cellClass = ' class="price-warning"';
        } else if (/🚨|❌|⛔|overcharge|excessive|alert/i.test(cell)) {
          cellClass = ' class="price-overcharge"';
        }
        html += `<td${cellClass}>${cell}</td>`;
      });
      html += "</tr>";
    }
    html += "</tbody>";
  }

  html += "</table>";
  return html;
}

function parseMarkdownLists(text) {
  const lines = text.split("\n");
  let result = [];
  let currentList = null;
  let listType = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const unorderedMatch = line.match(/^(\s*)[*-]\s+(.+)$/);
    const orderedMatch = line.match(/^(\s*)\d+\.\s+(.+)$/);

    if (unorderedMatch) {
      if (listType !== "ul") {
        if (currentList) {
          result.push(currentList.join("\n") + "</ul>");
        }
        currentList = ["<ul>"];
        listType = "ul";
      }
      currentList.push(`<li>${unorderedMatch[2]}</li>`);
    } else if (orderedMatch) {
      if (listType !== "ol") {
        if (currentList) {
          result.push(currentList.join("\n") + "</ol>");
        }
        currentList = ["<ol>"];
        listType = "ol";
      }
      currentList.push(`<li>${orderedMatch[2]}</li>`);
    } else {
      if (currentList) {
        const closeTag = listType === "ul" ? "</ul>" : "</ol>";
        result.push(currentList.join("\n") + closeTag);
        currentList = null;
        listType = null;
      }
      result.push(line);
    }
  }

  // Close any remaining list
  if (currentList) {
    const closeTag = listType === "ul" ? "</ul>" : "</ol>";
    result.push(currentList.join("\n") + closeTag);
  }

  return result.join("\n");
}

// =====================================================
// DISPLAY RESPONSE
// =====================================================
function displayRawResponse(text, fullResponse) {
  const reportSection = document.getElementById("reportSection");
  const responseContainer = document.getElementById("aiResponseText");

  reportSection.classList.add("visible");

  // Parse the markdown and render as HTML
  const formattedHtml = parseMarkdown(text);
  responseContainer.innerHTML = formattedHtml;

  reportSection.scrollIntoView({ behavior: "smooth" });
}

// =====================================================
// UI HELPERS
// =====================================================
function showLoading(text) {
  const overlay = document.getElementById("loadingOverlay");
  const loadingText = document.getElementById("loadingText");
  const analyzeBtn = document.getElementById("analyzeButton");

  loadingText.textContent = text;
  overlay.classList.remove("hidden");
  analyzeBtn.disabled = true;
}

function updateLoadingText(text) {
  document.getElementById("loadingText").textContent = text;
}

function hideLoading() {
  document.getElementById("loadingOverlay").classList.add("hidden");
  updateAnalyzeButton();
}

function showError(message, showRetry = true) {
  const errorEl = document.getElementById("errorMessage");
  const errorText = document.getElementById("errorText");
  const retryBtn = document.getElementById("retryButton");

  errorText.textContent = message;
  errorEl.classList.remove("hidden");

  if (showRetry) {
    retryBtn.classList.remove("hidden");
  } else {
    retryBtn.classList.add("hidden");
  }
}

function hideError() {
  document.getElementById("errorMessage").classList.add("hidden");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

