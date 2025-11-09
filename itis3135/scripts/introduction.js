const form = document.getElementById("intro_form");
const output = document.getElementById("output");



form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

});

const classContainer = document.getElementById('courseContainer');
const addClassBtn = document.getElementById('addCourseBtn');
let classCount = 0;

function clearFormFields(form) {
    const elements = form.elements;

    for (let el of elements) {
        if (el.tagName === 'BUTTON') continue; // skip buttons

        // Handle input types
        if (el.tagName === 'INPUT') {
            const type = el.type.toLowerCase();

            // Checkboxes / radios
            if ((type === 'checkbox' || type === 'radio') && el.defaultChecked) {
                el.checked = false;
            }
            // Text-like inputs
            else if (['text', 'email', 'number', 'password', 'url', 'search', 'tel', 'date'].includes(type)) {
                if (el.defaultValue.trim() !== '') {
                    el.value = '';
                }
            }
            // File inputs
            else if (type === 'file') {
                el.value = '';
            }
        }
        // Handle selects
        else if (el.tagName === 'SELECT') {
            const hasDefault = Array.from(el.options).some(opt => opt.defaultSelected && opt.value.trim() !== '');
            if (hasDefault) el.selectedIndex = 0;
        }
        // Handle textareas
        else if (el.tagName === 'TEXTAREA') {
            if (el.defaultValue.trim() !== '') el.value = '';
        }
    }
}

document.getElementById('resetTopBtn').addEventListener('click', () => {
    clearFormFields(form);
});
document.getElementById('loadSampleTopBtn').addEventListener('click', () => {
    form.reset();
});



function createClassEntry() {
    console.log("Adding class entry");
    classCount++;
    const div = document.createElement('div');
    div.className = 'class-entry';
    div.innerHTML = `
                    <h3>Class ${classCount}</h3>
                    <button type="button" class="remove-btn">✖</button>
                    <div>
                        <label>Course Department:</label>
                        <input type="text" id="department_${classCount}">
                    </div>
                    <div>
                        <label>Course Code:</label>
                        <input type="text" id="code_${classCount}">
                    </div>
                    <div>
                        <label>Course Name:</label>
                        <input type="text" id="name_${classCount}">
                    </div>
                    <div>
                    <label>Why are you taking it?</label>
                    <textarea id="reason_${classCount}" rows="3"></textarea>
                    </div>
                  `;

    div.querySelector('.remove-btn').addEventListener('click', () => {
        div.remove();
        updateClassHeaders();
    });

    classContainer.appendChild(div);
}

function updateClassHeaders() {
    const entries = document.querySelectorAll('.class-entry');
    entries.forEach((entry, index) => {
        entry.querySelector('h3').textContent = `Class ${index + 1}`;
    });
}

function loadDefaultClasses() {
    const defaultCourses = [
        { department: "ITIS", code: "3135", name: "Web Application and Development", reason: "Required, But I’m interested in having an idea of how webpages are made and work" },
        { department: "ITSC", code: "2181", name: "Introduction to Computer Systems", reason: "Required, Assembly and C will be interesting to learn" },
        { department: "STAT", code: "2122", name: "Statistics", reason: "Required" },
        { department: "ITSC", code: "3155", name: "Software Development Process", reason: "Required, Learning the process of software development should be very valuable" },
        { department: "MUPF", code: "1110", name: "Music Performance", reason: "I’ve always played in the school orchestra as long as I’ve been playing an instrument. It’s fun and a nice break from class" }
    ];

    defaultCourses.forEach(course => {
        classCount++;
        const div = document.createElement('div');
        div.className = `class-entry`;
        div.innerHTML = `
                        <h3>Class ${classCount}</h3>
                        <button type="button" class="remove-btn">✖</button>
                        <div>
                        <label>Course Department:</label>
                        <input type="text" id="department_${classCount}" value="${course.department}">
                        </div>
                        <div>
                        <label>Course Code:</label>
                        <input type="text" id="code_${classCount}" value="${course.code}">
                        </div>
                        <div>
                        <label>Course Name:</label>
                        <input type="text" id="name_${classCount}" value="${course.name}">
                        </div>
                        <div>
                        <label>Why are you taking it?</label>
                        <textarea id="reason_${classCount}" rows="3">${course.reason}</textarea>
                        </div>
                      `;

        div.querySelector('.remove-btn').addEventListener('click', () => {
            div.remove();
            updateClassHeaders();
        });

        classContainer.appendChild(div);
    });
}

