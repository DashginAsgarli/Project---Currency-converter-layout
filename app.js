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
allİnput.forEach(a =>
    a.addEventListener("input", e => {
        let val = e.target.value.replace(/,/g, ".").replace(/[^0-9.]/g, "");
        if (val.indexOf(".") !== -1) {
            let parts = val.split(".");
            parts[1] = parts[1].slice(0, 5);
            val = parts[0] + "." + parts[1];
        } e.target.value = val;
    }));
// İnterneti yoxlamaq (chatdan kömək almişam)
window.addEventListener("online", () => { wifi.style.display = "none"; change() });
window.addEventListener("offline", () => wifi.style.display = "block");

// esas hesablama funksiyasi
leftInput.value = 1;
let lr = "left";
function change() {
    if (lr === "left") {
        input = leftInput;
        output = rightInput;
        from = activeLeft.innerHTML;
        to = activeRight.innerHTML;
        amount = input.value;

    } else {
        input = rightInput;
        output = leftInput;
        from = activeRight.innerHTML;
        to = activeLeft.innerHTML;
        amount = input.value;
    }

    if (input.value == "") { output.value = "" }
    else if (from === to) {
        output.value = amount;
        leftBox.innerHTML = `1 ${from} = 1 ${to}`;
        rightBox.innerHTML = `1 ${to} = 1 ${from}`;
    }
    else {
        fetch(`https://api.exchangerate.host/convert?access_key=9edfbed82a74b6fc2d52f2509a0b465f&from=${from}&to=${to}&amount=${amount}`)
            .then(res => res.json())
            .then(data => {
                output.value = data.result.toFixed(5);
                leftBox.innerHTML = `1 ${from} = ${data.info.quote.toFixed(5)} ${to}`;
                rightBox.innerHTML = `1 ${to} = ${(1 / data.info.quote).toFixed(5)} ${from}`;
            })
    }
}
change();

// inputlarin daxil edilen reqemlere esasen cevirme edir 
leftInput.addEventListener("input", () => { lr = "left"; change(); });
rightInput.addEventListener("input", () => { lr = "right"; change(); });
// klike esasen
pLeft.forEach(p => {
    p.addEventListener("click", () => {
        activeLeft.classList.remove("color");
        p.classList.add("color");
        activeLeft = p;
        change();
    });
});
pRight.forEach(p => {
    p.addEventListener("click", () => {
        activeRight.classList.remove("color");
        p.classList.add("color");
        activeRight = p;
        change();
    });
});