// ================= Dark Mode Toggle =================
const toggleBtn = document.getElementById("darkToggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

// Toggle dark mode
toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

// ================= Nepali Currency Formatter =================
function nepaliCurrency(num) {
    if (num === null || num === undefined) return "";
    num = Math.round(num); // round to nearest integer
    let str = num.toString();
    if (str.length <= 3) return str;

    let lastThree = str.slice(-3);
    let remaining = str.slice(0, -3);
    let parts = [];

    while (remaining.length > 2) {
        parts.unshift(remaining.slice(-2));
        remaining = remaining.slice(0, -2);
    }
    if (remaining.length) parts.unshift(remaining);

    return parts.join(",") + "," + lastThree;
}

// ================= EMI Calculator =================
const emiForm = document.getElementById("emiForm");
if (emiForm) {
    emiForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const principal = parseFloat(document.getElementById("principal").value);
        const rate = parseFloat(document.getElementById("rate").value);
        const years = parseFloat(document.getElementById("years").value);

        if (principal <= 0 || rate <= 0 || rate > 100 || years <= 0) {
            alert("Please enter valid numeric values.");
            return;
        }

        const N = years * 12;
        const monthlyRate = rate / (12 * 100);
        const emi = Math.round(principal * monthlyRate * Math.pow(1 + monthlyRate, N) / (Math.pow(1 + monthlyRate, N) - 1));
        const totalPayment = Math.round(emi * N);
        const totalInterest = Math.round(totalPayment - principal);

        const emiResultBox = document.getElementById("emiResultBox");
        const emiResult = document.getElementById("emiResult");
        emiResultBox.style.display = "block";
        emiResult.innerHTML = `
            <p><strong>Loan Amount:</strong> Rs. ${nepaliCurrency(principal)}</p>
            <p><strong>Interest Rate:</strong> ${rate}%</p>
            <p><strong>Duration:</strong> ${years} years</p>
            <hr>
            <p><strong>Monthly EMI:</strong> Rs. ${nepaliCurrency(emi)}</p>
            <p><strong>Total Payment:</strong> Rs. ${nepaliCurrency(totalPayment)}</p>
            <p><strong>Total Interest:</strong> Rs. ${nepaliCurrency(totalInterest)}</p>
        `;
    });
}

// ================= Loan Calculator =================
const loanForm = document.getElementById("loanForm");
if (loanForm) {
    loanForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const principal = parseFloat(document.getElementById("loanPrincipal").value);
        const downPayment = parseFloat(document.getElementById("downPayment").value || 0);
        const rate = parseFloat(document.getElementById("loanRate").value);
        const years = parseFloat(document.getElementById("loanYears").value);

        if (principal <= 0 || rate <= 0 || rate > 100 || years <= 0 || downPayment < 0 || downPayment > principal) {
            alert("Please enter valid numeric values.");
            return;
        }

        const principalAfterDown = principal - downPayment;
        const N = years * 12;
        const monthlyRate = rate / (12 * 100);
        const emi = Math.round(principalAfterDown * monthlyRate * Math.pow(1 + monthlyRate, N) / (Math.pow(1 + monthlyRate, N) - 1));
        const totalPayment = Math.round(emi * N);
        const totalInterest = Math.round(totalPayment - principalAfterDown);

        const loanResultBox = document.getElementById("loanResultBox");
        const loanResult = document.getElementById("loanResult");
        loanResultBox.style.display = "block";
        loanResult.innerHTML = `
            <p><strong>Loan Amount:</strong> Rs. ${nepaliCurrency(principal)}</p>
            <p><strong>Down Payment:</strong> Rs. ${nepaliCurrency(downPayment)}</p>
            <p><strong>Amount After Down Payment:</strong> Rs. ${nepaliCurrency(principalAfterDown)}</p>
            <p><strong>Interest Rate:</strong> ${rate}%</p>
            <p><strong>Duration:</strong> ${years} years</p>
            <hr>
            <p><strong>Monthly EMI:</strong> Rs. ${nepaliCurrency(emi)}</p>
            <p><strong>Total Payment:</strong> Rs. ${nepaliCurrency(totalPayment)}</p>
            <p><strong>Total Interest:</strong> Rs. ${nepaliCurrency(totalInterest)}</p>
        `;
    });
}

// ================= Fuel Calculator =================
const fuelForm = document.getElementById("fuelForm");
if (fuelForm) {
    fuelForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const distance = parseFloat(document.getElementById("distance").value);
        const mileage = parseFloat(document.getElementById("mileage").value);
        const price = parseFloat(document.getElementById("price").value);

        if (distance <= 0 || mileage <= 0 || price < 0) {
            alert("Please enter valid numeric values.");
            return;
        }

        const total = Math.round((distance / mileage) * price);
        const fuelResultBox = document.getElementById("fuelResultBox");
        const fuelResult = document.getElementById("fuelResult");
        fuelResultBox.style.display = "block";
        fuelResult.innerHTML = `
            <p><strong>Distance:</strong> ${distance} km</p>
            <p><strong>Mileage:</strong> ${mileage} km/litre</p>
            <p><strong>Fuel Price:</strong> Rs. ${nepaliCurrency(price)}</p>
            <hr>
            <p><strong>Total Fuel Cost:</strong> Rs. ${nepaliCurrency(total)}</p>
        `;
    });
}