class InventoryComponent extends Component {

    constructor(xStart, xEnd, yStart, yEnd, width, height, context) {
        super(xStart, xEnd, yStart, yEnd, width, height, context)
    }

    create() {
        this.drawText("Inventory", 0.5, 0.07);
        this.InventoryText = this.drawText("Unbought Items in Inventory: 0", 0.5, 0.12);
        this.InventoryCount = 0;

        this.manualAdd = 1;
        this.drawButton("Purchase Inventory", 0.5, 0.17).on('pointerdown', () => this.InventoryCount += this.manualAdd);
    }

    preTick(delta, curStats) {
        var statChanges = {
            InventoryCount: 0,
            OrdersCount: 0,
            PackagesCount: 0,
            ShippingCount: 0,
            Money: 0
        }
        statChanges.InventoryCount = this.InventoryCount - curStats.InventoryCount
        this.InventoryText.setText("Items in Inventory: " + this.InventoryCount);
        return statChanges;
    }

    postTick(delta, curStats) {
        this.InventoryCount = curStats.InventoryCount;
    }

    recover(delta) {
        
    }
}