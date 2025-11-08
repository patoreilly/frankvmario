var Hud = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Hud ()
    {
        Phaser.Scene.call(this, { key: 'hud', active: false });
    },

    init: function (data)
    {
        
    },

    preload: function ()
    {
        
    },

    create: function ()
    {

        // reference to main scene
        this.main = this.scene.get('main');


        this.hudcomponent1 = this.add.image(0,180,'hud_com1').setOrigin(0);

        var config1 = {
            image: 'Kaiser Knuckle',
            width: 8,
            height: 8,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
            charsPerRow: 96,
            spacing: { x: 0, y: 0 },
            lineSpacing: 8,
            offset: {y:48}
        };

        var config2 = {
            image: 'Kaiser Knuckle',
            width: 8,
            height: 8,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
            charsPerRow: 96,
            spacing: { x: 0, y: 0 },
            lineSpacing: 8,
            offset: {y:24}
        };

        var config3 = {
            image: 'Kaiser Knuckle',
            width: 8,
            height: 8,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
            charsPerRow: 96,
            spacing: { x: 0, y: 0 },
            lineSpacing: 8,
            offset: {y:8}
        };

        var config4 = {
            image: 'Kaiser Knuckle',
            width: 8,
            height: 8,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
            charsPerRow: 96,
            spacing: { x: 0, y: 0 },
            lineSpacing: 8,
            offset: {y:32}
        };

        var config5 = {
            image: 'Kaiser Knuckle',
            width: 8,
            height: 8,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
            charsPerRow: 96,
            spacing: { x: 0, y: 0 },
            lineSpacing: 8,
            offset: {y:32}
        };

        

        this.cache.bitmapFont.add('kk_number1', Phaser.GameObjects.RetroFont.Parse(this, config1));
        this.cache.bitmapFont.add('kk_number2', Phaser.GameObjects.RetroFont.Parse(this, config2));
        this.cache.bitmapFont.add('kk_label', Phaser.GameObjects.RetroFont.Parse(this, config3));

        this.cache.bitmapFont.add('kk_stagenumber', Phaser.GameObjects.RetroFont.Parse(this, config4));
        this.cache.bitmapFont.add('kk_stagelabel', Phaser.GameObjects.RetroFont.Parse(this, config5));
        

        this.hud1Display = this.add.dynamicBitmapText(0, 0, 'kk_number1', 0).setOrigin(1,.5).setScale(1).setRightAlign().setPosition(160,200).setDepth(100);
        this.hud1DisplayLabel = this.add.dynamicBitmapText(0, 0, 'kk_label', 'label').setOrigin(0,.5).setScale(1).setLeftAlign().setPosition(162,200).setDepth(100);
        
        this.hud2Display = this.add.dynamicBitmapText(0, 0, 'kk_number2', 0).setOrigin(1,.5).setScale(1).setRightAlign().setPosition(50,200).setDepth(100);
        this.hud2DisplayLabel = this.add.dynamicBitmapText(0, 0, 'kk_label', 'label').setOrigin(0,.5).setScale(1).setLeftAlign().setPosition(52,200).setDepth(100);

        this.hud3Display = this.add.dynamicBitmapText(0, 0, 'kk_stagenumber', 0).setOrigin(1,.5).setScale(1).setRightAlign().setPosition(270,200).setDepth(100);
        this.hud3DisplayLabel = this.add.dynamicBitmapText(0, 0, 'kk_stagelabel', 'label').setOrigin(0,.5).setScale(1).setLeftAlign().setPosition(272,200).setDepth(100);

        
        

    },

    update: function()
    {
        // this.currentStage.text =  this.main.background_index+1;

        // this.currentPlacement.text = this.main.playerRacePlacement;

        // this.totalRaceTime.text =  this.main.totalRaceTime.toFixed(0);

        // this.totalRaceDistance.text =  this.main.playerTotalRaceDistance.toFixed(0);

        // this.speedDisplay.text =  Math.round(161*this.main.realSpeed);
    
        // this.lapDistance.text =  this.main.fDistance.toFixed(0);
    }

});


