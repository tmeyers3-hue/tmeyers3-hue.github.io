// --- Pretty-print helper ---
function formatHtml(html) {
    const tab = '  '; // 2-space indent
    let result = '';
    let indent = 0;
    html.split(/>\s*</).forEach((element, i, arr) => {
        if (element.match(/^\/\w/)) indent--;
        result += `${' '.repeat(indent * tab.length)}<${element.trim()}>` + (i < arr.length - 1 ? '\n' : '');
        if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith('input') && !element.startsWith('img')) indent++;
    });
    // Remove empty tags like <></>
    return result.replace(/<>\n<\/>/g, '');
}

// --- Main logic ---
function displayRenderedHtmlAsCode(sourceId, targetId) {
    const sourceElement = document.getElementById(sourceId);
    const targetElement = document.getElementById(targetId);
    if (!sourceElement || !targetElement) return;

    // Clone rendered DOM
    const clone = sourceElement.cloneNode(true);

    // Remove scripts
    clone.querySelectorAll("script").forEach(s => s.remove());

    // Clean attributes
    const cleanNode = (node) => {
        if (node.nodeType === 1) {
            for (let attr of Array.from(node.attributes)) {
                if (attr.name.startsWith("on") || attr.name === "id") {
                    node.removeAttribute(attr.name);
                }
            }
            node.childNodes.forEach(cleanNode);
        }
    };
    cleanNode(clone);

    // Serialize
    const serializer = new XMLSerializer();
    const cleanHtml = serializer.serializeToString(clone);

    // Format (pretty-print)
    const formattedHtml = formatHtml(cleanHtml);

    // Escape for display
    const escapedHtml = formattedHtml
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Display & highlight
    targetElement.innerHTML = escapedHtml;
    hljs.highlightElement(targetElement);
}

document.getElementById("htmlBtn").addEventListener("click", () => {

    displayRenderedHtmlAsCode("introduction", "code-block");
    // Remove the 'active' class from the form element
    document.getElementById('form').classList.remove('active');

    // Add the 'active' class to the introduction form div
    document.getElementById('code-block').classList.add('active');
});