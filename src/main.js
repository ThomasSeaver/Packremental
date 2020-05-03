var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        create: create,
        update: update
    }
};

var TitleBar;
var InventoryView;
var OrdersView;
var PackagingView;
var ShippingView;

var hiddenTime;

var game = new Phaser.Game(config);

this.game.events.on('hidden',function(){
    hiddenTime = new Date().getTime();
},this);

this.game.events.on('visible',function(){
    var returnTime = new Date().getTime();
    recover(returnTime - hiddenTime);
},this);


function create () {
    TitleBar      = new TitleBarComponent(0, 1, 0, 0.1, config.width, config.height, this);
    InventoryView = new InventoryComponent(0, 0.25, 0.1, 1, config.width, config.height, this);
    OrdersView    = new OrdersComponent(0.25, 0.5, 0.1, 1, config.width, config.height, this);
    PackagingView = new PackagingComponent(0.5, 0.75, 0.1, 1, config.width, config.height, this);
    ShippingView  = new ShippingComponent(0.75, 1, 0.1, 1, config.width, config.height, this);

    TitleBar.create();
    InventoryView.create();
    OrdersView.create();
    PackagingView.create();
    ShippingView.create();

    graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xFFFFFF } });
    graphics.strokeLineShape(new Phaser.Geom.Line(0, Math.round(config.height * 0.1), config.width, Math.round(config.height * 0.1)));
    graphics.strokeLineShape(new Phaser.Geom.Line(Math.round(config.width * 0.25), Math.round(config.height * 0.1), Math.round(config.width * 0.25), config.height));
    graphics.strokeLineShape(new Phaser.Geom.Line(Math.round(config.width * 0.5), Math.round(config.height * 0.1), Math.round(config.width * 0.5), config.height));
    graphics.strokeLineShape(new Phaser.Geom.Line(Math.round(config.width * 0.75), Math.round(config.height * 0.1), Math.round(config.width * 0.75), config.height));
    graphics.strokeLineShape(new Phaser.Geom.Line(0, Math.round(config.height * 0.4), config.width, Math.round(config.height * 0.4)));
    graphics.strokeLineShape(new Phaser.Geom.Line(0, Math.round(config.height * 0.785), config.width, Math.round(config.height * 0.785)));

    this.curStats = {
        InventoryCount: 0,
        OrdersCount: 0,
        PackagesCount: 0,
        ShippingCount: 0,
        Money: 4.80
    }
}

function update(time, delta) {
    // Pre-tick - take in updated values from inner workings of modules
    this.curStats = InventoryView.preTick(delta, this.curStats);
    this.curStats = OrdersView.preTick(delta, this.curStats);
    this.curStats = PackagingView.preTick(delta, this.curStats);
    this.curStats = ShippingView.preTick(delta, this.curStats);

    // Post-tick - take in state from main after other modules may have affected eachother's data
    InventoryView.postTick(this.curStats);
    OrdersView.postTick(this.curStats);
    PackagingView.postTick(this.curStats);
    ShippingView.postTick(this.curStats);
    // Single Way Updates
    TitleBar.update(delta, this.curStats);
}

function recover(delta) {
    TitleBar.recover(delta);
    InventoryView.recover(delta);
    OrdersView.recover(delta);
    PackagingView.recover(delta);
    ShippingView.recover(delta);
}