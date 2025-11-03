// --- Main logic: extract compiled data and build JSON ---
function displayRenderedHtmlAsJson(sourceId, targetId) {
    const sourceElement = document.getElementById(sourceId);
    const targetElement = document.getElementById(targetId);
    if (!sourceElement || !targetElement) return;

    // Clone compiled DOM (after render)
    const clone = sourceElement.cloneNode(true);
    clone.querySelectorAll("script").forEach(s => s.remove());

    // Helper to safely get text
    const getText = (id) => {
        const el = clone.querySelector(`#${id}`);
        return el ? el.textContent.trim() : "";
    };

    // Helper to safely get an attribute
    const getAttr = (id, attr) => {
        const el = clone.querySelector(`#${id}`);
        return el ? el.getAttribute(attr) : "";
    };

    // --- Build JSON Object ---
    const jsonObj = {
        firstName: getElementById("firstName"),
        preferredName: getText("preferredName"),
        middleInitial: getText("middleInitial"),
        lastName: getText("lastName"),
        divider: getText("divider"),
        mascotAdjective: getText("mascotAdjective"),
        mascotAnimal: getText("mascotAnimal"),
        image: getAttr("image", "src"),
        imageCaption: getText("imageCaption"),
        personalStatement: getText("personalStatement"),
        personalBackground: getText("personalBackground"),
        professionalBackground: getText("professionalBackground"),
        academicBackground: getText("academicBackground"),
        subjectBackground: getText("subjectBackground"),
        primaryComputer: getText("primaryComputer"),

        // --- Courses (array of objects) ---
        courses: Array.from(clone.querySelectorAll("#courses .course")).map(course => ({
            department: getTextWithin(course, ".department"),
            number: getTextWithin(course, ".number"),
            name: getTextWithin(course, ".name"),
            reason: getTextWithin(course, ".reason")
        })),

        // --- Links (array of objects) ---
        links: Array.from(clone.querySelectorAll("#links a")).map(link => ({
            name: link.textContent.trim(),
            href: link.getAttribute("href") || ""
        }))
    };

    // Helper to extract text within parent course node
    function getTextWithin(parent, selector) {
        const el = parent.querySelector(selector);
        return el ? el.textContent.trim() : "";
    }

    // --- Convert to JSON string ---
    const jsonString = JSON.stringify(jsonObj, null, 2);

    // Escape for safe display
    const escapedJson = jsonString
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Display & highlight
    targetElement.innerHTML = escapedJson;
    hljs.highlightElement(targetElement);
}

document.getElementById("jsonBtn").addEventListener("click", () => {
    // Wait briefly to ensure the introduction div is fully rendered
    setTimeout(() => {
        displayRenderedHtmlAsJson("introduction", "json-block");
        document.getElementById("form").classList.remove("active");
        document.getElementById("json-block").classList.add("active");
    }, 100);
});
