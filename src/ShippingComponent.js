class ShippingComponent extends Component {

    constructor(xStart, xEnd, yStart, yEnd, width, height, context) {
        super(xStart, xEnd, yStart, yEnd, width, height, context)
    }

    create() {
        this.drawText("Shipping", 0.5, 0.07);
        this.ShippingText = this.drawText("Unshipped Packages: 0", 0.5, 0.12);
        this.drawText("Profit per Shipped Item: $5.00", 0.5, 0.17);
        this.ShippingCount = 0;
        this.entities = [new Entity(1, 0, 0, 1000), new Entity(2, 0, 0, 2000), new Entity(4, 0, 0, 3000), new Entity(8, 0, 0, 4000)]
        this.ShippedValue = 5.00;

        this.manualEffect = 1;
        this.manualEffects = 0;
        this.timerEffect = 0;
        this.drawButton("Ship a Package", 0.5, 0.23).on('pointerdown', () => this.manualEffects += this.manualEffect);
    }

    preTick(delta, curStats) {
        this.potentialDelta = this.manualEffects;
        this.manualEffects = 0;
        this.entities.forEach(entity => {
            if (entity.time >= entity.frequency) {
                entity.time = 0;
                this.potentialDelta += entity.rate * entity.count;
            } else {
                entity.time += delta
            }
        });

        var actualDelta = Math.min(this.potentialDelta, curStats.ShippingCount);

        curStats.ShippingCount -= actualDelta;
        curStats.Money += actualDelta * this.ShippedValue;

        return curStats;
    }

    postTick(curStats) {
        this.ShippingCount = curStats.ShippingCount;
        this.ShippingText.setText("Unshipped Packages: " + Math.round(this.ShippingCount));
    }

    recover (delta) {

    }

}