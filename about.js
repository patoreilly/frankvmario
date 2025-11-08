var About = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function About ()
    {
        Phaser.Scene.call(this, { key: 'about', active: false });
    },

    init: function (data)
    {
        
    },

    preload: function ()
    {
        

    },

    create: function ()
    {
        
        var bgimg = this.add.image(0,0,'chunk3').setAlpha(.9).setOrigin(0).setDisplaySize(320,200).setDepth(0);

        this.access_menu = this.add.image(310,10,'a_menu').setAlpha(1).setInteractive();
        this.access_menu.on('pointerdown', function () { var menus = this.scene.get('menus'); menus.displayHideMenu(); } , this);

        var nt_config1 = {
        image: 'Hat Trick Hero',
        width: 8,
        height: 8,
        chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
        charsPerRow: 96,
        spacing: { x: 0, y: 0 },
        offset: {y:0}
        };

        var nt_config2 = {
        image: 'Hat Trick Hero',
        width: 8,
        height: 8,
        chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
        charsPerRow: 96,
        spacing: { x: 0, y: 0 },
        offset: {y:0}
        };

        var nt_config3 = {
        image: 'Hat Trick Hero',
        width: 8,
        height: 8,
        chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
        charsPerRow: 96,
        spacing: { x: 0, y: 0 },
        offset: {y:64}
        };

        var nt_config4 = {
        image: 'Hat Trick Hero',
        width: 8,
        height: 8,
        chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
        charsPerRow: 96,
        spacing: { x: 0, y: 0 },
        offset: {y:56}
        };

        var nt_config5 = {
        image: 'Hat Trick Hero',
        width: 8,
        height: 8,
        chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
        charsPerRow: 96,
        spacing: { x: 0, y: 0 },
        offset: {y:8}
        };

        this.cache.bitmapFont.add('labeltext', Phaser.GameObjects.RetroFont.Parse(this, nt_config2));
        this.cache.bitmapFont.add('infotext', Phaser.GameObjects.RetroFont.Parse(this, nt_config3));

        this.cache.bitmapFont.add('labeltext2', Phaser.GameObjects.RetroFont.Parse(this, nt_config4));
        this.cache.bitmapFont.add('infotext2', Phaser.GameObjects.RetroFont.Parse(this, nt_config5));


        this.cache.bitmapFont.add('foottext', Phaser.GameObjects.RetroFont.Parse(this, nt_config1));
        

        var text3 = this.add.dynamicBitmapText(0, 0, 'labeltext', "Game Design:").setOrigin(1,1).setScale(1).setRightAlign().setPosition(156,40).setDepth(100);
        var text4 = this.add.dynamicBitmapText(0, 0, 'labeltext', "Coding Credits:").setOrigin(1,1).setScale(1).setRightAlign().setPosition(156,60).setDepth(100);
        var text5 = this.add.dynamicBitmapText(0, 0, 'labeltext', "Art Credits:").setOrigin(1,1).setScale(1).setRightAlign().setPosition(156,80).setDepth(100);

        var text6 = this.add.dynamicBitmapText(0, 0, 'infotext', "@pato_reilly").setOrigin(0,1).setScale(1).setLeftAlign().setPosition(164,40).setDepth(100);
        var text7 = this.add.dynamicBitmapText(0, 0, 'infotext', "@javidx9 @phaser_").setOrigin(0,1).setScale(1).setLeftAlign().setPosition(164,60).setDepth(100);
        var text8 = this.add.dynamicBitmapText(0, 0, 'infotext', "Epyx -Super Cycle-").setOrigin(0,1).setScale(1).setLeftAlign().setPosition(164,80).setDepth(100);



        var text9 = this.add.dynamicBitmapText(0, 0, 'labeltext2', "Menu show/hide:").setOrigin(1,1).setScale(1).setRightAlign().setPosition(156,120).setDepth(100);
        var text10 = this.add.dynamicBitmapText(0, 0, 'labeltext2', "Menu Select:").setOrigin(1,1).setScale(1).setRightAlign().setPosition(156,140).setDepth(100);
        var text11 = this.add.dynamicBitmapText(0, 0, 'labeltext2', "Music on/off:").setOrigin(1,1).setScale(1).setRightAlign().setPosition(156,160).setDepth(100);

        var text12 = this.add.dynamicBitmapText(0, 0, 'infotext2', "ESC, Gamepad L1").setOrigin(0,1).setScale(1).setLeftAlign().setPosition(164,120).setDepth(100);
        var text13 = this.add.dynamicBitmapText(0, 0, 'infotext2', "ENTER, Gamepad A").setOrigin(0,1).setScale(1).setLeftAlign().setPosition(164,140).setDepth(100);
        var text4 = this.add.dynamicBitmapText(0, 0, 'infotext2', "Gamepad X").setOrigin(0,1).setScale(1).setLeftAlign().setPosition(164,160).setDepth(100);



        var text15 = this.add.dynamicBitmapText(0, 0, 'foottext', "2024").setOrigin(.5,1).setScale(2).setCenterAlign().setPosition(160,190).setDepth(100);


    },

    update: function()
    {


    }

});