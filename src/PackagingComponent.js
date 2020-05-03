class PackagingComponent extends Component {

    constructor(xStart, xEnd, yStart, yEnd, width, height, context) {
        super(xStart, xEnd, yStart, yEnd, width, height, context)
    }

    create() {
        this.drawText("Packages", 0.5, 0.07);
        this.PackagesText = this.drawText("Unpackaged Orders: 0", 0.5, 0.12);
        this.MaterialCostText = this.drawText("Shipping Material Cost: $0.20", 0.5, 0.17);
        this.PackagingRateText = this.drawText("Orders packaged per second: 0", 0.5, 0.22);
        this.PackagingRate = 0;
        this.PackagesCount = 0;
        this.entities = [new Entity(20.00, 1, 0, 0, 1000), new Entity(50.00, 3, 0, 0, 2000), new Entity(150.00, 12, 0, 0, 3000), new Entity(400.00, 40, 0, 0, 4000)];
        this.upgradePurchases = [0,0,0];
        this.materialCost = 0.20;
        
        this.manualEffect = 1;
        this.manualEffects = 0;
        this.drawButton("Prepare an Order\n  for Shipment", 0.5, 0.27).on('pointerdown', () => this.manualEffects += this.manualEffect);

        // Automation Purchases
        this.drawText("Five Hour Energy\nPrice: $20.00\nExtra 1 pkg/sec", 0.05, 0.4, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.40).on('pointerdown', () => this.entities[0].queuedPurchases++);
        this.drawText("Community Service Teens\nPrice: $50.00\nExtra 3 pkg/sec", 0.05, 0.5, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.5).on('pointerdown', () => this.entities[1].queuedPurchases++);
        this.drawText("Folding Robot\nPrice: $150.00\nExtra 12 pkg/sec", 0.05, 0.6, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.6).on('pointerdown', () => this.entities[2].queuedPurchases++);
        this.drawText("Pre-packaged Inventory\nPrice: $400.00\nExtra 40 pkg/sec", 0.05, 0.7, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.7).on('pointerdown', () => this.entities[3].queuedPurchases++);

        // Upgrades
        this.drawText("Lower Material Price\nPrice: $50.00", 0.05, 0.81, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.81).on('pointerdown', () => this.upgradePurchases[0]++);
        this.drawText("Double Automatic Power\nPrice: $2000.00", 0.05, 0.95, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.95).on('pointerdown', () => this.upgradePurchases[2]++);
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

        var actualDelta = Math.min(Math.min(this.potentialDelta, curStats.PackagesCount), curStats.Money / this.materialCost);
        curStats.PackagesCount -= actualDelta;
        curStats.ShippingCount += actualDelta;
        curStats.Money         -= actualDelta * this.materialCost;

        // Handle queued upgrades
        this.entities.forEach(entity => {
            while (entity.queuedPurchases > 0 && curStats.Money >= entity.price) {
                entity.queuedPurchases--;
                entity.increment();
                this.PackagingRate += entity.rate;
                this.PackagingRateText.setText("Orders packaged per second: " + this.PackagingRate); 
                curStats.Money -= entity.price;
            } 
        });

        // Handle upgrades (Poorly)
        while (this.upgradePurchases[0] > 0) {
            this.upgradePurchases[0]--;
            if (curStats.Money > 50.00) {
                curStats.Money -= 50.00;
                this.materialCost = parseFloat((this.materialCost * 0.75).toFixed(2));
                this.MaterialCostText.setText("Shipping Material Cost: $" + this.materialCost);
            }
        }

        while (this.upgradePurchases[1] > 0) {
            this.upgradePurchases[1]--;
            if (curStats.Money > 750.00) {
                curStats.Money -= 750.00;
            }
        }

        while (this.upgradePurchases[2] > 0) {
            this.upgradePurchases[2]--;
            if (curStats.Money > 2000.00) {
                curStats.Money -= 2000.00;
                this.entities.forEach(entity => entity.rate *= 2);
                this.PackagingRate *= 2;
                this.PackagingRateText.setText("Orders packaged per second: " + this.PackagingRate); 
            }
        }

        return curStats;
    }

    postTick(curStats) {
        this.PackagesCount = curStats.PackagesCount;
        this.PackagesText.setText("Unpackaged Orders: " + Math.round(this.PackagesCount));
    }

    recover(delta) {
        
    }

}