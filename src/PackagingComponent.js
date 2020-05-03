class PackagingComponent extends Component {

    constructor(xStart, xEnd, yStart, yEnd, width, height, context) {
        super(xStart, xEnd, yStart, yEnd, width, height, context)
    }

    create() {
        this.drawText("Packages", 0.5, 0.07);
        this.PackagesText = this.drawText("Unpackaged Orders: 0", 0.5, 0.12);
        this.PackagesCount = 0;
        this.entities = [new Entity(1, 0, 0, 1000), new Entity(2, 0, 0, 2000), new Entity(4, 0, 0, 3000), new Entity(8, 0, 0, 4000)]
        
        this.manualEffect = 1;
        this.manualEffects = 0;
        this.drawButton("Prepare an Order\n  for Shipment", 0.5, 0.23).on('pointerdown', () => this.manualEffects += this.manualEffect);

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

        var actualDelta = Math.min(this.potentialDelta, curStats.PackagesCount);
        curStats.PackagesCount -= actualDelta;
        curStats.ShippingCount += actualDelta;

        return curStats;
    }

    postTick(curStats) {
        this.PackagesCount = curStats.PackagesCount;
        this.PackagesText.setText("Unpackaged Orders: " + Math.round(this.PackagesCount));
    }

    recover(delta) {
        
    }

}