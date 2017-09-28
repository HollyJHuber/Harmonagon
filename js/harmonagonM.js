
/**
 * Harmonagon™ (beta)
 * Copyright (c) 2016, 2017 Radical Data and Media LLC and The Harmonagon Project
 */

 MIDI.loadPlugin(
{
    soundfontUrl: "./soundfont/",
    instrument: "acoustic_grand_piano",
    onprogress: function(state, progress){
        console.log(state, progress);
    },
    onsuccess: function() {
       MIDI.setVolume(0, 127);
        console.log("midi load plugin");
 // next two lines are end of MIDI.loadPlugIn
}
}); 

// w3 menu functions
function w3_displayNav(id)
{    
    if (id){
        var navEl = document.getElementById(id);
        if (navEl.className.indexOf("w3-show") == -1) {
                navEl.className += " w3-show";
            }
            else {
                navEl.className = navEl.className.replace (" w3-show", "");
            }
    }
    if( !id || id.indexOf("Menu") > 0){
        //var menus = ["CreateMenu", "PlayMenu", "LearnMenu", "ExploreMenu", "ChangeMenu", "ChangeMenuSm", "DiscoverMenu", "DiscoverMenuSm", "DonateMenu", "DonateMenuSm"];
        var menus = ["CreateMenu", "PlayMenu", "LearnMenu", "ExploreMenu", "ChangeMenu", "ChangeMenuSm", "DiscoverMenu", "DiscoverMenuSm"];
        for (var i = 0; i < menus.length; i++){
            if (id !== menus[i]){
                w3_close(menus[i]);
            }
        }    
    } 
};


function w3_close(id)
{
    var navEl = document.getElementById(id);
    navEl.className = navEl.className.replace(" w3-show", "");
    // DEBUG: may need to change this script to close other nav lists (like Tempo)
};

// called by Harmonagon icon on navbar to reload page
function reload()
{
    var forceGet = true;
    location.reload(forceGet);
    
};

// Discover menu's modal windows
function openInfo(infoTab){
    document.getElementById('Info').style.display='block';
    var i, x;
    x = document.getElementsByClassName("discover");
    for (i = 0; i < x.length; i++){
        x[i].style.display = "none";
    }
    document.getElementById(infoTab).style.display = "block";
};


/*var modal = document.getElementyById("Info");
window.onclick= function(event){
    if (event.target == modal){
        modal.style.display = "none";
    }
};*/

// this could be moved
function doMenu(onclick, option)
{
    switch(onclick)
    {
        case "MakeChord":
            w3_close("CreateMenu");
            makeSet("c");
            break;
        case "MakeScale":
            w3_close("CreateMenu");
            makeSet("s");
            break;
        case "Enter":
            w3_close("CreateMenu");
            clickEnter();
            break;
        case "Clear":
            w3_close("CreateMenu");
            clearAll();
            break;
        case "AddChord":
            w3_close("CreateMenu");
            addChord();
            break;
        case "MergeChords":
            // or Unmerge 
            w3_close("CreateMenu");
            
            if (document.getElementById("MERGE").innerHTML === "Merge Chords"){
                mergeChords();
                document.getElementById("MERGE").innerHTML = "Unmerge Chords";
            }
            else{
                undoMerge();
                document.getElementById("MERGE").innerHTML = "Merge Chords";
            }
            break;
    
        case "Play":
            w3_close("PlayMenu");
            doPlayNotes();
            break;
        case "Loop":
            w3_close("PlayMenu");
            playLoop("notes");
            break;
        case "LoopChords":
            w3_close("PlayMenu");
            playLoop("chords");
            break;
        case "SwapChords":
            w3_close("PlayMenu");
            swapChords();
            break;
        case "StopLoop":
            w3_close("PlayMenu");
            stopLoop();
            break;
            
        case "Tempo":
            w3_close("ChangeMenu");
            w3_close("ChangeMenuSm");
            w3_close("smallNav");
        
            DURATION = Math.round(30000/option);

            var bpmEls = document.getElementsByClassName("bpm");
            var tempos = [30, 60, 90, 100, 120, 140, 160, 180, 200, 220, 240, 30, 60, 90, 100, 120, 140, 160, 180, 200, 220, 240];

            for (var i = 0; i<tempos.length; i++){
                if (option === tempos[i]){
                     bpmEls[i].innerHTML = "<i class='fa fa-check'></i>" + option + " bpm";
                }
                else{
                    bpmEls[i].innerHTML = "&nbsp; &nbsp;"+ tempos[i] + " bpm";
                }
            }
            break;
            
        case "Info":
            w3_close("DiscoverMenu");
            w3_close("DiscoverMenuSm");
            w3_close("smallNav");
            document.getElementById('Info').style.display="block";
            openInfo(option);
            break;
    }
};

// harmonagon canvas
var c = document.getElementById("hpCanvas");
var ctx = c.getContext("2d");

c.width = (window.innerWidth * 0.5);
c.height = c.width;

var ctrX = c.width * 0.5;
var ctrY = ctrX;
var cirSize = ctrX * 0.65;

// setting up global variables -- do we need i, n here?
var mouseX, mouseY, i, n;
var HIDE = 0;
var CONSOLE = [0, 0, 0, 0];
var BUTTONS = "default";

// quiz variables -- values set in startQuiz()
var Q = 0;
var QSCORE; 
var QARRAY = [];
        

var INTERVAL;
var LOOP = 0;
var DURATION = 250;

// determining chord or scale mode and the note first clicked
var makeType = "";
var firstSelected = -1;
    
// create the note arrays
var note0 =[];
var note1 =[];
var note2 =[];
var note3 =[];
var note4 =[];
var note5 =[];
var note6 =[];
var note7 =[];
var note8 =[];
var note9 =[];
var note10 =[];
var note11 =[];

var notes = [note0, note1, note2, note3, note4, note5, note6, note7, note8, note9, note10, note11];

// create the label arrays, extra spaces for alignment
var label0 =[48, "C", "C", "C"];
var label1 =[49, "C# Db", "C#", "Db"];
var label2 =[50, "D", "D", "D"];
var label3 =[51, "   D# Eb", "D#", "Eb"];
var label4 =[52, "E","E","E"];
var label5 =[53, "F", "F", "F"];
var label6 =[54, "Gb F#", "F#", "Gb"];
var label7 =[55, "G", "G", "G"];
var label8 =[56, "Ab G#    ", "G#", "Ab"];
var label9 =[57, "A","A","A"];
var label10 =[58, "Bb A# ", "A#", "Bb"];
var label11 =[59, "B", "B", "B"];

var labels = [label0, label1, label2, label3, label4, label5, label6, label7, label8, label9, label10, label11];

setBackground = function(z)
{   
    var v = document.getElementById("vexflow");

    var isVisible = (document.getElementById("startup").style.display != "none") ||(document.getElementById("quiz").style.display != "none");

    // if resize and isVisible
    if( z  && isVisible){
        v.style.paddingTop = 0+ "px";
        v.style.backgroundColor= "rgb(217,217,217)";
        v.style.backgroundSize="";
        v.style.backgroundImage= "";
    }
    else{
        document.getElementById("startup").style.display = "none";
         v.style.backgroundColor= "rgb(248,221,188)";
         v.style.backgroundSize="150px 150px";
        v.style.backgroundImage= "url('paper_tile.jpg')";

        if ( window.innerWidth <= 960){
            v.style.paddingTop = "20px";
        }
        else{
            v.style.paddingTop = Math.round(labels[0][1] - (cirSize * 1/10) + 2)+ "px";
        }
    }
}

resizeCanvas = function()
{
    //set the canvas size, vexflow minHeight, ctrX, ctrY, cirSize based on the browser size
    
    if (window.innerWidth > 960){
        c.width = (window.innerWidth * 0.5);
        
         if (window.innerHeight - 76 > c.width){
            c.height = c.width;
            ctrX = c.width * 0.5;
            ctrY = ctrX;
            cirSize = ctrX * 0.65; 
            document.getElementById("vexflow").style.minHeight = (window.innerHeight - 76) + "px";
        }
        else{
            c.height = window.innerHeight - 76;
            c.width = window.innerWidth * 0.5;
            ctrX = c.width * 0.5;
            ctrY = c.height * 0.5
            cirSize = ctrY * 0.65;  
            document.getElementById("vexflow").style.minHeight = (c.height + 5) + "px";
        }
    }
    else{
        // breakpoint for vertical ipad or smaller
        c.width = window.innerWidth;
        c.height = c.width;
        ctrX = c.width * 0.5;
        ctrY = ctrX;
        cirSize = ctrX * 0.65; 
        document.getElementById("vexflow").style.minHeight =  "";
    }
    
    /*  there should be a better way to combine these if statements but I can't do it */
    
    
    // update arrays with new values
    var i, n, l;
    
    for ( i =0, n = 18; i < 12; i++, n+=2)
    {
        // reset numerator to 0
        if (n > 23) {
            n = 0;
        }

        //note# [x, y, numerator, selected]
        notes[i][0] = cirSize  * Math.cos(Math.PI * n/12) + ctrX;
        notes[i][1] = cirSize * Math.sin(Math.PI * n/12) + ctrY;
        
        if (window.innerWidth < 960){
            //xsmall
            l = 1.25;        
        }
        else{
             l = 1.225; 
        }
        //label# [x, y, number, midi, enharmonic, sharps, flats]
        labels[i][0] = (cirSize  * l) * Math.cos(Math.PI * n/12) + ctrX;
        labels[i][1] = (cirSize * l) * Math.sin(Math.PI * n/12) + ctrY;
    }
    
    setBackground(1);
    
    redraw();
};

/* to auto resize canvas */
/* and set up arrays */
initialize = function()
{
    var i, n, l;
    
    for ( i =0, n = 18; i < 12; i++, n+=2)
    {
        // reset numerator to 0
        if (n > 23) {
            n = 0;
        }

        //note# [x, y, numerator, selected]
        notes[i].push(cirSize  * Math.cos(Math.PI * n/12) + ctrX, cirSize * Math.sin(Math.PI * n/12) + ctrY, n, 0);
        
        if (window.innerWidth < 600){
            //xsmall
            l = 1.25;        
        }
        else{
             l = 1.225; 
        }

        //label# [x, y, number, midi, enharmonic, sharps, flats]
        labels[i].splice(0, 0, (cirSize  * l) * Math.cos(Math.PI * n/12) + ctrX, (cirSize * l) * Math.sin(Math.PI * n/12) + ctrY, i);
    }
    
    window.addEventListener('resize', resizeCanvas, false);
 
    
};
initialize();

var slideIndex = 0;

