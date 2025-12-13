let pLeft = document.querySelectorAll(".left-unit p");
let pRight = document.querySelectorAll(".right-unit p");
let leftInput = document.querySelector(".left-input");
let rightInput = document.querySelector(".right-input");
let activeLeft = document.querySelector(".left-unit .color");
let activeRight = document.querySelector(".right-unit .color");
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
window.addEventListener("online", () => { wifi.style.display = "none"; convert() });
window.addEventListener("offline", () => wifi.style.display = "block");

// esas hesablama funksiyasi
let lr = "left";
function convert() {
    if (lr === "left") {
        input = leftInput;
        output = rightInput;
        from = activeLeft.innerHTML;
        to = activeRight.innerHTML;
        amount = parseFloat(input.value);
    } else {
        input = rightInput;
        output = leftInput;
        from = activeRight.innerHTML;
        to = activeLeft.innerHTML;
        amount = parseFloat(input.value);
    }

    if (input.value == "") {
        output.value = "";
    }
    else if (from === to) {
        output.value = amount;
        leftBox.innerHTML = `1 ${from} = 1 ${to}`;
        rightBox.innerHTML = `1 ${to} = 1 ${from}`;
    }
    else {
        fetch(`https://api.exchangerate.host/convert?access_key=28adfddfba6b042b26e0fb0b93b55e61&from=${from}&to=${to}&amount=${amount}`)
            .then(res => res.json())
            .then(data => {
                output.value = data.result.toFixed(4);

                const rate = data.result / amount;
                leftBox.innerHTML = `1 ${from} = ${rate.toFixed(6)} ${to}`;
                rightBox.innerHTML = `1 ${to} = ${(1 / rate).toFixed(6)} ${from}`;
            })
    }
}

// inputlarin daxil edilen reqemlere esasen cevirme edir 
leftInput.addEventListener("keyup", () => { lr = "left"; convert(); });
rightInput.addEventListener("keyup", () => { lr = "right"; convert(); });

// SOL VALYUTA SEÇİMİ
pLeft.forEach(p => {
    p.addEventListener("click", () => {
        activeLeft.classList.remove("color");
        p.classList.add("color");
        activeLeft = p;
        convert();
    });
});

// SAĞ VALYUTA SEÇİMİ
pRight.forEach(p => {
    p.addEventListener("click", () => {
        activeRight.classList.remove("color");
        p.classList.add("color");
        activeRight = p;
        convert();
    });
});
convert();
// // 130