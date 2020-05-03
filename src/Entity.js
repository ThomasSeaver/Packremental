class Entity {
    constructor (price, rate, count, time, frequency) {
        this.price = price;
        this.rate = rate;
        this.count = count;
        this.time = time;
        this.frequency = frequency;
        this.queuedPurchases = 0;
    }

    increment() {
        this.count++;
    }
}