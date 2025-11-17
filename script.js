let loggedInUser = null;
let userRole = null;
const chatBox = document.getElementById('chatBox');

// Function to update time display
function showTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  const dateString = now.toLocaleDateString();
  document.getElementById('currentTime').innerHTML = `${timeString} | ${dateString}`;
}

// Initial time display
showTime();

// Update time every second
setInterval(showTime, 1000);

function login() {
  const username = document.getElementById('username').value.trim();
  const role = document.getElementById('role').value;
  const loginMsg = document.getElementById('loginMsg');
  if (!username || !role) {
    loginMsg.innerText = 'Please enter your name and select a role.';
    return;
  }
  loggedInUser = username;
  userRole = role;
  loginMsg.innerText = '';
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('mainContent').style.display = 'block';
  document.getElementById('userDisplay').innerText = `${loggedInUser} (${userRole})`;
  document.getElementById('logoutBtn').style.display = 'block'; // Show logout button

  if (userRole === 'patient') {
    document.getElementById('appointments').style.display = 'block';
    document.getElementById('chat').style.display = 'block';
  } else if (userRole === 'doctor') {
    document.getElementById('appointments').style.display = 'none';
    document.getElementById('chat').style.display = 'block';
  }
}

// Logout function
function logout() {
  loggedInUser = null;
  userRole = null;
  document.getElementById('loginSection').style.display = 'block';
  document.getElementById('mainContent').style.display = 'none';
  document.getElementById('logoutBtn').style.display = 'none'; // Hide logout button
  document.getElementById('username').value = ''; // Clear username input
  document.getElementById('role').value = ''; // Reset role select
  document.getElementById('loginMsg').innerText = ''; // Clear login message

  // Hide role-specific sections
  document.getElementById('appointments').style.display = 'none';
  document.getElementById('chat').style.display = 'none';

  // Clear chatbox and other inputs if desired
  chatBox.innerHTML = '';
  document.getElementById('chatInput').value = '';
  document.getElementById('symptomInput').value = '';
  document.getElementById('symptomResult').innerText = '';
  document.getElementById('aiQuestion').value = '';
  document.getElementById('aiAnswer').innerHTML = '';
  document.getElementById('apptMsg').innerText = '';
  document.getElementById('appointForm').reset();
}


document.getElementById('appointForm').addEventListener('submit', function(e) {
  e.preventDefault();
  if (userRole !== 'patient') {
    alert('Only patients can book appointments.');
    return;
  }
  const name = document.getElementById('apptName').value.trim();
  const doctor = document.getElementById('apptDoctor').value;
  const date = document.getElementById('apptDate').value;
  if (!name || !doctor || !date) {
    alert('Please fill all appointment fields.');
    return;
  }
  document.getElementById('apptMsg').innerText = `Appointment booked for ${name} with ${doctor} on ${date}.`;
  this.reset();
});

