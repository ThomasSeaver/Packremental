class OrdersComponent extends Component {

    constructor(xStart, xEnd, yStart, yEnd, width, height, context) {
        super(xStart, xEnd, yStart, yEnd, width, height, context)
    }

    create() {
        this.drawText("Orders", 0.5, 0.07);
        this.OrdersText = this.drawText("Unprocessed Orders: 0", 0.5, 0.12);
        this.OrdersCount = 0;
        this.entities = [new Entity(1, 0, 0, 1000), new Entity(2, 0, 0, 2000), new Entity(4, 0, 0, 3000), new Entity(8, 0, 0, 4000)]
        this.marketEntity = new Entity(1, 1, 0, 1000);

        this.manualEffect = 1;
        this.manualEffects = 0;
        this.drawButton("Process An Order", 0.5, 0.23).on('pointerdown', () => this.manualEffects += this.manualEffect);
    }

    preTick(delta, curStats) {
        // Handle market transactions, i.e. Unpurchased Inventory => Unprocessed Orders
        if (this.marketEntity.time >= this.marketEntity.frequency) {
            this.marketEntity.time = 0;
            var marketShift = Math.min(this.marketEntity.count * this.marketEntity.rate, curStats.InventoryCount);
            curStats.InventoryCount -= marketShift;
            curStats.OrdersCount += marketShift;
        } else {
            this.marketEntity.time += delta;
        }

        // Consider total manual and automatic effects
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

        // Take max of limiting variable and possible change as actual change
        // potentialDelta is actually positive here, because we need to compare to possible orders
        var actualDelta = Math.min(this.potentialDelta, curStats.OrdersCount);
        curStats.OrdersCount   -= actualDelta;
        curStats.PackagesCount += actualDelta;

        return curStats;
    }

    postTick(curStats) {
        this.OrdersCount = curStats.OrdersCount;
        this.OrdersText.setText("Unprocessed Orders: " + Math.round(this.OrdersCount));
    }

    recover(delta) {
        
    }
}