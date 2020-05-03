class InventoryComponent extends Component {

    constructor(xStart, xEnd, yStart, yEnd, width, height, context) {
        super(xStart, xEnd, yStart, yEnd, width, height, context)
    }

    create() {
        this.drawText("Inventory", 0.5, 0.07);
        this.InventoryText = this.drawText("Unbought Items in Inventory: 0", 0.5, 0.12);
        this.drawText("Price per Inventory Item: $2.00", 0.5, 0.17);
        this.InventoryCount = 0;
        this.entities = [new Entity(1, 0, 0, 1000), new Entity(2, 0, 0, 2000), new Entity(4, 0, 0, 3000), new Entity(8, 0, 0, 4000)]
        this.InventoryCost = 2;

        this.manualEffect = 1;
        this.manualEffects = 0;
        this.drawButton("Purchase Inventory", 0.5, 0.23).on('pointerdown', () => this.manualEffects += this.manualEffect);
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

        var actualDelta = Math.min(this.potentialDelta, Math.round(curStats.Money / this.InventoryCost));

        curStats.InventoryCount += actualDelta;
        curStats.Money          -= actualDelta * this.InventoryCost;
        return curStats;
    }

    postTick(curStats) {
        this.InventoryCount = curStats.InventoryCount;
        this.InventoryText.setText("Unbought Items in Inventory: " + Math.round(this.InventoryCount));
    }

    recover(delta) {
        
    }
}