function getImageUrl() {
    const fileInput = document.getElementById("imageFile");
    const fallbackUrl = "images/DSC_0582.JPG";

    // If no file is selected, return fallback image
    if (!fileInput.files || fileInput.files.length === 0) {
        return fallbackUrl;
    }

    const file = fileInput.files[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
        console.warn("Selected file is not an image. Using fallback image.");
        return fallbackUrl;
    }

    // Create and return a blob URL for the uploaded image
    return URL.createObjectURL(file);
}

document.getElementById("clearImageBtn").addEventListener("click", () => {
    const fileInput = document.getElementById("imageFile");
    fileInput.value = "";
});


loadDefaultClasses();
addClassBtn.addEventListener('click', createClassEntry);

submitTopBtn.addEventListener('click', (e) => { e.preventDefault(); doGenerate(); });

function formatHTML(html) {
    const tab = '  '; // use 2 spaces for indentation
    let result = '';
    let indentLevel = 0;

    // Remove existing whitespace between tags for consistency
    html = html.replace(/>\s+</g, '><').trim();

    html.split(/(?=<)|(?<=>)/g).forEach(token => {
        if (token.match(/^<\/\w/)) {
            // Closing tag → decrease indent, then add line
            indentLevel = Math.max(indentLevel - 1, 0);
            result += tab.repeat(indentLevel) + token.trim() + '\n';
        } else if (token.match(/^<\w[^>]*[^\/]>$/)) {
            // Opening tag (not self-closing)
            result += tab.repeat(indentLevel) + token.trim() + '\n';
            indentLevel++;
        } else if (token.match(/^<.*\/>$/)) {
            // Self-closing tag
            result += tab.repeat(indentLevel) + token.trim() + '\n';
        } else {
            // Text or inline content
            const text = token.trim();
            if (text) result += tab.repeat(indentLevel) + text + '\n';
        }
    });

    return result.trim();
}


function doGenerate() {


    //Rendered Preview
    const preview = document.querySelector('.preview-col');
    preview.innerHTML = '';
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    // Create introduction content
    const image_source = getImageUrl();
    console.log(image_source);


    let courses = [];
    const courseEntries = document.querySelectorAll(".class-entry");
    courseEntries.forEach((entry, index) => {
        const department = entry.querySelector(`#department_${index + 1}`).value;
        const code = entry.querySelector(`#code_${index + 1}`).value;
        const name = entry.querySelector(`#name_${index + 1}`).value;
        const reason = entry.querySelector(`#reason_${index + 1}`).value;
        courses.push({ department, code, name, reason });
    });
    data["courses"] = courses;

    const introDiv = document.createElement('div');
    introDiv.innerHTML = `
        <h2>Introduction</h2>
        <p>I acknowledge the information I present is avaliable on the internet - ${data.acknowledgment}</p>
        <p>${data.firstName} ${data.middleName}. ${data.preferredName} ${data.lastName} ${data.mascotDivider} ${data.mascotDescriptor}</p>
        <img src=${image_source}></img>
        <i>${data.caption}</i>
        <p>${data.personalStatement}</p>
        <h3>Background</h3>
        <p>Personal Background: ${data.personalBackground}</p>
        <p>Professional Background: ${data.professionalBackground}</p>
        <p>Academic Background: ${data.academicBackground}</p>
        <p>Primary Computer: ${data.computerOS} ${data.computerPlatform} ${data.workLocation}</p>
        <p>Funny/Interesting Item to Remember Me by: ${data.funnyRemember}</p>
        <h3>Courses</h3>
        <ul id="courseDetailsDisplay"></ul>
    `;

    for (let course of courses) {
        const li = document.createElement('li');
        li.innerHTML = `<p>${course.department}${course.code} - ${course.name}: ${course.reason}</p>`;
        introDiv.querySelector('#courseDetailsDisplay').appendChild(li);
    }



    console.log(data);

    preview.appendChild(introDiv);

    //JSON Output
    const jsonOutput = document.querySelector('.json');
    jsonOutput.textContent = JSON.stringify(data, null, 2);
    hljs.highlightElement(jsonOutput);

    //HTML Output
    const htmlOutput = document.querySelector('.html');
    const formattedHTML = formatHTML(introDiv.innerHTML);
    htmlOutput.textContent = formattedHTML;
    hljs.highlightElement(htmlOutput);



}
