class OrdersComponent extends Component {

    constructor(xStart, xEnd, yStart, yEnd, width, height, context) {
        super(xStart, xEnd, yStart, yEnd, width, height, context)
    }

    create() {
        this.drawText("Orders", 0.5, 0.07);
        this.OrdersText = this.drawText("Unprocessed Orders: 0", 0.5, 0.12);
        this.OrdersMadeText = this.drawText("Orders made per second: 1", 0.5, 0.17);
        this.OrdersRateText = this.drawText("Orders processed per second: 0", 0.5, 0.22);
        this.OrdersCount = 0;
        this.OrdersRate = 0;
        this.entities = [new Entity(20.00, 1, 0, 0, 1000), new Entity(50.00, 3, 0, 0, 2000), new Entity(150.00, 12, 0, 0, 3000), new Entity(400.00, 40, 0, 0, 4000)];
        this.upgradePurchases = [0,0,0];
        this.marketEntity = new Entity(40.00, 1, 1, 0, 1000);

        this.manualEffect = 1;
        this.manualEffects = 0;
        this.drawButton("Process An Order", 0.5, 0.27).on('pointerdown', () => this.manualEffects += this.manualEffect);

        // Automation Purchases
        this.drawText("Minimum Wage Worker\nPrice: $20.00\nExtra 1 order/sec", 0.05, 0.4, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.40).on('pointerdown', () => this.entities[0].queuedPurchases++);
        this.drawText("Logistics Contract\nPrice: $50.00\nExtra 3 order/sec", 0.05, 0.5, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.5).on('pointerdown', () => this.entities[1].queuedPurchases++);
        this.drawText("Logistics Software\nPrice: $150.00\nExtra 12 order/sec", 0.05, 0.6, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.6).on('pointerdown', () => this.entities[2].queuedPurchases++);
        this.drawText("Automated Shopfront\nPrice: $400.00\nExtra 40 order/sec", 0.05, 0.7, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.7).on('pointerdown', () => this.entities[3].queuedPurchases++);

        // Upgrades
        this.drawText("Double Order Rate\nPrice: $50.00", 0.05, 0.81, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.81).on('pointerdown', () => this.upgradePurchases[0]++);
        this.drawText("Double Automatic Power\nPrice: $2000.00", 0.05, 0.95, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.95).on('pointerdown', () => this.upgradePurchases[2]++);
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

        // Handle queued upgrades
        this.entities.forEach(entity => {
            while (entity.queuedPurchases > 0 && curStats.Money >= entity.price) {
                entity.queuedPurchases--;
                entity.increment();
                this.OrdersRate += entity.rate;
                this.OrdersRateText.setText("Orders processed per second: " + this.OrdersRate); 
                curStats.Money -= entity.price;
            } 
        });

        // Handle upgrades (Poorly)
        while (this.upgradePurchases[0] > 0) {
            this.upgradePurchases[0]--;
            if (curStats.Money > 50.00) {
                curStats.Money -= 50.00;
                this.marketEntity.rate *= 2;
                this.OrdersMadeText.setText("Orders made per second: " + this.marketEntity.rate); 
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
                this.OrdersRate *= 2;
                this.OrdersRateText.setText("Orders processed per second: " + this.OrdersRate); 
            }
        }

        return curStats;
    }

    postTick(curStats) {
        this.OrdersCount = curStats.OrdersCount;
        this.OrdersText.setText("Unprocessed Orders: " + Math.round(this.OrdersCount));
    }

    recover(delta) {
        
    }
}