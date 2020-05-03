class OrdersComponent extends Component {

    constructor(xStart, xEnd, yStart, yEnd, width, height, context) {
        super(xStart, xEnd, yStart, yEnd, width, height, context)
    }

    create() {
        this.drawText("Orders", 0.5, 0.07);
        this.OrdersText = this.drawText("Unprocessed Orders: 0", 0.5, 0.12);
        this.OrdersCount = 0;

        this.manualEffect = -1;
        this.timerEffect = 1;
        this.drawButton("Process An Order", 0.5, 0.17).on('pointerdown', () => this.OrdersCount += this.manualEffect);

        this.sinceLastUpdate = 0;
    }

    preTick(delta, curStats) {
        var statChanges = {
            InventoryCount: 0,
            OrdersCount: 0,
            PackagesCount: 0,
            ShippingCount: 0,
            Money: 0
        }
        // Either zero or a negative change, as the only effect should be processing orders
        statChanges.OrdersCount = this.OrdersCount - curStats.OrdersCount;
        // We want to invert this number, and add it to our unpackaged orders count
        statChanges.PackagesCount = statChanges.OrdersCount * -1;
        if (this.sinceLastUpdate >= 1000) {
            this.sinceLastUpdate = 0;
            if (curStats.InventoryCount > 0) {
                statChanges.InventoryCount -= this.timerEffect;
                statChanges.OrdersCount += this.timerEffect;
                this.OrdersCount += this.timerEffect;
            }
        } else {
            this.sinceLastUpdate += delta;
        }
        this.OrdersText.setText("Unprocessed Orders: " + this.OrdersCount);
        return statChanges;
    }

    postTick(delta, curStats) {
        this.OrdersCount = curStats.OrdersCount;
    }

    recover(delta) {
        
    }
}