function appendMessage(sender, msg, className) {
  const div = document.createElement('div');
  div.className = `chat-message ${className}`;
  div.innerText = `${sender}: ${msg}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message) return;
  appendMessage('You', message, 'user-msg');
  input.value = '';

  if (userRole === 'patient') {
    setTimeout(() => {
      let reply = 'Thank you for your message. Please provide more details.';
      if (message.toLowerCase().includes('pain')) reply = 'Please describe the location and intensity of your pain.';
      if (message.toLowerCase().includes('appointment')) reply = 'To book an appointment, please use the booking section above.';
      if (message.toLowerCase().includes('headache')) reply = 'For headaches, rest in a quiet, dark room, stay hydrated, and consider over-the-counter pain relievers. If severe or frequent, consult a doctor.';
      if (message.toLowerCase().includes('fever')) reply = 'For fever, rest, stay hydrated, and consider acetaminophen or ibuprofen. Seek medical attention if temperature exceeds 103°F or persists for more than 3 days.';
      if (message.toLowerCase().includes('cough')) reply = 'For cough, drink warm fluids, use a humidifier, and consider honey for relief. If persistent or severe, consult a doctor.';
      appendMessage('Doctor', reply, 'doctor-msg');
    }, 800);
  } else if (userRole === 'doctor') {
    setTimeout(() => {
      appendMessage('Patient', "Thanks Doctor, I will follow your advice.", 'user-msg');
    }, 800);
  }
}

function checkSymptoms() {
  const symptoms = document.getElementById('symptomInput').value.toLowerCase();
  const result = document.getElementById('symptomResult');
  let advice = "Please consult a doctor for an accurate diagnosis.";
  if (symptoms.includes('fever') && symptoms.includes('cough')) {
    advice = "You may have a respiratory infection. Seek medical help as soon as possible.";
  } else if (symptoms.includes('headache')) {
    advice = "Stay hydrated and rest. If persistent, consult a neurologist.";
  } else if (symptoms.includes('skin') || symptoms.includes('rash')) {
    advice = "You might want to consult a dermatologist for a precise diagnosis.";
  } else if (symptoms.length < 10) {
    advice = "Please enter more details about your symptoms.";
  }
  result.innerText = advice;
}

function askAI() {
  const q = document.getElementById('aiQuestion').value.trim();
  const ansEl = document.getElementById('aiAnswer');
  if (!q) {
    ansEl.innerHTML = "<p style='color:red;'>Please enter a question for the AI.</p>";
    return;
  }
  
  // Show loading indicator
  ansEl.innerHTML = "<p style='color:#005288; font-style: italic;'>AI Doctor is analyzing your question...</p>";
  
  // Simulate AI processing time
  setTimeout(() => {
    let answer = "";
    const question = q.toLowerCase();
    
    // Comprehensive AI responses with prevention and medicine information
    if (question.includes("headache")) {
      answer = `
        <div style="background:#e3f2fd; padding:15px; border-radius:8px; border-left:4px solid #005288;">
          <h3 style="color:#005288;">Headache Analysis</h3>
          <p><strong>Prevention:</strong></p>
          <ul>
            <li>Maintain regular sleep schedule (7-8 hours)</li>
            <li>Stay hydrated throughout the day</li>
            <li>Manage stress through relaxation techniques</li>
            <li>Avoid known triggers (certain foods, bright lights)</li>
            <li>Take regular breaks from screen time</li>
          </ul>
          <p><strong>Medications:</strong></p>
          <ul>
            <li>Over-the-counter: Acetaminophen (Tylenol), Ibuprofen (Advil)</li>
            <li>Prescription: For chronic migraines - Triptans, Preventive medications</li>
          </ul>
          <p><strong>General Advice:</strong> Rest in a quiet, dark room, stay hydrated, and consider over-the-counter pain relievers. If headaches are severe or frequent, consult a doctor.</p>
        </div>
      `;
    } 
    else if (question.includes("fever")) {
      answer = `
        <div style="background:#e3f2fd; padding:15px; border-radius:8px; border-left:4px solid #005288;">
          <h3 style="color:#005288;">Fever Analysis</h3>
          <p><strong>Prevention:</strong></p>
          <ul>
            <li>Practice good hygiene (handwashing)</li>
            <li>Get recommended vaccinations</li>
            <li>Avoid close contact with sick individuals</li>
            <li>Maintain a healthy immune system with proper nutrition</li>
          </ul>
          <p><strong>Medications:</strong></p>
          <ul>
            <li>Acetaminophen (Tylenol) - Reduces fever and pain</li>
            <li>Ibuprofen (Advil) - Reduces fever and inflammation</li>
            <li>Aspirin - For adults (avoid in children)</li>
          </ul>
          <p><strong>When to seek medical attention:</strong></p>
          <ul>
            <li>Temperature above 103°F (39.4°C)</li>
            <li>Fever lasting more than 3 days</li>
            <li>Severe headache, stiff neck, or difficulty breathing</li>
            <li>Severe vomiting or inability to keep fluids down</li>
          </ul>
          <p><strong>General Care:</strong> Rest, stay hydrated, and consider acetaminophen or ibuprofen as directed on the package.</p>
        </div>
      `;
    }
    else if (question.includes("covid") || question.includes("coronavirus")) {
      answer = `
        <div style="background:#e3f2fd; padding:15px; border-radius:8px; border-left:4px solid #005288;">
          <h3 style="color:#005288;">COVID-19 Information</h3>
          <p><strong>Prevention:</strong></p>
          <ul>
            <li>Get vaccinated and receive booster doses as recommended</li>
            <li>Wear masks in crowded or poorly ventilated areas</li>
            <li>Practice social distancing</li>
            <li>Wash hands frequently with soap and water</li>
            <li>Use hand sanitizer with at least 60% alcohol</li>
          </ul>
          <p><strong>Medications:</strong></p>
          <ul>
            <li>Antiviral drugs: Paxlovid, Remdesivir (for high-risk patients)</li>
            <li>Monoclonal antibodies (for early treatment)</li>
            <li>Over-the-counter: Acetaminophen, Ibuprofen for symptoms</li>
          </ul>
          <p><strong>Important:</strong> If you experience emergency warning signs such as difficulty breathing, persistent pain or pressure in the chest, or bluish lips or face, seek medical attention immediately.</p>
          <p>Follow local health guidelines for testing and vaccination.</p>
        </div>
      `;
    }
    else if (question.includes("diet") || question.includes("nutrition")) {
      answer = `
        <div style="background:#e3f2fd; padding:15px; border-radius:8px; border-left:4px solid #005288;">
          <h3 style="color:#005288;">Nutrition Advice</h3>
          <p><strong>Prevention:</strong></p>
          <ul>
            <li>Maintain a balanced diet rich in fruits and vegetables</li>
            <li>Limit processed foods and sugary drinks</li>
            <li>Control portion sizes to maintain healthy weight</li>
            <li>Stay hydrated with water</li>
            <li>Include fiber-rich foods for digestive health</li>
          </ul>
          <p><strong>Medications:</strong></p>
          <ul>
            <li>Vitamin D supplements (if deficient)</li>
            <li>Omega-3 fatty acids (fish oil)</li>
            <li>Iron supplements (if anemic)</li>
            <li>Probiotics for gut health</li>
          </ul>
          <p><strong>General Tips:</strong></p>
          <ul>
            <li>Eat a variety of colorful fruits and vegetables</li>
            <li>Include lean proteins (fish, poultry, legumes)</li>
            <li>Choose whole grains over refined grains</li>
            <li>Limit sodium intake</li>
            <li>Include healthy fats (avocados, nuts, olive oil)</li>
          </ul>
        </div>
      `;
    }
    else if (question.includes("exercise") || question.includes("workout")) {
      answer = `
        <div style="background:#e3f2fd; padding:15px; border-radius:8px; border-left:4px solid #005288;">
          <h3 style="color:#005288;">Exercise Recommendations</h3>
          <p><strong>Prevention:</strong></p>
          <ul>
            <li>Regular physical activity reduces risk of chronic diseases</li>
            <li>Helps maintain healthy weight</li>
            <li>Improves cardiovascular health</li>
            <li>Boosts mental health and reduces stress</li>
          </ul>
          <p><strong>Medications:</strong></p>
          <ul>
            <li>Supplements: Vitamin D, Magnesium (for muscle function)</li>
            <li>Anti-inflammatory medications (for joint pain)</li>
            <li>Prescription medications for specific conditions (as needed)</li>
          </ul>
          <p><strong>Exercise Guidelines:</strong></p>
          <ul>
            <li>Cardiovascular exercise: 150 minutes of moderate activity per week</li>
            <li>Muscle-strengthening activities: At least 2 days per week</li>
            <li>Flexibility and balance: Activities like yoga or tai chi</li>
          </ul>
          <p><strong>Beginner Tips:</strong></p>
          <ul>
            <li>Start slowly and gradually increase intensity</li>
            <li>Choose activities you enjoy</li>
            <li>Listen to your body and rest when needed</li>
            <li>Stay hydrated before, during, and after exercise</li>
          </ul>
          <p>Consult a healthcare provider before starting a new exercise program if you have health conditions.</p>
        </div>
      `;
    }
    else if (question.includes("stress") || question.includes("anxiety")) {
      answer = `
        <div style="background:#e3f2fd; padding:15px; border-radius:8px; border-left:4px solid #005288;">
          <h3 style="color:#005288;">Stress and Anxiety Management</h3>
          <p><strong>Prevention:</strong></p>
          <ul>
            <li>Practice stress management techniques</li>
            <li>Maintain work-life balance</li>
            <li>Regular physical activity</li>
            <li>Healthy sleep habits (7-9 hours)</li>
            <li>Social support from family and friends</li>
          </ul>
          <p><strong>Medications:</strong></p>
          <ul>
            <li>Antidepressants: SSRIs, SNRIs (for chronic conditions)</li>
            <li>Anxiolytics: Benzodiazepines (short-term use)</li>
            <li>Herbal supplements: Valerian root, Passionflower</li>
            <li>Stress management medications (as prescribed)</li>
          </ul>
          <p><strong>Management Strategies:</strong></p>
          <ul>
            <li>Relaxation techniques: Deep breathing, meditation, progressive muscle relaxation</li>
            <li>Regular exercise</li>
            <li>Healthy sleep habits</li>
            <li>Social support</li>
            <li>Time management</li>
          </ul>
          <p><strong>When to seek help:</strong> If stress significantly impacts your daily life, consider speaking with a mental health professional.</p>
        </div>
      `;
    }
    else if (question.includes("diabetes")) {
      answer = `
        <div style="background:#e3f2fd; padding:15px; border-radius:8px; border-left:4px solid #005288;">
          <h3 style="color:#005288;">Diabetes Management</h3>
          <p><strong>Prevention:</strong></p>
          <ul>
            <li>Maintain healthy weight</li>
            <li>Regular physical activity</li>
            <li>Healthy diet low in sugar and refined carbs</li>
            <li>Regular check-ups for blood sugar levels</li>
          </ul>
          <p><strong>Medications:</strong></p>
          <ul>
            <li>Insulin (various types)</li>
            <li>Metformin (for Type 2 diabetes)</li>
            <li>Sulfonylureas</li>
            <li>GLP-1 receptor agonists</li>
            <li>Thiazide diuretics (for hypertension)</li>
          </ul>
          <p><strong>Management Tips:</strong></p>
          <ul>
            <li>Monitor blood glucose regularly</li>
            <li>Follow prescribed diet plan</li>
            <li>Take medications as directed</li>
            <li>Regular exercise</li>
            <li>Foot care and regular check-ups</li>
          </ul>
        </div>
      `;
    }
    else {
      // Default response for other questions
      answer = `
        <div style="background:#e3f2fd; padding:15px; border-radius:8px; border-left:4px solid #005288;">
          <h3 style="color:#005288;">AI Doctor Response</h3>
          <p>Thank you for your question. While I can provide general health information, this is not a substitute for professional medical advice.</p>
          <p>For accurate diagnosis and treatment, please consult with a qualified healthcare provider. If you're experiencing severe symptoms or emergency conditions, seek immediate medical attention.</p>
          <p><strong>General Health Tip:</strong> Maintain a balanced diet, stay physically active, get adequate sleep, and manage stress for optimal health.</p>
        </div>
      `;
    }
    
    ansEl.innerHTML = answer;
  }, 1500);
}
