class Component {

    constructor(xStart, xEnd, yStart, yEnd, width, height, context) {
        this.xStart = Math.round(xStart * width);
        this.xEnd = Math.round(xEnd * width);
        this.yStart = Math.round(yStart * height);
        this.yEnd = Math.round(yEnd * height);
        this.context = context;
    }

    drawText(text, xPercent, yPercent) {
        var xPos = Math.round(this.xStart + (xPercent * (this.xEnd - this.xStart)));
        var yPos = Math.round(this.yStart + (yPercent * (this.yEnd - this.yStart)));
        return this.context.add.text(xPos, yPos, text).setOrigin(0.5, 0.5);
    }

    drawButtonText(text, xPercent, yPercent, style) {
        var xPos = Math.round(this.xStart + (xPercent * (this.xEnd - this.xStart)));
        var yPos = Math.round(this.yStart + (yPercent * (this.yEnd - this.yStart)));
        return this.context.add.text(xPos, yPos, text, style).setOrigin(0.5, 0.5);
    }

    drawButton(text, xPercent, yPercent, method) {
        var button = this.drawButtonText(text, xPercent, yPercent, { fill: '#0f0' });
        button.setInteractive();
        button.on('pointerover', () => button.setStyle({fill: '#ff0'}));
        button.on('pointerout',  () => button.setStyle({fill: '#0f0'}));
        button.on('pointerdown', () => button.setStyle({fill: '#ffa'}));
        button.on('pointerup',   () => button.setStyle({fill: '#ff0'}));
        return button;
    }

}