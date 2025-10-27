document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Update the introduction div fields
    document.getElementById('acknowledgementDisplay').innerText =
        document.getElementById('ackStatement').value + ' ' + document.getElementById('ackDate').value;

    document.getElementById('namedisplay').innerText =
        document.getElementById('firstName').value + ' ' + document.getElementById('middleName').value + ' ' +
        document.getElementById('lastName').value + ' ' + document.getElementById('divider').value + ' ' +
        document.getElementById('mascotAdjective').value + ' ' + document.getElementById('mascotAnimal').value;

    document.getElementById('pictureCaptionDisplay').innerText =
        document.getElementById('pictureCaption').value;

    document.getElementById('personalStatementDisplay').innerText =
        document.getElementById('personalStatement').value;

    document.getElementById('personalBackgroundDisplay').innerText =
        "Personal Background: " + document.getElementById('personalBackground').value;

    document.getElementById('professionalBackgroundDisplay').innerText =
        "Professional Background: " + document.getElementById('professionalBackground').value;

    document.getElementById('academicBackgroundDisplay').innerText =
        "Academic Background: " + document.getElementById('academicBackground').value;

    document.getElementById('primaryComputerDisplay').innerText =
        "Primary Computer: " + document.getElementById('primaryComputer').value;

    document.getElementById('funnyThingDisplay').innerText =
        "Funny/Interesting Item to Remember Me by: " + document.getElementById('funnyThing').value;

    // Update course details
    const numCourses = document.querySelectorAll('#class-container .class-entry').length;
    const courseDetailsContainer = document.getElementById('courseDetailsDisplay');
    courseDetailsContainer.innerHTML = ''; // Clear existing course details

    if (!numCourses) {
        console.log(numCourses)
        // Default course details
        const defaultCourses = [
            { department: "ITIS3135", details: "Web Application and Development: Required, But I’m interested in having an idea of how webpages are made and work" },
            { department: "ITSC2181", details: "Introduction to Computer Systems: Required, Assembly and C will be interesting to learn" },
            { department: "STAT2122", details: "Required" },
            { department: "ITSC3155", details: "Required, Learning the process of software development should be very valuable" },
            { department: "MUPF1110", details: "I’ve always played in the school orchestra as long as I’ve been playing an instrument. It’s fun and a nice break from class" }
        ];

        defaultCourses.forEach(course => {
            const li = document.createElement('li');
            li.innerHTML = `<p role="presentation" dir="ltr">${course.department} - ${course.details}</p>`;
            courseDetailsContainer.appendChild(li);
        });
    } else {
        for (let i = 1; i <= numCourses; i++) {
            const department = document.getElementById(`department_${i}`).value;
            const courseNumber = document.getElementById(`code_${i}`).value;
            const courseName = document.getElementById(`name_${i}`).value;
            const courseReason = document.getElementById(`reason_${i}`).value;

            const li = document.createElement('li');
            li.innerHTML = `<p role="presentation" dir="ltr">${department} ${courseNumber} - ${courseName}: ${courseReason}</p>`;
            courseDetailsContainer.appendChild(li);
        }
    }

    // Remove the 'active' class from the form element
    document.getElementById('form').classList.remove('active');

    // Add the 'active' class to the introduction form div
    document.getElementById('introduction').classList.add('active');
});
