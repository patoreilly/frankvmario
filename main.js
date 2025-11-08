var Main = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Main ()
    {
        Phaser.Scene.call(this, { key: 'main', active: false });
    },

    init: function (data)
    {
        
    },

    preload: function ()
    {
        



    },

    newdemo: function()
    {
        // reset globals
        demo_mode = true;
        drive_mode = false;
        this.playercart.inplay = false;

        og_index++;
        if (og_index>=objectGangs.length) og_index=0;
        var new_objectgang = objectGangs[og_index];

        this.changeLevel(new_objectgang);


        this.mariocart.inplay = true;
        this.ralphcart.inplay = true;
        this.toadcart.inplay = true;
        this.pippincart.inplay = true;

        this.frankcart.inplay = true;

        

        this.fProjectionPlaneYCenter = 100;
    },

    newgame: function()
    {

        // reset globals


        demo_mode = false;
        this.playercart.inplay = true;
        drive_mode = true; 
        this.fProjectionPlaneYCenter = 100;
        

        this.mariocart.inplay = true;
        this.ralphcart.inplay = true;
        this.toadcart.inplay = true;
        this.pippincart.inplay = true;

        this.frankcart.inplay = false;
        
        //init enemies, road obstacles and scenery
        //this.initEverything();
    },

    initEverything: function()
    {
        var thisContext = this;

        //
    },

    create: function ()
    {

        var thisContext = this;


        // activates gamepad in this scene
        this.input.gamepad.once('down', function (pad, button, index) {
            pad.setAxisThreshold(0.3);
            gamepad = pad;
            }, this);
        
        /// launch touch input gui
        if (touchActivated)
        {
            this.scene.launch('touchgui');
        }

        else
        {
            this.input.addPointer(1);

            this.input.on('pointerdown', function ()
                {
                    gShoot=true;
                }, this);

            this.input.on('pointerup', function ()
                {
                    gShoot=false;   
                }, this);

            this.input.on('pointermove', function (pointer) 
                {
                    horizontalMouseDelta = (((pointer.x - 160) / 320));
                    verticalMouseDelta = (((pointer.y - 100) / 200));
                } );


        }

        
        /// keyboard input 
        cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.addCapture('ALT, LEFT, RIGHT');

        keys = this.input.keyboard.addKeys('E,C,W,A,S,D');






        // this.input.keyboard.on('keydown-CTRL', function (event) 
        //     {
        //         if (drive_mode)
        //         {
        //             thisContext.playercart.jump();
                   
        //         }
        //     }

        // );
        

        // this.input.keyboard.on('keydown-ESC', function (event) 
        //     {

        //         thisContext.displayHideMenu();
        //     }
        // );


        // this.input.keyboard.on('keydown-ONE', function (event) 
        //     {
        //         thisContext.background.currentIndex++;
        //         if (thisContext.background.currentIndex==thisContext.background.length) {thisContext.background.currentIndex=0}
        //     }
        // );

        // this.input.keyboard.on('keydown-TWO', function (event) 
        //     {
        //         thisContext.floor.currentIndex++;
        //         if (thisContext.floor.currentIndex==thisContext.floor.length) {thisContext.floor.currentIndex=0}
        //     }
        // );

        // this.input.keyboard.on('keydown-THREE', function (event) 
        //     {
        //         active_og_index++;
        //         if (active_og_index>=active_objectGangs.length) active_og_index=0;
        //         var new_objectgang = active_objectGangs[active_og_index];

        //         thisContext.changeObjectgang(new_objectgang);    
        //     }
        // );

        // this.input.keyboard.on('keydown-FOUR', function (event) 
        //     {
        //         if (!menu_mode) {thisContext.changeLevelmap();}
        //     }
        // );
        // this.input.keyboard.on('keydown-FIVE', function (event) 
        //     {
        //         if (!menu_mode) {thisContext.changePortal();}
        //     }
        // );


        

        //// setup containers and cameras

        
        //  zoom camera to cover edges during camera shake
        this.cameras.main.on('camerashakestart', function () {

            if (tilt_mode)
            {
                //zoom greater 
                gamedisplayImage.setScale(1.25);
            }
            else
            {
                //zoom regular 
                gamedisplayImage.setScale(1.08);
            }

        });

        this.cameras.main.on('camerashakecomplete', function () {

            if (tilt_mode)
            {
                //reset to 1.17x
                gamedisplayImage.setScale(1.17);
            }
            else
            {
                //reset to normal scale
                gamedisplayImage.setScale(1.0);
            }

        });
        
        /// launch menus and title
        this.scene.launch('menus');
        this.scene.launch('title');
        

        /// debug global
        debug = this.add.text(120, 60, '', { font: '10px Arial', fill: '#00ff00' }).setDepth(200);


        //init routine if needed
        //this.initEverything();

        // TILE_SIZE is the defualt grid unit
        this.TILE_SIZE = 64;
        
        

        // 2 dimensional map
        this.wMap=[]; //floortiles

        this.wMap=[]; //walls

        this.MAP_WIDTH=40;
        this.MAP_HEIGHT=40; 
        
        // Remember that PROJECTIONPLANE = screen.  This demo assumes your screen is 320 pixels wide, 200 pixels high
        this.PROJECTIONPLANEWIDTH = 320;
        this.PROJECTIONPLANEHEIGHT = 200;
        
        // We use FOV of 60 degrees.  So we use this FOV basis of the table, taking into account
        // that we need to cast 320 rays (PROJECTIONPLANEWIDTH) within that 60 degree FOV.
        this.ANGLE60 = this.PROJECTIONPLANEWIDTH;
        // You must make sure these values are integers because we're using loopup tables.
        this.ANGLE30 = Math.floor(this.ANGLE60/2);
        this.ANGLE15 = Math.floor(this.ANGLE30/2);
        this.ANGLE90 = Math.floor(this.ANGLE30*3);
        this.ANGLE180 = Math.floor(this.ANGLE90*2);
        this.ANGLE270 = Math.floor(this.ANGLE90*3);
        this.ANGLE360 = Math.floor(this.ANGLE60*6);
        this.ANGLE0 = 0;
        this.ANGLE5 = Math.floor(this.ANGLE30/6);
        this.ANGLE10 = Math.floor(this.ANGLE5*2);
        this.ANGLE45 = Math.floor(this.ANGLE15*3);

        this.ANGLE1 = Math.floor(this.ANGLE5/5);
        this.ANGLE2 = Math.floor(this.ANGLE10/5);
        
        // trigonometric tables (the ones with "I" such as ISiTable are "Inverse" table)
        this.fSinTable=[];
        this.fISinTable=[];
        this.fCosTable=[];
        this.fICosTable=[];
        this.fTanTable=[];
        this.fITanTable=[];
        this.fFishTable=[];
        this.fXStepTable=[];
        this.fYStepTable=[];

        // player's attributes
        this.fPlayerX = 300;
        this.fPlayerY = 340;
        this.fPlayerArc = this.ANGLE90;
        this.playerArcDelta = 0;
        this.fPlayerDistanceToTheProjectionPlane = 277;
        this.fPlayerElevation = 80;
        this.fPlayerSpeed = 6;
        
        // Half of the screen height
        this.fProjectionPlaneYCenter = this.PROJECTIONPLANEHEIGHT/2;


        // the following variables are used to keep the player coordinate in the overhead map
        this.fPlayerMapX;
        this.fPlayerMapY;
        this.fMinimapWidth = 4;


        var i;
        var radian;
        this.fSinTable = new Array(this.ANGLE360+1);
        this.fISinTable = new Array(this.ANGLE360+1);
        this.fCosTable = new Array(this.ANGLE360+1);
        this.fICosTable = new Array(this.ANGLE360+1);
        this.fTanTable = new Array(this.ANGLE360+1);
        this.fITanTable = new Array(this.ANGLE360+1);
        this.fFishTable = new Array(this.ANGLE360+1);
        this.fXStepTable = new Array(this.ANGLE360+1);
        this.fYStepTable = new Array(this.ANGLE360+1);

        for (i=0; i<=this.ANGLE360;i++)
        {
            // Populate tables with their radian values.
            // (The addition of 0.0001 is a kludge to avoid divisions by 0. Removing it will produce unwanted holes in the wall when a ray is at 0, 90, 180, or 270 degree angles)
            radian = this.arcToRad(i) + (0.0001);
            this.fSinTable[i]=Math.sin(radian);
            this.fISinTable[i]=(1.0/(this.fSinTable[i]));
            this.fCosTable[i]=Math.cos(radian);
            this.fICosTable[i]=(1.0/(this.fCosTable[i]));
            this.fTanTable[i]=Math.tan(radian);
            this.fITanTable[i]=(1.0/this.fTanTable[i]);

            // Next we crate a table to speed up wall lookups.
            // 
            //  You can see that the distance between walls are the same
            //  if we know the angle
            //  _____|_/next xi______________
            //       |
            //  ____/|next xi_________   slope = tan = height / dist between xi's
            //     / |
            //  __/__|_________  dist between xi = height/tan where height=tile size
            // old xi|
            //                  distance between xi = x_step[view_angle];
            
            
            
            // Facing LEFT
            if (i>=this.ANGLE90 && i<this.ANGLE270)
            {
                this.fXStepTable[i] = (this.TILE_SIZE/this.fTanTable[i]);
                if (this.fXStepTable[i]>0)
                    this.fXStepTable[i]=-this.fXStepTable[i];
            }
            // facing RIGHT
            else
            {
                this.fXStepTable[i] = (this.TILE_SIZE/this.fTanTable[i]);
                if (this.fXStepTable[i]<0)
                    this.fXStepTable[i]=-this.fXStepTable[i];
            }

            // FACING DOWN
            if (i>=this.ANGLE0 && i<this.ANGLE180)
            {
                this.fYStepTable[i] = (this.TILE_SIZE*this.fTanTable[i]);
                if (this.fYStepTable[i]<0)
                    this.fYStepTable[i]=-this.fYStepTable[i];
            }
            // FACING UP
            else
            {
                this.fYStepTable[i] = (this.TILE_SIZE*this.fTanTable[i]);
                if (this.fYStepTable[i]>0)
                    this.fYStepTable[i]=-this.fYStepTable[i];
            }
        }

        // Create table for fixing FISHBOWL distortion
        for (i=-this.ANGLE30; i<=this.ANGLE30; i++)
        {
            radian = this.arcToRad(i);
            // we don't have negative angle, so make it start at 0
            // this will give range from column 0 to 319 (PROJECTONPLANEWIDTH) since we only will need to use those range
            this.fFishTable[i+this.ANGLE30] = (1.0/Math.cos(radian));
        }

        
        
                
  
        // CREATE A SIMPLE MAP. see globals wallMap,floorMap
        // Remove spaces and tabs

        this.wMap=wallMap.replace(/\s+/g, '');
        this.fMap=floorMap.replace(/\s+/g, '');



    



   
        //     This code uses a Phaser generated canvas (phaser.image)
        //     Must uncomment background.refresh in blitOffscreenCanvas() for it to work
        
        this.gamedisplay_buffer = this.textures.createCanvas('gamedisplaycanvas', 320, 200);
        //     This code uses a regular dom canvas created in css/html
        //this.gamedisplay_buffer = document.getElementById("gameCanvas");
        this.gamedisplay_context = this.gamedisplay_buffer.getContext('2d', {willReadFrequently:true});
        

        //to accomodate camera tilting for flying the main projected image has to be scaled (larger) and shifted (left/up)

        if (tilt_mode)
        {
            gamedisplayImage = this.add.image(160,100,'gamedisplaycanvas').setOrigin(.5).setScale(1.17);
        }
        else 
        {
            gamedisplayImage = this.add.image(160,100,'gamedisplaycanvas').setOrigin(.5);

        }
        
        // create the offscreen buffer (canvas)

        this.offscreen = {};
        this.offscreen.buffer = this.textures.createCanvas('offscreencanvas', 320, 200); //document.createElement('canvas');
        this.offscreen.context = this.offscreen.buffer.getContext('2d', {willReadFrequently:true});
        this.offscreen.imagedata =  this.offscreen.context.getImageData(0,0,this.gamedisplay_buffer.width, this.gamedisplay_buffer.height);
        this.offscreen.pixels = this.offscreen.imagedata.data;
        
        allImageKeys.push('offscreencanvas');
        

        // set-up a text canvas with frames for each bitmap char
        var textCanvas = this.textures.createCanvas('fontsheet',760,72);
        var all_characters = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[|]^_`abcdefghijklmnopqrstuvwxyz{\\}~';

        textCanvas.drawFrame('Nintendo',0,0,0);

        
        for (var b=0;b<textCanvas.height/8;b++)
        {

        
            for (var v=0;v<all_characters.length;v++)
            {

                var thisChar = all_characters.charAt(v);

                //console.log(thisChar);

                textCanvas.add(thisChar+'color'+b, 0, v*8, b*8, 8, 8);

            }
        }

           
        this.animationData = {};

        for (var i = 0; i<allImageKeys.length; i++)
        {
            var thisImageKey = allImageKeys[i];

            this.animationData[thisImageKey] = {};

            this.animationData[thisImageKey].waveData = Phaser.Math.SinCosTableGenerator(320, 14, 14, 20);



            this.animationData[thisImageKey].burstpixels = [];
            for (var j = 0; j < 4600; j++)
            {
                this.animationData[thisImageKey].burstpixels[j] = {};
                this.animationData[thisImageKey].burstpixels[j].xincr = 0;//Phaser.Math.RND.realInRange(-1, 1);
                this.animationData[thisImageKey].burstpixels[j].yincr = Phaser.Math.RND.realInRange(-.5, -2.5);
                this.animationData[thisImageKey].burstpixels[j].xpos = Phaser.Math.Between(0,64);
                this.animationData[thisImageKey].burstpixels[j].ypos = Phaser.Math.Between(0,64);
                this.animationData[thisImageKey].burstpixels[j].timecheck = 0;
                this.animationData[thisImageKey].burstpixels[j].switchtime = Phaser.Math.Between(300,1000);
            }


            this.animationData[thisImageKey].textspace = 0;
            

            var a = "incoming";
            var b = "        ";
            var c = " COMS   ";
            var d = " ^^^^^  ";
            var e = " defualt";
            var f = "message ";
            var g = " %//@<> ";
            var h = "  2023  ";

            this.animationData[thisImageKey].msgstring = a+b+c+d+e+f+g+h;
            this.animationData[thisImageKey].msgindex = 0; 
            this.animationData[thisImageKey].colorindex = 0;
            this.animationData[thisImageKey].timecheck = 0;
            this.animationData[thisImageKey].scrollindex = 0;
            this.animationData[thisImageKey].scrollcycles = 0;
            this.animationData[thisImageKey].modedoneflag = true;

        }

        //special case add for offscreen
        this.offscreen.animationData = this.animationData['offscreencanvas'];


        this.wall = [];
        for (var i = 0; i < wallList.length; i++)
        {
            var imagekey = wallList[i];
                
            this.wall[i] = {};

            this.wall[i].animationData = this.animationData[imagekey];

            this.wall[i].srcimg = this.textures.get(imagekey).getSourceImage();
            this.wall[i].buffer = this.textures.createCanvas('wallcanvas'+i, wallData[i].width, wallData[i].height);
            this.wall[i].context = this.wall[i].buffer.getContext('2d', {willReadFrequently:true});
            this.wall[i].context.drawImage(this.wall[i].srcimg, 0,0,this.wall[i].srcimg.width,this.wall[i].srcimg.height,0,0,wallData[i].width, wallData[i].height);
            var imageData = this.wall[i].context.getImageData(0, 0, wallData[i].width, wallData[i].height);
            this.wall[i].pixels = imageData.data;
        }

        this.floor = [];
        this.floor.defaultIndex = 0;
        this.floor.currentIndex = 0;


        for (var i = 0; i < floorList.length; i++)
        {
            var imagekey = floorList[i];
                
            this.floor[i] = {};

            this.floor[i].animationData = this.animationData[imagekey];

            this.floor[i].srcimg = this.textures.get(imagekey).getSourceImage();
            this.floor[i].buffer = this.textures.createCanvas('floorcanvas'+i, floorData[i].tilesize, floorData[i].tilesize);
            this.floor[i].context = this.floor[i].buffer.getContext('2d', {willReadFrequently:true});
            this.floor[i].context.drawImage(this.floor[i].srcimg, 0,0,this.floor[i].srcimg.width,this.floor[i].srcimg.height, 0, 0, floorData[i].tilesize, floorData[i].tilesize);
            var imageData = this.floor[i].context.getImageData(0, 0, floorData[i].tilesize, floorData[i].tilesize);
            this.floor[i].pixels = imageData.data;
        }

        this.background = [];
        this.background.defaultIndex = 0;
        this.background.currentIndex = 0;
        for (var i = 0; i < backgroundList.length; i++)
        {
            var imagekey = backgroundList[i];
                
            this.background[i] = {};

            this.background[i].animationData = this.animationData[imagekey];

            this.background[i].ImageArc = 0;
            
            this.background[i].width = 960;
            this.background[i].height = 600;
            this.background[i].yoffset = 150;

            this.background[i].srcimg = this.textures.get(imagekey).getSourceImage();
            this.background[i].buffer = this.textures.createCanvas('backgroundcanvas'+i, this.background[i].width, this.background[i].height);
            this.background[i].context = this.background[i].buffer.getContext('2d', {willReadFrequently:true});
            this.background[i].context.drawImage(this.background[i].srcimg, 0,0,this.background[i].srcimg.width,this.background[i].srcimg.height,0,0,this.background[i].width, this.background[i].height);
            var imageData = this.background[i].context.getImageData(0, 0, this.background[i].width, this.background[i].height);
            this.background[i].imagedata = imageData;
            this.background[i].pixels = imageData.data;

            
        }



        


        // player shooting settings
        this.shotIndex = 0;// index for bullet sprite objects
        this.num_bullets=10;
        this.shot_saved_timecheck = 0;


        // index for explosion sprite objects
        this.expspriteindex = 0;

        //total set of objects that can be drawn
        this.zspritesgroup = this.add.group();
        this.zspritesgroupArray = this.zspritesgroup.getChildren();

        // worker variables for creating game objects/sprites
        var thisContext = this;
        var a_zsprite;



        // all enemy bullets
        this.enemybulletsprites = [];

        // player bullets
        this.bulletsprites = [];

        
        for (var i = 0; i < this.num_bullets; i++)
        {
            this.bulletsprites[i] = this.add.image();
            this.bulletsprites[i].img = this.textures.get('red_ball.png').getSourceImage();

            var randomKey = Math.random().toString();
            this.bulletsprites[i].buffer = this.textures.createCanvas(randomKey, this.bulletsprites[i].img.width, this.bulletsprites[i].img.height);
            this.bulletsprites[i].buffer.context = this.bulletsprites[i].buffer.getContext('2d', {willReadFrequently:true});
            this.bulletsprites[i].buffer.context.drawImage(this.bulletsprites[i].img, 0, 0);        
            var imageData = this.bulletsprites[i].buffer.context.getImageData(0, 0, this.bulletsprites[i].img.width, this.bulletsprites[i].img.height);
            this.bulletsprites[i].pixels = imageData.data;

            this.bulletsprites[i].type = 'bullet';
            this.bulletsprites[i].dx = 0;
            this.bulletsprites[i].dy = 0;
            this.bulletsprites[i].pp_delta = 0;
            this.bulletsprites[i].distance = 0;

            // using .elevation_delta to make sure unpositioned redraws happen offscreen
            this.bulletsprites[i].elevation_delta = -100;
            this.bulletsprites[i].base_elevation = 0;

            this.bulletsprites[i].animated = false;
            this.bulletsprites[i].inplay = false;
            this.bulletsprites[i].currentMapIndex = 0;

            this.bulletsprites[i].move = function() 
            {
                // the cannon relative to the player center view
                var shooterOffset = -14;
                var vert_look_range = 80;
                
                //var pp_delta = Math.floor(thisContext.PROJECTIONPLANEHEIGHT/2 - thisContext.fProjectionPlaneYCenter);
                var abs_pp_delta = Math.abs(this.pp_delta);
                var new_elev_delta = Math.floor(thisContext.fTanTable[abs_pp_delta]*this.distance);

                if (this.pp_delta<0)
                {
                    new_elev_delta *= -1;
                }


                var adj_pp_delta = this.pp_delta/vert_look_range*shooterOffset;

                this.elevation_delta = shooterOffset+adj_pp_delta-new_elev_delta;
                
                this.x+=this.dx; 
                this.y+=this.dy;
                if (this.x<0 || this.x>thisContext.MAP_WIDTH*thisContext.TILE_SIZE || this.y<0 || this.y>thisContext.MAP_HEIGHT*thisContext.TILE_SIZE || this.distance>1500) 
                {
                    // using .elevation_delta to make sure unpositioned redraws happen offscreen
                    this.elevation_delta = -100;
                    this.inplay = false; 
                    
                }



                // CHECK COLLISION AGAINST WALLS
                // compute cell position


                var playerXCell = Math.floor(this.x/thisContext.TILE_SIZE);
                var playerYCell = Math.floor(this.y/thisContext.TILE_SIZE);

                // compute position relative to cell (ie: how many pixel from edge of cell)
                var playerXCellOffset = this.x % thisContext.TILE_SIZE;
                var playerYCellOffset = this.y % thisContext.TILE_SIZE;

                var minDistanceToWall=20;
                
                // bullet wall detect and remove
                //
                if (this.dx>0)
                {
                    // moving right
                    if ((thisContext.wMap.charAt((playerYCell*thisContext.MAP_WIDTH)+playerXCell+1)!='-')&&
                        (playerXCellOffset > (thisContext.TILE_SIZE-minDistanceToWall)))
                    {
                        // remove sprite
                        this.inplay = false;
                        this.elevation_delta = -100;
                    }               
                }
                else
                {
                    // moving left
                    if ((thisContext.wMap.charAt((playerYCell*thisContext.MAP_WIDTH)+playerXCell-1)!='-')&&
                        (playerXCellOffset < (minDistanceToWall)))
                    {
                        // remove sprite
                        this.inplay = false;
                        this.elevation_delta = -100;
                    } 
                } 

                if (this.dy<0)
                {
                    // moving up
                    if ((thisContext.wMap.charAt(((playerYCell-1)*thisContext.MAP_HEIGHT)+playerXCell)!='-')&&
                        (playerYCellOffset < (minDistanceToWall)))
                    {
                        // remove sprite
                        this.inplay = false;
                        this.elevation_delta = -100;
                    }
                }
                else
                {
                    // moving down                                  
                    if ((thisContext.wMap.charAt(((playerYCell+1)*thisContext.MAP_HEIGHT)+playerXCell)!='-')&&
                        (playerYCellOffset > (thisContext.TILE_SIZE-minDistanceToWall)))
                    {
                        // remove sprite
                        this.inplay = false;
                        this.elevation_delta = -100;
                    }
                }
            }

            this.zspritesgroup.add(this.bulletsprites[i]);
        }



        //explosion sprites
        //animated static objects
        this.explosionsprites = [];
        this.explosioncolors = ['red','green','blue','orange','cyan','violet','white','black'];
        explosionsize = 128;

        for (var j=0;j<10;j++)
        {

            

            this.explosionsprites[j] = this.add.image();

            this.explosionsprites[j].type = 'explosion';

            

            this.explosionsprites[j].timecheck = 0;
            this.explosionsprites[j].color = 'orange';//this.explosioncolors[j];
            this.explosionsprites[j].numBurstPixels = 18;
            this.explosionsprites[j].duration = 800;
            this.explosionsprites[j].anim_framerate = 100;// in ms/snapshot
            this.explosionsprites[j].saved_sparkleIndex = 0;
            this.explosionsprites[j].burstPixelSize = 8;
            this.explosionsprites[j].burstPixelFrame = 0;
            
            this.explosionsprites[j].elevation_delta = 0;
            //this.explosionsprites[j].base_elevation= 0;
            this.explosionsprites[j].animated = false;
            //this.explosionsprites[j].flying = false;
            this.explosionsprites[j].active = false;
            //a_zsprite.numframes = 40;
            //a_zsprite.framewidth = 29;
            //a_zsprite.frameindex = 0;
            
            
            this.explosionsprites[j].burstpixels = [];
            for (var i = 0; i < this.explosionsprites[j].numBurstPixels; i++)
            {
                this.explosionsprites[j].burstpixels[i] = {};

                this.explosionsprites[j].burstpixels[i].xincr = Phaser.Math.RND.realInRange(-.25, .25) * 10;
                this.explosionsprites[j].burstpixels[i].yincr = Phaser.Math.RND.realInRange(-.25, .25) * 10;
                this.explosionsprites[j].burstpixels[i].xpos = explosionsize/2;
                this.explosionsprites[j].burstpixels[i].ypos = explosionsize/2;
            }

            var randomKey = Math.random().toString();
                this.explosionsprites[j].buffer = this.textures.createCanvas(randomKey, explosionsize, explosionsize);

                this.explosionsprites[j].context =  this.explosionsprites[j].buffer.getContext('2d');

                //a_zsprite.buffer.getContext('2d').drawImage(a_zsprite.img, 0, 0);        
                var imageData = this.explosionsprites[j].buffer.getContext('2d').getImageData(0, 0, explosionsize, explosionsize);

                this.explosionsprites[j].imagedata = imageData;

                this.explosionsprites[j].pixels = imageData.data;

            var zspritesref = this.zspritesgroup;    
            this.explosionsprites[j].move = function()
            {
                
                

                //for timeout self-destruct 
                
                if (game.loop.now > this.timecheck + this.duration)
                {
                    this.inplay = false;
                    
                }

                
                for (var i=0; i<this.numBurstPixels; i++)
                {

                    var thispixel = this.burstpixels[i];

                    //var sparkleIndex = Math.floor((game.loop.now-this.timecheck)/this.resolution);

                    for (var s=0; s<this.burstPixelSize; s++)
                    {
                        for (var t=0; t<this.burstPixelSize; t++)
                        {
                            var bytesPerPixel=4;
                            var targetIndex=(explosionsize*bytesPerPixel)* Math.round(thispixel.ypos+s) + ( bytesPerPixel* Math.round(thispixel.xpos+t) );

                            this.pixels[targetIndex]=0;
                            this.pixels[targetIndex+1]=0;
                            this.pixels[targetIndex+2]=0;
                            this.pixels[targetIndex+3]=0;
                        }        
                    }
                }

                for (var i=0; i<this.numBurstPixels; i++)
                {

                    var thispixel = this.burstpixels[i];

                    thispixel.xpos += thispixel.xincr;
                    

                    thispixel.ypos += thispixel.yincr;
                    
                           
                    var r;
                    var g;
                    var b;

                    var ep_map = [


                    [   [0,0,0,0,0,1,1,0],
                        [0,0,1,1,1,1,1,0],
                        [0,1,1,1,1,1,1,1],
                        [0,1,1,1,1,1,1,1],
                        [1,1,1,1,1,1,1,1],
                        [0,1,1,1,1,1,1,0],
                        [0,1,1,1,1,1,1,0],
                        [0,0,1,1,1,0,0,0]
                        ],

                    [   [0,0,0,0,0,0,0,0],
                        [0,0,0,0,1,1,1,0],
                        [0,0,1,1,1,1,1,1],
                        [0,1,1,1,1,1,1,1],
                        [0,1,1,1,1,1,1,1],
                        [0,1,1,1,1,1,1,0],
                        [0,1,1,1,1,1,1,0],
                        [0,0,0,1,1,0,0,0]
                        ],

                    [   [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,1,1,0],
                        [0,0,1,1,1,1,1,0],
                        [0,1,1,1,1,1,1,1],
                        [0,1,1,1,1,1,1,1],
                        [0,1,1,1,1,1,1,1],
                        [0,0,1,1,1,1,1,0],
                        [0,0,0,0,1,0,0,0]
                        ],

                    [   [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,1,0],
                        [0,0,1,1,1,1,1,1],
                        [0,1,1,1,1,1,1,1],
                        [0,1,1,1,1,1,1,1],
                        [0,1,1,1,1,1,1,0],
                        [0,0,0,1,1,1,0,0],
                        [0,0,0,0,0,0,0,0]
                        ],

                    [   [0,0,0,0,0,0,0,0],
                        [0,0,0,1,1,1,0,0],
                        [0,0,1,1,1,1,1,0],
                        [0,1,1,1,1,1,1,0],
                        [0,1,1,1,1,1,1,0],
                        [0,0,1,1,1,1,0,0],
                        [0,0,1,1,0,1,0,0],
                        [0,0,0,0,0,0,0,0]
                        ],

                    [   [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,1,0,0,0],
                        [0,0,1,1,1,1,0,0],
                        [0,1,1,1,1,1,1,0],
                        [0,0,1,1,1,1,1,0],
                        [0,0,1,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0]
                        ],

                    [   [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,1,0,1,0,0],
                        [0,0,1,1,1,1,0,0],
                        [0,0,0,1,1,1,0,0],
                        [0,0,0,1,1,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0]
                        ],

                    [   [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,1,0,0,0,0],
                        [0,0,1,1,1,0,0,0],
                        [0,0,0,1,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0]
                        ]



                    ];

                    var colors = ['red','green','blue','orange','cyan','violet'];

                    var sparkleIndex = Math.floor((game.loop.now-this.timecheck)/this.anim_framerate);
                    var abs_anim_framerate = this.duration/this.anim_framerate;
                    var brightnessLevel = 1.0 - (game.loop.now-this.timecheck)/this.duration;
                    var inv_brightnessLevel = (game.loop.now-this.timecheck)/this.duration;

                    

                    if (sparkleIndex != this.saved_sparkleIndex)
                    {
                        this.saved_sparkleIndex = sparkleIndex;
                        this.burstPixelFrame = sparkleIndex%8;
                    }

                    if (this.color=='red') { r=255; g=0; b=0; }
                    if (this.color=='green') { r=0; g=255; b=0; }
                    if (this.color=='blue') { r=0; g=0; b=255; }
                    if (this.color=='orange') { r=255; g=255; b=0; }
                    if (this.color=='cyan') { r=0; g=255; b=255; }
                    if (this.color=='violet') { r=255; g=0; b=255; }
                    if (this.color=='white') { r=255; g=255; b=255; }
                    if (this.color=='black') { r=0; g=0; b=0; }



                    for (var s=0; s<this.burstPixelSize; s++)
                    {
                        for (var t=0; t<this.burstPixelSize; t++)
                        {
                            if (ep_map[this.burstPixelFrame][s][t])
                            {
                                // if ( (ep_map[this.burstPixelFrame][s][t]!=2 || (sparkleIndex/abs_resolution <.25)) && (ep_map[this.burstPixelFrame][s][t]!=3 || (sparkleIndex/abs_resolution <.5)) )
                                // {
                                    
                                    if ((thispixel.xpos>0 && thispixel.xpos<explosionsize-this.burstPixelSize) && (thispixel.ypos>0 && thispixel.ypos<explosionsize-this.burstPixelSize))
                                    {
                                        if (Phaser.Math.Between(0,1))
                                        {
                                            var bytesPerPixel=4;
                                            var targetIndex=(explosionsize*bytesPerPixel)* Math.round(thispixel.ypos+s) + ( bytesPerPixel* Math.round(thispixel.xpos+t) );

                                            this.pixels[targetIndex]=r*brightnessLevel;
                                            this.pixels[targetIndex+1]=g*brightnessLevel;
                                            this.pixels[targetIndex+2]=b+(255*inv_brightnessLevel);
                                            this.pixels[targetIndex+3]=255; 
                                        }                       
                                        else
                                        {
                                            var bytesPerPixel=4;
                                            var targetIndex=(explosionsize*bytesPerPixel)* Math.round(thispixel.ypos+s) + ( bytesPerPixel* Math.round(thispixel.xpos+t) );

                                            this.pixels[targetIndex]=r*inv_brightnessLevel;
                                            this.pixels[targetIndex+1]=g*inv_brightnessLevel;
                                            this.pixels[targetIndex+2]=b*inv_brightnessLevel;
                                            this.pixels[targetIndex+3]=255;                        
                                        }
                                    }
                                
                                    
                                // }

                                
                            }
                        }        
                    }
                    
                }
            }; 

            
            this.zspritesgroup.add(this.explosionsprites[j]);
        }
    
    

        ///// Player Cart

        this.playercart = this.add.image();

        



        this.playercart.x = 300;
        this.playercart.y = 600;

        this.playercart.lastX = this.playercart.x-1;
        this.playercart.lastY = this.playercart.y-1;
        

        this.playercart.savedpath = [];

        // initialize array --saved path for camera follow
        for (var s=0;s<40;s++)
        {
            this.playercart.savedpath[s] = {x:300,y:600-(s*4)};
        }
        this.playercart.lastPoint = {x:300,y:600-(39*4)};
        
        this.playercart.sswidth = 72;
        this.playercart.ssheight = 48;
        this.playercart.framewidth = 72;
        this.playercart.numframes = 22;
        this.playercart.frameindex = 0;

        this.playercart.buffer = this.textures.createCanvas('playercartcanvas', this.playercart.sswidth, this.playercart.ssheight );

        this.playercart.context = this.playercart.buffer.getContext('2d', {willReadFrequently:true});      
        
        var imageData = this.playercart.context.getImageData(0, 0, this.playercart.sswidth, this.playercart.ssheight);
        this.playercart.pixels = imageData.data;

        this.playercart.frames=[];

        for (var i=1;i<23;i++)
        {
            this.playercart.frames[i-1] = {};

            var frameimg = this.textures.get('frankcart'+i+'.png').getSourceImage();
            this.playercart.frames[i-1].buffer = this.textures.createCanvas('playercartframe'+i, this.playercart.sswidth, this.playercart.ssheight );

            this.playercart.frames[i-1].context = this.playercart.frames[i-1].buffer.getContext('2d', {willReadFrequently:true});      
            this.playercart.frames[i-1].context.drawImage(frameimg, 0, 0,frameimg.width,frameimg.height, 0, 0, this.playercart.framewidth, this.playercart.ssheight );
        
            var imageData = this.playercart.frames[i-1].context.getImageData(0, 0, this.playercart.sswidth, this.playercart.ssheight);
            this.playercart.frames[i-1].pixels = imageData.data;        
        }
        

        this.playercart.label = "playercart";
        this.playercart.type = 'playercart';
        this.playercart.hitcount = 0;
        this.playercart.explosioncolor= 'orange';

        this.playercart.img = this.textures.get('playercartcanvas').getSourceImage();
        
        this.playercart.arc = 0;
        this.playercart.animated = false;
        //a_zsprite.flying = false;
        this.playercart.animationtimecheck=0;
        this.playercart.frametimer = 50;
        this.playercart.frameindex = 0;

        this.playercart.inplay = false;
        
        this.playercart.elevation_delta = 0;
        this.playercart.base_elevation = Math.floor(this.playercart.img.height/2)-15;

        this.playercart.startX = 500;
        this.playercart.startY = 500;

        this.playercart.followerdata = 0;
        this.playercart.followerdata2 = 0;
        this.playercart.path_duration = 28000;
        this.playercart.path_delay = 0

        this.playercart.path = new Phaser.Curves.Path(this.playercart.startX, this.playercart.startY);
        
        this.playercart.path.splineTo([ 160,136,440,280,640,56,870,194,1240,56,1160,536,1200,736,840,896,800,536,480,816,80,776,400,496,100,250 ]);
        this.playercart.path.closePath();

        this.tweens.add({
            targets: this.playercart,
            followerdata: 1,
            ease: 'none',
            duration: this.playercart.path_duration,
            delay: this.playercart.path_delay,
            yoyo: 0,
            repeat: -1
        });

        this.tweens.add({
            targets: this.playercart,
            followerdata2: 1,
            ease: 'none',
            duration: this.playercart.path_duration,
            delay: this.playercart.path_delay+1,
            yoyo: 0,
            repeat: -1
        });

        this.playercart.jumptween = this.tweens.add({
                targets: this.playercart,
                elevation_delta: 80,
                ease: 'Quad.easeOut',
                duration: 450,
                yoyo: true,
                repeat: 0,
                paused:true
            });

        this.playercart.jump = function()
        { 
            if ( !this.jumptween.isPlaying() )
            this.jumptween.play();
        }
        this.playercart.move = function()
        {            

            // this.x = 500;//this.path.getPoint(this.followerdata2).x; 
            // this.y = 500;//this.path.getPoint(this.followerdata2).y;

            // var trackingX = 0;//this.path.getPoint(this.followerdata).x;           
            // var trackingY = 0;//this.path.getPoint(this.followerdata).y;            

            // var distance = Phaser.Math.Distance.Between(this.x,this.y,trackingX,trackingY);
            // var xdelta = this.x-trackingX;
            // var ydelta = this.y-trackingY;
            // var myrad = Math.asin(ydelta/distance);
            // var myarc = Math.round(thisContext.radToArc(myrad))+thisContext.ANGLE180;            

            // if (xdelta>0)
            // {
            //     var myadjarc = myarc;                
            // }
            // else if (ydelta>0)
            // {
            //     var myadjarc = (1440-myarc)+1440;                
            // }    
            // else 
            // {
            //     var myadjarc = (960-myarc);                
            // }
            var myadjarc = this.arc;

            myadjarc -= thisContext.fPlayerArc;

            if (myadjarc<0) myadjarc+=1920;
            if (myadjarc>1920) myadjarc-=1920;
            

            var myarcframeindex = Math.floor((myadjarc*this.numframes)/1920);

            if (this.frames[myarcframeindex] !=undefined)
            {
                this.pixels = this.frames[myarcframeindex].pixels;
            }

            if (this.x!=this.lastX || this.y!=this.lastY)
            {
                var myPoint = {x:this.x,y:this.y};
                    
                this.savedpath.unshift(myPoint);
                this.lastPoint  = this.savedpath.pop();                
            }

            this.lastX = this.x;
            this.lastY = this.y;

            
        }



        this.zspritesgroup.add(this.playercart);


        //// end Player Cart




        

        






    
        this.portal = this.add.image();

        this.portal.p_index = 0;

        this.portal.buffer = this.textures.createCanvas('portaldisplaycanvas', 64, 64);
        this.portal.context = this.portal.buffer.getContext('2d', {willReadFrequently:true});
        
        this.portal.imagedata = this.portal.context.getImageData(0, 0, 64, 64);
        this.portal.pixels = this.portal.imagedata.data;



        
        //portal image source
        this.portal.sphereTexture = this.textures.get(backgroundList[0]).getSourceImage();
        this.portal.sphereTextureBuffer = this.textures.createCanvas('portalimagecanvas', this.portal.sphereTexture.width, this.portal.sphereTexture.height);
        this.portal.sphereTexture_context = this.portal.sphereTextureBuffer.getContext('2d', {willReadFrequently:true});
        this.portal.sphereTexture_context.drawImage(this.portal.sphereTexture, 0, 0);
        this.portal.sphereTexture_imagedata = this.portal.sphereTexture_context.getImageData(0, 0, this.portal.sphereTexture.width, this.portal.sphereTexture.height);
        this.portal.sphereTexturePixels = this.portal.sphereTexture_imagedata.data;


        this.portal.src_vert_scope = this.portal.sphereTexture.height/16;


        //portal properties
        this.portal.width = 64;
        this.portal.height = 64;

        this.portal.rotation = 0;
        this.portal.s_distance = 0;

        this.portal.x = 1280;
        this.portal.y = 1280;
        this.portal.base_elevation = 32;
        this.portal.elevation_delta = 0;//Phaser.Math.Between(-50,70);
        this.portal.animated = true; //prevents close-up optimiztion draw routine which has some jankyness 
        this.portal.animationtimecheck=0;
        this.portal.frametimer = 200;
        this.portal.numframes = 1;
        this.portal.framewidth = this.portal.width;
        this.portal.frameindex = 0;


        this.portal.inplay = true;
        

        // Main render function. This method is called for each frame (see init() method for initialization).
        this.portal.move = function()
        {
            
            
            // this.context.clearRect(0, 0, this.width, this.height);
            // this.imagedata = this.context.getImageData(0, 0, this.width,this.height);
            // this.pixels = this.imagedata.data;

            var x, y;

            var p = {x:0,y:0,z:0};  
            
            for(i = 0; i < this.sphere.numberOfVertexes; i++) {
                
                p.x = this.sphere.point[i].x;
                p.y = this.sphere.point[i].y;
                p.z = this.sphere.point[i].z;

                //this.rotateX(p, this.rotation);
                this.rotateY(p, this.rotation);
                //this.rotateZ(p, this.rotation);

                x = this.projection(p.x, p.z, this.width/2.0, 100.0, this.s_distance);
                y = this.projection(p.y, p.z, this.height/2.0, 100.0, this.s_distance);

                if((x >= 0) && (x < this.width)) {
                    if((y >= 0) && (y < this.height)) {

                        //limit drawing to front facing vertices. slightly greater than 0 to clean up the edge
                        if(p.z >= 2) 
                        {
                            var mycolor = this.sphere.point[i].color;
                            var bytesPerPixel=4;
                            var targetIndex=(this.width*bytesPerPixel)*Math.round(y)+(bytesPerPixel*Math.round(x));          
            
                            this.pixels[targetIndex]=mycolor.r;
                            this.pixels[targetIndex+1]=mycolor.g;
                            this.pixels[targetIndex+2]=mycolor.b;
                            this.pixels[targetIndex+3]=255;
                        }
                    }
                }                   
            }

            // this.context.putImageData(this.imagedata,0,0);

            this.rotation += Math.PI/90.0;

            if(this.s_distance < 280) {
                this.s_distance += 10;
            }
        };


        // Sphere3D constructor. It builds a 3D sphere from scratch.
        this.portal.Sphere3D = function (radius) 
        {
            sphere = {};

            sphere.point = new Array();
            sphere.radius = (typeof(radius) == "undefined") ? 20.0 : radius;
            sphere.radius = (typeof(radius) != "number") ? 20.0 : radius;
            sphere.numberOfVertexes = 0;

            var vertex_step = .0235;
            
            // It builds the middle circle on the XZ plane. Loop of 2*pi with a step of 0.17 radians.
            for(alpha = 0; alpha <= 6.28; alpha += vertex_step) {
                p = sphere.point[sphere.numberOfVertexes] = {x:0,y:0,z:0};

                //console.log("onSphereTextureLoaded imageData="+sphereTexturePixels);
                var bytesPerPixel=4;
                var sourceIndex = bytesPerPixel* Math.round(this.sphereTexture.width*(alpha/6.28) ) + (this.sphereTexture.width*bytesPerPixel)*(Math.round((0/1.445))+this.sphereTexture.height/2 );//22;//
                //console.log("sourceIndex="+100);

                var r=this.sphereTexturePixels[sourceIndex];//r=200;//
                var g=this.sphereTexturePixels[sourceIndex+1];//g=11;//
                var b=this.sphereTexturePixels[sourceIndex+2];//b=100;//
                var a=this.sphereTexturePixels[sourceIndex+3];//a=100;//

                // var colors = ['red','green','blue','orange','cyan','violet'];
                p.color = {};//colors[Math.floor(Math.random()*5)];//
                p.color.r = r;
                p.color.g = g;
                p.color.b = b;

            
                p.x = Math.cos(alpha) * sphere.radius;
                p.y = 0;
                p.z = Math.sin(alpha) * sphere.radius;

                sphere.numberOfVertexes++;
            }

            // It builds two hemispheres:
            //  - First hemisphere: loop of pi/2 with step of 0.17 (direction = 1)
            //  - Second hemisphere: loop of pi/2 with step of 0.17 (direction = -1)
            
            for(var direction = 1; direction >= -1; direction -= 2) {
                for(var beta = vertex_step; beta < 1.445; beta += vertex_step) {
                    var radius = Math.cos(beta) * sphere.radius;
                    var fixedY = Math.sin(beta) * sphere.radius * direction;

                    for(var alpha = 0; alpha < 6.28; alpha += vertex_step) {
                        p = sphere.point[sphere.numberOfVertexes] = {x:0,y:0,z:0};



                        var src_vert_scope = this.src_vert_scope;

                        var bytesPerPixel=4;
                        var sourceIndex = bytesPerPixel* Math.round(this.sphereTexture.width*(alpha/6.28) ) + (this.sphereTexture.width*bytesPerPixel)*(Math.round((fixedY*-1*src_vert_scope/1.445))+this.sphereTexture.height/2);//11;//

                        var r=this.sphereTexturePixels[sourceIndex];//r=200;//
                        var g=this.sphereTexturePixels[sourceIndex+1];//g=11;//
                        var b=this.sphereTexturePixels[sourceIndex+2];//b=100;//
                        var a=this.sphereTexturePixels[sourceIndex+3];//a=100;//

                        // var colors = ['red','green','blue','orange','cyan','violet'];
                        p.color = {};//colors[Math.floor(Math.random()*5)];//
                        p.color.r = r;
                        p.color.g = g;
                        p.color.b = b;



                        p.x = Math.cos(alpha) * radius;
                        p.y = fixedY;
                        p.z = Math.sin(alpha) * radius;

                        sphere.numberOfVertexes++;
                    }
                }
            }

            return sphere;
        }





        // Utility method to rotate point by X in a 3D space
        this.portal.rotateX = function (point, radians) 
        {
            var y = point.y;
            point.y = (y * Math.cos(radians)) + (point.z * Math.sin(radians) * -1.0);
            point.z = (y * Math.sin(radians)) + (point.z * Math.cos(radians));
        };

        // Utility method to rotate point by Y in a 3D space
        this.portal.rotateY = function (point, radians) 
        {
            var x = point.x;
            point.x = (x * Math.cos(radians)) + (point.z * Math.sin(radians) * -1.0);
            point.z = (x * Math.sin(radians)) + (point.z * Math.cos(radians));
        };

        // Utility method to rotate point by Z in a 3D space
        this.portal.rotateZ = function (point, radians) 
        {
            var x = point.x;
            point.x = (x * Math.cos(radians)) + (point.y * Math.sin(radians) * -1.0);
            point.y = (x * Math.sin(radians)) + (point.y * Math.cos(radians));
        };

        // Utility method to project a 3D point a a 2D surface
        this.portal.projection = function (xy, z, xyOffset, zOffset, s_distance) 
        {
            return ((s_distance * xy) / (z - zOffset)) + xyOffset;
        };


        this.portal.sphere = this.portal.Sphere3D(10);

        this.zspritesgroup.add(this.portal);



        



        


        

        



        

        


        






        ///////////////pre activations

        //activate_runners(thisContext,200,100,2460,100,2460);

        activate_mariocarts(thisContext);

        activate_frankcart(thisContext);

        activate_plantedrocks(thisContext,30,1280,2460,100,1180);

        activate_oddtrees(thisContext,50,100,2460,1380,2460);

        activate_ufos(thisContext,20,1380,2460,1380,2460);

        activate_frogs(thisContext,30,100,1180,1380,2460);

        ////////////////////////////////////////////



        


        this.demoBot = {};

        this.demoBot.tracksprite = this.frankcart; //this.zspritesgroupArray[this.trackbotData.index];

        this.demoBot.strafeDelta = 0;
        this.demoBot.zspeedDelta = 15.0;
        this.demoBot.horizontalDelta = 0;
        this.demoBot.verticalDelta = .5;

        this.demoBot.arcDelta = 0;
        this.demoBot.deltaChange = 0;

        this.demoBot.xincr = 1;
        this.demoBot.yincr = 2.4;//Phaser.Math.RND.realInRange(.5, 2.5);

        //this.demoBot.xpos = this.fPlayerX;//Phaser.Math.Between(0,959);
        //this.demoBot.ypos = this.fPlayerY;//Phaser.Math.Between(0,199);

        this.demoBot.arc = 600;
        this.demoBot.elevation = 100;
        this.demoBot.level_index = 0;
        this.demoBot.bg_index = 0;
        this.demoBot.wall_index = 0;
        this.demoBot.floor_index = 0;
        this.demoBot.active_og_index = 0;
        //this.demoBot.current_objectgang = 'ufo';
        this.demoBot.startX = 100;
        this.demoBot.startY = 100;

        this.demoBot.followerdata = 0;
        this.demoBot.followerdata2 = 0;
        this.demoBot.path = new Phaser.Curves.Path(this.demoBot.startX, this.demoBot.startY);
        //this.demoBot.path.ellipseTo(1200,1200,360,0,true,180);
        // ([ 160,100,440,100,640,100,870,194,1240,56,1160,536,1200,736,840,896,800,536,480,816,80,776,400,496,100,250 ]);        
        this.demoBot.path.splineTo([ 308,123,640,150,880,470,1440,256,1760,576,2240,470,2480,896,2400,1428,1760,1215,1520,1428,
            1680,1855,2160,1748,2320,2174,1920,2480,1280,2390,1120,1960,1152,1450,800,1322,
            604,1615,736,2051,560,2388,240,2494,80,2175,220,1818,200,1450,412,1215,400,895,180,656,84,341 ]);



        this.demoBot.path.closePath();

        // this.tweens.add({
        //     targets: this.demoBot,
        //     elevation: 64,
        //     ease: 'none',
        //     duration: 3000,
        //     delay: 100,
        //     yoyo: true,
        //     repeat: -1
        // });

        this.tweens.add({
            targets: this.demoBot,
            followerdata: 1,
            ease: 'none',
            duration: this.demoBot.tracksprite.path_duration,
            delay: this.demoBot.tracksprite.path_delay+1500,
            yoyo: 0,
            repeat: -1,
            onRepeat: function()
            {
                if (demo_mode)
                {
                    og_index++;
                    if (og_index>=objectGangs.length) og_index=0;
                    var new_objectgang = objectGangs[og_index];

                    thisContext.changeLevel(new_objectgang);
                }
                
            }
        });

        this.tweens.add({
            targets: this.demoBot,
            followerdata2: 1,
            ease: 'none',
            duration: this.demoBot.tracksprite.path_duration,
            delay: this.demoBot.tracksprite.path_delay+1500,
            yoyo: 0,
            repeat: -1
        });


        transitionTween = this.tweens.add({
            targets: gamedisplayImage,
            scale: 10,
            alpha: 0,
            ease: 'Expo.easeIn',
            duration: 700,
            delay: 100,
            yoyo: 1,
            repeat: 0,
            paused: true,
            onStart: function ()
            {
                
                //

                
            },
            onYoYo: function ()
            {
                oginitflag=false;
            },
            onUpdate: function () 
            { 
                if (this.totalProgress>=.5)
                {                    
                    if (!oginitflag)
                    {
                        oginitflag=true;
                        thisContext.changeObjectgang(this.goto_level);

                        thisContext.background.currentIndex = Phaser.Math.Between(0,thisContext.background.length-1);
                        //if (thisContext.background.currentIndex==thisContext.background.length) {thisContext.background.currentIndex=0}

                        thisContext.floor.currentIndex = Phaser.Math.Between(0,thisContext.floor.length-1);
                        //if (thisContext.floor.currentIndex==thisContext.floor.length) {thisContext.floor.currentIndex=0}
                    }
                }                   
            },
            onComplete: function ()
            {
                // for (var i=0; i<thisContext.floor.length; i++)
                // {
                //     thisContext.resetbuffer(thisContext.floor[i]);
                // }
                

                // thisContext.resetbuffer(thisContext.wall[6]);

                // thisContext.resetbuffer(thisContext.wall[4]);

                thisContext.zspritesgroup.children.iterate( 
                function(_sprite)
                { 
                    if (_sprite != undefined)
                    {
                        // if (_sprite.inplay) 
                        // {                                
                        //     if (_sprite.animationData != undefined)
                        //     {
                                
                                thisContext.resetbuffer(_sprite);

                        //     }                                
                        // }
                    }    
                } );
            }
        });
        // init level pointer
        transitionTween.goto_level;
        


        

    }, ////// END OF create()

    
    
    changeLevel: function(level)
    {
        
        if(!active_objectGangs.includes(level))
        {
            switch (level)
            {
                case 'flybugs': activate_flybugs(this,4,100,2460,1380,2460); break;
                case 'classictrees': activate_classictrees(this,13,100,2460,1380,2460); break;
                case 'fancytrees': activate_fancytrees(this,3,100,2460,1380,2460); break;
                case 'palmtrees': activate_palmtrees(this,30,100,2460,1380,2460); break;
                case 'redtrees': activate_redtrees(this,20,100,2460,1380,2460); break;
                case 'baretrees': activate_baretrees(this,24,100,2460,1380,2460); break;
                case 'firtrees': activate_firtrees(this,24,100,2460,1380,2460); break;
                case 'oddtrees': activate_oddtrees(this,24,100,2460,1380,2460); break;
                case 'ferns': activate_ferns(this,30,100,2460,1380,2460); break;
                case 'plants': activate_plants(this,36,100,2460,1380,2460); break;
                case 'shrooms': activate_shrooms(this,70,100,2460,1380,2460); break;
                case 'gems': activate_gems(this,50,100,2460,1380,2460); break;
                case 'brightflowers': activate_brightflowers(this,45,100,2460,1380,2460); break;
                case 'elegantflowers': activate_elegantflowers(this,3,100,2460,1380,2460); break;
                case 'barerocks': activate_barerocks(this,30,100,2460,1380,2460); break;
                case 'plantedrocks': activate_plantedrocks(this,30,100,2460,1380,2460); break;
                case 'frogs': activate_frogs(this,20,100,2460,1380,2460); break;
                case 'octos': activate_octos(this,26,100,2460,1380,2460); break;
                case 'cydrones': activate_cydrones(this,26,100,2460,1380,2460); break;
                case 'redwings': activate_redwings(this,26,100,2460,1380,2460); break;
                case 'pinkblobs': activate_pinkblobs(this,20,100,2460,1380,2460); break;
                case 'ufos': activate_ufos(this,20,100,2460,1380,2460); break;
                case 'neonorbs': activate_neonorbs(this,30,100,2460,1380,2460); break;
                case 'blueorbs': activate_blueorbs(this,20,100,2460,1380,2460); break;

            }    
    
        }

        active_og_index++;
        if (active_og_index>=active_objectGangs.length) active_og_index=0;
                
        transitionTween.goto_level = level;
        
        transitionTween.play();
        
    },

    doDemoBot: function()
    {
       
        
        
        this.fPlayerX =  this.demoBot.path.getPoint(this.demoBot.followerdata2).x; //trackBotSprite.lastPoint.x;         
        this.fPlayerY =  this.demoBot.path.getPoint(this.demoBot.followerdata2).y; //trackBotSprite.lastPoint.y; 
        
        if (this.demoBot.tracksprite)
        {
            var trackBotSprite = this.demoBot.tracksprite; // this.zspritesgroupArray[this.trackbotData.index];
            var followDelta = trackBotSprite.followerdata; // use multiplier for look angle latency when following

            var trackingX = trackBotSprite.path.getPoint(followDelta).x;           
            var trackingY = trackBotSprite.path.getPoint(followDelta).y;
        }
        else
        {
            var trackingX =  this.demoBot.path.getPoint(this.demoBot.followerdata).x; //trackBotSprite.lastPoint.x;         
            var trackingY =  this.demoBot.path.getPoint(this.demoBot.followerdata).y; //trackBotSprite.lastPoin
        }
        

                
        
        
        


        

        var distance = Phaser.Math.Distance.Between(this.fPlayerX,this.fPlayerY,trackingX,trackingY);

        // prevents division by 0
        if (distance==0) distance = 1;

        var xdelta = this.fPlayerX-trackingX;
        var ydelta = this.fPlayerY-trackingY;
        var myrad = Math.asin(ydelta/distance);
        var myarc = Math.round(this.radToArc(myrad))+this.ANGLE180;

        if (xdelta>0)
        {
            var myadjarc = myarc;
            // var shotXDir=this.fCosTable[myarc];//thisContext.fPlayerArc
            // var shotYDir=this.fSinTable[myarc];

        }
        else if (ydelta>0)
        {
            var myadjarc = (1440-myarc)+1440;
            // var shotXDir=-this.fCosTable[myarc];//thisContext.fPlayerArc
            // var shotYDir=this.fSinTable[myarc];
        }    
        else 
        {
            var myadjarc = (960-myarc);
            // var shotXDir=-this.fCosTable[myarc];//thisContext.fPlayerArc
            // var shotYDir=this.fSinTable[myarc];
        }






        var currentArcDelta = this.fPlayerArc-myadjarc;

        // corrects the difference for when lead value crosses zero threshold before other value
        if (currentArcDelta<-1900) currentArcDelta+=1920;
        if (currentArcDelta>1900) currentArcDelta-=1920;

        this.background[this.background.currentIndex].ImageArc += currentArcDelta;

        this.fPlayerArc = myadjarc;
        this.fPlayerElevation = this.demoBot.elevation;

        




        // var debugt = [];
        //         // debugt.push(backgroundList[this.demoBot.bg_index]);
        //         debugt.push('fps: '+ Math.floor(this.sys.game.loop.actualFps.toString()) );
        //         // debugt.push('this.fPlayerArc: '+ this.fPlayerArc );

                
                
                

                // debugt.push('this.mariocart.arc: '+ this.mariocart.arc );
                
                
                // // // debugt.push('this.playerArcDelta: '+ this.playerArcDelta );
                // //debugt.push('verticalDelta: '+ verticalDelta );
                // // debugt.push('playerXCell: '+ playerXCell );
                // // debugt.push('playerYCell: '+ playerYCell );
                // //debugt.push('track--deltax: '+ trackBotSprite.lastPoint.x );
               
                // debugt.push('this.fPlayerX: '+ this.fPlayerX ); 

                // //debugt.push('track--deltay: '+ trackBotSprite.lastPoint.y );

                // debugt.push('this.fPlayerY: '+ this.fPlayerY );
                // debugt.push('mapIndex: '+ (playerYCell*this.MAP_WIDTH)+playerXCell );
                // debugt.push('charAt: '+ this.wMap.charAt( ( playerYCell*this.MAP_WIDTH)+playerXCell ) );
                // debugt.push('horizontalMouseDelta: '+ horizontalMouseDelta );
        //debug.setText(debugt);

        



    },

    

    driveCart: function()
    {        

        

        this.fPlayerX = this.playercart.lastPoint.x; //this.demoBot.path.getPoint(this.demoBot.followerdata).x;          
        this.fPlayerY = this.playercart.lastPoint.y; //this.demoBot.path.getPoint(this.demoBot.followerdata).y;  

        var distance = Phaser.Math.Distance.Between(this.fPlayerX,this.fPlayerY,this.playercart.x,this.playercart.y);
        var xdelta = this.fPlayerX-this.playercart.x;
        var ydelta = this.fPlayerY-this.playercart.y;
        var myrad = Math.asin(ydelta/distance);
        var myarc = Math.round(this.radToArc(myrad))+this.ANGLE180;

        if (xdelta>0)
        {
            var myadjarc = myarc;
            // var shotXDir=this.fCosTable[myarc];//thisContext.fPlayerArc
            // var shotYDir=this.fSinTable[myarc];

        }
        else if (ydelta>0)
        {
            var myadjarc = (1440-myarc)+1440;
            // var shotXDir=-this.fCosTable[myarc];//thisContext.fPlayerArc
            // var shotYDir=this.fSinTable[myarc];
        }    
        else 
        {
            var myadjarc = (960-myarc);
            // var shotXDir=-this.fCosTable[myarc];//thisContext.fPlayerArc
            // var shotYDir=this.fSinTable[myarc];
        }

        var currentArcDelta = this.fPlayerArc-myadjarc;

        // corrects the difference for when lead value crosses zero threshold before other value
        if (currentArcDelta<-1900) currentArcDelta+=1920;
        if (currentArcDelta>1900) currentArcDelta-=1920;

        this.background[this.background.currentIndex].ImageArc += currentArcDelta;

        this.fPlayerArc = myadjarc;
        this.fPlayerElevation = 50;
    },

    playerShoot: function()
    {
        if (game.loop.now > this.shot_saved_timecheck + 110)
        {
            this.shot_saved_timecheck = game.loop.now;

            var shotXDir=this.fCosTable[this.fPlayerArc];
            var shotYDir=this.fSinTable[this.fPlayerArc];

            var adjustshotposition = 5;
            this.bulletsprites[this.shotIndex].x = Math.floor(this.fPlayerX)+Math.round(shotXDir*this.fPlayerSpeed)*adjustshotposition;
            this.bulletsprites[this.shotIndex].y = Math.floor(this.fPlayerY)+Math.round(shotYDir*this.fPlayerSpeed)*adjustshotposition;

            this.bulletsprites[this.shotIndex].dx=Math.round(shotXDir*this.fPlayerSpeed*8);//8
            this.bulletsprites[this.shotIndex].dy=Math.round(shotYDir*this.fPlayerSpeed*8);//8
            
            this.bulletsprites[this.shotIndex].base_elevation = this.fPlayerElevation;
             
            this.bulletsprites[this.shotIndex].inplay = true;

            this.bulletsprites[this.shotIndex].pp_delta = Math.floor(this.PROJECTIONPLANEHEIGHT/2 - this.fProjectionPlaneYCenter);

            this.shotIndex++;
            if (this.shotIndex==this.num_bullets) this.shotIndex=0;
        }
    },
    
    changePortal: function ()
    {
        this.portal.p_index++;
        if (this.portal.p_index>=backgroundList.length) this.portal.p_index=0;        
        var imagekey = backgroundList[this.portal.p_index];

        //portal image source
        this.portal.sphereTexture = this.textures.get(imagekey).getSourceImage();

        var randomKey = Math.random().toString();
        this.portal.sphereTextureBuffer = this.textures.createCanvas(randomKey, this.portal.sphereTexture.width, this.portal.sphereTexture.height);
        this.portal.sphereTexture_context = this.portal.sphereTextureBuffer.getContext('2d', {willReadFrequently:true});
        //this.portal.sphereTextureBuffer.drawFrame(imagekey,0, 0, 0);
        this.portal.sphereTexture_context.drawImage(this.portal.sphereTexture,0,0);
        this.portal.sphereTexture_imagedata = this.portal.sphereTexture_context.getImageData(0, 0, this.portal.sphereTexture.width, this.portal.sphereTexture.height);
        this.portal.sphereTexturePixels = this.portal.sphereTexture_imagedata.data;

        this.portal.src_vert_scope = this.portal.sphereTexture.height/16;
        this.portal.sphere = this.portal.Sphere3D(10);


    },

    changeObjectgang: function (new_objectgang)
    {
        

        this.zspritesgroup.children.iterate( 
                function(_sprite)
                { 
                    if (_sprite != undefined)
                    {
                        if (active_objectGangs.includes(_sprite.label))
                        {
                            if (_sprite.label != new_objectgang)
                            {
                                _sprite.inplay = false;
                                // _sprite.x = Phaser.Math.Between(100,668);
                                // _sprite.y = Phaser.Math.Between(100,1180);
                            }
                            else
                            {
                                _sprite.inplay = true;
                                // _sprite.x = undefined;
                                // _sprite.y = undefined;
                            }                            
                        }

                    }                    
                } );
    },
        
    // //*******************************************************************//
    // //* Draw player POV on the overhead map (for illustartion purpose)
    // //* This is not part of the ray-casting process
    // //*******************************************************************//
    // drawPlayerPOVOnEditorMap : function(x, y)
    // {
    //     // Draw player position on the overhead map
    //     this.fPlayerMapX = ((this.fPlayerX/this.TILE_SIZE) * this.fMinimapWidth);
    //     this.fPlayerMapY = ((this.fPlayerY/this.TILE_SIZE) * this.fMinimapWidth);

    //     // draw a red line indication the player's direction
    //     this.drawLine(
    //         this.fPlayerMapX, 
    //         this.fPlayerMapY, 
    //         (this.fPlayerMapX+this.fCosTable[this.fPlayerArc]*12),
    //         (this.fPlayerMapY+this.fSinTable[this.fPlayerArc]*12), 
    //         "#ff0000");  
    // },

   
    // drawRayOnOverheadMap : function(x, y)
    // {        
    //     this.drawLine(
    //         this.fPlayerMapX, 
    //         this.fPlayerMapY, 
    //         ((x*this.fMinimapWidth)/this.TILE_SIZE),
    //         ((y*this.fMinimapWidth)/this.TILE_SIZE), 
    //         "#888888");
    // },
    
    // drawLine: function(startX, startY, endX, endY, cssColor)
    // {        
    //     this.editor.povoverlay_context.strokeStyle  = cssColor;  
    //     this.editor.povoverlay_context.beginPath();
    //     this.editor.povoverlay_context.moveTo(startX, startY);
    //     this.editor.povoverlay_context.lineTo(endX, endY);    
    //     this.editor.povoverlay_context.stroke();  
    // },
    
    
    update: function()
    {
        
        

        


        var thisContext = this;


        
        
        this.drawBackground();

        if (transitionTween.isPlaying())
        {

            
            this.wave(this.offscreen);
            

            // var colors = ['red','green','blue','orange','cyan','violet'];
            // var mycolor = colors[Phaser.Math.Between(0,5)];

            // this.wave(this.floor[this.floor.currentIndex],'cyan');

            // this.wave(this.wall[6],'blue');

            // this.wave(this.wall[4],'cyan');
            
        }

        
        
        //this.timedtext(this.wall[6],'blue');

        //this.wave(this.wall[4],'cyan');

        //this.noise(this.wall[4],'green');

        //this.timedtext(this.floor[17],'blue');

        this.rain(this.wall[1]);

        //this.noise(this.offscreen,'red');


        

        

        this.raycast();


        // // editor stuff
        // if (menu_mode)
        // {
            

        //     this.drawPlayerPOVOnEditorMap();

        //     this.editor.povoverlay_canvas.refresh();
        //     this.editor.povoverlay_context.clearRect(0, 0, 160, 160);

        // }

        

        this.zspritesgroup.children.iterate( 
            function(_sprite)
            { 
                if (_sprite != undefined)
                {
                    if (_sprite.inplay) 
                    {
                        
                        if (transitionTween.isPlaying() && _sprite.animationData != undefined)
                        {
                            //when transisitioning default to noise effect on active sprites
                            var colors = ['orange','white'];
                            var mycolor = colors[Phaser.Math.Between(0,1)];

                            thisContext.noise(_sprite, mycolor);

                        }
                           
                        

                        _sprite.move();
                    }
                }
                

                
            } );



        this.drawAllObjects();

        


        this.blitOffscreenCanvas();

        
        


        

        // check for shoot global

        if (gShoot && !menu_mode && !drive_mode) // disable shooting when menu up or in drive_mode
        {     
            this.playerShoot();
        }


        //check for portal intersect

        if (drive_mode)
        {
            var fx = Phaser.Math.Fuzzy.Equal(this.playercart.x,this.portal.x,16);
            var fy = Phaser.Math.Fuzzy.Equal(this.playercart.y,this.portal.y,16);
            if (fx && fy) 
            {
                drive_mode = false;
                
                this.playercart.x = 300;
                this.playercart.y = 600;

                this.playercart.lastX = this.playercart.x-1;
                this.playercart.lastY = this.playercart.y-1;
                

                this.playercart.savedpath = [];

                // initialize array --saved path for camera follow
                for (var s=0;s<40;s++)
                {
                    this.playercart.savedpath[s] = {x:300,y:600-(s*3)};
                }
                this.playercart.lastPoint = {x:300,y:600-(39*3)};
            }
        }
        else
        {
            var fx = Phaser.Math.Fuzzy.Equal(this.fPlayerX,this.portal.x,16);
            var fy = Phaser.Math.Fuzzy.Equal(this.fPlayerY,this.portal.y,16);
            if (fx && fy) 
            {
                drive_mode = true;
                this.fProjectionPlaneYCenter = 100;

                og_index++;
                if (og_index>=objectGangs.length) og_index=0;
                var new_objectgang = objectGangs[og_index];

                this.changeLevel(new_objectgang);
            }
        }
            


        
        
        


        if (drive_mode)
        {
            var playerXDir=this.fCosTable[this.playercart.arc];
            var playerYDir=this.fSinTable[this.playercart.arc];        
                   
            var adjustedarc;        
            var playerSXDir;
            var playerSYDir;

            adjustedarc=this.playercart.arc+this.ANGLE90;
            if (adjustedarc>this.ANGLE360)
            {
                adjustedarc-=this.ANGLE360;
            }
            playerSXDir=this.fCosTable[adjustedarc];
            playerSYDir=this.fSinTable[adjustedarc];
        }
        else
        {
            var playerXDir=this.fCosTable[this.fPlayerArc];
            var playerYDir=this.fSinTable[this.fPlayerArc];        
                   
            var adjustedarc;        
            var playerSXDir;
            var playerSYDir;

            adjustedarc=this.fPlayerArc+this.ANGLE90;
            if (adjustedarc>this.ANGLE360)
            {
                adjustedarc-=this.ANGLE360;
            }
            playerSXDir=this.fCosTable[adjustedarc];
            playerSYDir=this.fSinTable[adjustedarc];
        }
        




        var dx=0;
        var dy=0;
        var sdx=0;
        var sdy=0;        


        var strafeDelta=0;
        var zspeedDelta=0;
        var horizontalDelta=0;
        var verticalDelta=0;
        var forceAmp = 1;


        if (demo_mode)
        {

            strafeDelta = this.demoBot.strafeDelta;
            zspeedDelta = this.demoBot.zspeedDelta;
            horizontalDelta = this.demoBot.horizontalDelta;
            verticalDelta = this.demoBot.verticalDelta;

            this.doDemoBot();

        }
        else if (touchActivated)
        {

            strafeDelta = (guide_zspeed.input.localX-.5)*10;
            zspeedDelta = (guide_zspeed.input.localY-.5)*-10;
            horizontalDelta = guide_multi.input.localX-.5;
            verticalDelta = guide_multi_activeY-.5;

            if (drive_mode)
            {
                var r=Math.round(strafeDelta);
                
                this.playercart.arc+=r*3;
                    
                if (this.playercart.arc<this.ANGLE0) this.playercart.arc+=this.ANGLE360;
                else if (this.playercart.arc>=this.ANGLE360) this.playercart.arc-=this.ANGLE360;
                strafeDelta=0;

                if (gShoot)
                {     
                    this.playercart.jump();
                }
            }

        }
        else if (gamepad)
        {

            strafeDelta = (gamepad.rightStick.x*.5)*10;
            zspeedDelta = (gamepad.rightStick.y*.5)*-10;
            horizontalDelta = gamepad.leftStick.x*.5;
            verticalDelta = gamepad.leftStick.y*.5;

            if (drive_mode)
            {
                var r=Math.round(strafeDelta);
                
                this.playercart.arc+=r*3;
                    
                if (this.playercart.arc<this.ANGLE0) this.playercart.arc+=this.ANGLE360;
                else if (this.playercart.arc>=this.ANGLE360) this.playercart.arc-=this.ANGLE360;
                strafeDelta=0;

                

                if (gamepad.R1)
                {     
                    this.playercart.jump();
                }
                

            }
            else
            {
                if (gamepad.R1)
                {     
                    gShoot = true;
                }
                else
                {
                    gShoot = false;
                }  
            }

            

        }
        else //default to keyboard/mouse
        {

            // move forward
            if (cursors.up.isDown) zspeedDelta = this.fPlayerSpeed;
            
            // move backward
            if (cursors.down.isDown) zspeedDelta = -this.fPlayerSpeed;
            
            if (drive_mode)
            {
                //  check jump button
                if (gShoot)
                {     
                    this.playercart.jump();
                }

                // turn left
                if (cursors.left.isDown) 
                {
                    this.playercart.arc-=this.ANGLE5;
                    
                    if (this.playercart.arc<this.ANGLE0)
                        this.playercart.arc+=this.ANGLE360;
                }            
            
                // turn right
                if (cursors.right.isDown) 
                {
                    this.playercart.arc+=this.ANGLE5;
                    
                    if (this.playercart.arc>=this.ANGLE360)
                        this.playercart.arc-=this.ANGLE360;
                }

                horizontalDelta = horizontalMouseDelta;
                verticalDelta = verticalMouseDelta;

                forceAmp = 3;
            }
            else
            {
                // strafe left
                if (cursors.left.isDown) strafeDelta = -this.fPlayerSpeed;            
            
                // strafe right
                if (cursors.right.isDown) strafeDelta = this.fPlayerSpeed;

                horizontalDelta = horizontalMouseDelta;
                verticalDelta = verticalMouseDelta;

                forceAmp = 2.4;
            }
            

        }



        sdx=Math.round(playerSXDir*strafeDelta);
        sdy=Math.round(playerSYDir*strafeDelta);   

        dx=Math.round(playerXDir*zspeedDelta);
        dy=Math.round(playerYDir*zspeedDelta);        


        if (!menu_mode && !drive_mode)

        {
            
            if (tilt_mode)
            {
                this.cameras.main.rotation = -horizontalDelta*.24;
            }    
            

            this.fPlayerArc+=Math.floor(horizontalDelta*15*forceAmp);
            this.playerArcDelta=Math.floor(horizontalDelta*15*forceAmp);

            if (this.fPlayerArc<this.ANGLE0) this.fPlayerArc+=this.ANGLE360;
            if (this.fPlayerArc>=this.ANGLE360) this.fPlayerArc-=this.ANGLE360;
            
            if (verticalDelta>0)
            {
                //moving down -- ycenter decreases
                if (this.fProjectionPlaneYCenter<20)
                {
                    this.fPlayerElevation-=verticalDelta*3*forceAmp;
                }
                else
                {
                    this.fProjectionPlaneYCenter-=verticalDelta*6*forceAmp;
                }
            }
            if (verticalDelta<0)
            {
                // moving up -- ycenter increases
                if (this.fProjectionPlaneYCenter>140)
                {
                    this.fPlayerElevation-=verticalDelta*3*forceAmp;
                }
                else
                {
                    this.fProjectionPlaneYCenter-=verticalDelta*6*forceAmp;
                }
            }


            this.background[this.background.currentIndex].ImageArc-= this.playerArcDelta;

        }
        ///////////// keyboard elevation contol for editor/etc
        if (menu_mode && !demo_mode)
        {

            if (keys.E.isDown)
            {
                // if (this.fProjectionPlaneYCenter>145)
                // {
                    this.fPlayerElevation+=2;
                // }
                // else
                // {
                //     this.fProjectionPlaneYCenter+=5;
                // }
            }
            if (keys.C.isDown)
            {
                // if (this.fProjectionPlaneYCenter<50)
                // {
                    this.fPlayerElevation-=2;
                // }
                // else
                // {
                //     this.fProjectionPlaneYCenter-=5;
                // }
            }

                
            if (keys.D.isDown)
            {            
                this.fPlayerArc+=this.ANGLE1;            
            }
            if (keys.A.isDown)
            {
                this.fPlayerArc-=this.ANGLE1;
            }
            if (this.fPlayerArc<this.ANGLE0) this.fPlayerArc+=this.ANGLE360;
            if (this.fPlayerArc>=this.ANGLE360) this.fPlayerArc-=this.ANGLE360;

            if (keys.W.isDown)
            {            
                this.fProjectionPlaneYCenter+=3;           
            }
            if (keys.S.isDown)
            {
                this.fProjectionPlaneYCenter-=3;
            }

        }


        //// Background Image Control
                
        if (this.background[this.background.currentIndex].buffer!=undefined)
        {
        //console.log("this.fPlayerArc="+this.fPlayerArc+" this.fBackgroundImageArc="+this.fBackgroundImageArc);
        // This code wraps around the background image so that it can be drawn just one.
        // For this to work, the first section of the image needs to be repeated on the third section (see the image used in this example)
        if (this.background[this.background.currentIndex].ImageArc<-this.PROJECTIONPLANEWIDTH*2)
            this.background[this.background.currentIndex].ImageArc=this.PROJECTIONPLANEWIDTH*2+(this.background[this.background.currentIndex].ImageArc);
        else if (this.background[this.background.currentIndex].ImageArc>0)
            this.background[this.background.currentIndex].ImageArc=-(this.background[this.background.currentIndex].buffer.width-this.PROJECTIONPLANEWIDTH- (this.background[this.background.currentIndex].ImageArc));            
        }


        //// Player Position Updating

        if (drive_mode)
        {
            this.playercart.arc+=Math.floor(horizontalDelta*15*forceAmp);


            if (this.playercart.arc<this.ANGLE0) this.playercart.arc+=this.ANGLE360;
            if (this.playercart.arc>=this.ANGLE360) this.playercart.arc-=this.ANGLE360;

            this.playercart.x += (dx+sdx);
            this.playercart.y += (dy+sdy);

            this.driveCart();
        }
        else
        {
            this.fPlayerX+=(dx+sdx);
            this.fPlayerY+=(dy+sdy);
        }


// var debugt = [];
//                 // debugt.push(backgroundList[this.demoBot.bg_index]);
//                 debugt.push('fps: '+ Math.floor(this.sys.game.loop.actualFps.toString()) );
//                 debugt.push('zspeedDelta: '+ zspeedDelta );
//                 debugt.push('gamepad.rightStick.y: '+ gamepad.rightStick.y );

//         debug.setText(debugt);







        


        //// Elevation Limits

        if (this.fPlayerElevation<10)
            this.fPlayerElevation=10;
        else if (this.fPlayerElevation>800)
            this.fPlayerElevation=800;

        ///////////////

        //console.log(this.wMapArrays[this.MAP_currentlevelindex][playerYCell]);
        //console.log(this.wMapArrays[this.MAP_currentlevelindex][playerYCell][playerXCell+1]);


        //// Wall / Boundary Collisions / player hit

        if (!demo_mode)
        {
            var playerHit;
            var player_targetTolerance = 16;
            var player_hit_ED = 0;

            for (var i = 0; i < this.enemybulletsprites.length; i++)
            {
                if (this.enemybulletsprites[i].inplay)
                {
                    if ( Phaser.Math.Fuzzy.Equal(this.enemybulletsprites[i].x,this.fPlayerX,player_targetTolerance) && Phaser.Math.Fuzzy.Equal(this.enemybulletsprites[i].y,this.fPlayerY,player_targetTolerance) )
                    {
                        var net_ebullet_elev = this.enemybulletsprites[i].base_elevation+this.enemybulletsprites[i].elevation_delta;            
                        var net_player_elev = this.fPlayerElevation; // zsprite.base_elevation+zsprite.elevation_delta;
                        
                        if (Phaser.Math.Fuzzy.Equal(net_ebullet_elev,net_player_elev,player_targetTolerance))
                        {
                            playerHit=true;
                            playerHitCount++;
                            if (sound_enabled) { this.sound.playAudioSprite('sfx', 'char move') }
                            this.cameras.main.shake(260);
                        }                
                    }
                }
            }
            
            if (drive_mode)  
            {
                // CHECK COLLISION AGAINST WALLS
                // compute cell position
                var playerXCell = Math.floor(this.playercart.x/this.TILE_SIZE);
                var playerYCell = Math.floor(this.playercart.y/this.TILE_SIZE);

                // compute position relative to cell (ie: how many pixel from edge of cell)
                var playerXCellOffset = this.playercart.x % this.TILE_SIZE;
                var playerYCellOffset = this.playercart.y % this.TILE_SIZE;

                var minDistanceToWall=16;
                
                // make sure the player don't bump into walls
                if ((dx+sdx)>0)
                {
                    // moving right -- must manually check cell for left right map edge check
                    if (   ( playerXCell==this.MAP_WIDTH-1 || this.wMap.charAt( (playerYCell*this.MAP_WIDTH)+playerXCell+1)!='-' )&&
                        playerXCellOffset > (this.TILE_SIZE-minDistanceToWall)   ) 
                    {
                        // back player up
                        this.playercart.x-= (playerXCellOffset-(this.TILE_SIZE-minDistanceToWall));
                    }                
                }
                else
                {
                    // moving left -- must manually check cell for left right map edge check
                    if (   ( playerXCell==0 || this.wMap.charAt( (playerYCell*this.MAP_WIDTH)+playerXCell-1)!='-' )&&
                        playerXCellOffset < (minDistanceToWall)  )
                    {
                        // back player up
                        this.playercart.x+= (minDistanceToWall-playerXCellOffset);
                    } 
                } 

                if ((dy+sdy)<0)
                {
                    // moving up
                    if ((this.wMap.charAt(((playerYCell-1)*this.MAP_WIDTH)+playerXCell)!='-')&&
                        (playerYCellOffset < (minDistanceToWall)))
                    {
                        // back player up 
                        this.playercart.y+= (minDistanceToWall-playerYCellOffset);
                    }
                }
                else
                {
                    // moving down                                  
                    if ((this.wMap.charAt(((playerYCell+1)*this.MAP_WIDTH)+playerXCell)!='-')&&
                        (playerYCellOffset > (this.TILE_SIZE-minDistanceToWall)))
                    {
                        // back player up 
                        this.playercart.y-= (playerYCellOffset-(this.TILE_SIZE-minDistanceToWall ));
                    }
                }
            }
            else
            {
                // CHECK COLLISION AGAINST WALLS
                // compute cell position
                var playerXCell = Math.floor(this.fPlayerX/this.TILE_SIZE);
                var playerYCell = Math.floor(this.fPlayerY/this.TILE_SIZE);

                // compute position relative to cell (ie: how many pixel from edge of cell)
                var playerXCellOffset = this.fPlayerX % this.TILE_SIZE;
                var playerYCellOffset = this.fPlayerY % this.TILE_SIZE;

                var minDistanceToWall=30;
                
                // make sure the player don't bump into walls
                if ((dx+sdx)>0)
                {
                    // moving right -- must manually check cell for left right map edge check
                    if (   ( playerXCell==this.MAP_WIDTH-1 || this.wMap.charAt( (playerYCell*this.MAP_WIDTH)+playerXCell+1)!='-' )&&
                        playerXCellOffset > (this.TILE_SIZE-minDistanceToWall)   ) 
                    {
                        // back player up
                        this.fPlayerX-= (playerXCellOffset-(this.TILE_SIZE-minDistanceToWall));
                    }  
              
                }
                else
                {
                    // moving left -- must manually check cell for left right map edge check
                    if (   ( playerXCell==0 || this.wMap.charAt( (playerYCell*this.MAP_WIDTH)+playerXCell-1)!='-' )&&
                        playerXCellOffset < (minDistanceToWall)  )
                    {
                        // back player up
                        this.fPlayerX+= (minDistanceToWall-playerXCellOffset);
                    } 

                } 

                if ((dy+sdy)<0)
                {
                    // moving up
                    if ((this.wMap.charAt(((playerYCell-1)*this.MAP_WIDTH)+playerXCell)!='-')&&
                        (playerYCellOffset < (minDistanceToWall)))
                    {
                        // back player up 
                        this.fPlayerY+= (minDistanceToWall-playerYCellOffset);
                    }
                }
                else
                {
                    // moving down                                  
                    if ((this.wMap.charAt(((playerYCell+1)*this.MAP_WIDTH)+playerXCell)!='-')&&
                        (playerYCellOffset > (this.TILE_SIZE-minDistanceToWall)))
                    {
                        // back player up 
                        this.fPlayerY-= (playerYCellOffset-(this.TILE_SIZE-minDistanceToWall ));
                    }
                }
            }        
        }        

    
    },




    
    arcToRad: function(arcAngle)
    {
        return ((arcAngle*Math.PI)/this.ANGLE180);    
    },

    radToArc: function(arcRad)
    {
        return ((arcRad*this.ANGLE180)/Math.PI);    
    },
    
    

    

    //*******************************************************************//
    //* Draw background image
    //*******************************************************************//
    drawBackground : function()
    {
        if (this.background[this.background.currentIndex].buffer!=undefined)
        {
            // offset .putImageData y value to accomodate vertical projectionplane shifting

            this.offscreen.context.putImageData(this.background[this.background.currentIndex].imagedata,this.background[this.background.currentIndex].ImageArc,this.fProjectionPlaneYCenter-(this.PROJECTIONPLANEHEIGHT/2) - this.background[this.background.currentIndex].yoffset);

            this.offscreen.imagedata = this.offscreen.context.getImageData(0,0,this.gamedisplay_buffer.width, this.gamedisplay_buffer.height);

            this.offscreen.pixels = this.offscreen.imagedata.data;
        }
    },
    
    
    blitOffscreenCanvas : function()
    {        
        //this.offscreen.imagedata =  this.offscreen.context.getImageData(0,0,this.gamedisplay_buffer.width, this.gamedisplay_buffer.height);

        //this.tickleOffscreenCanvas();
        
        this.gamedisplay_context.putImageData(this.offscreen.imagedata,0,0);

        
        

        this.gamedisplay_buffer.refresh();

    },

    resetbuffer: function(thing)
    {
        var imageData = thing.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, thing.buffer.width, thing.buffer.height);
        thing.pixels = imageData.data;
    },
    
    timedtext: function(thing)
    {

        var nextChar = thing.animationData.msgstring.charAt(thing.animationData.msgindex);
        if ( game.loop.now > thing.animationData.timecheck + 65 || nextChar==' ')
        {
            if (thing.animationData.textspace == 0)
            {
                //this.wallAnimatedData[i].colorindex = Phaser.Math.Between(0,this.wallAnimatedData[i].numfontcolors-1);

                // this.wall_context.drawImage(this.walleraseimg, 0, 0, 
                // this.walleraseimg.width, this.walleraseimg.height, 
                // 0, 0, this.wallsrcimg.width, this.wallsrcimg.height);
                thing.context.clearRect(0, 0, 64, 64);

               
            }
            thing.animationData.timecheck=game.loop.now;
            var textX = thing.animationData.textspace%8;
            var textY = Math.floor(thing.animationData.textspace/8);
            thing.animationData.textspace++;
            if (thing.animationData.textspace>=64) {thing.animationData.textspace = 0; }


            
            thing.animationData.msgindex++;
            if (thing.animationData.msgindex>=64) { thing.animationData.msgindex=0 } //this.wallAnimatedData[i].modedoneflag='true';

            thing.buffer.drawFrame('fontsheet',nextChar+'color'+thing.animationData.colorindex,textX*8,textY*8);
        }

        var imageData = thing.context.getImageData(0,0, 64, 64);    
        thing.pixels = imageData.data;
    

    },

    wave: function(thing)
    {


        
        numberOfFrames = thing.buffer.width;
        wavePixelChunk = 1;
        
        // if the context is not updated we can retrieve the unaltered image data and pixels                 
        var imageData = thing.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, thing.buffer.width, thing.buffer.height);
        var savedpixels = imageData.data;

        // width is number of frames, 1 frame for every col
        for (var x = 0; x <numberOfFrames ; x += wavePixelChunk)
        {
            
                
            
                

            var y = thing.animationData.waveData.sin[x];

            for (var sy=0; sy<thing.buffer.height; sy++)  
            {   
                var bytesPerPixel=4; 

                var sourceIndex=(bytesPerPixel*x) + (thing.buffer.width*bytesPerPixel)*sy;

                var red=savedpixels[sourceIndex];
                var green=savedpixels[sourceIndex+1];
                var blue=savedpixels[sourceIndex+2];
                var alpha=savedpixels[sourceIndex+3];

                var yadj = Math.round(y)+sy
                var targetIndex= (bytesPerPixel*x) + (thing.buffer.width*bytesPerPixel)*yadj;

                thing.pixels[targetIndex]=red; 
                thing.pixels[targetIndex+1]=green;   
                thing.pixels[targetIndex+2]=blue;   
                thing.pixels[targetIndex+3]=alpha;         
            }                     
        }
            
        //  Cycle through the wave data - this is what causes the image to "undulate"
        Phaser.Utils.Array.RotateRight(thing.animationData.waveData.sin);
    
        // this.waveFrameIndex+=this.wavePixelChunk;
    
        // if (this.waveFrameIndex>=this.numberOfFrames) 
        // {
        //     this.waveFrameIndex = 0; 
        //     this.scrollcycles++;
        //     if (this.scrollcycles==1) { this.scrollcycles=0 } //this.wallAnimatedData.modedoneflag='true';
            
        // }
    },
    

    noise: function(thing,color)
    {
        var r,g,b;

        if (color=='red') { r=255; g=0; b=0; }
        if (color=='green') { r=0; g=255; b=0; }
        if (color=='blue') { r=0; g=0; b=255; }
        if (color=='orange') { r=255; g=255; b=0; }
        if (color=='cyan') { r=0; g=255; b=255; }
        if (color=='violet') { r=255; g=0; b=255; }
        if (color=='white') { r=255; g=255; b=255; }
        if (color=='black') { r=0; g=0; b=0; }

        //copy pixels
        for (var x=0; x<thing.buffer.width; x++)
        {            
            for (var y=0; y<thing.buffer.height; y++)
            {
                var bytesPerPixel=4;
                var targetIndex=(thing.buffer.width*bytesPerPixel)*y+(bytesPerPixel*x);          
                // var red = this.wall[i].pixels[targetIndex];
                // var green = this.wall[i].pixels[targetIndex+1];
                // var blue = this.wall[i].pixels[targetIndex+2];
                var alpha = thing.pixels[targetIndex+3];
            
                if (alpha!=0)
                {
                    var greylev = Phaser.Math.Between(80,160);
                    thing.pixels[targetIndex]=greylev*r/255;
                    thing.pixels[targetIndex+1]=greylev*g/255;
                    thing.pixels[targetIndex+2]=greylev*b/255;
                }                
            }            
        }
    },

    rain: function(thing)
    {


            //  'clearRect' clears the image from the CONTEXT. it does not clear any risidual data already extracted
            //  with 'getImageData' into var imageData. to do that 'getImageData' must be called again

            var imageData = thing.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, thing.buffer.width, thing.buffer.height);
            thing.pixels = imageData.data;
            



            // var mycolor = wallData[wallIndex].effect_color;
            // var r,g,b;

            // if (mycolor=='red') { r=255; g=0; b=0; }
            // if (mycolor=='green') { r=0; g=255; b=0; }
            // if (mycolor=='blue') { r=0; g=0; b=255; }
            // if (mycolor=='orange') { r=255; g=255; b=0; }
            // if (mycolor=='cyan') { r=0; g=255; b=255; }
            // if (mycolor=='violet') { r=255; g=0; b=255; }
            // if (mycolor=='white') { r=255; g=255; b=255; }
            // if (mycolor=='black') { r=0; g=0; b=0; }

            // if ( game.loop.now < this.wallAnimatedData.timecheck + 6000 )
            // {

                for (var j=0; j<thing.animationData.burstpixels.length; j++)
                {



                    var thispixel = thing.animationData.burstpixels[j];


                    thispixel.xpos += thispixel.xincr;
                    //if (thispixel.xpos<0 || thispixel.xpos>64) thispixel.xincr*=-1;

                    thispixel.ypos += thispixel.yincr;
                    if (thispixel.ypos<0) thispixel.ypos=thing.buffer.height;

                    // this.wall_context.drawImage(subsprite.img, 0, 0, 
                    //     subsprite.img.width, subsprite.img.height, 
                    //     this.wallAnimatedData.xpos, this.wallAnimatedData.ypos, subsprite.img.width/2, subsprite.img.height/2);   
                    var r;
                    var g;
                    var b;
                    var randColor = Phaser.Math.Between(0,1);

                    //if (randColor==0) { r=255; g=0; b=0; }//'red'
                    //if (randColor==1) { r=0; g=255; b=0; }//'green'
                    //if (randColor==0) { r=0; g=0; b=255; }//'blue'
                    //if (randColor==1) { r=255; g=255; b=0; }//'orange'
                    //if (randColor==4) { r=0; g=255; b=255; }//'cyan'
                    //if (randColor==1) { r=255; g=0; b=255; }//'violet'
                    //if (randColor==6) { r=255; g=255; b=255; }//'white'
                    //if (randColor==7) { r=0; g=0; b=0; }//'black' 

                    var calc_g = Math.round(-thispixel.yincr*100);
                    r=255; g=calc_g; b=255; 

                    if (game.loop.now>thispixel.timecheck+thispixel.switchtime)  
                    {
                        
                        thispixel.timecheck=game.loop.now;
                        //var greylev = Phaser.Math.Between(0,100);
                        thispixel.r = r;
                        thispixel.g = g;
                        thispixel.b = b;
                    }
                    
                    // if (game.loop.now>thispixel.timecheck+thispixel.switchtime)  
                    // {
                        
                    //     thispixel.timecheck=game.loop.now;
                    //     var greylev = Phaser.Math.Between(60,120);
                    //     thispixel.r = greylev*r/255;
                    //     thispixel.g = greylev*g/255;
                    //     thispixel.b = greylev*b/255;
                    // }

                    var bytesPerPixel=4;
                    var targetIndex=(thing.buffer.width*bytesPerPixel)* Math.round(thispixel.ypos) + ( bytesPerPixel* Math.round(thispixel.xpos) );     
                    thing.pixels[targetIndex]=thispixel.r;
                    thing.pixels[targetIndex+1]=thispixel.g;
                    thing.pixels[targetIndex+2]=thispixel.b;
                    thing.pixels[targetIndex+3]=255;
                }
    },


    //*******************************************************************//
    //* Renderer
    //*******************************************************************//
    raycast : function()
    {
        savedColumnDistances=[];

        var verticalGrid;        // horizotal or vertical coordinate of intersection
        var horizontalGrid;      // theoritically, this will be multiple of TILE_SIZE
                                 // , but some trick did here might cause
                                 // the values off by 1
        var distToNextVerticalGrid; // how far to the next bound (this is multiple of
        var distToNextHorizontalGrid; // tile size)
        var xIntersection;  // x and y intersections
        var yIntersection;
        var distToNextXIntersection;
        var distToNextYIntersection;

        var xGridIndex;        // the current cell that the ray is in
        var yGridIndex;
        var mapIndex;
        var v_savedMapIndex='';
        var h_savedMapIndex='';

        var distToVerticalGridBeingHit;      // the distance of the x and y ray intersections from
        var distToHorizontalGridBeingHit;      // the viewpoint

        var castArc, castColumn;
        var DEBUG=false;

        var H_edgeFlag;
        var V_edgeFlag;
        
        
        castArc = this.fPlayerArc;
        // field of view is 60 degree with the point of view (player's direction in the middle)
        // 30  30
        //    ^
        //  \ | /
        //   \|/
        //    v
        // we will trace the rays starting from the leftmost ray
        castArc-=this.ANGLE30;
        // wrap around if necessary
        if (castArc < 0)
        {
            castArc=this.ANGLE360 + castArc;
        }




        



        for (castColumn=0; castColumn<this.PROJECTIONPLANEWIDTH; castColumn+=1)
        {
            // Ray is between 0 to 180 degree (1st and 2nd quadrant).
            
            // Ray is facing down
            if (castArc > this.ANGLE0 && castArc < this.ANGLE180)
            {
                // truncuate then add to get the coordinate of the FIRST grid (horizontal
                // wall) that is in front of the player (this is in pixel unit)
                // ROUNDED DOWN
                horizontalGrid = Math.floor(this.fPlayerY/this.TILE_SIZE)*this.TILE_SIZE  + this.TILE_SIZE;

                // compute distance to the next horizontal wall
                distToNextHorizontalGrid = this.TILE_SIZE;

                var xtemp = this.fITanTable[castArc]*(horizontalGrid-this.fPlayerY);
                // we can get the vertical distance to that wall by
                // (horizontalGrid-playerY)
                // we can get the horizontal distance to that wall by
                // 1/tan(arc)*verticalDistance
                // find the x interception to that wall
                xIntersection = xtemp + this.fPlayerX;             
            }
            // Else, the ray is facing up
            else
            {
                horizontalGrid = Math.floor(this.fPlayerY/this.TILE_SIZE)*this.TILE_SIZE;
                distToNextHorizontalGrid = -this.TILE_SIZE;

                var xtemp = this.fITanTable[castArc]*(horizontalGrid - this.fPlayerY);
                xIntersection = xtemp + this.fPlayerX;

                horizontalGrid--;
            }
            // LOOK FOR HORIZONTAL WALL
            
            // If ray is directly facing right or left, then ignore it 
            if (castArc==this.ANGLE0 || castArc==this.ANGLE180)
            {
                distToHorizontalGridBeingHit=Number.MAX_VALUE;
            }
            // else, move the ray until it hits a horizontal wall
            else
            {
                distToNextXIntersection = this.fXStepTable[castArc];
                while (true)
                {
                    xGridIndex = Math.floor(xIntersection/this.TILE_SIZE);
                    yGridIndex = Math.floor(horizontalGrid/this.TILE_SIZE);
                    mapIndex=Math.floor(yGridIndex*this.MAP_WIDTH+xGridIndex);
                    var mapIndexChar = this.wMap.charAt(mapIndex);
                    
                    // If we've looked as far as outside the map range, then bail out
                    if ((xGridIndex>=this.MAP_WIDTH) ||
                        (yGridIndex>=this.MAP_HEIGHT) ||
                        xGridIndex<0 || yGridIndex<0)
                    {
                        distToHorizontalGridBeingHit = (xIntersection-this.fPlayerX)*this.fICosTable[castArc];//Number.MAX_VALUE;
                        //savedEdge  = (xIntersection-this.fPlayerX)*this.fICosTable[castArc];
                        h_savedMapIndex = '0';
                        H_edgeFlag=true;
                        break;
                    }
                    // If the grid is not an Opening, then stop
                    else if (  mapIndexChar!='-' )
                    {
                        h_savedMapIndex = mapIndexChar;
                        distToHorizontalGridBeingHit  = (xIntersection-this.fPlayerX)*this.fICosTable[castArc];
                        H_edgeFlag=false;
                        break;
                    }
                    
                    // Else, keep looking.  At this point, the ray is not blocked, extend the ray to the next grid
                    else
                    {
                        xIntersection += distToNextXIntersection;
                        horizontalGrid += distToNextHorizontalGrid;
                    }
                }
            }


            // FOLLOW X RAY
            if (castArc < this.ANGLE90 || castArc > this.ANGLE270)
            {
                verticalGrid = this.TILE_SIZE + Math.floor(this.fPlayerX/this.TILE_SIZE)*this.TILE_SIZE;
                distToNextVerticalGrid = this.TILE_SIZE;

                var ytemp = this.fTanTable[castArc]*(verticalGrid - this.fPlayerX);
                yIntersection = ytemp + this.fPlayerY;
            }
            // RAY FACING LEFT
            else
            {
                verticalGrid = Math.floor(this.fPlayerX/this.TILE_SIZE)*this.TILE_SIZE;
                distToNextVerticalGrid = -this.TILE_SIZE;

                var ytemp = this.fTanTable[castArc]*(verticalGrid - this.fPlayerX);
                yIntersection = ytemp + this.fPlayerY;

                verticalGrid--;
            }
              // LOOK FOR VERTICAL WALL
            if (castArc==this.ANGLE90||castArc==this.ANGLE270)
            {
                distToVerticalGridBeingHit = Number.MAX_VALUE;
            }
            else
            {
                distToNextYIntersection = this.fYStepTable[castArc];
                while (true)
                {
                    // compute current map position to inspect
                    xGridIndex = Math.floor(verticalGrid/this.TILE_SIZE);
                    yGridIndex = Math.floor(yIntersection/this.TILE_SIZE);
                    mapIndex=Math.floor(yGridIndex*this.MAP_WIDTH+xGridIndex);
                    var mapIndexChar = this.wMap.charAt(mapIndex);
                    
                    if ((xGridIndex>=this.MAP_WIDTH) || 
                        (yGridIndex>=this.MAP_HEIGHT) ||
                        xGridIndex<0 || yGridIndex<0)
                    {
                        distToVerticalGridBeingHit = (yIntersection-this.fPlayerY)*this.fISinTable[castArc];//Number.MAX_VALUE;
                        //savedEdge =

                        v_savedMapIndex = '0';

                        V_edgeFlag=true;
                        break;
                    }
                    else if (  mapIndexChar!='-' )
                    {

                        v_savedMapIndex = mapIndexChar;
                        distToVerticalGridBeingHit =(yIntersection-this.fPlayerY)*this.fISinTable[castArc];
                        V_edgeFlag=false;
                        
                        break;
                    }
                    
                    else
                    {
                        yIntersection += distToNextYIntersection;
                        verticalGrid += distToNextVerticalGrid;
                    }
                }
            }

            // DRAW THE WALL SLICE
            

            
            var dist;
            var xOffset;
            var yOffset;
            var projectedDelta;
            var savedMapIndex;
            //var edgeType;

            var topOfWall;   // used to compute the top and bottom of the sliver that
            var bottomOfWall;   // will be the staring point of floor and ceiling
            // determine which ray strikes a closer wall.
            // if yray distance to the wall is closer, the yDistance will be shorter than
            // the xDistance

            var isVerticalHit=false;
            if (distToHorizontalGridBeingHit < distToVerticalGridBeingHit)
            {
                //if (menu_mode) this.drawRayOnOverheadMap(xIntersection, horizontalGrid);

                savedMapIndex = h_savedMapIndex;
                //edgeType = h_edgeType;
                dist=distToHorizontalGridBeingHit;
                xOffset=xIntersection%this.TILE_SIZE;
                if (DEBUG)
                {               
                    console.log("castColumn="+castColumn+" using distToHorizontalGridBeingHit");
                }
            }
            // else, we use xray instead (meaning the vertical wall is closer than
            //   the horizontal wall)
            else
            {
                isVerticalHit=true;

                //if (menu_mode) this.drawRayOnOverheadMap(verticalGrid, yIntersection);
                
                savedMapIndex = v_savedMapIndex;
                //edgeType = v_edgeType;
                dist=distToVerticalGridBeingHit;
                xOffset=yIntersection%this.TILE_SIZE;
                
                if (DEBUG)
                {               
                    console.log("castColumn="+castColumn+" using distToVerticalGridBeingHit");
                }
            }

            savedColumnDistances.push(dist);


// var projectedObjectHeight=Math.floor(zsprite.buffer.height*this.fPlayerDistanceToTheProjectionPlane/distance);
// var projectedObjectWidth=Math.floor(zsprite.buffer.width*this.fPlayerDistanceToTheProjectionPlane/distance);

// if (zsprite.elevation_delta)
// {
//     var projected_ed = Math.floor(zsprite.elevation_delta*(projectedObjectHeight/zsprite.buffer.height));
//     var saved_ed = Math.floor(zsprite.elevation_delta);
// }
// else
// {
//     var projected_ed = 0;
//     var saved_ed = 0;
// }
// var bottomOfObject = Math.floor(this.fProjectionPlaneYCenter+(projectedObjectHeight*0.5)-projected_ed);
// var topOfObject = Math.floor(this.fProjectionPlaneYCenter-(projectedObjectHeight*0.5)-projected_ed);
            



            // correct distance (compensate for the fishbown effect)
            dist /= this.fFishTable[castColumn];
            // projected_wall_height/wall_height = fPlayerDistToProjectionPlane/dist;


            savedMapIndex = +savedMapIndex; //converts string to number
            

            var projectedWallHeight=(wallData[savedMapIndex].height*this.fPlayerDistanceToTheProjectionPlane/dist);
            var projectedWallWidth=(wallData[savedMapIndex].width*this.fPlayerDistanceToTheProjectionPlane/dist);


            var wallElevationDelta = (wallData[savedMapIndex].height/2)-this.fPlayerElevation;


            var projected_ed = wallElevationDelta*(projectedWallHeight/wallData[savedMapIndex].height);
        

            var bottomOfWall = Math.floor(this.fProjectionPlaneYCenter+(projectedWallHeight*0.5)-projected_ed);
            var topOfWall = Math.floor(this.fProjectionPlaneYCenter-(projectedWallHeight*0.5)-projected_ed);

            if (topOfWall<0 && bottomOfWall>199)
            {
                var pp_delta = Math.floor(this.PROJECTIONPLANEHEIGHT/2 - this.fProjectionPlaneYCenter);                
                var abs_pp_delta = Math.abs(pp_delta);
                var adj_pp_delta = (this.fTanTable[abs_pp_delta]*dist);

                //ensures the calculated height is cast at same scale even though it will be trimmed
                projectedDelta = (bottomOfWall-topOfWall);

                // setting topOfWall = 0 trims the calculated height to the visible area as the new height
                topOfWall = 0;
                //bottomOfWall = 200;
                
                
                var yd1 = ( 200*wallData[savedMapIndex].height / projectedWallHeight );
                var yd2 = (.5*(wallData[savedMapIndex].height-yd1));
                
                
                if (pp_delta>0)
                {
                    yOffset = Math.floor(yd2+(wallElevationDelta+adj_pp_delta))  ;
                }
                else
                {
                    yOffset = Math.floor(yd2+(wallElevationDelta-adj_pp_delta))  ;
                }
                
            }
            else
            {
                projectedDelta = null;
                yOffset = 0;
            }

            
// var debugt = [];

// if (castColumn==319)
// {
//     debugt.push('mapIndex: '+ mapIndex );

//     debugt.push('charAt: '+ this.wMap.charAt(mapIndex));
//     // debugt.push('topOfWall: '+ topOfWall );
//     // debugt.push('bottomOfWall: '+ bottomOfWall);

    
//     debugt.push('xGridIndex: '+ xGridIndex );
//     debugt.push('yGridIndex: '+ yGridIndex );

//     debugt.push('horizontalGrid: '+ horizontalGrid );
//     debugt.push('verticalGrid: '+ verticalGrid );

//     debugt.push('xIntersection: '+ xIntersection );
//     debugt.push('yIntersection: '+ yIntersection );

//     debugt.push('distToHorizontalGridBeingHit: '+ distToHorizontalGridBeingHit );
//     debugt.push('distToVerticalGridBeingHit: '+ distToVerticalGridBeingHit );

//     debugt.push('playerXCell: '+ Math.floor(this.fPlayerX/this.TILE_SIZE ));
//     debugt.push('playerYCell: '+ Math.floor(this.fPlayerY/this.TILE_SIZE ));
    

// }
// debugt.push('relYCenter: '+ (100-this.fProjectionPlaneYCenter) );
//debugt.push('fps: '+ Math.floor(this.sys.game.loop.actualFps.toString()) );

//debug.setText(debugt);


            
            if (DEBUG)
            {               
                console.log("castColumn="+castColumn+" distance="+dist);
            }
            
            
            //Add simple shading so that farther wall slices appear darker.
            
            //dist=Math.floor(dist);
            

            // if ( ((bottomOfWall-topOfWall) && !H_edgeFlag) || ((bottomOfWall-topOfWall) && !V_edgeFlag) )
            // {
                // Trick to give different shades between vertical and horizontal (you could also use different textures for each if you wish to)  
                if (isVerticalHit)
                {
                    
                    this.drawWallSliceRectangleTinted(castColumn, (topOfWall), 1, (bottomOfWall-topOfWall), 1.0, xOffset, yOffset, projectedDelta, savedMapIndex);// 90/(dist)
                }

                else
                {
                    
                    this.drawWallSliceRectangleTinted(castColumn, (topOfWall), 1, (bottomOfWall-topOfWall), 0.7, xOffset, yOffset, projectedDelta, savedMapIndex);// 120/(dist)
                }


            // }

            if (!wallCastMask)
            {
                var bytesPerPixel=4;
                var projectionPlaneCenterY=this.fProjectionPlaneYCenter;
                var lastBottomOfWall = Math.floor(bottomOfWall);
                //*************
                // FLOOR CASTING at the simplest!  Try to find ways to optimize this, you can do it!
                //*************
                if (this.floor[this.floor.currentIndex] != undefined)
                {
                    // find the first bit so we can just add the width to get the
                    // next row (of the same column)
                    var targetIndex=lastBottomOfWall*(this.offscreen.imagedata.width*bytesPerPixel)+(bytesPerPixel*castColumn);

                    // added 1 to this.PROJECTIONPLANEHEIGHT to correct last row glitch
                    for (var row=lastBottomOfWall;row<this.PROJECTIONPLANEHEIGHT+1;row++) 
                    {                          
                        var ratio=(this.fPlayerElevation)/(row-projectionPlaneCenterY);

                        var diagonalDistance = (this.fPlayerDistanceToTheProjectionPlane*ratio)*
                            (this.fFishTable[castColumn]) ;

                        // floor tile bug is drawing only floor tile 0 on map south(?) edge 
                        // adjusting diagonalDistance prevents *seeing* floor tile bug
                        // i.e. diagonalDistance*=.9

                        var yEnd = Math.floor(diagonalDistance * this.fSinTable[castArc]);
                        var xEnd = Math.floor(diagonalDistance * this.fCosTable[castArc]);
            
                        // Translate relative to viewer coordinates:
                        xEnd+=this.fPlayerX;
                        yEnd+=this.fPlayerY;




                        // Get the tile intersected by ray:
                        var cellX = Math.floor(xEnd / this.TILE_SIZE);
                        var cellY = Math.floor(yEnd / this.TILE_SIZE);
                        // compute current map position to inspect
                        var mapFloorIndex=cellY*this.MAP_WIDTH+cellX;
                        var mapFloorIndexChar = this.fMap.charAt(mapFloorIndex);
                        if (mapFloorIndexChar == '-' ) // || mapFloorIndexChar == undefined
                        {
                            var floorIndexToDraw = this.floor.currentIndex;
                        }
                        else
                        {
                            var floorIndexToDraw = +mapFloorIndexChar;
                        }
                        
                        //Make sure the tile is within our map
                        if ((cellX<this.MAP_WIDTH) &&   
                            (cellY<this.MAP_HEIGHT) &&
                            cellX>=0 && cellY>=0)
                        {            
                            // Find offset of tile and column in texture
                            var tileRow = Math.floor(yEnd % floorData[floorIndexToDraw].tilesize);
                            var tileColumn = Math.floor(xEnd % floorData[floorIndexToDraw].tilesize);
                            // Pixel to draw
                            var sourceIndex=(tileRow*this.floor[floorIndexToDraw].buffer.width*bytesPerPixel)+(bytesPerPixel*tileColumn);
                            
                            // Cheap shading trick
                            //var brighnessLevel=1;//(100/diagonalDistance);
                            var red=Math.floor(this.floor[floorIndexToDraw].pixels[sourceIndex]);//*brighnessLevel);
                            var green=Math.floor(this.floor[floorIndexToDraw].pixels[sourceIndex+1]);//*brighnessLevel);
                            var blue=Math.floor(this.floor[floorIndexToDraw].pixels[sourceIndex+2]);//*brighnessLevel);
                            var alpha=Math.floor(this.floor[floorIndexToDraw].pixels[sourceIndex+3]);                      
                            
                            // Draw the pixel 
                            if (alpha!=0)
                            {
                                this.offscreen.imagedata.data[targetIndex]=red;
                                this.offscreen.imagedata.data[targetIndex+1]=green;
                                this.offscreen.imagedata.data[targetIndex+2]=blue;
                                //this.offscreen.imagedata.data[targetIndex+3]=alpha;
                            }

                            
                            // Go to the next pixel (directly under the current pixel)
                            targetIndex+=(bytesPerPixel*this.offscreen.imagedata.width);                                          
                        }                                                              
                    }   
                }  
            }
            
                      

            // TRACE THE NEXT RAY
            castArc+=1;
            if (castArc>=this.ANGLE360)
                castArc-=this.ANGLE360;
        }


        

    },

    drawWallSliceRectangleTinted: function(x, y, width, height, brightnessLevel, xOffset, yOffset, projectedDelta, savedMapIndex)
    {       
        //console.log(savedMapIndex);
        //var xOffset=x%this.fWallTexture.width;    // wrap the image position
        
        // wait until the texture loads
        if (this.wall[savedMapIndex] == undefined)
            return;
        
        
        x=Math.floor(x);
        y=Math.floor(y);

        xOffset=Math.floor(xOffset);
        var bytesPerPixel=4;
        
        var sourceIndex=(bytesPerPixel*xOffset) + (this.wall[savedMapIndex].buffer.width*bytesPerPixel)*yOffset;

        var lastSourceIndex= sourceIndex + (this.wall[savedMapIndex].buffer.width*this.wall[savedMapIndex].buffer.height*bytesPerPixel);
        
        var targetIndex=(this.offscreen.imagedata.width*bytesPerPixel)*y+(bytesPerPixel*x);
        


        var heightToDraw = height;
        

// var debugt = [];

// debugt.push('y (topOfWall): '+ y );

// debugt.push('heightToDraw: '+ heightToDraw );

// debug.setText(debugt);


// clip bottom
        if (y+heightToDraw>this.offscreen.imagedata.height)
            heightToDraw=this.offscreen.imagedata.height-y;




        var yError=0;   
        

        // we need to check this, otherwise, program might crash when trying
        // to fetch the shade if this condition is true (possible if height is 0)
        if (heightToDraw<0)
            return;

        while (true)
        {                     
            // if error < actualHeight, this will cause row to be skipped until
            // this addition sums to scaledHeight
            // if error > actualHeight, this ill cause row to be drawn repeatedly until
            // this addition becomes smaller than actualHeight
            // 1) Think the image height as 100, if percent is >= 100, we'll need to
            // copy the same pixel over and over while decrementing the percentage.  
            // 2) Similarly, if percent is <100, we skip a pixel while incrementing
            // and do 1) when the percentage we're adding has reached >=100

            if (projectedDelta) 
            {
                yError += projectedDelta;
            }
            else
            {
                yError += height;
            }
            
                                                 
    
            var red=Math.floor(this.wall[savedMapIndex].pixels[sourceIndex]*brightnessLevel);
            var green=Math.floor(this.wall[savedMapIndex].pixels[sourceIndex+1]*brightnessLevel);
            var blue=Math.floor(this.wall[savedMapIndex].pixels[sourceIndex+2]*brightnessLevel);
            var alpha=Math.floor(this.wall[savedMapIndex].pixels[sourceIndex+3]);
            
            // while there's a row to draw & not end of drawing area

            // **test only -Getting the height from wallData to accomodate dynamic height editing
            while (yError>=this.wall[savedMapIndex].buffer.height)
            {                  
                yError-=this.wall[savedMapIndex].buffer.height;

                if (alpha!=0)
                {
                    this.offscreen.imagedata.data[targetIndex]=red;
                    this.offscreen.imagedata.data[targetIndex+1]=green;
                    this.offscreen.imagedata.data[targetIndex+2]=blue;
                    //this.offscreen.imagedata.data[targetIndex+3]=alpha;
                }
                


                targetIndex+=(bytesPerPixel*this.offscreen.imagedata.width);
                // clip bottom (just return if we reach bottom)
                heightToDraw--;
                if (heightToDraw<1)
                    return;
            }
            // **Get width from the buffer this.wall[savedMapIndex].buffer.width or use constant 64
            sourceIndex+=(bytesPerPixel*64);
            if (sourceIndex>lastSourceIndex)
                sourceIndex=lastSourceIndex;            
        }

    },    







    drawAllObjects: function()
    {
        // DRAW THE OBJECTS
        spriteZDistances = [];
        
        for (var i = 0; i < this.zspritesgroupArray.length; i++)
        {
            if (this.zspritesgroupArray[i].inplay) 
            {
                
                
                var distance = Phaser.Math.Distance.Between(this.zspritesgroupArray[i].x,this.zspritesgroupArray[i].y,this.fPlayerX,this.fPlayerY);

                this.zspritesgroupArray[i].distance = distance;

                spriteZDistances.push(distance);
            }
            else
            {
                this.zspritesgroupArray[i].distance = 0;
            }       
        }

        spriteZDistances.sort(function(a,b){return b-a});

        for (var i = 0; i < spriteZDistances.length; i++)
        {
            for (var j = 0; j < this.zspritesgroupArray.length; j++)
            {
                if (this.zspritesgroupArray[j].distance == spriteZDistances[i])
                {
                    
                    this.drawObject(this.zspritesgroupArray[j]);
                }
            }
        }        
    },

    drawObject: function(zsprite)
    {
        var yOffset=0;
        var projectedDelta;


        var chkangle = Phaser.Math.Angle.Between(zsprite.x,zsprite.y,this.fPlayerX,this.fPlayerY);
        //var distance = Phaser.Math.Distance.Between(zsprite.x,zsprite.y,this.fPlayerX,this.fPlayerY);

        var pcastArc = this.fPlayerArc;
        var parcrad = this.arcToRad(pcastArc)-Math.PI;
        var diffrad = (chkangle - parcrad);

        if (diffrad<-3)
        {
            diffrad += 2*Math.PI;
        }
        if (diffrad>3)
        {
            diffrad -= 2*Math.PI;
        }

        if (diffrad>0)
        {
            var occ = 160 + (diffrad * 160 / .524);
        }
        else
        {
            var occ = 160 - (-diffrad * 160 / .524);
        }


        // visible range to limit object drawing to. object cast column (occ) is the object center, 
        // so wider objects require a bigger range than the projection plane width (0..319) to not blink out of view
        if (occ<-100 || occ>419)
        {
            return;
        }
                
        var targetHit;
        if (zsprite.type == 'target')
        {

            var fx = Phaser.Math.Fuzzy.Equal(this.playercart.x,zsprite.x,16);
            var fy = Phaser.Math.Fuzzy.Equal(this.playercart.y,zsprite.y,16);

            if (fx && fy) targetHit = true;




            var targetTolerance = 16;
            var bullet_hit_ED = 0;
            for (var i = 0; i < this.bulletsprites.length; i++)
            {
                if (this.bulletsprites[i].inplay)
                {
                    if ( Phaser.Math.Fuzzy.Equal(this.bulletsprites[i].x,zsprite.x,targetTolerance) && Phaser.Math.Fuzzy.Equal(this.bulletsprites[i].y,zsprite.y,targetTolerance) )
                    {
                        var net_bullet_elev = this.bulletsprites[i].base_elevation+this.bulletsprites[i].elevation_delta;            
                        var net_sprite_elev = zsprite.base_elevation+zsprite.elevation_delta;
                        
                        if (Phaser.Math.Fuzzy.Equal(net_bullet_elev,net_sprite_elev,targetTolerance))
                        {
                            targetHit=true;
                        }                
                    }  
                }
            }
            
        }
        
        var current_ED = zsprite.elevation_delta;
        var abs_ED = (zsprite.base_elevation+current_ED)-this.fPlayerElevation;        
        
        if ( targetHit ) 
        {
            zsprite.hitcount++;
            if (zsprite.hitcount>0)
            {
                
                var thisexpsprite = this.explosionsprites[this.expspriteindex];

                this.expspriteindex++;
                if (this.expspriteindex==10) {this.expspriteindex=0}

                // uncomment for custom explosion hue based on target setting otherwise default is used
                //thisexpsprite.color = zsprite.explosioncolor;
                var colors = ['red','green','blue','orange','cyan','violet'];
                thisexpsprite.color = colors[Phaser.Math.Between(0,5)];
                
                ///clear the explosion buffer of any left over pixels from previous use
                var imageData = thisexpsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, thisexpsprite.buffer.width, thisexpsprite.buffer.height);
                thisexpsprite.pixels = imageData.data;
                

                thisexpsprite.x=zsprite.x;
                thisexpsprite.y=zsprite.y;

                thisexpsprite.inplay=true;

                thisexpsprite.base_elevation=abs_ED+this.fPlayerElevation;
                
                thisexpsprite.distance=zsprite.distance;
                thisexpsprite.timecheck = game.loop.now;

                

                for (var i = 0; i < thisexpsprite.numBurstPixels; i++)
                {
                    

                    // thisexpsprite.burstpixels[i].xincr = Phaser.Math.RND.realInRange(-1.5, 1.5);
                    // thisexpsprite.burstpixels[i].yincr = Phaser.Math.RND.realInRange(-1.5, 1.5);

                    //reset position of burst sprites to center
                    thisexpsprite.burstpixels[i].xpos = explosionsize/2;
                    thisexpsprite.burstpixels[i].ypos = explosionsize/2;
                }

                
                zsprite.hitcount = 0;
                zsprite.inplay = false;
            }
            
                        
        }
         

        if (zsprite.animated)
        {
            var projectedObjectHeight=zsprite.buffer.height*this.fPlayerDistanceToTheProjectionPlane/zsprite.distance;
            var projectedObjectWidth=zsprite.framewidth*this.fPlayerDistanceToTheProjectionPlane/zsprite.distance;

            var projected_ed = abs_ED*(projectedObjectHeight/zsprite.buffer.height);
            
            var bottomOfObject = Math.floor(this.fProjectionPlaneYCenter+(projectedObjectHeight*0.5)-projected_ed);
            var topOfObject = Math.floor(this.fProjectionPlaneYCenter-(projectedObjectHeight*0.5)-projected_ed);



            // if (projectedObjectHeight>200)
            // {
            //     var yd1 = (200*zsprite.buffer.height/projectedObjectHeight);
            //     var yd2 = (.5*(zsprite.buffer.height-yd1));

            //     projectedDelta = (bottomOfObject-topOfObject);

            //     topOfObject=0;
            //     //bottomOfObject=topOfObject+projectedObjectHeight;

            //     yOffset = Math.floor(yd2); 
            // }
            // else
            // {
                projectedDelta = null;
                yOffset = 0;
            // }




            for (var i=0;i<projectedObjectWidth;i++)
            {
                var calcColumn = Math.floor(occ-projectedObjectWidth/2)+i;

                if (zsprite.distance<savedColumnDistances[calcColumn])
                {
                    var imgstep = zsprite.framewidth/projectedObjectWidth;
                    var frameoffset = zsprite.frameindex*zsprite.framewidth;
                    var brightness;

                    if (targetHit) {brightness=1.0} else {brightness=1.0}
                    this.drawObjectSlice(zsprite,calcColumn,topOfObject,1,(bottomOfObject-topOfObject),Math.floor(i*imgstep)+frameoffset,0, yOffset, projectedDelta, brightness);                    
                }
            }
            
            if (game.loop.now> zsprite.animationtimecheck+zsprite.frametimer)
            {
                zsprite.animationtimecheck = game.loop.now;
                zsprite.frameindex++;
            }
            

            if (zsprite.frameindex == zsprite.numframes)
            {
                zsprite.frameindex = 0;
            }
        }

        else
        {
            var projectedObjectHeight=zsprite.buffer.height*this.fPlayerDistanceToTheProjectionPlane/zsprite.distance;
            var projectedObjectWidth=zsprite.buffer.width*this.fPlayerDistanceToTheProjectionPlane/zsprite.distance;
            
            var projected_ed = abs_ED*(projectedObjectHeight/zsprite.buffer.height);
           
            var bottomOfObject = Math.floor(this.fProjectionPlaneYCenter+(projectedObjectHeight*0.5)-projected_ed);
            var topOfObject = Math.floor(this.fProjectionPlaneYCenter-(projectedObjectHeight*0.5)-projected_ed);

            if (topOfObject<0 && bottomOfObject>199)
            {
                
                var pp_delta = Math.floor(this.PROJECTIONPLANEHEIGHT/2 - this.fProjectionPlaneYCenter);                
                var abs_pp_delta = Math.abs(pp_delta);
                var adj_pp_delta = (this.fTanTable[abs_pp_delta]*zsprite.distance);

                var yd1 = (200*zsprite.buffer.height/projectedObjectHeight);
                var yd2 = (.5*(zsprite.buffer.height-yd1));
                
                projectedDelta = (bottomOfObject-topOfObject);    
                topOfObject=0;

                if (pp_delta>0)
                {
                    yOffset = Math.floor(yd2+(abs_ED+adj_pp_delta)) ;
                }
                else
                {
                    yOffset = Math.floor(yd2+(abs_ED-adj_pp_delta)) ;
                    
                }


            }
            else
            {
                projectedDelta = null;
                yOffset = 0;
            }
            




// var debugt = [];

// debugt.push('this.playercart.x: '+ this.playercart.x );
// debugt.push('this.playercart.y: '+ this.playercart.y );

// debugt.push('zsprite.x: '+ zsprite.x );
// debugt.push('zsprite.y: '+ zsprite.y );

// var fx = Phaser.Math.Fuzzy.Equal(this.playercart.x,zsprite.x,targetTolerance);
// var fy = Phaser.Math.Fuzzy.Equal(this.playercart.y,zsprite.y,targetTolerance);


// debugt.push('fuzzy x: '+ fx );
// debugt.push('fuzzy y: '+ fy );
// // debugt.push('sprite proj.ed: '+ projected_ed );
// // debugt.push('sprite saved.ed: '+ saved_ed );

// // debugt.push('yd0: '+ yd0 );
// // debugt.push('yd1: '+ yd1 );
// // debugt.push('yd2: '+ yd2 );

// debugt.push('fps: '+ Math.floor(this.sys.game.loop.actualFps.toString()) );

// debug.setText(debugt);





            for (var i=0;i<projectedObjectWidth;i++)
            {
                var calcColumn = Math.floor(occ-projectedObjectWidth/2)+i;

                if (zsprite.distance<savedColumnDistances[calcColumn])
                {
                    var imgstep = zsprite.buffer.width/projectedObjectWidth;
                    var brightness;

                    if (targetHit) {brightness=1.0} else {brightness=1.0}

                    this.drawObjectSlice(zsprite,calcColumn,topOfObject,1,(bottomOfObject-topOfObject),Math.floor(i*imgstep),0, yOffset, projectedDelta, brightness);                    
                }
            } 
        }
                   
    },


    drawObjectSlice: function(zsprite, x, y, width, height, xOffset, frameoffset, yOffset, projectedDelta, brightnessLevel)
    {       
        //console.log("this.fWallTextureBuffer="+this.fWallTextureBuffer);
        //var xOffset=x%this.fWallTexture.width;    // wrap the image position
        
        // wait until the texture loads
        if (zsprite.buffer==undefined)
            return;
        
        var dy=height;
        x=Math.floor(x);
        y=Math.floor(y);

        xOffset=Math.floor(xOffset);
        var bytesPerPixel=4;
        
        var sourceIndex=(bytesPerPixel*xOffset) + (zsprite.buffer.width*bytesPerPixel)*yOffset;
        var lastSourceIndex=sourceIndex+(zsprite.buffer.width*zsprite.buffer.height*bytesPerPixel);
        
        var targetIndex=(this.offscreen.imagedata.width*bytesPerPixel)*y+(bytesPerPixel*x);
        


        var heightToDraw = height;
        // clip bottom
        if (y+heightToDraw>this.offscreen.imagedata.height)
            heightToDraw=this.offscreen.imagedata.height-y;




        var yError=0;   
        

        // we need to check this, otherwise, program might crash when trying
        // to fetch the shade if this condition is true (possible if height is 0)
        if (heightToDraw<0)
            return;

        while (true)
        {                     
            // if error < actualHeight, this will cause row to be skipped until
            // this addition sums to scaledHeight
            // if error > actualHeight, this ill cause row to be drawn repeatedly until
            // this addition becomes smaller than actualHeight
            // 1) Think the image height as 100, if percent is >= 100, we'll need to
            // copy the same pixel over and over while decrementing the percentage.  
            // 2) Similarly, if percent is <100, we skip a pixel while incrementing
            // and do 1) when the percentage we're adding has reached >=100
            if (projectedDelta) 
            {
                yError += projectedDelta;
            }
            else
            {
                yError += height;
            }
                                                 
    
            var red=Math.floor(zsprite.pixels[sourceIndex]*brightnessLevel);
            var green=Math.floor(zsprite.pixels[sourceIndex+1]*brightnessLevel);
            var blue=Math.floor(zsprite.pixels[sourceIndex+2]*brightnessLevel);
            var alpha=Math.floor(zsprite.pixels[sourceIndex+3]);
            
            // while there's a row to draw & not end of drawing area
            while (yError>=zsprite.buffer.height)
            {                  
                yError-=zsprite.buffer.height;

                if (alpha!=0)
                {
                    this.offscreen.imagedata.data[targetIndex]=red;
                    this.offscreen.imagedata.data[targetIndex+1]=green;
                    this.offscreen.imagedata.data[targetIndex+2]=blue;
                    //this.offscreen.imagedata.data[targetIndex+3]=alpha;
                }


                targetIndex+=(bytesPerPixel*this.offscreen.imagedata.width);
                // clip bottom (just return if we reach bottom)
                heightToDraw--;
                if (heightToDraw<1)
                    return;
            } 
            sourceIndex+=(bytesPerPixel*zsprite.buffer.width);
            if (sourceIndex>lastSourceIndex)
                sourceIndex=lastSourceIndex;            
        }

    }


});



