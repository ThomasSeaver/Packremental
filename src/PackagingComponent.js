class PackagingComponent extends Component {

    constructor(xStart, xEnd, yStart, yEnd, width, height, context) {
        super(xStart, xEnd, yStart, yEnd, width, height, context)
    }

    create() {
        this.drawText("Packages", 0.5, 0.07);
        this.PackagesText = this.drawText("Unpackaged Orders: 0", 0.5, 0.12);
        this.PackagesCount = 0;
        
        this.manualEffects = 0;
        this.manualEffect = -1;
        this.drawButton("Prepare an Order \nfor Shipment", 0.5, 0.17).on('pointerdown', () => this.manualEffects += this.manualEffect);

    }

    preTick(delta, curStats) {
        var statChanges = {
            InventoryCount: 0,
            OrdersCount: 0,
            PackagesCount: 0,
            ShippingCount: 0,
            Money: 0
        }

        this.PackagesCount = curStats.PackagesCount + this.manualEffects;
        statChanges.PackagesCount = this.PackagesCount - curStats.PackagesCount;
        statChanges.ShippingCount = statChanges.PackagesCount * -1;

        this.manualEffects = 0;

        return statChanges;
    }

    postTick(delta, curStats) {
        this.PackagesCount = curStats.PackagesCount;
        this.PackagesText.setText("Unpackaged Orders: " + this.PackagesCount);
    }

    recover(delta) {
        
    }

}