function carousel() {
    var captions = [ "The Harmonagon is a new app that uses simple geometric shapes to teach music.",
                    "The Harmonagon can identify and play more than 2,500 chords and scales.",
                    "The Harmonagon is compatible with every instrument and style of music.",
                    "Follow the Harmonagon on Facebook and Twitter and subscribe to our YouTube channel.",
                    "Making music on the Harmonagon is as easy as 1-2-3.",
                    "Sharing the knowledge of music with anyone, anywhere, for free.",
                    "Anyone can learn music using the Harmonagon."];
    var x = document.getElementsByClassName("slideShow");
    for (var i = 0, j = x.length; i < j; i++) {
       x[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > x.length) {slideIndex = 1}    
    x[slideIndex-1].style.display = "block"; 
    document.getElementById("slideCaption").innerHTML = captions[slideIndex-1];

    setTimeout(carousel, 5000); // Change image every 5 seconds
};
carousel();

// draw the structure without notes
drawCircle = function()
{
    var i, j, k, n, colorNote;
    
    var fifths = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5, 0];
    // draw background lines
    for (i = 0 ; i < notes.length ; i++)
    {
        // [i] and [j] reference note# in notes array
        for (j = 0 ; j < notes.length ; j++)
        {
            ctx.beginPath();
            ctx.lineTo(notes[i][0], notes[i][1]);
            ctx.lineTo(notes[j][0], notes[j][1]);
            ctx.strokeStyle = "rgba(64, 64, 64, 1)";
            ctx.lineWidth = cirSize * 1/150;
            ctx.stroke();
        }
    }
    
    // draw circle of fifths lines in color

    for (i = 0; i < fifths.length - 1 ; i++)
    {
        j = fifths[i];
        k = fifths[i+1];

        ctx.beginPath();
        ctx.lineTo(notes[j][0], notes[j][1]);
        ctx.lineTo(notes[k][0], notes[k][1]);
        // DEBUG: using globalAlpha here but may change if accessing color array
        ctx.globalAlpha=0.3;
        ctx.strokeStyle = noteColor(k);
        ctx.lineWidth = cirSize * 1/150;
        ctx.stroke();
        // DEBUG: reset globalAlpha
        ctx.globalAlpha=1;
    }
     
    // draw the circle
    ctx.beginPath();
    ctx.arc(ctrX, ctrY, cirSize, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(128, 128, 128, 1)";
    ctx.lineWidth = cirSize * 1/38;
    ctx.stroke();
    
    //TEMP: draw the label circle, for reference
/*  ctx.beginPath();
    ctx.arc(ctrX, ctrY, cirSize * 4/3, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(128, 128, 128, 1)";
    ctx.lineWidth = cirSize * 1/75;
    ctx.stroke();*/
    
    // create the intermediate arrays with RGB color values
    var intermediate0 = [51, 153, 77];
    var intermediate1 = [0, 153, 204];
    var intermediate2 = [51, 102, 255];
    var intermediate3 = [90, 0, 255];
    var intermediate4 = [102, 51, 255];
    var intermediate5 = [102, 0, 51];
    var intermediate6 = [153, 0, 51];
    var intermediate7 = [153, 0, 0];
    var intermediate8 = [204, 51, 0];
    var intermediate9 = [255, 153, 0];
    var intermediate10 = [204, 204, 102];
    var intermediate11 = [77, 189, 40];

    var intermediates = [intermediate0, intermediate1, intermediate2, intermediate3, intermediate4, intermediate5, intermediate6, intermediate7, intermediate8, intermediate9, intermediate10, intermediate11];
    
    for ( i =0, n = 18; i < 12; i++, n+=2)
    {
        // reset numerator to 0
        if (n > 23) {
            n = 0;
        }
        
        //intermediate# [x, y, numerator, r, g, b] using splice()
        intermediates[i].splice(0, 0, cirSize * Math.cos(Math.PI * (n + 1)/12) + ctrX, cirSize * Math.sin(Math.PI * (n + 1)/12) + ctrY, n + 1);
    }
    
    // draw intermediates circles
    for( i = 0; i < intermediates.length; i++)
    {
        colorNote = "rgba(" + intermediates[i][3] + "," + intermediates[i][4] + "," + intermediates[i][5] +", 1)";
        ctx.beginPath();
        ctx.arc(intermediates[i][0], intermediates[i][1], cirSize * 1/50, 0, 2 * Math.PI);
        ctx.fillStyle = colorNote;
        ctx.fill();
        ctx.strokeStyle = "rgba(128, 128, 128, 1)";
        ctx.lineWidth = cirSize * 1/150;
        ctx.stroke();
    }
};

drawConsole = function()
{
    
    var numerator, center, variation, colorB, a, i, j, k;
    
    // changing HIDE to minimize/display/hide
    if (HIDE){
       return;
    }
    else
    {   
        if (CONSOLE.length === 4)
        {
            numerator = 3;
            center = 7;
            variation = 6;
            var colors = [[Note6.noteR, Note6.noteG, Note6.noteB], 
                      [Note9.noteR, Note9.noteG, Note9.noteB], 
                      [Note0.noteR, Note0.noteG, Note0.noteB],
                      [Note3.noteR, Note3.noteG, Note3.noteB]];
        }
        else if (CONSOLE.length === 6)
        {
            numerator = 0;
            center = 2;
            variation = 4;
            var colors = [[Note4.noteR, Note4.noteG, Note4.noteB], 
                       [Note6.noteR, Note6.noteG, Note6.noteB], 
                       [Note8.noteR, Note8.noteG, Note8.noteB], 
                       [Note10.noteR, Note10.noteG, Note10.noteB], 
                       [Note0.noteR, Note0.noteG, Note0.noteB],
                       [Note2.noteR, Note2.noteG, Note2.noteB]];
        }
        
        j = numerator;
        k = numerator + variation;

        for (i = 0; i < CONSOLE.length; i++)
        {
            if (CONSOLE[i] > 0){
                a = "1.0";
            }
            else{
                a = "0.8";
            }
            colorB = "rgba(" + colors[i][0]+ ", " +  colors[i][1] + ", " +  colors[i][2] + "," + a+ ")";

            ctx.strokeStyle = "rgba(64, 64, 64, 0)";
            ctx.lineWidth = cirSize * 1/150;
            ctx.beginPath();
            ctx.fillStyle = colorB;
            ctx.arc(ctrX, ctrY, cirSize*5/8, j/12*Math.PI, k/12*Math.PI, false);
            ctx.arc(ctrX, ctrY, cirSize*2/9, k/12*Math.PI, j/12*Math.PI, true);
            ctx.lineTo(ctrX, ctrY);            
            ctx.fill();
            ctx.stroke();
            j += variation;
            k += variation;
        }

        drawButtons();
    }

}; // end drawConsole

drawButtons = function()
{
    var ctrTxt, i;
    var buttonTxt = [];
    var disable = [];
    
    if (CONSOLE.length === 4){
        ctrTxt = 6;
        variation = 6;
    }
    else if (CONSOLE.length === 6){
        ctrTxt = 2;
        variation = 4;
    }
    
    switch (BUTTONS)
    {
        // DEBUG: save commented code for when menu items are implemented (like TRANSPOSE, TRANSFORM, etc)

        case "default":
        default:
            buttonTxt = ["MAKE SCALE", "", "MAKE CHORD", ""];
            MakeScaleB.start = 3;
            MakeScaleB.end = 9;
            MakeScaleB.index = 0;
           // var disable = ["CLEAR","ENTER", "LOOP", "PLAY", "TRANSPOSE", "ADD CHORD", "LOOP CHORDS", "MERGE", "SWAP CHORDS", "TRANSFORM", "CHANGE MODE"];
            disable = ["CLEAR","ENTER", "LOOP", "PLAY", "ADD CHORD", "LOOP CHORDS", "MERGE", "SWAP CHORDS"];
            for (i=0; i< disable.length; i++){
                document.getElementById(disable[i]).className = "disabled";
            }
            for (i=0; i<buttonTxt.length; i++){
                if(buttonTxt[i] !== ""){
                    document.getElementById(buttonTxt[i]).className = "";
                }
            }
            break;
            
        case "enter":
            buttonTxt = ["CLEAR", "", "ENTER", ""];
            ClearB.start = 3;
            ClearB.end = 9;
            ClearB.index = 0;            
            for (i=0; i<buttonTxt.length; i++){
                if(buttonTxt[i] !== ""){
                    document.getElementById(buttonTxt[i]).className = "";
                }
            }
           //  var disable = ["LOOP", "PLAY", "TRANSPOSE", "ADD CHORD", "LOOP CHORDS", "MERGE", "SWAP CHORDS", "TRANSFORM", "CHANGE MODE"];
            disable = ["MAKE CHORD", "MAKE SCALE","LOOP", "PLAY", "ADD CHORD", "LOOP CHORDS", "MERGE", "SWAP CHORDS"];
            for (i=0; i< disable.length; i++){
                document.getElementById(disable[i]).className = "disabled";
            }
            break;
            
        case "addChord":
/*            buttonTxt = ["LOOP", "CLEAR", "PLAY", "TRANSPOSE", "ADD CHORD", "TRANSFORM"];
            ClearB.start = 4;
            ClearB.end = 8;
            ClearB.index = 1;
            PlayB.start = 8;
            PlayB.end = 12;
            PlayB.index = 2; */
            
            buttonTxt = ["CLEAR", "PLAY", "ADD CHORD", "LOOP"];
            ClearB.start = 3;
            ClearB.end = 9;
            ClearB.index = 0;
            PlayB.start = 9;
            PlayB.end = 15;
            PlayB.index = 1; 
            LoopB.start = 21;
            LoopB.end = 27;
            LoopB.index = 3;
    
            for (i=0; i<buttonTxt.length; i++){
                if(buttonTxt[i] !== ""){
                    document.getElementById(buttonTxt[i]).className="";
                }
            }
            // DEBUG: temp code to disable functions not yet available
            // document.getElementById("TRANSPOSE").className = "disabled";
            // document.getElementById("TRANSFORM").className = "disabled";
            break;
            
        case "madeScale":
            if (makeType === "m"){
                 buttonTxt = ["CLEAR", "PLAY", "UNMERGE", "LOOP"];
            }
            else{
                buttonTxt = ["CLEAR", "PLAY", "MAKE SCALE", "LOOP"];
            }
            // UNMERGE is only applicable for merged chords
            ClearB.start = 3;
            ClearB.end = 9;
            ClearB.index = 0;
            PlayB.start = 9;
            PlayB.end = 15;
            PlayB.index = 1; 
            MakeScaleB.start = 15;
            MakeScaleB.end = 21;
            MakeScaleB.index = 2;
            LoopB.start = 21;
            LoopB.end = 27;
            LoopB.index = 3;
/*            
            if (makeType === "m"){
                 buttonTxt = ["LOOP", "CLEAR", "PLAY","TRANSPOSE", "UNMERGE", "CHANGE MODE"];
            }
            else{
                buttonTxt = ["LOOP", "CLEAR", "PLAY","TRANSPOSE", "MAKE SCALE", "CHANGE MODE"];
            }
            ClearB.start = 4;
            ClearB.end = 8;
            ClearB.index = 1;
            PlayB.start = 8;
            PlayB.end = 12;
            PlayB.index = 2; 
            MakeScaleB.start = 16;
            MakeScaleB.end = 20;
            MakeScaleB.index = 4;
            */
            for (i=0; i<buttonTxt.length; i++){
                if(buttonTxt[i] !== ""){
                    // MERGE/UNMERGE menu item toggles
                    if(buttonTxt[i] === "UNMERGE"){
                        document.getElementById("MERGE").className="";
                        document.getElementById("MERGE").innerHTML = "Unmerge Chords";
                    }
                    else{
                        document.getElementById(buttonTxt[i]).className="";
                    }
                }
            }
            disable = ["MAKE CHORD", "MAKE SCALE", "LOOP CHORDS", "SWAP CHORDS"];
            for (i=0; i< disable.length; i++){
                document.getElementById(disable[i]).className = "disabled";
            }

            break;
            
         case "mergeChord":
            buttonTxt = ["LOOP", "CLEAR", "PLAY", "LOOP CHORDS", "MERGE", "SWAP CHORDS"];
            LoopB.start = 0;
            LoopB.end = 4;
            LoopB.index = 0;
            ClearB.start = 4;
            ClearB.end = 8;
            ClearB.index = 1;
            PlayB.start = 8;
            PlayB.end = 12;
            PlayB.index = 2; 
            for (i=0; i<buttonTxt.length; i++){
                if(buttonTxt[i] !== ""){
                    document.getElementById(buttonTxt[i]).className="";
                    if(buttonTxt[i] === "MERGE"){
                        document.getElementById("MERGE").innerHTML = "Merge Chords";
                    }
                }
            }
            //document.getElementById("TRANSPOSE").className="disabled";
            //document.getElementById("CHANGE MODE").className="disabled";
            break;
            
        case "madeSeq":
            buttonTxt = ["CLEAR", "", "PLAY", ""];
            ClearB.start = 3;
            ClearB.end = 9;
            ClearB.index = 0;  
            PlayB.start = 15;
            PlayB.end = 21;
            PlayB.index = 2; 
            for (i=0; i<buttonTxt.length; i++){
                if(buttonTxt[i] !== ""){
                    document.getElementById(buttonTxt[i]).className = "";
                }
            }
           // var disable = ["LOOP", "ENTER", "TRANSPOSE", "ADD CHORD", "LOOP CHORDS", "MERGE", "SWAP CHORDS", "TRANSFORM", "CHANGE MODE"];
            disable = ["MAKE CHORD", "MAKE SCALE", "LOOP", "ENTER", "ADD CHORD", "LOOP CHORDS", "MERGE", "SWAP CHORDS"];
            for (i=0; i< disable.length; i++){
                document.getElementById(disable[i]).className = "disabled";
            }
            break;
            
        case "madeRow":
            buttonTxt = ["CLEAR", "PLAY", "", "LOOP"];
            ClearB.start = 3;
            ClearB.end = 9;
            ClearB.index = 0;
            PlayB.start = 9;
            PlayB.end = 15;
            PlayB.index = 1; 
            LoopB.start = 21;
            LoopB.end = 27;
            LoopB.index = 3;
    
            for (i=0; i<buttonTxt.length; i++){
                if(buttonTxt[i] !== ""){
                    document.getElementById(buttonTxt[i]).className="";
                }
            }
            buttonTxt[2] = "NEW TONE ROW";
            // because "NEW" or "NEW TONE ROW" is not an html element, this has to be added after loop
            break;
            
// DEBUG: if you change the order of ANY buttons above, be sure to change start/end in the Button objects
    }
    // disable Enter for almost everything
    if (BUTTONS !== "enter"){
           document.getElementById("ENTER").className = "disabled";
    }
    //draw button text

    for (i = 0; i < CONSOLE.length; i++)
    {
        textSize = (cirSize * 1/18);
        ctx.font = textSize +"px Arial, sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.shadowColor = "rgba(0, 0, 0, 1)";
        ctx.shadowBlur = 5;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(buttonTxt[i], (cirSize * 5/12)  * Math.cos(Math.PI * ctrTxt/12) + ctrX, (cirSize * 5/12)  * Math.sin(Math.PI * ctrTxt/12) + ctrY);
        ctx.shadowBlur=0;
        ctrTxt += variation; 
    }
};

// Reset variables
doReset = function()
{
    // set all notes to off
    for (var i = 0, j = notes.length; i < j; i++)
    {
     notes[i][3] = 0;
    }

    // reset some mode/selection vars
    makeType = "";
    firstSelected = -1;
    
    // what about resetting the Sets of selected notes?
    // maybe not necessary if makeType is empty
    
    HIDE =0;
    CONSOLE = [0,0,0,0];
    BUTTONS = "default";
        
    // reset notes text to numbers
   Set3.notesText("n");
    // what if Set3 had values?? Seems to work
    
    //promptEl.innerHTML = "";

    
    // DEBUG: couldn't get this loop to work; "removeAttribute is not a function"
/*    var elements = ["nameEl", "name1El", "name2El", "notationEl", "notation1El", "notation2El", "notation3El", "descriptionEl", "description1El", "description2El"];
    for (i = 0; i < elements.length; i++){
        elements[i].innerHTML = "";
        elements[i].removeAttribute("class");
    }*/
    nameEl.innerHTML = "";
    notationEl.innerHTML = "";
    descriptionEl.innerHTML = "";
    name2El.innerHTML = "";
    notation2El.innerHTML = "";
    description2El.innerHTML = "";
    name1El.innerHTML = "";
    notation1El.innerHTML = "";
    description1El.innerHTML = "";
    notation3El.innerHTML = "";
    
    nameEl.removeAttribute("class");
    notationEl.removeAttribute("class");
    descriptionEl.removeAttribute("class");
    name1El.removeAttribute("class");
    notation1El.removeAttribute("class");
    description1El.removeAttribute("class");
    name2El.removeAttribute("class");
    notation2El.removeAttribute("class");
    description2El.removeAttribute("class");
    notation3El.removeAttribute("class");
    
    document.getElementById('quiz').style.display='none';
    var quizAsk = document.getElementById("quizAsk");
    var quizDiv = quizAsk.getElementsByTagName("div")[0];
    if (quizDiv){
        quizAsk.removeChild(quizDiv);
    }
    Q=0;
    QARRAY.splice(0, QARRAY.length);
};
    

// CONFIGURATION OBJECT TYPE FOR NOTES
var Notes = function(config)
{
    this.number = config.number;
    this.numerator = config.numerator;
    this.noteText = config.noteText || this.number;
    this.noteR = config.noteR; 
    this.noteG = config.noteG; 
    this.noteB = config.noteB; 
    this.noteA = config.noteA || 0.7;
    this.state = config.state || "off";
    this.onClick = config.onClick || function() {};
};

// DRAW FOR NOTES
Notes.prototype.draw = function() 
{
    var colorNote, textSize, textNote;
    var noteX = notes[this.number][0];
    var noteY = notes[this.number][1];
    
    if (window.innerWidth > 960){
        var noteSize = cirSize * 1/8.5;
    }
    else if (window.innerWidth < 600){
        //xsmall
         var noteSize = cirSize * 1/7;
    }
    else{
        //small
       var noteSize = cirSize * 1/7.5;
    }
    
    // update this.state based on notes array
    // DEBUG: for min, notes[#][3] = -1 set by clickEnter?
    if (notes[this.number][3] < 0)
    {
        this.state = "min";
        // DEBUG: if min doesn't call draw note text code, then maybe not change textNote?
        //textNote = "";
        this.noteA = 1;
        ctx.beginPath();
        
        ctx.arc(noteX, noteY, noteSize * 0.4, 0, 2 * Math.PI);
        colorNote = "rgba(" + this.noteR + "," + this.noteG + "," + this.noteB +"," + this.noteA +")";
        ctx.fillStyle = colorNote;
        ctx.fill();
        ctx.strokeStyle = "rgba(128, 128, 128, 1)";
        ctx.lineWidth = cirSize * 1/150;
        ctx.stroke();
    }
    else 
    {   
        if (notes[this.number][3])
        {
            this.state = "on";
            this.noteA = 1;
            ctx.beginPath();
            ctx.arc(noteX, noteY, noteSize, 0, 2 * Math.PI);
            colorNote = "rgba(" + this.noteR + "," + this.noteG + "," + this.noteB +"," + this.noteA +")";
            ctx.fillStyle = colorNote;
            ctx.shadowBlur = cirSize*1/5;
            ctx.shadowColor = colorNote;
            ctx.fill();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
            ctx.lineWidth = cirSize * 1/100;
            ctx.stroke();
            // turn off the shadow settings for subsequent draws
            ctx.shadowBlur = 0;
            //ctx.shadowColor = "rgba(0,0,0,0)";
            //ctx.strokeStyle = "rgba(0,0,0,0)";
        }
        else
        {
            this.state = "off";
            this.noteA = 0.7;
            ctx.beginPath();
            ctx.arc(noteX, noteY, noteSize, 0, 2 * Math.PI);
            colorNote = "rgba(" + this.noteR + "," + this.noteG + "," + this.noteB +"," + this.noteA +")";
            ctx.fillStyle = colorNote;
            ctx.fill();
            ctx.strokeStyle = "rgba(0, 0, 0, 0.7)";
            ctx.lineWidth = cirSize * 1/100;
            ctx.stroke();
        }

        //draw note text
        textNote = this.noteText;
        textSize = (cirSize * 1/12);
        ctx.shadowColor= "rgba(0, 0, 0, 1)";
        ctx.shadowBlur=5;
        ctx.font = textSize +"px Arial, sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(textNote, noteX, noteY);
        ctx.shadowBlur=0;
    }
};

// CONFIGURATION OBJECT TYPE FOR LABELS
var Labels = function(config)
{
    this.number = config.number;
    this.midi = config.midi;
    this.enharmonic = config.enharmonic;
    this.name = config.name || this.enharmonic;
    this.sharps = config.sharps;
    this.flats = config.flats;
    this.labelR = config.labelR || 255;
    this.labelG = config.labelG || 255;
    this.labelB = config.labelB || 255;
    this.labelA = config.labelA || 1;
};

// DRAW FOR LABELS
Labels.prototype.draw = function() 
{
    // set label transparency based on makeType and note state
    // verify that Set1.selected is populated before accessing values
    if (makeType === "c3" && Set1.selected.length === 12)
    {
        if (Set1.selected[this.number] === 1){
            this.labelA = 0.7;
        }
        else{
            this.labelA = 0.2;
        }
    }
    // DEBUG: not sure if notes[this.number][3] should be 0 or -1?
    else if ((makeType === "c1" || makeType === "s1" || makeType === "m") && (notes[this.number][3] < 1)){
        this.labelA = 0.2;
    }
   else {
        // default
        this.labelA = 1;
    }
    // required to ensure that selected notes display labels
    if (notes[this.number][3] === 1){
        this.labelA = 1;
    }
    
    var labelX = labels[this.number][0];
    var labelY = labels[this.number][1];
    
    var textLabel = (cirSize * 1/10);
    var textColor = "rgba(" + this.labelR + "," + this.labelG + "," + this.labelB +"," + this.labelA +")";
    ctx.font = textLabel +"px Opus Chords Sans Std, Arial, sans-serif";
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.name, labelX, labelY);
};

// CONFIGURATION OBJECT TYPE FOR BUTTONS
var Buttons = function(config)
{
    this.index = config.index;
    this.start = config.start;
    this.end = config.end;
    this.text = config.text;
    this.state = config.state || 0;
    this.onClick = config.onClick || function() {};
};


// MOUSE: WHICH NOTE IS CLICKED function

function mouseClicked (event)
{
    mouseX = event.clientX - ctx.canvas.offsetLeft;
    mouseY = event.clientY - ctx.canvas.offsetTop;
    
    // close any menu that may be left open, including modal
    w3_displayNav();
    document.getElementById('Info').style.display="none";
    
    // stop loop by clicking anywhere in circle
    if (LOOP)
    {
        ctx.beginPath();
        ctx.arc(ctrX, ctrY, cirSize, 0, 2*Math.PI);
        ctx.closePath();
        if(ctx.isPointInPath(mouseX,mouseY)){
            stopLoop ();
            return;
        }
        return;
    }
    
    Note0.handleMouseClick();
    Note1.handleMouseClick();
    Note2.handleMouseClick();
    Note3.handleMouseClick();
    Note4.handleMouseClick();
    Note5.handleMouseClick();
    Note6.handleMouseClick();
    Note7.handleMouseClick();
    Note8.handleMouseClick();
    Note9.handleMouseClick();
    Note10.handleMouseClick();
    Note11.handleMouseClick();
    
    //check for HIDE and if not, check for inside console and then check other buttons?
    
    // unhide by clicking anywhere in circle
    if (HIDE)
    {
        if(Q){
            // if quizmode, then don't display button console
            return;
        }
        ctx.beginPath();
        ctx.arc(ctrX, ctrY, cirSize* 5/6, 0, 2*Math.PI);
        ctx.closePath();
        if(ctx.isPointInPath(mouseX,mouseY)){
            HIDE = 0;
            redraw();
            return;
        }
    }
    
    ctx.beginPath();
    ctx.arc(ctrX, ctrY, cirSize*2/9, 0, 2*Math.PI);
    ctx.closePath();
    if(ctx.isPointInPath(mouseX,mouseY))
    {
        if (HIDE){
            HIDE = 0;
        }
        else{
            HIDE = 1;
        }
        redraw();
    }
    else 
    {
        ctx.beginPath();
        ctx.arc(ctrX, ctrY, cirSize*5/8, 0, 2*Math.PI);
        ctx.closePath();
        if(ctx.isPointInPath(mouseX,mouseY))
        {        
            switch (BUTTONS)
            {
                case "default":
                default:
                    MakeScaleB.handleMouseClick();
                    MakeChordB.handleMouseClick();
                    break;
                case "enter":
                    EnterB.handleMouseClick();
                    ClearB.handleMouseClick();
                    break;
                case "addChord":
                    LoopB.handleMouseClick();
                    ClearB.handleMouseClick();
                    PlayB.handleMouseClick();
                    //TransposeB.handleMouseClick();
                    AddChordB.handleMouseClick();
                    //TransformB.handleMouseClick();
                    break;
                case "mergeChord":
                    LoopB.handleMouseClick();
                    ClearB.handleMouseClick();
                    PlayB.handleMouseClick();
                    LoopChordsB.handleMouseClick();
                    MergeChordsB.handleMouseClick();
                    SwapChordsB.handleMouseClick();
                    break;
                case "madeScale":
                    LoopB.handleMouseClick();
                    ClearB.handleMouseClick();
                    PlayB.handleMouseClick();
                    //TransposeB.handleMouseClick();
                    if (makeType === "m"){
                        UnmergeB.handleMouseClick();
                    }
                    else{
                        MakeScaleB.handleMouseClick();
                    }
                   //ChangeModeB.handleMouseClick();
                    break;
                case "madeSeq":
                    PlayB.handleMouseClick();
                    ClearB.handleMouseClick();
                    break;
                case "madeRow":
                    LoopB.handleMouseClick();
                    ClearB.handleMouseClick();
                    PlayB.handleMouseClick();
                    NewB.handleMouseClick();
                    break;

            }
        }
    }
};

