document.addEventListener("DOMContentLoaded", function () {
    const selectedCar = localStorage.getItem("selectedCar"); // Retrieve the stored car
    console.log(selectedCar);
    
    if (selectedCar) {
        const carImagePath = `../Images/Cars/car${selectedCar}.png`;

        // Set the background image of the car div
        document.querySelector(".car").style.backgroundImage = `url(${carImagePath})`;

        // Set the mouse cursor to the same image
        document.body.style.cursor = `url(${carImagePath}), auto`;
    }
});

$(document).ready(function() {
    $(".settings").on("click", function() {
        $("#settingsMenu").fadeIn();
        document.getElementById('settingsMenu').style.display = 'flex';
    });

    $("#closeSettings").on("click", function() {
        $("#settingsMenu").fadeOut();
        document.getElementById('settingsMenu').style.display = 'none';
    });

    // Optional: close when clicking outside the menu
    $("#settingsMenu").on("click", function(e) {
        if (e.target === this) {
            $(this).fadeOut();
        }
    });
});


document.addEventListener('click', () => {
    // Change cursor to gear-shift on click
    body.style.cursor = "url('../Images/gear-shift.png') 16 16, auto";

    // Restore cursor after 300ms
    setTimeout(() => {
      body.style.cursor = "url('../Images/transmission.png') 16 16, auto";
    }, 100);
  });

  let x_axis = 0;
  let y_axis = 0;
  let rotationAngle = 0; // degrees
  let speed = 0; // starting speed
  let maxSpeed = 10; // maximum speed
  let acceleration = 0.5; // how fast to accelerate
  let friction = 0.1; // how fast to slow down naturally
  let turningSpeed = 3; // how fast the car turns
  
  let keysPressed = {}; // Track keys pressed
  
  const car = document.querySelector('.car');
  
  document.addEventListener('keydown', (e) => {
      keysPressed[e.key] = true; // Track key press
      if (e.keyCode === 13) { // Enter key
        document.querySelector(".information").innerHTML = "";
        document.querySelector('.information').classList.remove('extra-style');
        checkParkingCollision();
    }
  });
  
  document.addEventListener('keyup', (e) => {
      keysPressed[e.key] = false; // Untrack key release
  });
  
  // Auto movement update (drift feel, speed drop)
  setInterval(() => {
      moveCar();
      handleControls();
  }, 30); // update every 30ms
  
  function handleControls() {
      // Check if the key is pressed and move accordingly
      if (keysPressed['ArrowUp'] || keysPressed['w']) { // Up Arrow = accelerate (or W key)
          accelerate();
      }
  
      if (keysPressed['ArrowDown'] || keysPressed['s']) { // Down Arrow = brake (or S key)
          brake();
      }
  
      if (keysPressed['ArrowLeft'] || keysPressed['a']) { // Left Arrow = turn left (or A key)
          rotateCarLeft();
      }
  
      if (keysPressed['ArrowRight'] || keysPressed['d']) { // Right Arrow = turn right (or D key)
          rotateCarRight();
      }
      
      if (keysPressed['d']) { // D key = quick 360 spin
          driftRight();
      }
  }
  
  // Movement logic
  function accelerate() {
      if (speed < maxSpeed) {
          speed += acceleration;
      }
  }
  
  function brake() {
      if (speed > -maxSpeed / 2) { // allow some reverse
          speed -= acceleration;
      }
  }
  
  function moveCar() {
    // Apply friction
    if (speed > 0) {
        speed -= friction;
        if (speed < 0) speed = 0;
    } else if (speed < 0) {
        speed += friction;
        if (speed > 0) speed = 0;
    }

    const angleInRadians = rotationAngle * (Math.PI / 180);
    const deltaX = speed * Math.cos(angleInRadians);
    const deltaY = speed * Math.sin(angleInRadians);

    const carRect = car.getBoundingClientRect();
    const containerRect = document.querySelector('.main-container').getBoundingClientRect();

    const carWidth = carRect.width;
    const carHeight = carRect.height;

    const futureLeftX = carRect.left + deltaX;
    const futureRightX = futureLeftX + carWidth;
    const futureTopY = carRect.top + deltaY;
    const futureBottomY = futureTopY + carHeight;

    const withinXBounds = futureLeftX >= containerRect.left && futureRightX <= containerRect.right-10;
    const withinYBounds = futureTopY >= containerRect.top+10 && futureBottomY <= containerRect.bottom-10;

    if (withinXBounds) {
        x_axis += deltaX;
    } else {
        speed = -speed * 0.7; // Bounce with reduced speed
        x_axis -= deltaX * 0.7; // Slight shift away from edge
    }

    if (withinYBounds) {
        y_axis += deltaY;
    } else {
        speed = -speed * 0.7;
        y_axis -= deltaY * 0.7;
    }

    updateCarTransform();
}


  
  function rotateCarLeft() {
      if (speed !== 0) { // can only turn when moving
          rotationAngle -= turningSpeed; // drift feel
      }
      updateCarTransform();
  }
  
  function rotateCarRight() {
      if (speed !== 0) {
          rotationAngle += turningSpeed;
      }
      updateCarTransform();
  }
  
  function driftRight() {
    car.classList.add("drift-skid");
    setTimeout(() => {
        car.classList.remove("drift-skid");
        rotationAngle -= 30;
        updateCarTransform();
    }, 200);
}


  
  function updateCarTransform() {
      car.style.transition = "none"; // No transition for smooth movement
      car.style.transformOrigin = "50% 5%"; // front of the car
      car.style.transform = `translate(${x_axis}px, ${y_axis}px) rotate(${rotationAngle}deg)`;
  }
  
  
