const typingText = document.querySelector(".typing-text p"),
inpField = document.querySelector(".wrapper .input-field");

let charIndex = 0;

function randomWords(){
    for(let i = 0; i < 200; i++){
        let randIndex = Math.floor(Math.random() * words.length);
        words[randIndex].split("").forEach(span => {
            let spanTag = `<span>${span}</span>`;
            typingText.innerHTML += spanTag;
        });
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
    }
}

randomWords();
