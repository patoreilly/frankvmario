var Gameover = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Gameover ()
    {
        Phaser.Scene.call(this, { key: 'gameover', active: false });
    },

    init: function (data)
    {
        
    },

    preload: function ()
    {
        

    },

    create: function ()
    {
        // reference to raycer scene
        this.main = this.scene.get('main');
        
        var bgimg = this.add.image(0,0,'chunk3').setAlpha(.9).setOrigin(0).setDisplaySize(320,200).setDepth(0);

        this.access_menu = this.add.image(310,10,'a_menu').setAlpha(1).setInteractive();
        this.access_menu.on('pointerdown', function () { var menus = this.scene.get('menus'); menus.displayHideMenu(); } , this);

        var config1 = {
            image: 'Kaiser Knuckle',
            width: 8,
            height: 8,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
            charsPerRow: 96,
            spacing: { x: 0, y: 0 },
            lineSpacing: 8,
            offset: {y:16}
        };

        var config2 = {
            image: 'Kaiser Knuckle',
            width: 8,
            height: 8,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
            charsPerRow: 96,
            spacing: { x: 0, y: 0 },
            lineSpacing: 8,
            offset: {y:56}
        };

        var config3 = {
            image: 'Kaiser Knuckle',
            width: 8,
            height: 8,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
            charsPerRow: 96,
            spacing: { x: 0, y: 0 },
            lineSpacing: 8,
            offset: {y:32}
        };

        var config4 = {
            image: 'Kaiser Knuckle',
            width: 8,
            height: 8,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
            charsPerRow: 96,
            spacing: { x: 0, y: 0 },
            lineSpacing: 8,
            offset: {y:24}
        };

        var config5 = {
            image: 'Kaiser Knuckle',
            width: 8,
            height: 8,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
            charsPerRow: 96,
            spacing: { x: 0, y: 0 },
            lineSpacing: 8,
            offset: {y:48}
        };

        

        this.cache.bitmapFont.add('headtext', Phaser.GameObjects.RetroFont.Parse(this, config1));
        this.cache.bitmapFont.add('labeltext', Phaser.GameObjects.RetroFont.Parse(this, config2));
        this.cache.bitmapFont.add('timetext', Phaser.GameObjects.RetroFont.Parse(this, config3));
        this.cache.bitmapFont.add('placetext', Phaser.GameObjects.RetroFont.Parse(this, config4));
        this.cache.bitmapFont.add('raycertext', Phaser.GameObjects.RetroFont.Parse(this, config5));

        // var text3 = this.add.dynamicBitmapText(0, 0, 'subtext', "Game Design:").setOrigin(1,1).setScale(1).setRightAlign().setPosition(150,50).setDepth(100);
        // var text4 = this.add.dynamicBitmapText(0, 0, 'subtext', "Coding Credits:").setOrigin(1,1).setScale(1).setRightAlign().setPosition(150,100).setDepth(100);
        // var text5 = this.add.dynamicBitmapText(0, 0, 'subtext', "Art Credits:").setOrigin(1,1).setScale(1).setRightAlign().setPosition(150,150).setDepth(100);

        // var text6 = this.add.dynamicBitmapText(0, 0, 'foottext', "@pato_reilly").setOrigin(0,1).setScale(1).setLeftAlign().setPosition(170,50).setDepth(100);
        // var text7 = this.add.dynamicBitmapText(0, 0, 'foottext', "@javidx9 @phaser_").setOrigin(0,1).setScale(1).setLeftAlign().setPosition(170,100).setDepth(100);
        // var text8 = this.add.dynamicBitmapText(0, 0, 'foottext', "the great pixel\nartists of X").setOrigin(0,.5).setScale(1).setLeftAlign().setPosition(170,150).setDepth(100);

        this.add.dynamicBitmapText(0, 0, 'headtext', "Game Over").setOrigin(.5,.5).setScale(2).setCenterAlign().setPosition(160,30).setDepth(100);


        // var playerRacePlacement = this.raycer.race_finishers.findIndex( function getPlayerIndex(value,index,array) { return value.type == "player"});

        // for (var i=0; i<10; i++)
        // {
        //     var finishtime_formated = this.raycer.race_finishers[i].finishtime.toFixed(3);

        //     if (i==playerRacePlacement)
        //     {
        //         this.add.dynamicBitmapText(0, 0, 'raycertext', this.raycer.race_finishers[i].label).setOrigin(1,.5).setScale(1).setRightAlign().setPosition(150,50+(10*i)).setDepth(100);
        //         this.add.dynamicBitmapText(0, 0, 'raycertext', finishtime_formated).setOrigin(0,.5).setScale(1).setLeftAlign().setPosition(170,50+(10*i)).setDepth(100);
        //         this.add.dynamicBitmapText(0, 0, 'raycertext', i+1).setOrigin(.5,.5).setScale(1).setPosition(256,50+(10*i)).setDepth(100);
        //     }
        //     else
        //     {
        //         this.add.dynamicBitmapText(0, 0, 'labeltext', this.raycer.race_finishers[i].label).setOrigin(1,.5).setScale(1).setRightAlign().setPosition(150,50+(10*i)).setDepth(100);
        //         this.add.dynamicBitmapText(0, 0, 'timetext', finishtime_formated).setOrigin(0,.5).setScale(1).setLeftAlign().setPosition(170,50+(10*i)).setDepth(100);
        //         this.add.dynamicBitmapText(0, 0, 'placetext', i+1).setOrigin(.5,.5).setScale(1).setPosition(256,50+(10*i)).setDepth(100);
        //     }
            
        // }

        // if (playerRacePlacement>9)
        // {
        //     var finishtime_formated = this.raycer.race_finishers[playerRacePlacement].finishtime.toFixed(3);
            
        //     this.add.dynamicBitmapText(0, 0, 'raycertext', this.raycer.race_finishers[playerRacePlacement].label).setOrigin(1,.5).setScale(1).setRightAlign().setPosition(150,150).setDepth(100);
        //     this.add.dynamicBitmapText(0, 0, 'raycertext', finishtime_formated).setOrigin(0,.5).setScale(1).setLeftAlign().setPosition(170,150).setDepth(100);
        //     this.add.dynamicBitmapText(0, 0, 'raycertext', playerRacePlacement+1).setOrigin(.5,.5).setScale(1).setPosition(256,150).setDepth(100);
        // }


    },

    update: function()
    {


    }

});