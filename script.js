let phy = [];
let mat = [];
let chem = [];
let l = [];
let currentExam = 0;  // To keep track of the current exam number
let currentSubject = 'phy';  // To keep track of the current subject

const inp = document.getElementById("7");
const ldiv = document.querySelector(".ldiv");
const rdiv = document.querySelector(".rdiv");

ldiv.textContent = "ENTER THE NUMBER OF EXAMS";
inp.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();  // Prevent default form submission behavior
        processInput();  // Call the function to process input
    }
});

function processInput() {
    const inpval = inp.value;
    
    // If no exams have been entered yet, set the number of exams
    if (l.length === 0 && inpval.trim() !== '') {
        const x = parseInt(inpval);
        if (!isNaN(x) && x > 0) {  // Ensure valid number of exams
            l.push(x);
            inp.value = '';
            ldiv.textContent = "Enter Physics marks for exam " + (currentExam + 1);
        } else {
            ldiv.textContent = "Please enter a valid number of exams.";
        }
    } else if (l.length > 0) {
        // Collect marks for the current subject
        const mark = parseInt(inpval);
        if (!isNaN(mark) && mark >= 0 && mark <= 100) {  // Ensure valid mark
            if (currentSubject === 'phy') {
                phy.push(mark);
                currentSubject = 'mat';
                ldiv.textContent = "Enter Maths marks for exam " + (currentExam + 1);
            } else if (currentSubject === 'mat') {
                mat.push(mark);
                currentSubject = 'chem';
                ldiv.textContent = "Enter Chemistry marks for exam " + (currentExam + 1);
            } else if (currentSubject === 'chem') {
                chem.push(mark);
                currentExam++;  // Move to the next exam
                currentSubject = 'phy';  // Reset to Physics for the next exam
                
                if (currentExam < l[0]) {
                    ldiv.textContent = "Enter Physics marks for exam " + (currentExam + 1);
                } else {
                    ldiv.textContent = "All marks have been entered!";
                    inp.style.display = 'none';  // Hide input once all marks are entered

                    // Calculate predictions and display results
                    displayResults();
                }
            }
            inp.value = '';  // Clear the input for the next entry
        } else {
            ldiv.textContent = "Please enter a valid mark (0-100) for " + (currentSubject === 'phy' ? "Physics" : currentSubject === 'mat' ? "Maths" : "Chemistry") + " for exam " + (currentExam + 1);
        }
    }
}

function pred(lname, subject) {
    let sm = lname.reduce((a, b) => a + b, 0); // Sum
    sm = Math.floor(sm / lname.length); // Average
    let boost;
    switch (subject) {
        case 'phy':
            boost = Math.floor((5 / 100) * sm); // Physics boost factor
            break;
        case 'mat':
            boost = Math.floor((6 / 100) * sm); // Maths boost factor
            break;
        case 'chem':
            boost = Math.floor((7 /100) * sm); // Chemistry boost factor
            break;
    }
    let predictedMark = sm + boost;
    return predictedMark > 100 ? 100 : predictedMark; // Cap at 100 if necessary
}

function displayResults() {
    let cl = [];
    cl.push(pred(phy, 'phy'));
    cl.push(pred(chem, 'chem'));
    cl.push(pred(mat, 'mat'));

    let predictedCutoff = (cl[0] + cl[1]) / 2 + cl[2];

    rdiv.innerHTML = `
        <p>Predicted Physics mark: ${cl[0]}</p>
        <p>Predicted Chemistry mark: ${cl[1]}</p>
        <p>Predicted Maths mark: ${cl[2]}</p>
        <p>Predicted cutoff: ${predictedCutoff}</p>
    `;

    // Plotting the cutoff graph
    let exams = Array.from({length: phy.length}, (_, i) => `Exam ${i + 1}`);
    exams.push("Predicted");

    let data = [
        {
            x: exams,
            y: phy.concat(cl[0]),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Physics',
            marker: {color: 'blue'}
        },
        {
            x: exams,
            y: chem.concat(cl[1]),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Chemistry',
            marker: {color: 'green'}
        },
        {
            x: exams,
            y: mat.concat(cl[2]),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Maths',
            marker: {color: 'red'}
        }
    ];

    let layout = {
        title: 'Marks Progression',
        xaxis: {title: 'Exams'},
        yaxis: {title: 'Marks'},
        width: 600,
        height: 400
    };

    // Clear existing content and render the plot in the 'cutoffChart' div within the ldiv
    ldiv.innerHTML = '<div id="cutoffChart" style="width: 100%; height: 400px;"></div>';
    Plotly.newPlot('cutoffChart', data, layout, { displayModeBar: false });

    // College scores dictionary
    const collegeScores = {
        "College of Engineering": 190.67,
        "Madras Institute of Technology": 190.98,
        "SSN College of Engineering": 190.98,
        "Chennai Institute of Technology": 185.87,
        "Rajalakshmi Engineering College": 176.26,
        "Rajalakshmi Institute of Technology": 178.95,
        "Sri Venkateshwara College of Engineering": 174.50,
        "RMK Engineering College": 174.48,
        "Sri Sairam Engineering College": 167.69,
        "Saveetha Engineering College": 162.30,
        "RMD Engineering College": 169.45,
        "Sri Sairam Institute of Technology": 164.33,
        "Panimalar Engineering College": 158.71,
        "RMK College of Engineering and Technology": 164.24,
        "ST Joseph Institute of Technology": 156.23,
        "Vellamal Engineering College": 153.74,
        "Prince SVP Engineering College": 155.26,
        "SRM Valliamai Engineering College": 156.64,
        "ST Joseph College of Engineering": 158.53
    };

    // Calculate distances to the predicted cutoff
    const distances = Object.keys(collegeScores).map(college => ({
        college: college,
        cutoff: collegeScores[college],
        distance: Math.abs(collegeScores[college] - predictedCutoff)
    }));
    
    // Sort by distance and get the top 3 closest colleges
    const top3Colleges = distances.slice().sort((a, b) => a.distance - b.distance).slice(0, 3);
    
    // Create a Set to store the names of colleges already included in top3Colleges
    const selectedColleges = new Set(top3Colleges.map(item => item.college));
    
    // Get colleges with higher cutoffs and closest distances, excluding those in top3Colleges
    const improvements = distances
        .filter(item => item.cutoff > predictedCutoff && !selectedColleges.has(item.college))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 2);

    // Display the top colleges in a single section
    rdiv.innerHTML += '<h3>Suggested Colleges:</h3>';
    rdiv.innerHTML += '<ul>';
    
    // Display 1 nearest college
    if (top3Colleges.length > 0) {
        rdiv.innerHTML += `<li> ${top3Colleges[0].college}</li>`;
    }

    // Display 2 just lesser than the nearest
    if (top3Colleges.length > 1) {
        rdiv.innerHTML += `<li> ${top3Colleges[1].college}</li>`;
    }

    // Display 2 just greater than the nearest (if available)
    if (improvements.length > 0) {
        improvements.forEach((item, index) => {
            if (index < 2) {  // Only the top 2 colleges with higher cutoffs
                rdiv.innerHTML += `<li> ${item.college}</li>`;
            }
        });
    }
    
    rdiv.innerHTML += '</ul>';
}
