class Entity {
    constructor (rate, count, time, frequency) {
        this.rate = rate;
        this.count = count;
        this.time = time;
        this.frequency = frequency;
    }

    increment() {
        this.count++;
    }
}