Buttons.prototype.handleMouseClick = function()
{
    if (LOOP){
        return;
    }
    
    // only checks for button objects, not HIDE
    ctx.beginPath();
    ctx.arc(ctrX, ctrY, cirSize*5/8, this.start/12 * Math.PI, this.end/12 * Math.PI);
    ctx.lineTo(ctrX, ctrY);
    ctx.closePath();

    if(ctx.isPointInPath(mouseX,mouseY))
    {   
        // turns on button so redraws with alpha 1
        CONSOLE[this.index] = 1;
        redraw();
        setTimeout(this.onClick, 375);
        CONSOLE[this.index] = 0;
    }
 
}; // end of Buttons.prototype.handleMouseClick

Notes.prototype.isMouseInside = function() 
{    
    var noteX = notes[this.number][0];
    var noteY = notes[this.number][1];
    if (window.innerWidth > 1023){
        var noteSize = cirSize * 1/9;
    }
    else{
        // breakpoint for vertical ipad or smaller
       var noteSize = cirSize * 1/8;
    }
    
 
    return (mouseX >= noteX - noteSize &&
           mouseX <= noteX + noteSize &&
           mouseY >= noteY - noteSize &&
           mouseY <= noteY + noteSize);
};

// MOUSE: WHAT TO DO WITH CLICK function
Notes.prototype.handleMouseClick = function() 
{    
    // this.onClick currently just calls redraw() 
    // when five states are possible, change this to switch( )
    if (this.isMouseInside()) 
    {
        
        if (!makeType)
        {
            this.state = "on";
            notes[this.number][3] = 1;            
            this.onClick();
            MIDI.noteOn(0, labels[this.number][3], 127, 0);
            MIDI.noteOff(0, labels[this.number][3], 0.5);
            // using delay of 500 milliseconds
            
            this.state = "off";
            notes[this.number][3] = 0;
            
            setTimeout(this.onClick, 375);
        }
        else if (this.state === "off")
        {
            var playMidi;
            this.state = "on";
            notes[this.number][3] = 1;
            
            // capture first note selected
            if(makeType && firstSelected < 0){
                firstSelected = this.number;
                playMidi = labels[this.number][3];
            }
            else{
                if(this.number < firstSelected){
                    playMidi = labels[this.number][3] + 12;
                }
                else{
                    playMidi = labels[this.number][3];
                }
            }
            
            MIDI.noteOn(0, playMidi, 127, 0);
            MIDI.noteOff(0, playMidi, 0.5);
             // using delay of 500 milliseconds

           this.onClick();
        }
        else if (this.state === "on")
        {
            this.state = "off";
            // change boolean array value
            notes[this.number][3] = 0;

            // capture first note selected
            if(makeType && firstSelected === this.number){
                firstSelected = -1;
            }

            this.onClick();
        }
        // no else: don't want to do anything because you can't click a min note
    }
};

// CONFIGURATION OBJECT TYPE FOR SETS
var Sets = function(config)
{
    this.set = config.set; // which set
    this.number = config.number;  // number of notes
    this.kind = config.kind;  // c =chord s =scale or q =sequence
    this.root = config.root;  
    this.rootName = config.rootName;
    this.selected = config.selected; // 12-note boolean array
    this.undef = config.undef; // boolean
    this.roman = config.roman; // array
    this.chordNotes = config.chordNotes; // array
    this.chordMidi = config.chordMidi; // array
    this.noteSeq = config.noteSeq; // array
    this.midiSeq = config.midiSeq; // array
    this.drawSeq = config.drawSeq; // array
    this.vexflowSeq = config.vexflowSeq; // array
    // DEBUG: could add name and description
};
// Sets values are set in clickEnter, based on matches from the kb

// SET OBJECTS
var Set1 = new Sets ({
    set: 1,
    number: 0
});
var Set2 = new Sets ({
    set: 2,
    number: 0
});
var Set3 = new Sets ({
    set: 3,
    number: 0
});
// DEBUG: Set1 was c1; Set2 was c2; Set3 is for merged or current

// VEXFLOW
Sets.prototype.vexflow = function()
{
    var vfDiv, svgEl, vfheight, vfwidth;
        
   if (this.vexflowSeq === undefined){
       console.log ("undefined");
       return;
       // exit script if no seq, add code later to write vexflowSeq
   }
    
    vfheight = 132; // change only if 2 staves
    vfwidth = 360; // set to default
    
     switch(this.number)
    {
        case 3:
        case 4:
        case 5:
            // 2 measures
            vfwidth = 610;
            break;
        case 6:
            if (this.undef && this.kind === "c"){
                // 3 measures
                vfwidth = 710; 
            }
            else{
                // 2 measures
                vfwidth = 610;
            }
            break;
        case 7:
        case 8:
        case 9:
        case 10:
            // 3 measures
            vfwidth = 710;
            break;
        case 11:
        case 12:
            if (this.kind === "q" && this.roman[0] === "I"){
                // chromatic or circle: 2 measures
                vfwidth = 610;
            }
            else{
                // 4 measures, 2 staves
                vfwidth = 610;
                vfheight = 264;  
            }
            break;
    }   
    
     if (this.set === 3){
        vfDiv = "notation";
         
    }
    else{
        vfDiv = "notation" + this.set;
    }
    
    const VF = Vex.Flow;
    
        // Create an SVG renderer and attach it to the DIV element
    var vf = new VF.Factory({renderer: {selector: vfDiv , height: vfheight, width: vfwidth}});
    const context = vf.getContext();
    context.setViewBox(0, 0, 760, vfheight);
    
    context.setFillStyle('#000000');
    
    var score = vf.EasyScore();
    var voice = score.voice.bind(score);
    var notes = score.notes.bind(score);
    var beam = score.beam.bind(score);
    
    // required for using a stave tie
    var registry = new VF.Registry();
    VF.Registry.enableDefaultRegistry(registry);
    function id(id) { return registry.getElementById(id); }
    
   
    var x = 0, y = 22;
    function makeSystem(width) {
        var system = vf.System({x: x, y: y, width: width, spaceBetweenStaves: 10});
        x += width;
        return system;
    }
    
    // set the first measure
     switch(this.number)
    {
        case 1:
        case 2:
            /* Measure 1 of 1 */
            var system = makeSystem(350);
            system.addStave({
                voices: [
                      voice(beam(notes(this.vexflowSeq[0][0], {stem: this.vexflowSeq[0][1]}))
                      .concat(notes(this.vexflowSeq[1][0])))],
            }).addClef('treble').addTimeSignature('4/4').setEndBarType(VF.Barline.type.DOUBLE);
            
                         console.log("this.vexflowSeq[0][1]: " +this.vexflowSeq[0][0] );
            break;
           
        case 3:
            /* Measure 1 of 2 */
           var system = makeSystem(350);
           system.addStave({ 
               voices: [
                      voice(beam(notes(this.vexflowSeq[0][0], {stem: this.vexflowSeq[0][1]}))
                      .concat(beam(notes(this.vexflowSeq[1][0], {stem: this.vexflowSeq[1][1]})))
                      .concat(notes(this.vexflowSeq[2][0])))],
            }).addClef('treble').addTimeSignature('4/4');
            break;
            
        default:
             /* Measure 1 of 2+ */
            if (this.kind === "q" && this.roman[0] === "R"){
                // intervals
                var system = makeSystem(200);
                system.addStave({ 
                  voices: [voice(notes(this.vexflowSeq[0][0], {stem: this.vexflowSeq[0][1]}))]
                }).addClef('treble').addTimeSignature('4/4').setEndBarType(VF.Barline.type.DOUBLE); 
            }
            else if(this.kind === "q" && this.roman[0] === "1"){
                var system = makeSystem(350);
                system.addStave({ 
                  voices: [voice(notes(this.vexflowSeq[0][0], {stem: this.vexflowSeq[0][1]}) .concat(notes(this.vexflowSeq[1][0], {stem: this.vexflowSeq[1][1]})))],
                }).addClef('treble').addTimeSignature('4/4');
            }
            else
            {
                if ((this.number > 6 && this.number < 11) || (this.number === 6 && this.undef)){
                    var system = makeSystem(300);
                }
                else{
                    var system = makeSystem(350);  
                }
                system.addStave({ 
                  voices: [voice(beam(notes(this.vexflowSeq[0][0], {stem: this.vexflowSeq[0][1]}))
                      .concat(beam(notes(this.vexflowSeq[1][0], {stem: this.vexflowSeq[1][1]}))))],
                }).addClef('treble').addTimeSignature('4/4');
            }
            break;
    }

    // set the second measure
    if (this.number > 2)
    {
        
        if (this.kind === "q" && this.roman[0] === "R" ){
             var system = makeSystem(350);
        }
        else{
            var system = makeSystem(250);
        }
        switch(this.number)
        {
            case 3:
                 /* Measure 2 of 2 */
                system.addStave({ 
                      voices: [voice(notes(this.vexflowSeq[3][0]))],
                }).setEndBarType(VF.Barline.type.DOUBLE);
                break;
                
            case 4:
            case 5:
                 /* Measure 2 of 2 */
                if((this.number === 4) || (this.number === 5 && this.kind === "c" && ! this.undef))
                {
                        system.addStave({
                              voices: [voice(notes(this.vexflowSeq[2][0]))],
                         }).setEndBarType(VF.Barline.type.DOUBLE);
                }
                else
                {
                    system.addStave({
                          voices: [voice(beam(notes(this.vexflowSeq[2][0], {stem: this.vexflowSeq[2][1]}))
                              .concat(notes(this.vexflowSeq[3][0])))],
                     }).setEndBarType(VF.Barline.type.DOUBLE);
                }
                break;
            case 6:
                /* Measure 2 of 2 */
                 if ( this.kind === "c" && this.undef)
                {
                     system.addStave({
                      voices: [voice(beam(notes(this.vexflowSeq[2][0], {stem: this.vexflowSeq[2][1]}))
                          .concat(notes(this.vexflowSeq[3][0])))],
                      });  
                     /* Measure 3 of 3 */
                        var system = makeSystem(150);
                        system.addStave({ 
                            voices: [voice(notes(this.vexflowSeq[4][0]))],
                        }).setEndBarType(VF.Barline.type.DOUBLE);
                }
                else
                {
                    system.addStave({
                      voices: [voice(beam(notes(this.vexflowSeq[2][0], {stem: this.vexflowSeq[2][1]}))
                          .concat(notes(this.vexflowSeq[3][0])))],
                     }).setEndBarType(VF.Barline.type.DOUBLE);
                }
                break;

                
            case 7:
                if (this.kind === "c" && !this.undef)
                {
                    /* Measure 2 of 3 */
                    system.addStave({
                          voices: [voice(beam(notes(this.vexflowSeq[2][0], {stem: this.vexflowSeq[2][1]}))
                              .concat(notes(this.vexflowSeq[3][0])))],
                    });
                }
                else
                {
                    /* Measure 2 of 3 */
                    system.addStave({
                          voices: [voice(beam(notes(this.vexflowSeq[2][0], {stem: this.vexflowSeq[2][1]})).concat(beam(notes(this.vexflowSeq[3][0], {stem: this.vexflowSeq[3][1]})))
                                   .concat(notes(this.vexflowSeq[4][0])))],
                    });
                }
                break;
                
            case 8:
                if (this.kind === "c" && !this.undef)
                {
                    /* Measure 2 of 3 */
                    system.addStave({
                          voices: [voice(beam(notes(this.vexflowSeq[2][0], {stem: this.vexflowSeq[2][1]})).concat(beam(notes(this.vexflowSeq[3][0], {stem: this.vexflowSeq[3][1]})))
                                   .concat(notes(this.vexflowSeq[4][0])))],
                    });
                }
                else
                {
                   /* Measure 2 of 3 */
                    system.addStave({
                          voices: [voice(beam(notes(this.vexflowSeq[2][0], {stem: this.vexflowSeq[2][1]})).concat(beam(notes(this.vexflowSeq[3][0], {stem: this.vexflowSeq[3][1]}))))],
                    });
                }
                break;

            default:
                /* Measure 2 if notes > 8 */
                if( this.kind === "q")
                {
                    // all sequences are finished here!
                    if (this.roman[0] === "I" ){
                        /* Measure 2 of 2 for chromatics and circles */
                        system.addStave({
                          voices: [voice(beam(notes(this.vexflowSeq[2][0], {stem: this.vexflowSeq[2][1]}))
                              .concat(notes(this.vexflowSeq[3][0])))],
                         }).setEndBarType(VF.Barline.type.DOUBLE);
                    }
                    else if (this.roman[0] === "R"){
                        /* Measure 2 of 4 for intervals */
                        system.addStave({
                              voices: [voice(beam(notes(this.vexflowSeq[1][0], {stem: this.vexflowSeq[1][1]})).concat(beam(notes(this.vexflowSeq[2][0], {stem: this.vexflowSeq[2][1]}))))],
                        });
                        /* Measure 3 of 4 (New system) */
                        var x = 0, y = 154;
                        var system = makeSystem(300);
                        system.addStave({
                          voices: [voice(beam(notes(this.vexflowSeq[3][0], {stem: this.vexflowSeq[3][1]})).concat(beam(notes(this.vexflowSeq[4][0], {stem: this.vexflowSeq[4][1]}))))],
                        }).addClef('treble').addTimeSignature('4/4');
                        /* Measure 4 of 4 */
                        var system = makeSystem(250);
                        system.addStave({
                          voices: [voice(beam(notes(this.vexflowSeq[5][0], {stem: this.vexflowSeq[5][1]})).concat(beam(notes(this.vexflowSeq[6][0], {stem: this.vexflowSeq[6][1]})))
                                   .concat(notes(this.vexflowSeq[7][0])))],
                         }).setEndBarType(VF.Barline.type.DOUBLE);
                    }
                    else{
                        /* Measure 2 of 4 for tensions */
                       system.addStave({
                          voices: [voice(notes(this.vexflowSeq[2][0], {stem: this.vexflowSeq[2][1]}).concat(notes(this.vexflowSeq[3][0], {stem: this.vexflowSeq[3][1]})))],
                        });
                        /* Measure 3 of 4 (New system) */
                        var x = 0, y = 154;
                        var system = makeSystem(350);
                        system.addStave({
                          voices: [voice(notes(this.vexflowSeq[4][0], {stem: this.vexflowSeq[4][1]}).concat(notes(this.vexflowSeq[5][0], {stem: this.vexflowSeq[5][1]})))],
                        }).addClef('treble').addTimeSignature('4/4');
                        /* Measure 4 of 4 */
                        var system = makeSystem(250);
                        system.addStave({
                          voices: [voice(notes(this.vexflowSeq[6][0], {stem: this.vexflowSeq[6][1]}))],
                        }).setEndBarType(VF.Barline.type.DOUBLE);
                    }
                }
                else{
                    system.addStave({
                      voices: [voice(beam(notes(this.vexflowSeq[2][0], {stem: this.vexflowSeq[2][1]})).concat(beam(notes(this.vexflowSeq[3][0], {stem: this.vexflowSeq[3][1]}))))],
                    });
                }
                break;
        }
    }
    
    // set the third measure
    if (this.number > 6)
    {
        switch(this.number)
        {
            case 7:
            case 8:
                if ((this.kind === "c" && this.number === 7 && !this.undef) || (this.kind === "s" && this.number === 8) || (this.kind === "c" && this.number === 8 && this.undef)) 
                {
                    // 7-note chord or 8-note scale or 8-note undefined chord
                    /* Measure 3 of 3 */
                    var system = makeSystem(150);
                    system.addStave({ 
                        voices: [voice(notes(this.vexflowSeq[4][0]))],
                    }).setEndBarType(VF.Barline.type.DOUBLE);
                }
                else{
                    // 7-note scale or 8-note chord or 7-note undefined chord
                    /* Measure 3 of 3 */
                    var system = makeSystem(150);
                    system.addStave({ 
                        voices: [voice(notes(this.vexflowSeq[5][0]))],
                    }).setEndBarType(VF.Barline.type.DOUBLE);
                }
                break;
                
            case 9:
            case 10:
                /*   Measure 3 of 3 */
                var system = makeSystem(150);
                system.addStave({ 
                    voices: [voice(beam(notes(this.vexflowSeq[4][0], {stem: this.vexflowSeq[4][1]}))
                      .concat(notes(this.vexflowSeq[5][0])))],
                }).setEndBarType(VF.Barline.type.DOUBLE);
                break;   
            
            case 11:
                /*  Measure 3 (New System) */
                var x = 0, y = 154;
                var system = makeSystem(350);
                system.addStave({ 
                    voices: [
                        voice(beam(notes(this.vexflowSeq[4][0], {stem: this.vexflowSeq[4][1]}))
                            .concat(beam(notes(this.vexflowSeq[5][0], {stem: this.vexflowSeq[5][1]})))
                            .concat(notes(this.vexflowSeq[6][0])))],
                }).addClef('treble').addTimeSignature('4/4');
                break;
                
            case 12:
                if( this.kind !== "q"){
                    /*  Measure 3 (New System) */
                    var x = 0, y = 154;
                    var system = makeSystem(350);
                    system.addStave({ 
                        voices: [
                            voice(beam(notes(this.vexflowSeq[4][0], {stem: this.vexflowSeq[4][1]}))
                                .concat(beam(notes(this.vexflowSeq[5][0], {stem: this.vexflowSeq[5][1]}))))],
                    }).addClef('treble').addTimeSignature('4/4');
                }
                break;
        }
    }
    // set the fourth measure
    if (this.number > 10)
    {
        switch(this.number)
        {
            case 11:
                /* Measure 4 of 4 */
                var system = makeSystem(250);
                system.addStave({ 
                    voices: [voice(notes(this.vexflowSeq[7][0]))],
                }).setEndBarType(VF.Barline.type.DOUBLE);
                break;
            case 12:
                if( this.kind !== "q"){
                    /* Measure 4 of 4 */
                    var system = makeSystem(250);
                    system.addStave({ 
                        voices: [voice(notes(this.vexflowSeq[6][0]))],
                    }).setEndBarType(VF.Barline.type.DOUBLE);
                }
                break;
        }
    }

    
    // use tie for 3-note chords or 8-note defined chords or 7-note undefined chords or 7-note and 11-note scales
    if ((this.kind === "c" && this.number === 3) || (this.kind === "c" && this.number === 8 && !this.undef) || (this.kind === "c" && this.undef && this.number === 7)|| (this.kind === "s" && (this.number === 11 || this.number === 7)))
    {
         vf.StaveTie({from: id('tie1'), to: id('tie2')});
    }

    // remove SVG width and height before draw! 
     var svgEls = document.getElementsByTagName("svg");
    if (svgEls[0] !== undefined){
        svgEls[0].removeAttribute("height");
        svgEls[0].removeAttribute("width");
//        svgEls[0].setAttribute("class", "scaling-svg");
    }

    vf.draw();
};
// END VEXFLOW

