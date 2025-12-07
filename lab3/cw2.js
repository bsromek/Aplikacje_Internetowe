function generate() {
    const min = parseInt(document.getElementById("min").value);
    const max = parseInt(document.getElementById("max").value);
    const useUpper = document.getElementById("upper").checked;
    const useSpecial = document.getElementById("special").checked;
    if (isNaN(min) || isNaN(max) || min <= 0 || max < min)
    {
        alert("Niepoprawne wartości!");
        return;
    }
    const length = Math.floor(Math.random() * (max - min + 1)) + min;
    let chars = "abcdefghijklmnopqrstuvwxyz";
    if (useUpper)
        chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useSpecial)
        chars += "!@#$%^&*";
    let password = "";
    for (let i=0;i<length;i++) 
    {
        const index = Math.floor(Math.random() * chars.length);
        password += chars[index];
    }
    alert("Wygenerowane hasło:\n" + password);
}

const button_generate = document.getElementById('generate');
button_generate.addEventListener('click', generate);