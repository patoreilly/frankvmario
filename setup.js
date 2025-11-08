var Setup = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Setup ()
    {
        Phaser.Scene.call(this, { key: 'setup', active: true});
    },
    init: function (data)
    {
        
    },

    preload: function ()
    {
        // load audio assets

        this.load.audioSprite('sfx', 'audio/horizon6_sounds.json', [
        'audio/horizon6_sounds.ogg',
        'audio/horizon6_sounds.mp3'
        ]);

        this.load.audio('theme', [
        'audio/tdujam_000.ogg',
        'audio/tdujam_000.mp3'
        ]);
        
        // load gui assets

        this.load.image('title', 'gui/frank_vs_mario.png');

        this.load.image('Hat Trick Hero', 'gui/Hat Trick Hero 95 (modified).png');

        this.load.image('Kaiser Knuckle', 'gui/Kaiser Knuckle (Taito).png');

        this.load.image('Afterburner', 'gui/Afterburner (Sega).png');

        this.load.image('Nintendo', 'gui/Super Mario Bros 3 (Nintendo).png');

        this.load.image('mousekeys_icon', 'gui/mousekeys_icon.png');
        this.load.image('touch_icon', 'gui/touch_icon.png');
        this.load.image('gamepad_icon', 'gui/gamepad_icon.png');

        this.load.image('hud_com1', 'gui/hud_com1.png');  
        


        // load game assets

        for (var i = 0; i < backgroundList.length; i++)
        {
            this.load.image(backgroundList[i], 'sprites/backgrounds/'+backgroundList[i]);
            allImageKeys.push(backgroundList[i]);
        }

        for (var j = 0; j < wallList.length; j++)
        {
            this.load.image(wallList[j], 'sprites/walls/'+wallList[j]);
            allImageKeys.push(wallList[j]);
        }

        for (var k = 0; k < floorList.length; k++)
        {
            this.load.image(floorList[k], 'sprites/floors/'+floorList[k]);
            allImageKeys.push(floorList[k]);
        }

        for (var h = 0; h < objectList.length; h++)
        {
            this.load.image(objectList[h], 'sprites/objects/'+objectList[h]);
            allImageKeys.push(objectList[h]);
        }


        for (var r = 1; r < 9; r++)
        {

            this.load.image('run_anim_'+r+'.png', 'sprites/runner/run_anim_'+r+'.png');
            
        }

        for (var m = 1; m < 23; m++)
        {

            this.load.image('mariocart'+m+'.png', 'sprites/mariocart/mariocart'+m+'.png');
            
        }

        for (var i = 1; i < 23; i++)
        {

            this.load.image('frankcart'+i+'.png', 'sprites/frankcart/frankcart'+i+'.png');
            
        }
        
        for (var p = 1; p < 23; p++)
        {

            this.load.image('ralphcart'+p+'.png', 'sprites/ralphcart/ralphcart'+p+'.png');
            
        }

        for (var m = 1; m < 23; m++)
        {

            this.load.image('toadcart'+m+'.png', 'sprites/toadcart/toadcart'+m+'.png');
            
        }

        for (var p = 1; p < 23; p++)
        {

            this.load.image('pippincart'+p+'.png', 'sprites/pippincart/pippincart'+p+'.png');
            
        }

        


        


        
        

        


        //////////////////
        
        loadfile_index = 0;

        var progress = this.add.graphics().setDepth(99);

        var text = this.add.text(10, 50, '(debug text)', { font: '10px Courier', fill: '#ffffff' }).setDepth(99);
        var text2 = this.add.text(10, 72, '(debug text)', { font: '10px Courier', fill: '#ffffff' }).setDepth(99);
        

        this.load.on('progress', function (value) {
            text.setText('loading...'+Math.floor(100*value)+'%');
            progress.clear();
            progress.fillStyle(0x33ff04, 1);
            progress.fillRect(0, 40, 320 * value, 10);
        });
        
        this.load.on('fileprogress', function (file,value) {
            //text.setText(Math.floor(100*value)+'%');          
            text2.setText(file.key);            
            // text3.setText(value);
            // progress.clear();
            // progress.fillStyle(0x00cc11, 1);
            // progress.fillRect(0, 0, 320 * value, 5);            
        });

        this.load.on('filecomplete', this.showFile, this);

        this.load.on('complete', function () {

            progress.destroy();            
            text.destroy();
            text2.destroy();
            for (var e=0; e<file_thumbs.length; e++)
            {
                file_thumbs[e].destroy();
            }
            

        });

    },


    showFile: function (key, type, texture)
    {
        file_thumbs[loadfile_index] = this.add.image(10+20*(loadfile_index%16), 100+20*(Math.floor(loadfile_index/16)), key).setDisplaySize(20, 20);
        

        
        loadfile_index++;

        // if (key=='load_scrn_bkgd')
        // {
        //     this.add.image(0, 0, key).setOrigin(0).setDisplaySize(320, 200);
        // }

        if (key=='Nintendo')
        {
            var nt_config1 = {
            image: 'Nintendo',
            width: 8,
            height: 8,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
            charsPerRow: 96,
            spacing: { x: 0, y: 0 },
            offset: {y:0}
            };

            var nt_config2 = {
            image: 'Nintendo',
            width: 8,
            height: 8,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
            charsPerRow: 96,
            spacing: { x: 0, y: 0 },
            offset: {y:8}
            };

            this.cache.bitmapFont.add('headtext', Phaser.GameObjects.RetroFont.Parse(this, nt_config1));
            this.cache.bitmapFont.add('foottext', Phaser.GameObjects.RetroFont.Parse(this, nt_config2));

            hsv = Phaser.Display.Color.HSVColorWheel();

            var text0 = this.add.dynamicBitmapText(0, 0, 'headtext', 'DragonFLY').setOrigin(0).setScale(1).setPosition(4,4).setDepth(200);
            var text1 = this.add.dynamicBitmapText(0, 0, 'headtext', '          v 0.4').setOrigin(0).setScale(1).setPosition(4,4).setDepth(200);
            var text2 = this.add.dynamicBitmapText(0, 0, 'headtext', 'presents...').setOrigin(0).setScale(1).setPosition(4,14).setDepth(200);

            text0.setDisplayCallback(this.textCallback);
        } 
    },

    textCallback: function (data) 
    {


        data.tint.topLeft = hsv[Math.floor(i)].color;
        

        i += 0.5;

        if (i >= hsv.length)
        {
            i = 0;
        }
        // data.parent.alpha -= .0005;
        // if (data.parent.alpha<.5) data.parent.alpha=1.0;
        //console.log(data);
        

        return data;
    },
    
    
    create: function ()
    {

        //create gui textures for use in all scenes
        this.textures.generate('chunk3', { data: ['D'], pixelWidth: 1});
        this.textures.generate('a_menu', { data: accessMenuData, pixelWidth: 1});

        /// debug global
        debug = this.add.text(160, 100, '', { font: '10px Arial', fill: '#00ff00' });

        // access to functions belonging to other scenes in Phaser: this.scene.get
        // use worker variable to hold the scene object accessed thru scene key
        // i.e.

        //var demo = this.scene.get('demo');

        // where the worker and the key are the same name
        // thus, 'this.myfunction()' becomes 'scenekey.myfunction()'




        startFlag=false;

        // pre-load animations used in other scenes


        // this.anims.create({
        //         key: 'fireball_animation',
        //         frames: this.anims.generateFrameNumbers('explosion'),
        //         frameRate: 20,
        //         repeat: 0
        //         //yoyo: true
        //     });
        

        
        //this.textures.generate('chunk3', { data: ['3'], pixelWidth: 1});
        //bgimg = this.add.image(0,0,'chunk3').setAlpha(.25).setOrigin(0).setDisplaySize(320,200).setDepth(0);


        //  animated sprite set up for 2d display purpose 
            //  must be loaded as .spritesheet with frame params and added as .sprite
            // var randomKey3 = Math.random().toString();

            // this.anims.create({
            //     key: randomKey3,
            //     frames: this.anims.generateFrameNumbers('flybug'),
            //     frameRate: 60,
            //     repeat: -1
            //     //yoyo: true
            // });

        
        var title = this.add.image(10, 50, 'title').setOrigin(0).setScale(1);

        // this.tweens.add({
        //     targets: racertitle,
        //     alpha: .6,
        //     ease: 'Sine.easeInOut',
        //     duration: 600,
        //     yoyo: true,
        //     repeat: -1
        // });

        var config1 = {
            image: 'Afterburner',
            width: 8,
            height: 8,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
            charsPerRow: 96,
            spacing: { x: 0, y: 0 },
            lineSpacing: 8,
            offset: {y:24}
        };

        this.cache.bitmapFont.add('Afterburner1', Phaser.GameObjects.RetroFont.Parse(this, config1));


        var text1 = this.add.dynamicBitmapText(0, 0, 'headtext', " keyboard mouse \n ").setOrigin(0.5,1).setScale(1).setCenterAlign().setPosition(240,60).setDepth(100);
        var text2 = this.add.dynamicBitmapText(0, 0, 'headtext', " touchscreen \n ").setOrigin(0.5,1).setScale(1).setCenterAlign().setPosition(240,110).setDepth(100);
        var text3 = this.add.dynamicBitmapText(0, 0, 'headtext', " gamepad \n ").setOrigin(0.5,1).setScale(1).setCenterAlign().setPosition(240,160).setDepth(100);
                
        var hitarea1 = this.add.rectangle(text1.x, text1.y, text1.width + 20, text1.height + 20, 0x00ff00, 0.45).setInteractive().setAlpha(.5);
        var hitarea2 = this.add.rectangle(text2.x, text2.y, text2.width + 20, text2.height + 20, 0xff00ff, 0.45).setInteractive().setAlpha(.5);
        var hitarea3 = this.add.rectangle(text3.x, text3.y, text3.width + 20, text3.height + 20, 0x00ffff, 0.45).setInteractive().setAlpha(.5);

        this.add.sprite(240, 60, 'mousekeys_icon').setOrigin(.5,0).setScale(2);   
        this.add.sprite(240, 110, 'touch_icon').setOrigin(.5,0).setScale(2);   
        this.add.sprite(240, 160, 'gamepad_icon').setOrigin(.5,0).setScale(2);  

        hitarea1.on('pointerover', function () { hitarea1.setAlpha(1); }, this);
        hitarea1.on('pointerout', function () { hitarea1.setAlpha(.5); }, this);

        hitarea1.on('pointerup', function () {
             
            sound_enabled = true;

            //this.scale.startFullscreen();

            //screen.orientation.lock('landscape');
            
            touchActivated = false;

            
            music = this.sound.add('theme');
            music.play({loop: true});

            this.add.dynamicBitmapText(0, 0, 'Afterburner1', 'getting ready..').setOrigin(0.5).setScale(2).setCenterAlign().setPosition(160,100).setDepth(100);
            startFlag=true;//this.scene.start('demo');
            

        }, this);

        hitarea2.on('pointerover', function () { hitarea2.setAlpha(1); }, this);
        hitarea2.on('pointerout', function () { hitarea2.setAlpha(.5); }, this);

        hitarea2.on('pointerup', function () {

            sound_enabled = true;

            this.scale.startFullscreen();

            screen.orientation.lock('landscape');
            
            touchActivated = true;
            fullscreen_enabled = true;

            music = this.sound.add('theme');
            music.play({loop: true});

            this.add.dynamicBitmapText(0, 0, 'Afterburner1', 'getting ready..').setOrigin(0.5).setScale(2).setCenterAlign().setPosition(160,100).setDepth(100);
            startFlag=true;//this.scene.start('demo');
            

        }, this);

        hitarea3.on('pointerover', function () { hitarea3.setAlpha(1); }, this);
        hitarea3.on('pointerout', function () { hitarea3.setAlpha(.5); }, this);

        hitarea3.on('pointerup', function () {

            sound_enabled = true;

            //this.scale.startFullscreen();

            //screen.orientation.lock('landscape');
            
            touchActivated = false;

            music = this.sound.add('theme');
            music.play({loop: true});

            this.add.dynamicBitmapText(0, 0, 'Afterburner1', 'getting ready..').setOrigin(0.5).setScale(2).setCenterAlign().setPosition(160,100).setDepth(100);
            startFlag=true;//this.scene.start('demo');
            

        }, this);

        
        this.input.gamepad.once('down', function (pad, button, index) {

        //text_gamepad.setText('Playing with ' + pad.id + ' index: ' + pad.index);

        pad.setAxisThreshold(0.3);

        gamepad = pad;

        sound_enabled = true;

        //this.scale.startFullscreen();

        touchActivated = false;


        music = this.sound.add('theme');
        music.play({loop: true});

        

        this.add.dynamicBitmapText(0, 0, 'Afterburner1', 'getting ready..').setOrigin(0.5).setScale(2).setCenterAlign().setPosition(160,100).setDepth(100);
        startFlag=true;//this.scene.start('demo');

        }, this);


        
        text5 = this.add.dynamicBitmapText(0, 0, 'foottext', 'no gamepad detected').setOrigin(0).setScale(1).setPosition(320,190).setDepth(200);

        this.tweens.add({
            targets: text5,
            x: -320,
            ease: 'none',
            duration: 4000,
            yoyo: false,
            repeat: -1
        });
        
        

        

        this.events.on('shutdown', this.shutdown, this);
    },

    shutdown: function ()
    {

        //  We need to clear keyboard events, or they'll stack up when the Menu is re-run
        this.input.keyboard.shutdown();
    },
    update: function ()
    {
        



        if (startFlag)
        {
            this.scene.start('main');
        }        
        else if (this.input.gamepad.total === 0)// exit update loop if no gamepad detected
        {
            return;
        }

        


        
        var pads = this.input.gamepad.gamepads;
        var pad;

        for (var i = 0; i < pads.length; i++)
        {
            pad = pads[i];

            if (!pad)
            {
                continue;
            }
            else
            {
                text5.setText('gamepad detected press any button '+pad.id );
            }
        }
        
        

        


        
        

    }

});


