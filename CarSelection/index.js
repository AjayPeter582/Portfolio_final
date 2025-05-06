const carContainer = document.querySelector(".car-container");
const car = document.querySelector(".car");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");

let currentCar = 1; // Initial car

function changeCar(direction) {
    let newCarIndex = direction === "left" ? (currentCar - 1 < 1 ? 8 : currentCar - 1) : (currentCar + 1 > 8 ? 1 : currentCar + 1);
    
    // Directly change the image source without transition
    car.src = `../Images/Cars/car${newCarIndex}.png`;

    currentCar = newCarIndex;
}

// Event Listeners
leftArrow.addEventListener("click", () => changeCar("left"));
rightArrow.addEventListener("click", () => changeCar("right"));

car.addEventListener("click", () => {
    localStorage.setItem("selectedCar", currentCar);
    window.location.href = "/MainPage/index.html";
});
