var Touchgui = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Touchgui ()
    {
        Phaser.Scene.call(this, { key: 'touchgui', active: false });
    },

    init: function (data)
    {
        
    },

    preload: function ()
    {
        

    },

    create: function ()
    {

        //touch gui
        this.input.addPointer(3);
        this.textures.generate('chunk', { data: ['A'], pixelWidth: 1});
        this.textures.generate('chunk2', { data: ['6'], pixelWidth: 1});

        guide_multi = this.add.image(40,148,'chunk').setDisplaySize(64, 64).setAlpha(.25).setInteractive().setDepth(200);
        guide_multi.on('pointermove', function () {guide_multi_activeY = guide_multi.input.localY}, this);
        guide_multi.on('pointerout', function () {guide_multi_activeY = .5}, this);

        guide_zspeed = this.add.image(280,148,'chunk').setDisplaySize(64, 64).setAlpha(.25).setInteractive().setDepth(200);
        //guide_zspeed.on('pointermove', function () {debug.setText(guide_zspeed.input.localX+" "+guide_zspeed.input.localY)}, this);

        guide_shoot = this.add.image(210,148,'chunk2').setDisplaySize(40, 40).setAlpha(.45).setInteractive().setDepth(200);
        guide_shoot.on('pointermove', function () {gShoot = true}, this);
        guide_shoot.on('pointerout', function () {gShoot = false}, this);

        this.textures.generate('h_arrow', { data: guideInputHorizontalData, pixelWidth: 2});
        this.textures.generate('v_arrow', { data: guideInputVerticalData, pixelWidth: 2});

        guide_left = this.add.image(20,148,'h_arrow').setAlpha(.25);
        guide_right = this.add.image(60,148,'h_arrow').toggleFlipX().setAlpha(.25);

        guide_up = this.add.image(40,128,'v_arrow').setAlpha(.25);
        guide_down = this.add.image(40,168,'v_arrow').toggleFlipY().setAlpha(.25);

        guide_forward = this.add.image(280,128,'v_arrow').setAlpha(.25).setDepth(200);
        guide_back = this.add.image(280,168,'v_arrow').toggleFlipY().setAlpha(.25).setDepth(200);

        guide_sleft = this.add.image(260,148,'h_arrow').setAlpha(.25);
        guide_sright = this.add.image(300,148,'h_arrow').toggleFlipX().setAlpha(.25);

        this.textures.generate('a_menu', { data: accessMenuData, pixelWidth: 1});
        access_menu = this.add.image(310,10,'a_menu').setAlpha(1).setInteractive();
        access_menu.on('pointerdown', function () { var menus = this.scene.get('menus'); menus.displayHideMenu(); } , this);

        

    },

    update: function()
    {


    }

});