// function to assign colors based on a note number, called by drawCircle(), arcsLines(), playNotes()
// DEBUG: may change this to note# arrays holding RGB values
var noteColor = function(n)
{
    // transparency creeping in based on note state, made all colors alpha 1
    var newColor;
    switch(n)
    {
        case 0:
            newColor = "rgba(" + Note0.noteR + "," +  Note0.noteG + "," +  Note0.noteB + ", 1)";
            return newColor;
        case 1:
            newColor = "rgba(" + Note1.noteR + "," +  Note1.noteG + "," +  Note1.noteB + ", 1)";
            return newColor;
        case 2:
            newColor = "rgba(" + Note2.noteR + "," +  Note2.noteG + "," +  Note2.noteB + ", 1)";
            return newColor;
        case 3:
           newColor = "rgba(" + Note3.noteR + "," +  Note3.noteG + "," +  Note3.noteB + ", 1)";
           return newColor;
        case 4:
            newColor = "rgba(" + Note4.noteR + "," +  Note4.noteG + "," +  Note4.noteB + ", 1)";
            return newColor;
        case 5:
            newColor = "rgba(" + Note5.noteR + "," +  Note5.noteG + "," +  Note5.noteB + ", 1)";
            return newColor;
        case 6:
            newColor = "rgba(" + Note6.noteR + "," +  Note6.noteG + "," +  Note6.noteB + ", 1)";
            return newColor;
        case 7:
            newColor = "rgba(" + Note7.noteR + "," +  Note7.noteG + "," +  Note7.noteB + ", 1)";
            return newColor;
        case 8:
            newColor = "rgba(" + Note8.noteR + "," +  Note8.noteG + "," +  Note8.noteB + ", 1)";
            return newColor;
        case 9:
            newColor = "rgba(" + Note9.noteR + "," +  Note9.noteG + "," +  Note9.noteB + ", 1)";
            return newColor;
        case 10:
            newColor = "rgba(" + Note10.noteR + "," +  Note10.noteG + "," +  Note10.noteB + ", 1)";
            return newColor;
        case 11:
            newColor = "rgba(" + Note11.noteR + "," +  Note11.noteG + "," +  Note11.noteB + ", 1)";
            return newColor;
        default: 
            newColor = "rgba(255, 255, 255, 1)";
            return newColor;
    }
 };

// DEBUG: may need to be rewritten
// function to get the labelName of the root for undefined, called by clickEnter
var labelName = function(n)
{
     var newRoot;
     switch (n)
     {
        case 0:
            newRoot = Label0.name;
            return newRoot;
        case 1:
            newRoot = Label1.name;
            return newRoot;
        case 2:
            newRoot = Label2.name;
            return newRoot;
        case 3:
            newRoot = Label3.name;
            return newRoot;
        case 4:
            newRoot = Label4.name;
            return newRoot;
        case 5:
            newRoot = Label5.name;
            return newRoot;
        case 6:
            newRoot = Label6.name;
            return newRoot;
        case 7:
            newRoot = Label7.name;
            return newRoot;
        case 8:
            newRoot = Label8.name;
            return newRoot;
        case 9:
            newRoot = Label9.name;
            return newRoot;
        case 10:
            newRoot = Label10.name;
            return newRoot;
        case 11:
            newRoot = Label11.name;
            return newRoot;
        default:
            newRoot = Label0.name;
            return newRoot;
    }
};

// changes the note text based on value passed or romans
Sets.prototype.notesText = function(v)
{
    var i;
    var text = [];
    
     if (v === "n" || v === "f" || v === "s")
     {
         if (v === "n"){
                     text = [0,1,2,3,4,5,6,7,8,9,10,11];
         }
         else if (v === "f"){
             text = ["I", "bII", "II", "bIII", "III", "IV", "bV", "V", "bVI", "VI", "bVII", "VII"];
         }
         else {
               text = ["I", "#I", "II", "#II", "III", "IV", "#IV", "V", "#V", "VI", "#VI", "VII"];
         }

        Note0.noteText = text[0];
        Note1.noteText = text[1];
        Note2.noteText = text[2];
        Note3.noteText = text[3];
        Note4.noteText = text[4];
        Note5.noteText = text[5];
        Note6.noteText = text[6];
        Note7.noteText = text[7];
        Note8.noteText = text[8];
        Note9.noteText = text[9];
        Note10.noteText = text[10];
        Note11.noteText = text[11];
    }
    else 
    {
        if (this.undef){
            text = ["I", "bII", "II", "bIII", "III", "IV", "bV", "V", "bVI", "VI", "bVII", "VII"];
        }
        else {
            text = this.roman;
        }
        // KEEP this messy code: needed to accomodate different noteText for different Sets 

        for (i =0; i < this.selected.length; i++ )
        {
            if (this.selected[i] === 1)
            {
                switch (i)
                {
                    case 0:
                        Note0.noteText = text[i];
                        break;
                   case 1:
                        Note1.noteText = text[i];
                        break;
                    case 2:
                        Note2.noteText = text[i];
                        break;
                   case 3:
                        Note3.noteText = text[i];
                        break;
                    case 4:
                        Note4.noteText = text[i];
                        break;
                   case 5:
                        Note5.noteText = text[i];
                        break;
                    case 6:
                        Note6.noteText = text[i];
                        break;
                   case 7:
                        Note7.noteText = text[i];
                        break;
                    case 8:
                        Note8.noteText = text[i];
                        break;
                   case 9:
                        Note9.noteText = text[i];
                        break;
                    case 10:
                        Note10.noteText = text[i];
                        break;
                   case 11:
                        Note11.noteText = text[i];
                        break;
                }
            }
        }
    }
};

// NOTE OBJECTS
var Note0 = new Notes ({
    number: 0,
    noteR: 0, 
    noteG: 153, 
    noteB: 0,
    numerator: note0[2],
    onClick: function() {
        redraw();
    }
});

var Note1 = new Notes ({
    number: 1,
    noteR: 0, 
    noteG: 204, 
    noteB: 204,
    numerator: note1[2],
    onClick: function() {
        redraw();
    }
}); 

var Note2 = new Notes ({
    number: 2,
    noteR: 51, 
    noteG: 153, 
    noteB: 255,
    numerator: note2[2],
    onClick: function() {
        redraw();
    }
}); 

var Note3 = new Notes ({
    number: 3,
    noteR: 0,
    noteG: 51, 
    noteB: 255,
    numerator: note3[2],
    onClick: function() {
        redraw();
    }
}); 

var Note4 = new Notes ({
    number: 4,
    noteR: 51, 
    noteG: 0, 
    noteB: 204,
    numerator: note4[2],
    onClick: function() {
        redraw();
    }
}); 

var Note5 = new Notes ({
    number: 5,
    noteR: 102, 
    noteG: 0, 
    noteB: 153,
    numerator: note5[2],
    onClick: function() {
        redraw();
    }
}); 

var Note6 = new Notes ({
    number: 6,
    noteR: 128, 
    noteG: 0, 
    noteB: 0,
    numerator: note6[2],
    onClick: function() {
        redraw();
    }
}); 

var Note7 = new Notes ({
    number: 7,
    noteR: 204, 
    noteG: 0, 
    noteB: 0,
    numerator: note7[2],
    onClick: function() {
        redraw();
    }
}); 

var Note8 = new Notes ({
    number: 8,
    noteR: 255, 
    noteG: 64, 
    noteB: 0,
    numerator: note8[2],
    onClick: function() {
        redraw();
    }
}); 

var Note9 = new Notes ({
    number: 9,
    noteR: 255, 
    noteG: 128, 
    noteB: 0,
    numerator: note9[2],
    onClick: function() {
        redraw();
    }
}); 

var Note10 = new Notes ({
    number: 10,
    noteR: 255, 
    noteG: 204, 
    noteB: 0,
    numerator: note10[2],
    onClick: function() {
        redraw();
    }
}); 

var Note11 = new Notes ({
    number: 11,
    noteR: 102, 
    noteG: 204, 
    noteB: 0,
    numerator: note11[2],
    onClick: function() {
        redraw();
    }
}); 

// draw all NOTES
var allNotes = function(){
    Note0.draw();
    Note1.draw();
    Note2.draw();
    Note3.draw();
    Note4.draw();
    Note5.draw();
    Note6.draw();
    Note7.draw();
    Note8.draw();
    Note9.draw();
    Note10.draw();
    Note11.draw();
};


   // LABEL OBJECTS
var Label0 = new Labels ({
    number: 0,
    midi: label0[3],
    enharmonic: label0[4],
    sharps: label0[5],
    flats: label0[6]
});

var Label1 = new Labels ({
    number: 1,
    midi: label1[3],
    enharmonic: label1[4],
    sharps: label1[5],
    flats: label1[6]
}); 

var Label2 = new Labels ({
    number: 2,
    midi: label2[3],
    enharmonic: label2[4],
    sharps: label2[5],
    flats: label2[6]
}); 

var Label3 = new Labels ({
    number: 3,
    midi: label3[3],
    enharmonic: label3[4],
    sharps: label3[5],
    flats: label3[6]
}); 

var Label4 = new Labels ({
    number: 4,
    midi: label4[3],
    enharmonic: label4[4],
    sharps: label4[5],
    flats: label4[6]
}); 

var Label5 = new Labels ({
    number: 5,
    midi: label5[3],
    enharmonic: label5[4],
    sharps: label5[5],
    flats: label5[6]
}); 

var Label6 = new Labels ({
    number: 6,
    midi: label6[3],
    enharmonic: label6[4],
    sharps: label6[5],
    flats: label6[6]
}); 

var Label7 = new Labels ({
    number: 7,
    midi: label7[3],
    enharmonic: label7[4],
    sharps: label7[5],
    flats: label7[6]              
}); 

var Label8 = new Labels ({
    number: 8,
    midi: label8[3],
    enharmonic: label8[4],
    sharps: label8[5],
    flats: label8[6]
}); 

var Label9 = new Labels ({
    number: 9,
    midi: label9[3],
    enharmonic: label9[4],
    sharps: label9[5],
    flats: label9[6]
    }); 

var Label10 = new Labels ({
    number: 10,
    midi: label10[3],
    enharmonic: label10[4],
    sharps: label10[5],
    flats: label10[6] 
}); 

var Label11 = new Labels ({
    number: 11,
    midi: label11[3],
    enharmonic: label11[4],
    sharps: label11[5],
    flats: label11[6]
}); 

// draw all LABELS
var allLabels = function()
{
    Label0.draw();
    Label1.draw();
    Label2.draw();
    Label3.draw();
    Label4.draw();
    Label5.draw();
    Label6.draw();
    Label7.draw();
    Label8.draw();
    Label9.draw();
    Label10.draw();
    Label11.draw();
};

// BUTTONS OBJECTS
// default
var MakeScaleB = new Buttons ({
    index: 0,
    start: 3,
    end: 9,
    text: "MAKE SCALE",
    onClick: function() {
        makeSet("s");
    }
});
var MakeChordB = new Buttons ({
    index: 2,
    start: 15,
    end: 21,
    text: "MAKE CHORD",
    onClick: function() {
        makeSet("c");
    }
});
// enter
var EnterB = new Buttons ({
    index: 2,
    start: 15,
    end: 21,
    text: "ENTER",
    onClick: function() {
        clickEnter();
    }
});
var ClearB = new Buttons ({
    index: 0,
    start: 3,
    end: 9,
    text: "CLEAR",
    onClick: function() {
        clearAll();
    }
});

// addChord
var LoopB = new Buttons ({
    index: 0,
    start: 0,
    end: 4,
    text: "ADD CHORD",
    onClick: function() {
        playLoop("notes");
    }
});

var PlayB = new Buttons ({
    index: 1,
    start: 9,
    end: 15,
    text: "PLAY",
    onClick: function() {
        doPlayNotes();     
    }
});
/*var TransposeB = new Buttons ({
    index: 3,
    start: 12,
    end: 16,
    text: "TRANSPOSE",
    onClick: function() {
        // not operable
    }
});*/
var AddChordB = new Buttons ({
    index: 2,
    start: 15,
    end: 21,
    text: "ADD CHORD",
    onClick: function() {
        addChord();
    }
});
/*    var TransformB = new Buttons ({
    index: 5,
    start: 20,
    end: 24,
    text: "TRANSFORM",
    onClick: function() {
        // not operable
    }
});*/

var LoopChordsB = new Buttons ({
    index: 3,
    start: 12,
    end: 16,
    text: "TRANSPOSE",
    onClick: function() {
        playLoop("chords");
    }
});
var MergeChordsB = new Buttons ({
    index: 4,
    start: 16,
    end: 20,
    text: "ADD CHORD",
    onClick: function() {
        mergeChords();
    }
});
    var SwapChordsB = new Buttons ({
    index: 5,
    start: 20,
    end: 24,
    text: "SWAP CHORDS",
    onClick: function() {
        swapChords();
    }
});

//madeScale
var UnmergeB = new Buttons ({
    index: 2,
    start: 15,
    end: 21,
    text: "UNMERGE",
    onClick: function() {
        undoMerge();
    }
});

//madeRow
var NewB = new Buttons ({
    index: 2,
    start: 15,
    end: 21,
    text: "NEW TONE ROW",
    onClick: function() {
        toneRows();
    }
});
/*    var ChangeModeB = new Buttons ({
    index: 5,
    set: ["madeScale"],
    start: 20,
    end: 24,
    text: "CHANGE MODE",
    onClick: function() {
        // not operable
    }
});*/

// DRAW AND REDRAW note states
// called by Note# onclick, makeSet, addChord
redraw = function()
{
    // clear the canvas (x, y, width, height)
    ctx.clearRect(0, 0, c.width, c.height );
    drawCircle(); 
    
    allLabels();
    
    // DEBUG: should there be error checking to make sure these sets are defined? 
    // can check to see if Set#.number > 0?
    if (makeType === "c1" || makeType === "c2" || makeType === "c3")
    {
        Set1.drawSet();
        if (makeType === "c3"){
            Set2.drawSet();
        }
    }
    else if (makeType === "m" || makeType === "s1" || makeType === "q")
    {
        Set3.drawSet();
    }
    
       // DEBUG: don't call Set1.notesText() or it will muck up noteText
    
    allNotes();
    drawConsole();
    
};
resizeCanvas();

// DEBUG: not quite sure what to do with these html Element vars that need to be GLOBAL
// maybe instead of using vars, we could just use the full document.getElementById
// check useage; what are the benefits of using these vars?
//var promptEl = document.getElementById("prompt");
var nameEl = document.getElementById("name");
var notationEl = document.getElementById("notation");
var descriptionEl = document.getElementById("description");
var name2El = document.getElementById("name2");
var notation2El = document.getElementById("notation2");
var description2El = document.getElementById("description2");
var name1El = document.getElementById("name1");
var notation1El = document.getElementById("notation1");
var description1El = document.getElementById("description1");
var notation3El = document.getElementById("notation3");

var makeSet = function(type)
{
    // reset all selected notes & clear the screen
    document.getElementById("startup").style.display="none";
    clearAll();
    CONSOLE = [0,0,0,0];
    BUTTONS = "enter";
    redraw();
    makeType = type;
};

