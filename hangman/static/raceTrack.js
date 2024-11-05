class RaceTrack {
    constructor() {
        this.track = document.getElementById('raceTrack');
        this.cars = Array.from(document.getElementsByClassName('car'));
        this.positions = this.cars.map(() => 0);
        this.flag = document.getElementById('finishFlag');
        this.updateTrackSize();
        this.animationFrames = {};
        this.initializeCarPositions();
    }

    updateTrackSize() {
        this.trackWidth = this.track.offsetWidth;
        this.trackHeight = this.track.offsetHeight;
        this.carWidth = this.cars[0].offsetWidth;
        this.carHeight = this.cars[0].offsetHeight;
        this.flagWidth = this.flag.offsetWidth;
        this.finishLine = this.trackWidth - this.carWidth - this.flagWidth - 10;
    }

    initializeCarPositions() {
        const laneHeight = this.trackHeight / 5; // 5 lanes
        this.cars.forEach((car, index) => {
            const laneCenter = (index + 0.5) * laneHeight;
            car.style.top = `${laneCenter - (this.carHeight / 2)}px`;
        });
    }

    updateCarPositions(playerScores, currentPlayerIndex) {
        // Only move the current player's car if they made a correct guess
        if (playerScores[currentPlayerIndex] > 0) {
            const remainingDistance = this.finishLine - this.positions[currentPlayerIndex];
            const newPosition = this.positions[currentPlayerIndex] + remainingDistance * 0.25;

            // Ensure the car doesn't go past the finish line
            const targetPosition = Math.min(newPosition, this.finishLine);

            // Animate the current player's car
            this.animateCar(currentPlayerIndex, targetPosition);
        }
    }

    animateCar(index, targetPosition) {
        // Cancel any ongoing animation for this car
        if (this.animationFrames[index]) {
            cancelAnimationFrame(this.animationFrames[index]);
        }

        const car = this.cars[index];
        const startPosition = this.positions[index];
        const distance = targetPosition - startPosition;
        const duration = 1000; // Animation duration in milliseconds
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easedProgress = this.easeOutCubic(progress);

            const currentPosition = startPosition + distance * easedProgress;
            this.positions[index] = currentPosition;
            car.style.left = `${currentPosition}px`;

            if (progress < 1) {
                this.animationFrames[index] = requestAnimationFrame(animate);
            } else {
                delete this.animationFrames[index];
            }
        };

        this.animationFrames[index] = requestAnimationFrame(animate);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
}

let raceTrack;

window.addEventListener('load', () => {
    raceTrack = new RaceTrack();
});

window.addEventListener('resize', () => {
    raceTrack.updateTrackSize();
    raceTrack.initializeCarPositions(); // Re-initialize car positions on resize
    raceTrack.cars.forEach((car, index) => {
        car.style.transition = 'none'; // Disable transition for immediate repositioning
        car.style.left = `${raceTrack.positions[index]}px`;
    });
    // Force reflow
    void raceTrack.track.offsetWidth;
    raceTrack.cars.forEach(car => car.style.transition = ''); // Re-enable transitions
});

// This function will be called from hangman.js
window.updateCarPositions = function(scores, currentPlayerIndex) {
    if (raceTrack) {
        raceTrack.updateCarPositions(scores, currentPlayerIndex);
    }
};