document.getElementById('reload').addEventListener('click', function() {
    location.reload();
});

  

function checkCollision(car, lot) {
    const carRect = car.getBoundingClientRect();
    const lotRect = lot.getBoundingClientRect();

    return (
        carRect.left < lotRect.right - 50 &&
        carRect.right > lotRect.left + 50 &&
        carRect.top < lotRect.bottom - 50 &&
        carRect.bottom > lotRect.top + 50
    );
}

function textTypingEffect(element, text, callback) {
    let i = 0;
    let isTyping = true;

    const typingInterval = setInterval(() => {
        element.textContent += text[i];
        i++;
        if (i === text.length) {
            clearInterval(typingInterval);
            isTyping = false;
            document.removeEventListener("keydown", onKeyPress); // Clean up
            callback();
        }
    }, 50);

    function onKeyPress(event) {
        if (event.key === "Enter" && isTyping) {
            clearInterval(typingInterval);
            element.textContent = text; // Show full text
            isTyping = false;
            document.removeEventListener("keydown", onKeyPress); // Clean up
            callback();
        }
    }

    document.addEventListener("keydown", onKeyPress);
}

$(document).ready(function() {
    const defaultSpeed = 0.5;
    let currentSpeed = defaultSpeed;
    let currentDifficulty = "Easy";

    $(".settings").on("click", function() {
        $("#settingsMenu").fadeIn();
    });

    $("#closeSettings").on("click", function() {
        $("#settingsMenu").fadeOut();
    });

    $("#settingsMenu").on("click", function(e) {
        if (e.target === this) {
            $(this).fadeOut();
        }
    });

    // Toggle difficulty
    const difficulties = ["Easy", "Hard"];
    let difficultyIndex = 0;

    // Difficulty control
    $("#increaseDifficulty").click(function () {
        difficultyIndex = (difficultyIndex + 1) % difficulties.length;
        currentDifficulty = difficulties[difficultyIndex];
        $("#difficultyToggle").text(currentDifficulty);
    });

    $("#decreaseDifficulty").click(function () {
        difficultyIndex = (difficultyIndex - 1 + difficulties.length) % difficulties.length;
        currentDifficulty = difficulties[difficultyIndex];
        $("#difficultyToggle").text(currentDifficulty);
    });

    $("#change-car").click(function(){
        window.location.href="../CarSelection/index.html"
    })


    // Speed controls
    $("#increaseSpeed").click(function() {
        if (currentSpeed < 10) {
            currentSpeed += 0.5;
            currentSpeed = Math.min(currentSpeed, 10); // Don't allow beyond 10
            $("#speedInput").val(currentSpeed.toFixed(1));
            acceleration = currentSpeed;
        }
    });

    $("#decreaseSpeed").click(function() {
        if (currentSpeed > 0.5) {
            currentSpeed -= 0.5;
            currentSpeed = Math.max(currentSpeed, 0.5); // Don't allow below 0.5
            $("#speedInput").val(currentSpeed.toFixed(1));
            acceleration = currentSpeed;
        }
    });

    // Manual input
    $("#speedInput").on("input", function() {
        let val = parseFloat($(this).val());
        if (isNaN(val)) {
            val = 0.5;
        }
        val = Math.min(Math.max(val, 0.5), 10);
        currentSpeed = val;
        acceleration = currentSpeed; 
        $(this).val(currentSpeed.toFixed(1));
    });

    // Reset button
    $("#resetSettings").click(function() {
        currentSpeed = defaultSpeed;
        currentDifficulty = "Easy";
        acceleration = defaultSpeed; 
        $("#speedInput").val(currentSpeed.toFixed(1));
        $("#difficultyToggle").text(currentDifficulty);
    });
});