var clickEnter = function()
{    
    // set variables for knowledgebase lookup, code must be a string due to leading zeroes
    var i, n, t, kbID, d, matched, rootName;
    var undef, kind, root, name, rootname, description, romans;
    var chordNotes, chordMidi, noteSeq, midiSeq, drawSeq, vexflowSeq;
    var c = 0;
    var code = "";
    var selected = [];
    HIDE = -1;
    
 /*   if(!makeType){
        promptEl.innerHTML = "Make Chord or Make Scale, select notes, and then click Enter";
        return;
    }
    */
    
    if (makeType === "c" || makeType === "s"){
        notationEl.innerHTML = "";
        notation2El.innerHTML = "";
        notation1El.innerHTML = "";
        notation3El.innerHTML = "";

        notationEl.removeAttribute("class");
        notation1El.removeAttribute("class");
        notation2El.removeAttribute("class");
        notation3El.removeAttribute("class");
        
        if (makeType === "c"){
            makeType = "c1";
        }
    }
    else if (makeType === "c2"){
        makeType = "c3";
    }
    
    for( i=0, n=0; i< notes.length; i++)
    {
        if (notes[i][3]< 1){
            selected.push(0);
            notes[i][3] = -1;
            // make sure deselected notes are set to -1, min;
        }
        else {
            selected.push(notes[i][3]);
        }
        code = code + String(selected[i]);
        if(selected[i])
        {
            n++;
            if(n === 1){ 
                root = i;
               // by default, root is set to first note of selection
            }
        }
    }
    
    if(n === 0)
    {
        //promptEl.innerHTML = "no notes selected";
        makeType = "";
        clearAll();
        return;
    }
    else
    {
        // search the kb for scale 
        //promptEl.innerHTML = "";
    
        // if scale, check first for scale and then look for chords
        if(makeType === "s" || makeType === "m")
        {
            // DEBUG: may need to change this checking for makeType, okay for now!
            t = kb.indexOf("s") -1;
            c = kb.indexOf(code, t);
            if(c < 0)
            {
                if (makeType === "s"){
                    makeType = "s1";
                }
                else if (makeType === "m"){
                    makeType = "m1";
                    // no match, search chords for merged notes
                }
            }
        }
    
     // search the kb for chords
    if(makeType === "c1" || makeType === "s1" || makeType === "c3" || makeType === "m1")
    {
        c = kb.indexOf(code);
    }
    // reset temp values used to search for chords 
    if (makeType === "m1"){
        makeType = "m";
    }
    // console.log("makeType: " + makeType);   
    // c is -1 when code not found in knowledgebase
    if(c > 0)
    {
       if (makeType === "s1"){
            makeType = "c1";
        }
        // if user was making a scale but got a chord instead, give them chord options
        
        // sets defaults based on first code match
        undef = 0;
        kind = kb[c+1];
        root = kb[c+2];
        rootName = kb[c+3];
        kbID = kb[c+4];
        romans = kb[c+8];
        chordNotes = kb[c+9];
        chordMidi = kb[c+10];
        noteSeq = kb[c+11];
        midiSeq = kb[c+12];
        drawSeq = kb[c+13];
        vexflowSeq = kb[c+14];
        d = kbData.indexOf(kbID);
        name = kbData[d+1];
        description = kbData[d+2];
        
        // DEBUG: should it look up the name & description or wait until root match?
        // would the kbID change based on root match? Yes, I think so.
        // if it's set here, it's a default whether or not there is a root match but means you may have two lookups
        // but you have to otherwise, it may not look up because code below is so selective
        
        // only check firstSelected if codeMatch and kindMatch are not unique
        if(kb[c+5] > 1 && kb[c+7]>1)
        {
            // now check for firstSelected, using two consecutive if statements
            if (firstSelected >= 0)
            {
                if(notes[firstSelected][3])
                {
                    // if default not firstSelected, keep looking
                    if (firstSelected !== root)
                    {   
                        t = kb.indexOf(code, c+1);
                        matched = 0;
                        // loop thru matches checking root
                        do
                        {
                            if (firstSelected === kb[t+2])
                            {        
                                kind = kb[t+1];
                                root = firstSelected;
                                rootName = kb[t+3];
                                kbID = kb[t+4];
                                romans = kb[t+8];
                                chordNotes = kb[t+9];
                                chordMidi = kb[t+10];
                                noteSeq = kb[t+11];
                                midiSeq = kb[t+12];
                                drawSeq = kb[t+13];
                                vexflowSeq = kb[t+14];
                                d = kbData.indexOf(kbID);
                                name = kbData[d+1];
                                description = kbData[d+2];
                                matched = 1;
                            }
                            // increment
                            t = kb.indexOf(code, t+1);
                            // if no match, end loop 
                            if(t < 0)
                                {
                                    matched = 1;
                                }
                        }
                        while (matched === 0);
                    }
                }
            }
        }
        // else statement not needed because defaults are already set
    }
        else // no match in kb
        {
            undef = 1;
            switch (n)
            {
                case 3:
                    if (makeType === "c1" || makeType === "c3" ){
                        name = " Triad (undefined)";
                    }
                    else {
                        name = " Tritonic scale (undefined)";
                    }
                    break;
                case 4:
                    if (makeType === "c1" || makeType === "c3" ){
                        name = " Tetrachord (undefined)";
                    }
                    else {
                        name = " Tetratonic scale (undefined)";
                    }
                    break;
                case 5:
                    if (makeType === "c1" || makeType === "c3" ){
                        name = " Pentachord (undefined)";
                    }
                    else {
                        name = " Pentatonic scale (undefined)";
                    }
                        break;
                case 6:
                    if (makeType === "c1" || makeType === "c3" ){
                        name = " Hexachord (undefined)";
                    }
                    else {
                        name = " Hexatonic scale (undefined)";
                    }
                    break;
                case 7:
                    if (makeType === "c1" || makeType === "c3" ){
                        name = " Heptachord undefined";
                    }
                    else {
                        name = " Heptatonic scale (undefined)";
                    }
                    break;
                case 8:
                    if (makeType === "c1" || makeType === "c3" ){
                        name = " Octachord undefined";
                    }
                    else {
                        name = " Octatonic scale (undefined)";
                    }
                        break;
                case 9:
                    name = " Nonatonic scale (undefined)";
                    makeType = "s1";
                    break;
                case 10:
                    name =" Decatonic scale (undefined)";
                    makeType = "s1";
                    break;
                default:
                    name = " undefined";
                    break;
            }
            if (makeType === "c1" || makeType === "c3" ){
                kind = "c";
                description = " undefined chord";
            }
            else {
                kind = "s";
                description = " undefined scale";
            }
            
            // by default, root is set to first note of selection, now set it to firstSelected
            if (firstSelected >= 0)
            {
                root = firstSelected;
            }
            rootName = labelName(root);
        }
    } // end of search the kb
    
    // to draw labels properly and indicate that scale is drawn
    if (makeType === "s"){
        makeType = "s1";
    }
    
    ctx.clearRect(0, 0, ctrX * 2, ctrY *2);
    drawCircle(); 
    allLabels();
    
    document.getElementById("startup").style.display="none";
        
    if (makeType === "c1")
    {
        // remember c1 values 
        Set1.number = n;
        Set1.kind = kind;
        Set1.root = root;
        Set1.rootName = rootName;
        Set1.selected = selected;
        Set1.undef = undef;
        Set1.roman = romans;
        Set1.chordNotes = chordNotes;
        Set1.chordMidi = chordMidi;
        Set1.noteSeq = noteSeq;
        Set1.midiSeq = midiSeq;
        Set1.drawSeq = drawSeq;
        Set1.vexflowSeq = vexflowSeq;
        
        firstSelected = -1;

        name1El.innerHTML = rootName + " " + name;
        description1El.innerHTML = description;
        
        name1El.setAttribute("class", "names");
        notation1El.setAttribute("class", "notations");
        description1El.setAttribute("class", "descriptions");
        
        BUTTONS = "addChord";
        CONSOLE = [0,0,0,0];
        
        if (Set1.undef || (Set1.kind === "s" && Set1.number >7 ))
        {
            Set1.notesText("s");
        }
        else{
           Set1.notesText();
        }
        
        Set1.vexflow();
        Set1.playNotes();

    }
    else if (makeType === "c3")
    {
         //remember c2 values
        Set2.number = n;
        Set2.kind = kind;
        Set2.root = root;
        Set2.rootName = rootName;
        Set2.selected = selected;
        Set2.undef = undef;
        Set2.roman = romans;
        Set2.chordNotes = chordNotes;
        Set2.chordMidi = chordMidi;
        Set2.noteSeq = noteSeq;
        Set2.midiSeq = midiSeq;
        Set2.drawSeq = drawSeq;
        Set2.vexflowSeq = vexflowSeq;
   
        name2El.innerHTML = rootName + " " + name;
        description2El.innerHTML = description; 
        
        name2El.setAttribute("class", "names");
        notation2El.setAttribute("class", "notations");
        description2El.setAttribute("class", "descriptions");
        
        BUTTONS = "mergeChord";
        CONSOLE = [0,0,0,0,0,0];
        
        if (Set2.undef || (Set2.kind === "s" && Set2.number >7 ))
        {
            Set2.notesText("s");
        }
        else{
           Set2.notesText();
        }
        
        Set2.vexflow();
        Set2.playNotes();
    }
    else // scale or merge or sequence???
    {
        Set3.number = n;
        Set3.kind = kind;
        Set3.root = root;
        Set3.rootName = rootName;
        Set3.selected = selected;
        Set3.undef = undef;
        Set3.roman = romans;
        Set3.chordNotes = chordNotes;
        Set3.chordMidi = chordMidi;
        Set3.noteSeq = noteSeq;
        Set3.midiSeq = midiSeq;
        Set3.drawSeq = drawSeq;
        Set3.vexflowSeq = vexflowSeq;
        
        if (kind === "q"){
            nameEl.innerHTML =  name;
        }
        else{
            nameEl.innerHTML = rootName + " " + name;
        }
        
        descriptionEl.innerHTML = description;
        
        nameEl.setAttribute("class", "names");
        notationEl.setAttribute("class", "notations");
        descriptionEl.setAttribute("class", "descriptions");
        
        console.log ("Set3.kind: " + Set3.kind);
       // DEBUG: added to change notesText to sharps/flats
        if (Set3.undef || (Set3.kind === "s" && Set3.number >7 ))
        {
            Set3.notesText("s");
        }
        else{
           Set3.notesText();
        }
        
        Set3.vexflow();
        Set3.playNotes();
        
        BUTTONS = "madeScale";
        CONSOLE = [0,0,0,0];
        // I don't have an alternate button set if it's not a scale
        
        // if makeType s1 and kind s, then it's a created scale
        // if makeType m and kind s, then it's a merged scale
        // if makeType m and kind c, then it's merged chords
        
        // buttons are either madeScale or merged
        
        // DEBUG: if Set3 exists, then Set1 and Set2 are pretty much ignored
        // but they may be accessed for Undo Merge so can't be wiped out
    }
    // if reset button console

};
// end clickEnter function


// Add Chord button

var addChord = function()
{
    // DEBUG: change HIDE to display proper buttons
    HIDE = -1;
    if (makeType === "c1")
    {
        makeType = "c2";
        //promptEl.innerHTML = "select notes to make another chord";
        firstSelected = -1;
        
        // clear the canvas (x, y, width, height)
        ctx.clearRect(0, 0, ctrX * 2, ctrY *2);
        drawCircle(); 
        
        // DEBUG: should we have a separate function to do this?
         // set all notes to off before drawing them!!
        for (i = 0; i < notes.length; i++){
         notes[i][3] = 0;
        }

        allLabels();

        Set1.drawSet();
        Set1.notesText("n");
        allNotes();
        HIDE = 0;
        BUTTONS = "enter";
        CONSOLE = [0,0,0,0];
        drawConsole();
    }   
   /* else
    {
        // addChord function can only be called by when makeType c1
        // DEBUG: this is just error capture code I guess
        // do we need this??
        makeType = " ";
        doReset();
        redraw();
    }*/
};

var clearAll = function()
{
    setBackground(0);

    doReset();
    redraw();
     // new code to insert blank vexflow measures on clear (not on startup)
        
    var vfDiv = ["notation", "notation2", "notation1", "notation3"];
    
    for (var i=0; i< vfDiv.length; i++){
         const VF = Vex.Flow;
         var vf = new VF.Factory({renderer: {selector: vfDiv[i] , height: 140, width: 750}});
        const context = vf.getContext();
        context.setViewBox(0, 0, 760, 140);

        context.setFillStyle('#000000');

        var stave = new VF.Stave(0,0,190);
        stave.addClef("treble");
        stave.setContext(context).draw();
        stave = new VF.Stave(190,0,160);
        stave.setContext(context).draw();
        stave = new VF.Stave(350,0,160);
        stave.setContext(context).draw();
        stave = new VF.Stave(510,0,160);
        if (i === vfDiv.length-1){
            stave.setEndBarType(VF.Barline.type.DOUBLE);
        }
        stave.setContext(context).draw();
    }
    
    notationEl.setAttribute("class", "notations");
    notation1El.setAttribute("class", "notations");
    notation2El.setAttribute("class", "notations");
    notation3El.setAttribute("class", "notations");

    // remove SVG width and height before draw!
    var svgEls = document.getElementsByTagName("svg");
    for ( i = 0; i <svgEls.length; i++){
        if (svgEls[i] !== undefined){
            svgEls[i].removeAttribute("height");
            svgEls[i].removeAttribute("width");
//            svgEls[i].setAttribute("class", "scaling-svg");
        }    
    }
};


// Merge Chords Button

var mergeChords = function()
{
    var i;
    makeType = "m";
    //promptEl.innerHTML = "merging chords";
    // DEBUG: do error checking to ensure both Set1 and Set2 have selected values?
    firstSelected = Set1.root;
    
    for (i = 0; i < Set1.selected.length; i++)
    {
        if (Set1.selected[i]) { 
            notes[i][3] = 1;
        }
    }
    //redraw();
    clickEnter();
};


// DEBUG: Undo Merge Button

var undoMerge = function()
{   
    var i, j;
    makeType = "c3";
   // promptEl.innerHTML = "";
    nameEl.innerHTML = "";
    notationEl.innerHTML = "";
    descriptionEl.innerHTML = "";
    
    notation2El.innerHTML = "";
    // to eliminate duplication of notation

    firstSelected = Set2.root;
    
    for (i = 0; i < Set2.selected.length; i++)
    {
        if (Set2.selected[i]) { 
            notes[i][3] = 1;
        }
        else {
            notes[i][3] = 0;
            //DEBUG: not sure if setting these notes to min is enough
        }
    }

  clickEnter();
};

// DEBUG: Swap Chords Button
var swapChords = function()
{   
/*    if (makeType != "c3"){
        promptEl.innerHTML = "two chords must be created in order to swap";
        return;
    }*/
    
    var i, sName, sDescription, sNotation;
        
    Set3.number = Set2.number;
    Set3.kind = Set2.kind
    Set3.root = Set2.root; 
    Set3.rootName = Set2.rootName;
    Set3.selected = Set2.selected;
    Set3.undef =  Set2.undef;
    Set3.roman = Set2.roman;
    Set3.chordNotes = Set2.chordNotes;
    Set3.chordMidi = Set2.chordMidi;
    Set3.noteSeq = Set2.noteSeq;
    Set3.midiSeq = Set2.midiSeq;
    Set3.drawSeq = Set2.drawSeq;
    Set3.vexflowSeq = Set2.vexflowSeq;
    
    firstSelected = Set1.root;
    
    Set2.number = Set1.number;
    Set2.kind = Set1.kind
    Set2.root = Set1.root; 
    Set2.rootName = Set1.rootName; 
    Set2.selected = Set1.selected;
    Set2.undef =  Set1.undef;
    Set2.roman = Set1.roman;
    Set2.chordNotes = Set1.chordNotes;
    Set2.chordMidi = Set1.chordMidi;
    Set2.noteSeq = Set1.noteSeq;
    Set2.midiSeq = Set1.midiSeq;
    Set2.drawSeq = Set1.drawSeq;
    Set2.vexflowSeqe = Set1.vexflowSeq;
    
    
    Set1.number = Set3.number;
    Set1.kind = Set3.kind
    Set1.root = Set3.root; 
    Set1.rootName = Set3.rootName;
    Set1.selected = Set3.selected;
    Set1.undef =  Set3.undef;
    Set1.roman = Set3.roman;
    Set1.chordNotes = Set3.chordNotes;
    Set1.chordMidi = Set3.chordMidi;
    Set1.noteSeq = Set3.noteSeq;
    Set1.midiSeq = Set3.midiSeq;
    Set1.drawSeq = Set3.drawSeq;
    Set1.vexflowSeq = Set3.vexflowSeq;
    
    
    // only swap notation if not LOOPing
    if(LOOP < 1){
        sName = name2El.innerHTML;
        sDescription = description2El.innerHTML;
        sNotation = notation2El.innerHTML;
        name2El.innerHTML = name1El.innerHTML;
        description2El.innerHTML = description1El.innerHTML
        notation2El.innerHTML = notation1El.innerHTML;
        name1El.innerHTML = sName;
        description1El.innerHTML = sDescription;
        notation1El.innerHTML = sNotation;
    }
        
    // reset selected notes
    for (i = 0; i < Set2.selected.length; i++)
    {
        if (Set2.selected[i] === 1) { 
            notes[i][3] = 1;
        }
        else if (Set1.selected[i] === 1) {
            notes[i][3] = 0;
        }
        else {
            notes[i][3] = -1;
        }
    }
    Set2.playNotes();
};



// draw arcs & lines
var arcsLines = function(arcColor, arcSize, lineColor, startX, startY, startN, endX, endY, endN)
{
    // arcs
    ctx.beginPath();
    ctx.arc(ctrX, ctrY, cirSize * arcSize, Math.PI * startN/12, Math.PI * endN/12);
    ctx.strokeStyle = arcColor;
    ctx.lineWidth = cirSize * 1/75;
    ctx.stroke();

    // lines
    ctx.beginPath();
    ctx.lineTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = cirSize * 1/38;
    ctx.stroke();
};

