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
    TitleBar = new TitleBarComponent(0, 1, 0, 0.1, config.width, config.height, this);
    TitleBar.create();

    InventoryView = new InventoryComponent(0, 0.25, 0.1, 1, config.width, config.height, this);
    InventoryView.create();

    OrdersView = new OrdersComponent(0.25, 0.5, 0.1, 1, config.width, config.height, this);
    OrdersView.create();

    PackagingView = new PackagingComponent(0.5, 0.75, 0.1, 1, config.width, config.height, this);
    PackagingView.create();

    ShippingView = new ShippingComponent(0.75, 1, 0.1, 1, config.width, config.height, this);
    ShippingView.create();

    graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xFFFFFF } });
    graphics.strokeLineShape(new Phaser.Geom.Line(0, Math.round(config.height * 0.1), config.width, Math.round(config.height * 0.1)));
    graphics.strokeLineShape(new Phaser.Geom.Line(Math.round(config.width * 0.25), Math.round(config.height * 0.1), Math.round(config.width * 0.25), config.height));
    graphics.strokeLineShape(new Phaser.Geom.Line(Math.round(config.width * 0.5), Math.round(config.height * 0.1), Math.round(config.width * 0.5), config.height));
    graphics.strokeLineShape(new Phaser.Geom.Line(Math.round(config.width * 0.75), Math.round(config.height * 0.1), Math.round(config.width * 0.75), config.height));

}

function update(time, delta) {
    TitleBar.update(delta);
}

function recover(deltaTime) {
    TitleBar.recover(deltaTime);
    InventoryView.recover(deltaTime);
    OrdersView.recover(deltaTime);
    PackagingView.recover(deltaTime);
    ShippingView.recover(deltaTime);
}