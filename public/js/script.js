const typingText = document.querySelector(".typing-text p"),
inpField = document.querySelector(".wrapper .input-field"),
timeTag = document.querySelector(".time span b"),
mistakeTag = document.querySelector(".mistake span"),
wpmTag = document.querySelector(".wpm span"),
cpmTag = document.querySelector(".cpm span"),
tryAgainBtn = document.querySelector(".restart"),
languageTag = document.querySelector(".language-select select"),
open = document.getElementById("open"),
modal_container = document.getElementById("modal_container"),
interact = document.getElementById("interact"),
close = document.getElementById('close');


let paragraph = ''

let timer,
maxTime = 60,
timeLeft = maxTime,
charIndex = mistakes = isTyping = 0;

async function getParagraph() {
    paragraph = ''
    for(let i = 0; i < 200; i++){
        let randIndex = Math.floor(Math.random() * words.length);
        paragraph += words[randIndex]
    }
    if(languageTag.value != 'en'){
        changeLang()
    } 
    renderParagraph();
};

async function renderParagraph(){
    paragraph.toLowerCase()
    typingText.innerHTML = "";
    paragraph.split("").forEach(span => {
        let spanTag = `<span>${span}</span>`;
        typingText.innerHTML += spanTag;
    });
    typingText.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
}


function initTyping() {
    const characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex]; 

    if (charIndex < characters.length - 1 && timeLeft > 0) {
        if(!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        
        if (typedChar == null) {
            charIndex--;
            if(characters[charIndex].classList.contains("incorrect")){
                mistakes--;
            }
            characters[charIndex].classList.remove("correct", "incorrect");
        } else{
            if (characters[charIndex].innerText === typedChar) {
                characters[charIndex].classList.add("correct")
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect")
            }
            charIndex++;
        }
        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");
    
        let wpm = Math.round((((charIndex - mistakes) / 5) / (maxTime - timeLeft)) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
        cpmTag.innerText = charIndex - mistakes;
    } else {
        inpField.value = "";
        clearInterval(timer)
    }
    
}

function initTimer(){
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
    } else { 
        clearInterval(timer);
    }
}

function resetGame() {
    getParagraph();
    inpField.value = "";
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    timeTag.innerText = timeLeft;
    mistakeTag.innerText = mistakes;
    wpmTag.innerText = 0;
    cpmTag.innerText = 0;
}

async function changeLang() {
    const lang = languageTag.value;
    const text = paragraph
    const URL = 'http://localhost:8080/translate'
    const obj = {'trgt': lang, 'text': text}
    const params = {
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
        method:"POST",
    }

    fetch(URL, params)
        .then(response => response.json())
        .then(data => {
            paragraph = data.text
            renderParagraph();
            inpField.value = "";
            clearInterval(timer);
            timeLeft = maxTime;
            charIndex = mistakes = isTyping = 0;
            timeTag.innerText = timeLeft;
            mistakeTag.innerText = mistakes;
            wpmTag.innerText = 0;
            cpmTag.innerText = 0;
        })

}

getParagraph();
console.log(paragraph)
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);

open.addEventListener('click', () => {
    modal_container.classList.add('show');
});
close.addEventListener('click', () => {
    modal_container.classList.remove('show');
});