// draw c1 object when adding or playing 2nd chord, called by redraw, addChord, playNotes
Sets.prototype.drawSet = function()
{
    var i, n, j, k, arcColor, arcSize, lineColor, startX, startY, startN, endX, endY, endN;
    
    // verify this.drawSeq exists, if not then create it
    if (this.drawSeq === undefined)
    {
        var sequence = [];
        for (i = this.root; i < this.selected.length; i++)
        {
            if(this.selected[i] === 1)
            {
                sequence.push(i);
                if(notes[i][3] < 0){
                    notes[i][3] = 0; 
                }
            }
        }
        // for notes before the root, go back & find selected and add octave
        if (this.number > sequence.length)
        {
            for (i = 0; i < this.root; i++)
            {
                if(this.selected[i] === 1)
                {
                    sequence.push(i);
                    if(notes[i][3] < 0){
                        notes[i][3] = 0; 
                    }            
                }
            }
        }
        sequence.push(this.root);
        
        this.drawSeq = sequence;
    }
    
    if (this.set === 1 && makeType !== "c1"){
        arcSize = 0.94;
        ctx.globalAlpha=0.5;
    }
    else
    {
        arcSize = 1.06;
        ctx.globalAlpha=1;
    }

    //if count is one, draw the arcs!!
     if (this.number === 1)
    {            
        j = this.drawSeq[0];
        startX = notes[j][0];
        startY = notes[j][1];
        startN = notes[j][2];
        endX = notes[j][0];
        endY = notes[j][1];
        endN = notes[j][2] + 24;

        lineColor = noteColor(this.root);
        arcColor = lineColor;
        arcsLines(arcColor, arcSize, lineColor, startX, startY, startN, endX, endY, endN);
    }
    else if (this.kind === "c" || this.kind === "s")
    {      
        for (i = 0; i < this.number; i++)
        {
            j = this.drawSeq[i];
            k = this.drawSeq[i+1];

            startX = notes[j][0];
            startY = notes[j][1];
            startN = notes[j][2];
            endX = notes[k][0];
            endY = notes[k][1];
            endN = notes[k][2];
            if(endN < startN) {
                endN = endN + 24;
            }
            if (this.number === 2){
                lineColor = noteColor(this.root);
                arcColor = noteColor(j);
            }
            else{
                lineColor = noteColor(j);
                arcColor = lineColor;
            }
            arcsLines(arcColor, arcSize, lineColor, startX, startY, startN, endX, endY, endN);
        }
    }
    else{
        //sequences!!
        if(this.roman[0] === "R" || this.roman[0] === "1"){
           // special draw for intervals and tensions
            for (i = 0; i <this.drawSeq.length-1; i++)
            {
                 j = this.drawSeq[i+1];
                 k = this.drawSeq[i];

                startX = notes[k][0];
                startY = notes[k][1];
                startN = notes[k][2];
                endX = notes[j][0];
                endY = notes[j][1];
                endN = notes[j][2];
                if(endN === startN) {
                    endN = endN + 24;
                }
                lineColor = noteColor(k);
                arcColor = lineColor
                arcsLines(arcColor, arcSize, lineColor, startX, startY, startN, endX, endY, endN);
            }
        }
        else if(this.roman[1] === "bII"){
            for (i = 0; i < this.drawSeq.length-1; i++)
            {
                j = this.drawSeq[i];
                k = this.drawSeq[i+1];
                startX = notes[k][0];
                startY = notes[k][1];
                startN = notes[k][2];
                endX = notes[j][0];
                endY = notes[j][1];
                endN = notes[j][2];
                if (endN<= startN){
                    endN = endN + 24;
                }
                lineColor = noteColor(k);
                arcColor = lineColor;
                arcsLines(arcColor, arcSize, lineColor, startX, startY, startN, endX, endY, endN);
            }
        }
        else{
            for (i = 0; i < this.drawSeq.length-1; i++)
            {
                j = this.drawSeq[i];
                k = this.drawSeq[i+1];

                startX = notes[j][0];
                startY = notes[j][1];
                startN = notes[j][2];
                endX = notes[k][0];
                endY = notes[k][1];
                endN = notes[k][2];
                if(endN <= startN) {
                    endN = endN + 24;
                }
                lineColor = noteColor(k);
                arcColor = lineColor;
                arcsLines(arcColor, arcSize, lineColor, startX, startY, startN, endX, endY, endN);
            }
        }
    }
   ctx.globalAlpha=1.0;
};

// DEBUG: Play button
// playNotes is called by clickEnter, swapChords and doPlayNotes (play and loop buttons)
Sets.prototype.playNotes = function()
{
    var i, b, j, k, l, m, startX, startY, startN, endX, endY, endN, lineColor, arcColor; 
    var tensions, set, root, count, kind;
    var arcSize = 1.06;

    HIDE = 1;

    // DEBUG: no longer testing for this.chordNotes or this.chordMidi undefined since sequences don't use them
    if (this.noteSeq === undefined || this.midiSeq === undefined || this.drawSeq === undefined) 
    {
        // generate required arrays and vars for undefined based on the selected notes
        this.chordNotes = [];
        this.chordMidi = [];
        this.noteSeq = [];
        this.midiSeq = [];
        this.drawSeq = [];
        this.vexflowSeq = [];
        this.roman = ["I", "bII", "II", "bIII", "III", "IV", "bV", "V", "bVI", "VI", "bVII", "VII"];
        var vSequence = [];
        var f;
        var vStems = [];
        var vChord = "";
        var stems = 0;
        var vArray = [];
       
        // add notes to chord & midi arrays starting with the root
        for ( i = this.root ; i < notes.length; i++)
        {
            if (notes[i][3] === 1)
            {
                this.chordMidi.push(labels[i][3]);
                this.chordNotes.push(i);
                this.drawSeq.push(i);
                notes[i][3] = 0;
             }
        }
        // for notes before the root, go back & find selected and add octave
        if (this.number > this.chordNotes.length)
        {
            for ( i = 0; i < this.root; i++)
            {
                if (notes[i][3] === 1)
                {
                    this.chordMidi.push(labels[i][3] + 12);
                    this.chordNotes.push(i);
                    this.drawSeq.push(i);
                    notes[i][3] = 0;
                }
            }
        }

        // generate noteSeq and midiSeq from chord arrays for undefined
        if (this.number !== 2)
        {
            // add to end of array first
            for (i = this.chordNotes.length-1; i >= 0; i--)
            {
                this.midiSeq.push(this.chordMidi[i]);
                this.noteSeq.push(this.chordNotes[i]);
            }
            
            // add top note for undefineds
            this.midiSeq.splice(0, 0, this.chordMidi[0] + 12);
            this.noteSeq.splice(0, 0, this.chordNotes[0]);
            this.drawSeq.push(this.chordNotes[0]);
            
            for (i = 0; i < this.chordNotes.length; i++)
            {
                this.midiSeq.splice(i, 0, this.chordMidi[i]);
                this.noteSeq.splice(i, 0, this.chordNotes[i]);
            }    
        }
        else // for intervals only play three notes, not five
        {
            for (i = 0; i < this.number; i++)
            {
                this.midiSeq.push(this.chordMidi[i]);
                this.noteSeq.push(this.chordNotes[i]);
            }
            this.midiSeq.push(this.chordMidi[0]);
            this.noteSeq.push(this.chordNotes[0]);
        }
         // now create vexflow notes from this.midiSeq
        for (i =0, j = 1; i< this.midiSeq.length; i++, j++)
        {
            switch (this.midiSeq[i])
            {
                case 48:
                case 60:
                    f = "C";
                    break;
                case 49:
                case 61:
                    if (i < this.number){
                        f = "C#"
                    }
                    else{
                        f = "Db";
                    }
                    break;
                case 50:
                case 62:
                    f = "D";
                    break;
                case 51:
                case 63:
                    if (i < this.number){
                        f = "D#";
                    }
                    else{
                        f = "Eb";   
                    }
                    break;
                case 52:
                case 64:
                    f = "E";
                    break;
                case 53:
                case 65:
                    f = "F";
                    break;
                case 54:
                case 66:
                    if (i < this.number){
                        f = "F#";
                    }
                    else{
                        f = "Gb";
                    }
                    break;
                case 55:
                case 67:
                     f = "G";
                    break;
                case 56:
                case 68:
                    if (i < this.number){
                        f = "G#";
                    }
                    else{
                        f = "Ab";
                    }
                    break;
                case 57:
                case 69:
                     f = "A";
                    break;
                case 58:
                case 70:
                    if (i < this.number){
                        f = "A#";
                    }
                    else{
                        f = "Bb";
                    }
                    break;
                case 59:
                case 71:
                    f = "B";
                    break;           
            }
            if (this.midiSeq[i] < 60){
                f += "4";
            }
            else {
                f += "5";
            }

            vSequence.push(f);

            if (this.kind === "c" && i < this.chordMidi.length)
            {
                vChord += f + " ";
            }

            stems += this.midiSeq[i];

            if (j === 4)
            {
                if (stems/j > 59){
                    vStems.push("down");
                }
                else{
                    vStems.push("up");
                }
                stems = 0;
                j = 0;
            }
                // force a stem value on the last note too
            if (i === this.midiSeq.length-1){
                 if (stems/j > 59){
                    vStems.push("down");
                }
                else{
                    vStems.push("up");
                }
            }
        } // end of for loop

        // sequence of notes generated, now push values to this.vexflowSeq array
        // Measure 1
        if(this.number === 1 || this.number === 2)
        {
            /* Measure 1 of 1 */
            f = vSequence[0] + "/8, " + vSequence[1];
            vArray.push(f);
            vArray.push(vStems[0]);
            this.vexflowSeq.push(vArray);
            vArray =[];
            f = vSequence[2] + "/q,(" + vChord +")/h";
            vArray.push(f);
            this.vexflowSeq.push(vArray);
        }
        else
        {
           /* Measure 1 of 2 */
            f = vSequence[0] + "/8, "  + vSequence[1] + ", " + vSequence[2] + ", " + vSequence[3];
            vArray.push(f);
            vArray.push(vStems[0]);
            this.vexflowSeq.push(vArray);
            vArray =[];
        }
         // Measure 2 start            
        if(this.number > 2)
        {
            if (this.number === 3)
            {
                f = vSequence[4] + "/8, " + vSequence[5] ;
                vArray.push(f);
                vArray.push(vStems[1]);
                this.vexflowSeq.push(vArray);
                vArray =[];
                f = vSequence[6] + "/q[id=\"tie1\"]"; 
                vArray.push(f);
                this.vexflowSeq.push(vArray);
                vArray =[];
                 if (vSequence[6].charAt(1) === "b"){
                      f = vSequence[6].charAt(0) + vSequence[6].charAt(2) + "/q[id=\"tie2\"],";
                 }
                else{
                    f = vSequence[6] + "/q[id=\"tie2\"],";
                }
                if (this.kind === "c"){
                     f += "(" + vChord +")/h, B4/q/r";
                }
                else{
                     f += "B4/r, B4/h/r";
                }
                vArray.push(f);
                this.vexflowSeq.push(vArray);    
            }
            else
            {
                f = vSequence[4] + "/8, " + vSequence[5]+ ", " + vSequence[6] + ", " + vSequence[7];
                vArray.push(f);
                vArray.push(vStems[1]);
                this.vexflowSeq.push(vArray);
                vArray =[];    
            }
        }

        if (this.number > 3)
        {
            switch(this.number)
            {
                case 4:
                    f = vSequence[8] + "/h, ";
                     if (this.kind === "c"){
                         f += "(" + vChord +")/h";
                    }
                    else{
                         f += "B4/r";
                    }
                    vArray.push(f);
                    this.vexflowSeq.push(vArray); 
                    break;

                case 5:
                    f = vSequence[8] + "/8, " + vSequence[9] ;
                    vArray.push(f);
                    vArray.push(vStems[2]);
                    this.vexflowSeq.push(vArray);
                    vArray =[];
                    f = vSequence[10];
                    if (this.kind === "c"){
                         f += "/q, (" + vChord +")/h";
                    }
                    else{
                         f += "/h, B4/q/r";
                    }
                    vArray.push(f);
                    this.vexflowSeq.push(vArray);
                    break;

                default:
                    f = vSequence[8] + "/8, " + vSequence[9] +   ", " + vSequence[10] + ", " + vSequence[11];
                    vArray.push(f);
                    vArray.push(vStems[2]);
                    this.vexflowSeq.push(vArray);
                    vArray =[];
                    break;
            }
        }
        // Measure 2 end
        if (this.number > 5)
        {
            switch(this.number)
            {
                case 6:
                    f = vSequence[12] + "/h";
                    vArray.push(f);
                    this.vexflowSeq.push(vArray);
                    vArray =[];
                    if (this.kind === "c")
                    {
                        f = "(" + vChord +")/h, B4/r";
                        vArray.push(f);
                        this.vexflowSeq.push(vArray);
                    }
                    break;

                case 7:
                    f = vSequence[12] + "/8, " + vSequence[13];
                    vArray.push(f);
                    vArray.push(vStems[3]);
                    this.vexflowSeq.push(vArray);
                    vArray =[];
                    f = vSequence[14] + "/q[id=\"tie1\"]";
                    vArray.push(f);
                    this.vexflowSeq.push(vArray);
                    vArray =[];
                    
                    if (vSequence[14].charAt(1) === "b"){
                          f = vSequence[14].charAt(0) + vSequence[14].charAt(2) + "/q[id=\"tie2\"],";
                     }
                    else{
                          f = vSequence[14] + "/q[id=\"tie2\"],";
                    }
                    if (this.kind === "c"){
                        f += "(" + vChord +")/h, B4/q/r";
                    }
                    else{
                        f += "B4/r, B4/h/r";
                    }
                    vArray.push(f);
                    this.vexflowSeq.push(vArray);
                    console.log (this.vexflowSeq);
                    break;

                default:
                    f = vSequence[12] + "/8, " + vSequence[13] +   ", " + vSequence[14] + ", " + vSequence[15];
                    vArray.push(f);
                    vArray.push(vStems[3]);
                    this.vexflowSeq.push(vArray);
                    vArray =[];
                    break;
            }
        }
        if (this.number > 7)
        {
            switch(this.number)
            {
                case 8:
                    f = vSequence[16] + "/h, ";
                    if (this.kind === "c"){
                         f += "(" + vChord +")/h";
                    }
                    else{
                         f += "B4/r";
                    }
                    vArray.push(f);
                    this.vexflowSeq.push(vArray);
                    break;

                case 9:
                    f = vSequence[16] + "/8, "  + vSequence[17];
                    vArray.push(f);
                    vArray.push(vStems[4]);
                    this.vexflowSeq.push(vArray);
                    vArray =[];
                    f = vSequence[18] + "/h, B4/q/r";
                    vArray.push(f);
                    vArray.push(vStems[4]);
                    this.vexflowSeq.push(vArray);
                    break;

                case 10:
                    f = vSequence[16] + "/8, " + vSequence[17] +   ", " + vSequence[18] + ", " + vSequence[19];
                    vArray.push(f);
                    vArray.push(vStems[4]);
                    this.vexflowSeq.push(vArray);
                    vArray =[];
                    f = vSequence[20] + "/h";
                    vArray.push(f);
                    this.vexflowSeq.push(vArray);
                    break;
            }
        }
  
        if(this.set === 1){
            Set1.vexflow();
        }
        else if (this.set === 2){
            Set2.vexflow();
        }
        else{
            Set3.vexflow();
        }
        
    } // end of setting up vars, arrays and vexflow for undefined
    
   
    else if ( this.kind === "c" && this.number > 4  && this.number < 9){
            tensions = 1;
        // set tensions to be used for drawing arcs and lines; undefined don't have tensions
    }

    //redraw(); 
    ctx.clearRect(0, 0, ctrX * 2, ctrY *2);
    drawCircle();

   if (makeType === "c3")
   {
       // reset selected notes
        for (i = 0; i < Set2.selected.length; i++)
        {
            if (Set2.selected[i] === 1) {
                notes[i][3] = 1;
            }
            else if (Set1.selected[i] === 1) {
                notes[i][3] = 0;
            }
            else {
                notes[i][3] = -1;
            }
        }
        Set1.drawSet();
        Set1.notesText();
   }
    else
  {
       // turn selected notes off before playing
        for (i = 0; i < notes.length; i++){
            if (notes[i][3] === 1){
                notes[i][3] = 0;
            }
        }
  }
    
    // DEBUG: can't use object properties in subroutines - should learn how to do this
    undef = this.undef;
    sets = this.set;
    root = this.root;
    count = this.number;
    midi = this.chordMidi;
    kind = this.kind;
    sequence = this.noteSeq;
    arpeggio = this.midiSeq;
    drawChord = this.drawSeq; 
    
    // DEBUG: sequences need a modifier to distinguish between them
    // this may be a temporary fix or might be all we need
    if(kind === "q"){
        if(this.roman[1] === "bII"){
            //descending chomatic & descending circle
            kind = "d";
        }
        else if(this.roman[0] === "R" ){
            // interval
            kind = "i";
        }
        else if(this.roman[0] === "1"){
            // tensions
            kind = "t";
        }
    }
    
    i = 0;
    // play & draw, i is deliberately looping thru sequence[] as note sounds
    var noteOn = function()
    {           
        j = sequence[i];
        notes[j][3] = 1;
        
      /*   j is the current note number and i is the index
         remember the sequence array is like [0, 4, 7, 10, 0, 10, 7, 4, 0] 
      */
        
        // draw lines & arcs in sequence with arpeggio ascending
        // first note just turns on and plays; 2nd note is when lines/arcs draw
        if (count === 1)
        {
            // just one note in sequence!
            startX = notes[j][0];
            startY = notes[j][1];
            startN = notes[j][2];
            endX = notes[j][0];
            endY = notes[j][1];
            endN = notes[j][2] + 24;

            lineColor = noteColor(j);
            arcColor = lineColor;
            arcsLines(arcColor, arcSize, lineColor, startX, startY, startN, endX, endY, endN);
        }
        else if (kind === "i" && i > 0){
            //special draw for intervals!
            for (l = 1; l <= i; l+=2)
            {
                if (sequence[1] === 1){
                    // ascending
                    m = sequence[l];
                    k = sequence[l-1];
                    lineColor = noteColor(m);
                }
                else{
                    k = sequence[l];
                    m = sequence[l-1];
                    lineColor = noteColor(k);
                }
                
                startX = notes[k][0];
                startY = notes[k][1];
                startN = notes[k][2];
                endX = notes[m][0];
                endY = notes[m][1];
                endN = notes[m][2];
                if(endN === startN) {
                    endN = endN + 24;
                }
                arcColor = lineColor;
                arcsLines(arcColor, arcSize, lineColor, startX, startY, startN, endX, endY, endN);
            }
        }
        else if (i > 0 && i <= count)
        {
             // sharps ascending, flats descending note text for large scales and undef
            if (undef || (count > 7 && kind === "s")){
                if( sets === 1){
                    Set1.notesText("s");
                }
                else if (sets === 2){
                    Set2.notesText("s");
                }
                else{
                    Set3.notesText("s");
                }
            }
            // descending sequence 
            if(kind==="d"){
                for (l = 0; l < i; l++)
                {
                    k = sequence[l];
                    m = sequence[l+1];

                    startX = notes[m][0];
                    startY = notes[m][1];
                    startN = notes[m][2];
                    endX = notes[k][0];
                    endY = notes[k][1];
                    endN = notes[k][2];
                    if(endN < startN) {
                        endN = endN + 24;
                    }

                    lineColor = noteColor(m);
                    arcColor = lineColor;
                    arcsLines(arcColor, arcSize, lineColor, startX, startY, startN, endX, endY, endN);
                }
            }
            else{
                for (l = 1; l <= i; l++)
                {
                    m = sequence[l];
                    k = sequence[l-1];

                    startX = notes[k][0];
                    startY = notes[k][1];
                    startN = notes[k][2];
                    endX = notes[m][0];
                    endY = notes[m][1];
                    endN = notes[m][2];
                    if(endN < startN) {
                        endN = endN + 24;
                    }

                    lineColor = noteColor(m);
                    arcColor = lineColor;
                    arcsLines(arcColor, arcSize, lineColor, startX, startY, startN, endX, endY, endN);
                }
            }
        }
        // draw lines & arcs in sequence with arpeggio descending
        else if (i > count && i < sequence.length)
        { 
            // sharps ascending, flats descending note text for large scales and undef
            if ( undef || (count > 7 && kind === "s")){
                if( sets === 1){
                    Set1.notesText("f");
                }
                else if (sets === 2){
                    Set2.notesText("f");
                }
                else{
                    Set3.notesText("f");
                }
            }
            // iterate down from the middle of the array to the end
            if (tensions){
                l = count -1;
                // tensions are missing the root at the top of the arpeggio
            }
            else{
                l = count;
            }
            for (l; l < i; l++)
            {
                k = sequence[l];
                m = sequence[l+1];
                
                // swap start/end in order to draw arcs counterclockwise!
                startX = notes[m][0];
                startY = notes[m][1];
                startN = notes[m][2];
                endX = notes[k][0];
                endY = notes[k][1];
                endN = notes[k][2];
                if(endN < startN) {
                    endN = endN + 24;
                }
                
                lineColor = noteColor(m);
                arcColor = lineColor;
                arcsLines(arcColor, arcSize, lineColor, startX, startY, startN, endX, endY, endN);
            }
        }
        allLabels();
        allNotes();
        
        MIDI.noteOn(0, arpeggio[i], 127, 0);
        
        // play longer for last note of arpeggio
        if (i !== arpeggio.length - 1){
            setTimeout(noteOff, DURATION);
        }
        else
        {
            // last note
            if (kind === "c"){
                if (count === 1 || count === 2 || count === 6){
                    // last note is quarter note
                    setTimeout(noteOff, 2 * DURATION);
                }
                else{
                    // last note is half note
                    setTimeout(noteOff, 4 * DURATION);
                }
            }
            else
            {
                switch(count)
                {
                    case 5:
                    case 9:
                        setTimeout(noteOff, 5 * DURATION);
                        break;
                    case 7:
                    case 11:
                        setTimeout(noteOff, 9 * DURATION);
                        break;
                    case 8:
                    case 12:
                        if (kind === "i" || kind === "t"){
                            setTimeout(noteOff, 2 * DURATION);
                        }
                        else if (kind === "q"){
                             setTimeout(noteOff, 3 * DURATION);
                        }
                        else{
                            setTimeout(noteOff, 7 * DURATION);
                        }
                        break;;
                    default:
                        setTimeout(noteOff, 3 * DURATION);
                        break;
                        // hexatonic and decatonic scales same as default
                }
            }
        }

    };

    var noteOff = function() {
        MIDI.noteOff(0, arpeggio[i], 0);
        notes[j][3] = 0;

        // DEBUG: don't use redraw here
        ctx.clearRect(0, 0, ctrX * 2, ctrY * 2);
        drawCircle();
        allLabels();
        allNotes();

        if (makeType === "c3"){
            Set1.drawSet();
            Set1.notesText();
        }
        if (i < arpeggio.length-1){
            i++;
            noteOn();
        }
        else if(kind === "c"){
            chordOn();
        }
        else 
        {
         // only or last note of scale or sequence
            if (count === 1)
            {
                j = sequence[i];
                notes[j][3] = 1;
                startX = notes[j][0];
                startY = notes[j][1];
                startN = notes[j][2];
                endX = notes[j][0];
                endY = notes[j][1];
                endN = notes[j][2] + 24;
                arcColor = lineColor;
                arcsLines(arcColor, arcSize, lineColor, startX, startY, startN, endX, endY, endN);
            }
            else 
            {
            // reset after sharps up, flats down notetext for defined
                if ((count > 7 && kind === "s")){
                    if( sets === 1){
                        Set1.notesText();
                    }
                    else if (sets === 2){
                        Set2.notesText();
                    }
                    else{
                        Set3.notesText();
                    }
                }
                ctx.clearRect(0, 0, ctrX * 2, ctrY *2);
                drawCircle();
                if (makeType === "c3"){
                    Set1.drawSet();
                    Set1.notesText();
                }
                if (kind === "i"){
                    // special draw for intervals
                    for (i = 0; i <sequence.length-1; i++)
                    {
                        j = sequence[i+1];
                        k = sequence[i];
                        notes[k][3] = 1;
                        startX = notes[k][0];
                        startY = notes[k][1];
                        startN = notes[k][2];
                        endX = notes[j][0];
                        endY = notes[j][1];
                        endN = notes[j][2];
                        if(endN === startN) {
                            endN = endN + 24;
                        }
                        lineColor = noteColor(k);
                        arcColor = lineColor;
                        arcsLines(arcColor, arcSize, lineColor, startX, startY, startN, endX, endY, endN);
                    }
                }
                else if (kind === "d")
                {
                    for (l = 0; l < i; l++)
                    {
                        k = sequence[l];
                        m = sequence[l+1];
                        notes[k][3] = 1;

                        startX = notes[m][0];
                        startY = notes[m][1];
                        startN = notes[m][2];
                        endX = notes[k][0];
                        endY = notes[k][1];
                        endN = notes[k][2];
                        if(endN <= startN) {
                            endN = endN + 24;
                        }
                        lineColor = noteColor(m);
                        arcColor = lineColor;
                        arcsLines(arcColor, arcSize, lineColor, startX, startY, startN, endX, endY, endN);
                    }
                }
                else{
                    for (i = 0; i <count; i++)
                    {
                    // DEBUG: changing arcs & lines colors; commenting original code for reference
                        j = sequence[i];
                        k = sequence[i+1];
//                        if (kind === "c" || kind === "s"){
//                            lineColor = noteColor(root);
//                        }
//                        else{
//                            // other sequence
//                            lineColor = noteColor(k);
//                        }
                        lineColor = noteColor(j);
                        // arcColor = noteColor(k);
                        arcColor = lineColor;
                        notes[j][3] = 1;
                        startX = notes[j][0];
                        startY = notes[j][1];
                        startN = notes[j][2];
                        endX = notes[k][0];
                        endY = notes[k][1];
                        endN = notes[k][2];
                        if(endN < startN) {
                            endN = endN + 24;
                        }
                        
                        arcsLines(arcColor, arcSize, lineColor, startX, startY, startN, endX, endY, endN);
                    }
                }
            }
            allLabels();
            allNotes();

            if (LOOP){
                HIDE = 1;
            }
            else{
                HIDE = 0;
               // promptEl.innerHTML = "";
                // DEBUG: we had a delay on drawing the button console but no longer needed
                //setTimeout(drawConsole, DURATION);
                drawConsole();
            }
        }
    };
  
    var chordOn = function()
    {
        ctx.clearRect(0, 0, ctrX * 2, ctrY *2);
        drawCircle();
        if (makeType === "c3"){
            Set1.drawSet();
            Set1.notesText();
        }
        // i already set to 0
        if (kind === "t"){
            //tensions!! loop thru midi array of arrays

             j = sequence[i];
             notes[j][3] = 1;
             notes[0][3] = 1;
             allLabels();
             allNotes();
            
            /*   j is the current note number and i is the outer loop indexremember the sequence array is like [0,0,0,1,0,2,0,3,0,4,0,5,0,6,0,7,0,8,0,9,0,10,0,11,0,0, 0,0]; 
      */
                        
            for (l = 0; l <i; l++)
            {   
                k = sequence[l+1];

                startX = notes[0][0];
                startY = notes[0][1];
                startN = notes[0][2];
                endX = notes[k][0];
                endY = notes[k][1];
                endN = notes[k][2];
                if(endN === startN) {
                    endN = endN + 24;
                }
                lineColor = noteColor(k);
                arcColor = lineColor
                arcsLines(arcColor, arcSize, lineColor, startX, startY, startN, endX, endY, endN);
             }
             allLabels();
             allNotes();

             MIDI.chordOn(0, arpeggio[i], 127, 0);
            if (i !== sequence.length - 1){
                 setTimeout(chordOff, DURATION * 2);
             }
            else{
                // last note
                setTimeout(chordOff, DURATION * 4);
            }         
        }
        else{
            
            

            if (count === 1)
            {
                j = sequence[i];
                notes[j][3] = 1;
                startX = notes[j][0];
                startY = notes[j][1];
                startN = notes[j][2];
                endX = notes[j][0];
                endY = notes[j][1];
                endN = notes[j][2] + 24;
                lineColor = noteColor(root);
                arcColor = lineColor;
                arcsLines(arcColor, arcSize, lineColor, startX, startY, startN, endX, endY, endN);
            }
            else 
            {
                for (i = 0; i < count; i++)
                {
                    j = drawChord[i];
                    k = drawChord[i+1];
                    notes[j][3] = 1;

                    startX = notes[j][0];
                    startY = notes[j][1];
                    startN = notes[j][2];
                    endX = notes[k][0];
                    endY = notes[k][1];
                    endN = notes[k][2];
                    if(endN < startN) {
                        endN = endN + 24;
                    }
                    if (count === 2){
                        lineColor = noteColor(root);
                        arcColor = noteColor(j);
                    }
                    else{
                        lineColor = noteColor(j);
                        arcColor = lineColor;
                    }
                    arcsLines(arcColor, arcSize, lineColor, startX, startY, startN, endX, endY, endN);
                }
            }

            allLabels();
            if (makeType === "c3"){
                Set2.notesText();
            }
            allNotes();
            MIDI.chordOn(0, midi, 127, 0);

            // all chords should play for a half note or 1000 ms
            // however because of rests to finish out the measure, it varies

            switch(count)
            {
                case 1:
                case 2:
                    setTimeout(chordOff, DURATION * 2);
                    break;
                case 3:
                case 8:
                    setTimeout(chordOff, DURATION * 5);
                    break;
                case 4:
                case 5:
                case 6:
                default:
                    setTimeout(chordOff, DURATION * 3);
                    break;
                case 7:
                    setTimeout(chordOff, DURATION * 7);
                    break;

                    // may need to add 9, 10, and 11 note chords (undefined)
            }
        }
     };
    
    var chordOff = function() {
        if (kind === "t"){
            MIDI.chordOff(0, arpeggio[i], 0);
            notes[j][3] = 0;
            notes[0][3] = 0;
            
             // DEBUG: don't use redraw here
            ctx.clearRect(0, 0, ctrX * 2, ctrY * 2);
            drawCircle();
            allLabels();
            allNotes();
            
            if (i < sequence.length-1){
                i++;
                chordOn();
            }
            else{
                //last chord in tensions
                notes[0][3] = 1;             
                for (l = 0; l < i; l++)
                {   
                    k = sequence[l+1];
                    notes[k][3] = 1;
                    
                    startX = notes[0][0];
                    startY = notes[0][1];
                    startN = notes[0][2];
                    endX = notes[k][0];
                    endY = notes[k][1];
                    endN = notes[k][2];
                    if(endN <= startN) {
                        endN = endN + 24;
                    }
                    lineColor = noteColor(k);
                    arcColor = lineColor;
                    arcsLines(arcColor, arcSize, lineColor, startX, startY, startN, endX, endY, endN);
                }
                allLabels();
                allNotes();
                HIDE = 0;
                //promptEl.innerHTML = "";
                drawConsole();
            }
        }
        else{
            MIDI.chordOff(0, midi, 0);

            if (LOOP){
                HIDE = 1;
            }
            else{
                HIDE = 0;
               // promptEl.innerHTML = "";
                drawConsole();
            }
        }
    };
    
    // this starts playing the notes
    if (kind === "t"){
        chordOn();
    }
    else{
        noteOn();
    }
};
// end of playNotes

