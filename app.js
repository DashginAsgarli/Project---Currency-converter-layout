let pLeft = document.querySelectorAll(".left-unit p");
let pRight = document.querySelectorAll(".right-unit p");
let leftInput = document.querySelector(".left-input");
let rightInput = document.querySelector(".right-input");
let activeLeft = document.querySelector(".left-unit .color1");
let activeRight = document.querySelector(".right-unit .color2");
let leftBox = document.querySelector(".left-box");
let rightBox = document.querySelector(".right-box");
let allİnput = document.querySelectorAll("input");
let wifi = document.querySelector(".internet");

wifi.style.display = "none"

//Inputa yazilanlar duzgunluyun yoxlayiram nöqtə və reqemlerden başqa heçnə daxil etmək olmur  
allİnput.forEach(a => a.addEventListener("keyup", e => e.target.value = e.target.value.replace(/,/g, ".").replace(/(\..*)\.|[^0-9.]/g, "$1")));

// İnterneti yoxlamaq (chatdan kömək almişam)
function checkWifi() { 
    wifi.style.display = navigator.onLine ? "none" : "block"; 
    return navigator.onLine;
}
window.addEventListener("online", () => {wifi.style.display = "none"; convert()});
window.addEventListener("offline", () => wifi.style.display = "block");





// hansı inputa son yazılıb
let lastEdited = "left";


// ƏSAS FUNKSİYA
function convert() {
    if (!checkWifi()) return;

    let input, output, from, to;

    if (lastEdited === "left") {
        input = leftInput;
        output = rightInput;
        from = activeLeft.textContent;
        to = activeRight.textContent;
    } else {
        input = rightInput;
        output = leftInput;
        from = activeRight.textContent;
        to = activeLeft.textContent;
    }

    const amount = parseFloat(input.value);
    if (isNaN(amount)) {
        output.value = "";
        return;
    }

    // EYNİ VALYUTA
    if (from === to) {
        output.value = amount;
        leftBox.textContent = `1 ${from} = 1 ${to}`;
        rightBox.textContent = `1 ${to} = 1 ${from}`;
        return;
    }

    fetch(`https://api.exchangerate.host/convert?access_key=28adfddfba6b042b26e0fb0b93b55e61&from=${from}&to=${to}&amount=${amount}`)
        .then(res => res.json())
        .then(data => {
            if (!data.result) return;

            output.value = data.result.toFixed(4);

            const rate = data.result / amount;
            leftBox.textContent = `1 ${from} = ${rate.toFixed(6)} ${to}`;
            rightBox.textContent = `1 ${to} = ${(1 / rate).toFixed(6)} ${from}`;
        })

        .catch(() => {
            wifi.textContent = "API xətası!";
            wifi.style.display = "block";


        });
}

// INPUTLAR
leftInput.addEventListener("input", () => {
    lastEdited = "left";
    convert();
});

rightInput.addEventListener("input", () => {
    lastEdited = "right";
    convert();
});

// SOL VALYUTA SEÇİMİ
pLeft.forEach(p => {
    p.addEventListener("click", () => {
        activeLeft.classList.remove("color1");
        p.classList.add("color1");
        activeLeft = p;
        convert();
    });
});

// SAĞ VALYUTA SEÇİMİ
pRight.forEach(p => {
    p.addEventListener("click", () => {
        activeRight.classList.remove("color2");
        p.classList.add("color2");
        activeRight = p;
        convert();
    });
});

convert();

// // 130