function attachInternshipListeners() {
    document.querySelectorAll(".custom-btn").forEach(button => {
        button.addEventListener("click", function () {
            let id = this.getAttribute("data-id");
            let desc = document.getElementById("desc-" + id);

            // Toggle visibility
            if (desc.style.display === "block") {
                desc.style.display = "none";
            } else {
                document.querySelectorAll(".description").forEach(d => d.style.display = "none"); // Hide other descriptions
                desc.style.display = "block";
            }
        });
    });
}
  
function checkParkingCollision() {
    const car = document.querySelector('.car');
    const parkingLots = document.querySelectorAll('.parking-lot');
    const informationEl = document.querySelector('.information');
    let contentToDisplay = "";

    parkingLots.forEach((lot) => {
        if (checkCollision(car, lot)) {
            const detail = lot.dataset.detail;
            if (detail === "education") {
                // Start typing the dynamic text
                textTypingEffect(informationEl, "I completed my schooling in Rose Mary. Now I am doing my bachelor's degree in NEC", () => {
                    // Once typing is done, append static content without removing previous content
                    informationEl.innerHTML += '<p>SSLC: 80%<br>HSC: 80.7%<br>CGPA: 7.8</p><div class="img-container"><img src="../Images/rosemary.jpg"><img src="../Images/national.avif"></div>';
                });
            } else if (detail === "resume") {
                document.querySelector('.information').classList.add('extra-style');
                informationEl.innerHTML = '<a href="../Images/resume.png" download="../Images/resume.png"><img src="../Images/resume.png" class="styled-image" alt="Resume Image"></a><p style="margin:0;">Click on the image to Download</p>';

            } else if (detail === "internships") {
                informationEl.innerHTML = `
                <div class="intern-btn-container">
                    <h1>Internships</h1>
                    <button class="custom-btn btn-11" data-id="1">MERN intern @WSA<div class="dot"></div></button>
                    <div class="description" id="desc-1" style="display: none;text-align:center;padding:0;">Completed a 2-month WSA internship, developing Homely Hub, a full-stack MERN room booking application with authentication and dynamic user interfaces.</div>

                    <button class="custom-btn btn-11" data-id="2">Web Development @Codsoft<div class="dot"></div></button>
                    <div class="description" id="desc-2" style="display: none;text-align:center;padding:0;">Completed a 1-month CodSoft internship, building responsive web projects including a landing page, portfolio, and calculator using HTML, CSS, and JavaScript.</div>

                    <button class="custom-btn btn-11" data-id="3">Software Developer intern @HBS<div class="dot"></div></button>
                    <div class="description" id="desc-3" style="display: none;text-align:center;padding:0;">Experience: Worked on backend APIs, optimized databases, and implemented security best practices.</div>
                </div>
                `;
                
                attachInternshipListeners();
            } else if (detail==="about me"){
                informationEl.innerHTML = `
                    <div id="about-container" style="text-align: center;">
                        <h3 style="margin-bottom: 20px;">About Me</h3>
                        <p id="typing-text" style="text-align: justify; font-size: 25px; display: inline-block; max-width: 800px;"></p>
                    </div>
                    `;

                    const typingTextEl = document.getElementById("typing-text");

                    textTypingEffect(
                    typingTextEl,
                    "I'm a full-stack developer with expertise in the MERN stack — MongoDB, Express.js, React, and Node.js. I enjoy crafting scalable web applications and solving real-world problems through clean, efficient code.",
                    () => {
                        typingTextEl.innerHTML += `
                        <div style="margin-top: 20px; font-size: 22px; line-height: 1.6; text-align: left;">
                            <p>
                            🚀 Proficient in building responsive interfaces with React and RESTful APIs using Node.js & Express.<br>
                            🌐 Experienced in PHP and JSP, with additional knowledge in Java and C.<br>
                            🎯 Currently developing a video streaming platform while exploring MERN for SSR and better UX.<br>
                            🤝 Always open to collaborating on MERN stack projects and creative web solutions.
                            </p>
                        </div>
                        `;
                    }
                );
            } else if (detail === "skills") {
                contentToDisplay = `
                <div class="skills-container">
                    <div class="technical-container">
                        <p><strong>Technical</strong></p>
                        <p><strong>Languages:</strong> C, Java, JavaScript, Python</p>
                        <p><strong>Frontend:</strong> React.js, Next.js, TailwindCSS, Figma</p>
                        <p><strong>Backend:</strong> Node.js, Express.js, GraphQL</p>
                        <p><strong>Databases:</strong> MongoDB, MySQL, Firebase</p>
                    </div>
                    <div class="soft-skills-container">
                        <p><strong>Soft-skills</strong></p>
                        <p><strong>Problem-Solving:</strong> Debugging, Performance Optimization</p>
                        <p><strong>Collaboration:</strong> Teamwork, Technical Communication</p>
                        <p><strong>Adaptability:</strong> Quick Learning, Staying Updated</p>
                        <p><strong>Leadership:</strong> Team Management, Mentorship</p>
                    </div>
                </div>
                `;
            } else if (detail === "projects") {
                contentToDisplay = `
                <div class="projects" style="height: 95%; position: relative; padding: 20px; background: linear-gradient(to bottom, #333 0%, #222 100%); border-radius: 15px;">
                <!-- Road Track Frame -->
                <div style="width: 100%; height: 95%; border: 6px dashed #555; border-radius: 15px; background: #111; position: relative; overflow: hidden;">
                    <!-- Iframe Road Content -->
                    <iframe id="scrollFrame" width="98%" height="98%" style="margin: 1%; border: none; border-radius: 10px; background: #f5f5f5; overflow: auto;"
                        src="projects-content.html">
                    </iframe>
                </div>
            </div>

            <script>
                const interval = setInterval(() => {
                    const iframe = document.querySelector('#scrollFrame');
                    const car = document.querySelector('#carScroller');
                    if (iframe && iframe.contentWindow && iframe.contentDocument.readyState === 'complete') {
                        const iframeBody = iframe.contentDocument.body;

                        iframe.contentWindow.addEventListener('scroll', () => {
                            const scrollTop = iframe.contentWindow.scrollY;
                            const scrollHeight = iframeBody.scrollHeight - iframe.offsetHeight;
                            const percent = scrollTop / scrollHeight;

                            const trackHeight = iframe.offsetHeight - car.offsetHeight;
                            car.style.top = (percent * trackHeight) + 'px';
                        });

                        clearInterval(interval);
                    }
                }, 100);
            </script>

                `;
                
            } else if (detail === "contact") {
                informationEl.innerHTML = `
                <div class="contact-me">
                    <h1 class="contact">CONTACT ME</h1>
                    <p class="contact-p">----xxx----</p>
                    <p class="contact-p">I'LL BE GLAD TO ANSWER YOUR QUESTIONS!</p>
                    <form id="contact-form">
                        <input type="text" name="name" placeholder="Name" required>
                        <input type="email" name="from_email" placeholder="Email address" required>
                        <input type="text" name="subject" placeholder="Subject">
                        <textarea name="message" placeholder="Your message" required></textarea>
                        <button type="submit" class="send-message">Send Message</button>
                    </form>
                    <div class="contact-container">
                        <a href="https://github.com/AjayPeter582"><img src="../Images/Logo/github.png"></a>
                        <a href="https://www.linkedin.com/in/ajay-peter-r/"><img src="../Images/Logo/linkedin.png"></a>
                        <a href="#"><img src="../Images/Logo/gmail.png"></a>
                        <a href="https://www.instagram.com/_ajay_peter_005/"><img src="../Images/Logo/instagram.png"></a>
                        <a href=""><img src="../Images/Logo/github.png"></a>
                    </div>
                </div>
                `;
            }
            // Update content at the end of loop
            if (contentToDisplay) {
                informationEl.innerHTML = contentToDisplay;
            }
        }
    });
}