var doPlayNotes = function()
{
    // DEBUG: what if Set3 is undefined? 
    if (makeType === "c1"){
        Set1.playNotes();
    }
    else if(makeType === "c3"){
        Set2.playNotes();
    }
    else{
        Set3.playNotes();
    }
};


// DEBUG: Loop
function playLoop(z)
{
    
    window.addEventListener( "keypress", stopLoop, false );
    
    HIDE = -1;
    var n, kind, sequence;
    INTERVAL = 0;
    
    if (makeType === "c1"){
        kind = Set1.kind;
        sequence = Set1.midiSeq;
    }
    else if(makeType === "c3"){
        kind = Set2.kind;
        sequence = Set2.midiSeq;
    }
    else{
        kind = Set3.kind;
        sequence = Set3.midiSeq;
    }
    
    n = sequence.length;
    
    if (kind === "c"){
        n++;
        // add the chord
    }
    
    if (n < 7){
        INTERVAL = (DURATION * 8);
    }
    else if (n < 14){
        INTERVAL = (DURATION * 16);
    }
    else if (n < 22){
        INTERVAL = (DURATION * 24);
    }
    else{
        INTERVAL = (DURATION * 32);
    }
        
    // enable Stop Loop on menu 
    document.getElementById("STOP LOOP").className="";
    document.getElementById("TEMPO").className="disabled";
    //disable other menu items!
    // var disable = ["MAKE CHORD", "MAKE SCALE", "CLEAR","ENTER", "LOOP", "PLAY", "TRANSPOSE", "ADD CHORD", "LOOP CHORDS", "MERGE", "SWAP CHORDS", "TRANSFORM", "CHANGE MODE"];
    var disable = ["MAKE CHORD", "MAKE SCALE", "ENTER", "CLEAR","ADD CHORD", "MERGE", "PLAY", "LOOP", "LOOP CHORDS", "SWAP CHORDS"];
    for (var i=0, j=disable.length; i< j; i++){
        document.getElementById(disable[i]).className = "disabled";
    }        
    
    //promptEl.innerHTML = "Stop LOOP by Clicking Anywhere in the Circle";
    
    if (z === "notes" || z === "rows")
    {
        doPlayNotes();
        LOOP = setInterval(doPlayNotes, INTERVAL);
    }
    else if (z === "chords")
    {
        swapChords();
        LOOP = setInterval(swapChords, INTERVAL);
    }
    else{
        doReset();
        redraw();
    }    
    
    console.log("INTERVAL: " + INTERVAL);
}

function stopLoop ()
{
   // promptEl.innerHTML = "LOOP stopping";
    clearInterval(LOOP);
    LOOP = 0;
    document.getElementById("STOP LOOP").className="disabled";
     document.getElementById("TEMPO").className="";
    
    // enable other menu items
    drawConsole();
    
    console.log("STOP loop");
    console.log ("loop: " + LOOP);
};

function explore(kbID)
{
    var el, c, d, i , j, min, max, id, name, description;
    var selected = [];
    var menu = [];

    // close LEARN menu
    w3_close("ExploreMenu");
    w3_close("smallNav");
    
    menu = document.getElementsByClassName("w3-accordion-content");
    for (i = 0; i < menu.length; i++){
        el = menu[i];
        el.className = el.className.replace(" w3-show", "");
     }
    
    if(LOOP){
        stopLoop();
    }
    // don't use clearAll here, that draws blank staff paper
    doReset();
    redraw();
    setBackground(0);
    
    if (kbID === "ToneRows"){
        toneRows();
        return;
    }
    
    if (kbID === "randomChord" || kbID === "randomScale"){
        if (kbID === "randomChord"){
             min = 1200;
             max = 2353;
        }
        else{
            min = 5000;
            max = 6344;
        }
        
         id = Math.floor(Math.random() * (max - min)) + min;
        
        d = kb.indexOf(id);
        if (d < 0)
        {
            console.log ("ID error: " + id);
            return;
            // no match for kbID
        }
        //get the value of the kbID based on the ID index
        kbID = kb[d -11];
        c = kbData.indexOf(kbID);
    }
    
    else{
        //learn menu passes ### kbID
        c = kbData.indexOf(kbID);
        if (c < 0)
        {
            console.log ("kbID error: " + kbID);
            return;
            // no match for kbID
        }
        id = kbData[c+3];

        d = kb.indexOf(id);
    }

    name = kbData[c+1];
    description = kbData[c+2];

    kind = kb[d-14];
    code = kb[d-15];
    
    // use the code to populate the selected array with booleans
    for (i=0; i < 12; i++){
        j = code.charAt(i);
        if (j === "1"){
            selected.push(1);
        }
        else{
            selected.push(0);
            notes[i][3] = -1;
            // make sure deselected notes are set to -1, min;
        }
    }

     if (kind === "c")
    {
        Set1.number = kb[d-16];
        Set1.kind = kind;
        Set1.root = kb[d-13];
        Set1.rootName = kb[d-12];
        Set1.selected = selected;
        Set1.undef = 0;
        Set1.roman = kb[d-7];
        Set1.chordNotes = kb[d-6];
        Set1.chordMidi = kb[d-5];
        Set1.noteSeq = kb[d-4];
        Set1.midiSeq = kb[d-3];
        Set1.drawSeq = kb[d-2];
        Set1.vexflowSeq = kb[d-1];
        
        makeType = "c1";
        
        name1El.innerHTML = Set1.rootName + " " + name;
        description1El.innerHTML = description;
        
        name1El.setAttribute("class", "names");
        notation1El.setAttribute("class", "notations");
        description1El.setAttribute("class", "descriptions");
        
        CONSOLE = [0,0,0,0];     
        BUTTONS = "addChord";
        
        Set1.notesText();
        Set1.vexflow();
        Set1.playNotes();
    }
    else
    {
        // scale or sequence
        Set3.number = kb[d-16];
        Set3.kind = kind;
        Set3.root = kb[d-13];
        Set3.rootName = kb[d-12];
        Set3.selected = selected;
        Set3.undef = 0;
        Set3.roman = kb[d-7];
        Set3.chordNotes = kb[d-6];
        Set3.chordMidi = kb[d-5];
        Set3.noteSeq = kb[d-4];
        Set3.midiSeq = kb[d-3];
        Set3.drawSeq = kb[d-2];
        Set3.vexflowSeq = kb[d-1];
        
        makeType = "s1";
        
        if (kind === "q"){
             nameEl.innerHTML = name;
             CONSOLE = [0,0,0,0]; 
             BUTTONS = "madeSeq";
        }
        else{
            nameEl.innerHTML = Set3.rootName + " " + name;
            CONSOLE = [0,0,0,0]; 
            BUTTONS = "madeScale";
        }
        
        descriptionEl.innerHTML = description;
        
        nameEl.setAttribute("class", "names");
        notationEl.setAttribute("class", "notations");
        descriptionEl.setAttribute("class", "descriptions");
        

        
        if (Set3.number > 7 && kind === "s"){
            Set3.notesText("s");
        }
        else{
            Set3.notesText();
        }
        Set3.vexflow();
        Set3.playNotes();
    }
};

function toneRows(){
    
    doReset();
    redraw();
    
    Set3.number = 12;
    Set3.kind = "q";  
    Set3.selected = [1,1,1,1,1,1,1,1,1,1,1,1];
    Set3.undef = 0;
    Set3.roman = ["I", "bII", "II", "bIII", "III", "IV", "bV", "V", "bVI", "VI", "bVII", "VII"]
    Set3.noteSeq = [];
    Set3.midiSeq = [];
    Set3.drawSeq = [];
    Set3.vexflowSeq =[];
    
    var i, q, r, n, j, k, l, z, s;
    var randomNotes = [0,1,2,3,4,5,6,7,8,9,10,11];
    var vex = [];
    var stems = [];
    var temp = [];
    
    randomNotes.sort(function(a, b){return 0.5 - Math.random()});
    for(i=0; i<randomNotes.length; i++){
        // set q to noteNumber, not index
        q = randomNotes[i];
        // randomly select sharp or flat, index 5 is sharp, index 6 is flat
        r = Math.floor((Math.random() * 2) + 5);
        vex.push(labels[q][r]);
        
        // if sharp, then change the roman
        if ((r === 5) && (q === 1 || q === 3 || q === 6 || q === 8 || q === 10))
        {
            switch(q)
            {
                case 1:
                    Set3.roman[1] = "#I";
                    break;
                case 3:
                    Set3.roman[3] = "#II";
                    break;
                case 6:
                    Set3.roman[6] = "#IV";
                    break;
                case 8:
                    Set3.roman[8] = "#V";
                    break;
                case 10:
                    Set3.roman[10] = "#VI";
                    break;
            }
        }

        //capture first note
        if (i === 0){
            Set3.root = randomNotes[0];
            Set3.rootName = labels[q][r];
        }

        Set3.noteSeq.push(randomNotes[i]);
        if (q >= Set3.root){
            Set3.midiSeq.push(48 + randomNotes[i]); 
        }
        else{
            Set3.midiSeq.push(60 + randomNotes[i]); 
        }

    }
    // at end set the last note as the root +
    Set3.noteSeq.push(Set3.root);
    Set3.drawSeq = Set3.noteSeq;
    vex.push(vex[0]);
    Set3.midiSeq.push(Set3.midiSeq[0]+12); 
     
    z = 7;
    for (i = 0, k = 1; i <= z; i++, k++){
        n = vex[i];
        // if accidental other than a natural, look for matches in the measure
        if (n.length >1 && n.substr(1,1) !== "n"){
            //get the note letter without accidental
            l = n.substr(0,1);            
            // loop thru the measure looking for matches, starting with the next note
            for (j = i+1; j < z+1; j++){
                if(l === vex[j]){
                    vex[j] = l + "n";
                    //stop this inner loop when you find a match
                    break;
                }
            }
        }
        
        if (Set3.midiSeq[i] <60){
            vex[i] = vex[i] + "4";
        }
        else{
            vex[i] = vex[i] + "5";
        }
        if (i === 6 || i === 11){
            i++;
            if (Set3.midiSeq[i] <60){
                vex[i] = vex[i] + "4";
            }
            else{
                vex[i] = vex[i] + "5";
            }
            
         // reset loop for 2nd measure
            if (i === 7){
                 z = 11;
            }
            else if (i === 11){
                z = 12
            }
        }       
    }

      // calculate stems
    for (k = 0; k <12; k++){
        
        s = Set3.midiSeq[k] + Set3.midiSeq[k+1] + Set3.midiSeq[k+2] + Set3.midiSeq[k+3];
        if(s/4 > 59){
           stems = "down";
        }
        else{
            stems = "up";
        }

        z = vex[k] + "/8, " + vex[k+1] + ", " + vex[k+2] + ", " + vex[k+3] ;
        temp.push(z);
        temp.push(stems);
        Set3.vexflowSeq.push(temp);
        temp=[];
        s=0;
        k=k+3
    }
    z = vex[12] +"/h";
    temp.push(z);
    Set3.vexflowSeq.push(temp);
 
    
    nameEl.innerHTML = Set3.rootName + " Tone Row (random)";
    CONSOLE = [0,0,0,0]; 
    BUTTONS = "madeRow";

   descriptionEl.innerHTML = "Tone Row: one octave chromatic scale in random order without repeating.";
   nameEl.setAttribute("class", "names");
   notationEl.setAttribute("class", "notations");
   descriptionEl.setAttribute("class", "descriptions");
 
    /* console.log("randomNotes: " + randomNotes);
    console.log("Set3.noteSeq: " + Set3.noteSeq);
    console.log("vex: " + vex);
    console.log("Set3.midiSeq: " + Set3.midiSeq);
   console.log("Set3.vexflowSeq: " + Set3.vexflowSeq);
    */
    makeType = "q";
    Set3.notesText();
    Set3.vexflow();
    Set3.playNotes();    
};
// end toneRows

function startQuiz(videoID){
    
    // close LEARN menu
    w3_close("LearnMenu");
    w3_close("smallNav");
    
    menu = document.getElementsByClassName("w3-accordion-content");
    for (i = 0; i < menu.length; i++){
        el = menu[i];
        el.className = el.className.replace(" w3-show", "");
     }
    
    // doReset here to clear any html or divs
    doReset();
    
    var disable = ["MAKE CHORD", "MAKE SCALE", "ENTER", "CLEAR","ADD CHORD", "MERGE", "PLAY", "LOOP", "LOOP CHORDS", "SWAP CHORDS"];
    for (var i=0, j=disable.length; i< j; i++){
        document.getElementById(disable[i]).className = "disabled";
    }   
    
    Q = 0;
    QSCORE = 0; 
    
    var a = kbVideo.indexOf(videoID);
    if (a < 0){
        // no match -- put in something else here?
        return;
    }
    
    // DEBUG:
//    var vName = kbVideo[a+1];
//    var vLink = kbVideo[a+2];
//    var vQuiz = kbVideo[a+3];
//    console.log("vName: " + vName + ", vQuiz: " + vQuiz + ", vLink: " + vLink);
//    console.log ("videoID: " + videoID);
//    console.log ("a: " + a);
    //clears QARRAY
//    QARRAY.splice(0, QARRAY.length);
//    console.log ("QARRAY: " + QARRAY);
//    console.log ("kbVideo[a+5]: " + kbVideo[a+5]);
    QARRAY = kbVideo[a+4];
   // console.log ("QARRAY: " + QARRAY);
    //console.log ("kbVideo[a+4]: " + kbVideo[a+4]);
 
    var onClick = "checkAnswer(" + videoID + ")";
    document.getElementById("quizTitle").innerHTML=kbVideo[a+1];
    document.getElementById("quizAnswer").innerHTML="&nbsp;";
    document.getElementById("quizClick").setAttribute("onclick", onClick);
    document.getElementById("quizClick").setAttribute("value", "Submit");
    document.getElementById("quizAsk").setAttribute("class", "");
    
    document.getElementById("startup").style.display="none";
    document.getElementById('quiz').style.display='block';
    
    setBackground(1);
    HIDE = 1;
    makeQuestion();

};

function makeQuestion(){
    HIDE = 1;
    redraw();
    LOOP = 0;
    var qCount = QARRAY.length;
    console.log ("qCount: " + qCount);
    var qCurrent = Q + 1;
    var question = QARRAY[Q];
//    console.log("question: " + question);
    document.getElementById("quizQuestion").innerHTML = question[0];
    document.getElementById("quizCount").innerHTML = "Question " + qCurrent + " of " + qCount; 
    var qType = question[3];

    var quizAsk = document.getElementById("quizAsk");
    var choices = question[1];
//    console.log("choices: " + choices);

    if(qType === "m"){
        // multiple choice
        var div = document.createElement("div");
        for (var i=0, j=choices.length; i<j ; i++){
            var label = document.createElement("label");
            var radio = document.createElement("input");
            var hr = document.createElement("hr");
            radio.type = "radio";
            radio.name = "option";
            radio.value= choices[i];
            label.appendChild(radio);
            label.appendChild(document.createTextNode(choices[i]));
            label.appendChild(hr);
            div.appendChild(label);
        }
    quizAsk.appendChild(div); 
    }
    else{
        // challenge
        makeType = choices[0];
    }
};
function checkAnswer(videoID){

    var qCount = QARRAY.length;
    var correct = QARRAY[Q][2];
    var right = 0;
    var qAnswer;
    var checked = 0;
    // where the answer is the indexNo
    
    var question = QARRAY[Q];
    var qType = QARRAY[Q][3];


    // if multiple choice then verify an option was selected, else verify a note was selected
     if(qType === "m"){
        for (var i = 0, j=document.getElementsByName("option").length; i<j; i++){
            if(document.getElementsByName("option")[i].checked){
                checked++;
            }
            if ( i === correct){
                 qAnswer = document.getElementsByName("option")[i].value;
                 // this is the right answer
                 if(document.getElementsByName("option")[i].checked){
                     // you got it right
                     QSCORE++;
                     right++;
                     document.getElementById("quizAnswer").innerHTML = "<span>CORRECT!</span>";
                     document.getElementById("quizAnswer").setAttribute("class", "quizCorrect");
                 }
            }
        }
     }
    else{
        // this code was duplicated from clickEnter
        // should I check here to see if no notes were selected?
        
        var code = "";
        var selected = [];
        var qRoot = QARRAY[Q][1][2];
        
        console.log ("qRoot: "+ qRoot + "firstSelected: " + firstSelected);
        console.log ("correct: " + correct);
        
        for( var i=0, n=0, j=notes.length; i< j; i++)
        {
            if (notes[i][3]< 1){
                selected.push(0);
            }
            else {
                selected.push(notes[i][3]);
                checked++;
            }
            code = code + String(selected[i]);
            // firstSelected is root;
        }

        if(code === correct && (qRoot === undefined || qRoot === firstSelected)){
            //verify that root matches
            
            QSCORE++;
            right++;
            document.getElementById("quizAnswer").innerHTML = "<span>CORRECT!</span>";
            document.getElementById("quizAnswer").setAttribute("class", "quizCorrect");
        }
        else{
            //not right!!
            qAnswer = QARRAY[Q][1][1];
        }
        
    }
    if (checked){
        if (!right){
            document.getElementById("quizAnswer").innerHTML = "<span>SORRY!</span> Correct answer is:<br><b>" + qAnswer + "</b>";
            document.getElementById("quizAnswer").setAttribute("class", "quizWrong");
        }
         if(qType === "c"){
            clickEnter();
            // turn on LOOP to hide button console!
             LOOP = 1;
         }
    }
    else{
        // no answer
        document.getElementById("quizCount").innerHTML = "<span>Please select an answer before clicking Submit.</span>";
        document.getElementById("quizCount").setAttribute("class", "quizWrong");
        return;
    }

    // if last question
    if (Q === qCount -1){
        document.getElementById("quizClick").setAttribute("value", "See Score");
        document.getElementById("quizCount").innerHTML = "";

    }
    else{
         document.getElementById("quizClick").setAttribute("value", "Next");
         document.getElementById("quizCount").innerHTML = "Score: " + QSCORE;

    }
    var onClick = "nextQuestion(" + videoID + ")";
    document.getElementById("quizAsk").setAttribute("class", "quizDisabled");
    document.getElementById("quizClick").setAttribute("onclick", onClick);
    };

function nextQuestion(videoID){

    var onClick;
    var qCount = QARRAY.length;
    var quizAsk = document.getElementById("quizAsk");
    var quizDiv = quizAsk.getElementsByTagName("div")[0];
   
    if(quizDiv){
            quizAsk.removeChild(quizDiv);
    }
    
    quizAsk.setAttribute("class", "");
    document.getElementById("quizAnswer").innerHTML = "&nbsp;";
    document.getElementById("quizAnswer").setAttribute("class", "");
    Q++;

    // set all notes to off
    for (var i = 0, j = notes.length; i < j; i++)
    {
        notes[i][3] = 0;
    }
    console.log ("makeType: " + makeType);
    if (makeType === "s1"){
        Set3.notesText("n");
    }
    else{
        Set1.notesText("n");
    }
    makeType = "";
    //reset noteText so its numeric
    redraw();
    
    //basically I need to do a reset() except reset includes quiz reset code!

    // taken from reset() <-- change this code to a function and consider removing all these vars
    nameEl.innerHTML = "";
    notationEl.innerHTML = "";
    descriptionEl.innerHTML = "";
    name2El.innerHTML = "";
    notation2El.innerHTML = "";
    description2El.innerHTML = "";
    name1El.innerHTML = "";
    notation1El.innerHTML = "";
    description1El.innerHTML = "";
    notation3El.innerHTML = "";
    
    nameEl.removeAttribute("class");
    notationEl.removeAttribute("class");
    descriptionEl.removeAttribute("class");
    name1El.removeAttribute("class");
    notation1El.removeAttribute("class");
    description1El.removeAttribute("class");
    name2El.removeAttribute("class");
    notation2El.removeAttribute("class");
    description2El.removeAttribute("class");
    notation3El.removeAttribute("class");

    HIDE = 1;
    LOOP = 0;
    
    
    if (Q === qCount){
        //if quiz is over

        document.getElementById("quizAnswer").innerHTML = "Your score: " + QSCORE + " out of " + qCount + ".";
        document.getElementById("quizAnswer").setAttribute("class", "quizCorrect");

        //document.getElementById("quizClick").style.width="280px";
        
        if ( QSCORE === qCount){
            document.getElementById("quizQuestion").innerHTML = "<b>Perfect Score Maestro!</b>";
        }
        else  if (QSCORE > 6){
            document.getElementById("quizQuestion").innerHTML = "<b>Good Job!</b>";
        }
        else {
            var a = kbVideo.indexOf(videoID);
            var vName = kbVideo[a+1];
            document.getElementById("quizQuestion").innerHTML = "You may wish to watch the <a href='#' onclick='playVideo(" + videoID + ")'> " + vName + "</a> video again.";
        }
            
        var nextID = videoID + 1;
        if (kbVideo.indexOf(nextID) < 0){
            // no match -- go back to beginning?
            nextID = 1000;
        }
        onClick = "playVideo(" + nextID + ")";
        document.getElementById("quizClick").setAttribute("value", "Continue");
        document.getElementById("quizClick").setAttribute("onclick", onClick);
        
        //clears QARRAY
        QARRAY.splice(0, QARRAY.length);

        document.getElementById("quizCount").innerHTML ="";
        return;
    }
    
    var qCurrent = Q + 1;
    onClick = "checkAnswer(" + videoID + ")";
    document.getElementById("quizClick").setAttribute("onclick", onClick);
    document.getElementById("quizClick").setAttribute("value", "Submit");
    document.getElementById("quizCount").innerHTML = "question " + qCurrent + " of " + qCount;
    document.getElementById("quizCount").setAttribute("class", "");

    var question = QARRAY[Q];
    document.getElementById("quizQuestion").innerHTML = question[0];

    makeQuestion();
};

function playVideo(videoID){
    
    // close LEARN menu
    w3_close("LearnMenu");
    w3_close("smallNav");
    
    menu = document.getElementsByClassName("wfcon3-accordion-content");
    for (i = 0; i < menu.length; i++){
        el = menu[i];
        el.className = el.className.replace(" w3-show", "");
     }
    
    var a = kbVideo.indexOf(videoID);
    if (a < 0){
        // no match -- go back to beginning?
        a = 0;
        videoID = 1000;
    }

    var vName = kbVideo[a+1];
    var vLink = kbVideo[a+2];
    var vQuiz = kbVideo[a+3];
    
    document.getElementById('video').style.display="block";
    document.getElementById('videoContent').style.display="block";
    document.getElementById('videoClick').style.display="block";
    document.getElementById('videoName').innerHTML = vName;    
    var vFrame = document.getElementById("playVideo");
    vFrame.setAttribute("src", vLink);
    
    if(vQuiz){
        var onClick = "closeVideo(1," + videoID + ")";
        document.getElementById("videoClick").setAttribute("value", "Take the Quiz");
        document.getElementById("videoClick").setAttribute("onclick", onClick);
    }
    else{
        var nextID = videoID + 1;
        if (kbVideo.indexOf(nextID) < 0){
            // no match -- put in something else here?
            nextID = 1000;
        }
        var onClick = "playVideo(" + nextID + ")";
        document.getElementById("videoClick").setAttribute("value", "Next Video");
        document.getElementById("videoClick").setAttribute("onclick", onClick);
        
    }

};
function closeVideo(vQuiz, videoID){
    var vFrame = document.getElementById("playVideo");

    document.getElementById('video').style.display="none";
    // blank src is necessary to keep video from playing after modal is closed
    vFrame.setAttribute("src", " ");

    if(vQuiz){
        startQuiz(videoID);
    }
};

//end quiz functions