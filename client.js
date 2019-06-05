var websocket = new WebSocket("ws://127.0.0.1:8765/");
var times = 0;
var detect_key = true;
var start = new Date().getTime();
var beep = document.getElementById("beep");  // beep.wav
var wrong = document.getElementById("wrong");  // wrong.mp3
var mario = document.getElementById("mario");  // mario.mp3


/*
ToDo: Ignore keys other than space on staring or interval trials
*/
document.onkeydown = function(e){
    e = e || window.event;
    
    if (detect_key && ( (e.keyCode == 69 || e.keyCode == 73) || e.keyCode == 32) ) {
        // Return early if space pressed in normal blocks
        if (['1', '2', '3', '4', '5'].indexOf(data.block) >= 0 &&
            e.keyCode == 32) {return;};
        // Return early if e or i pressed in interval blocks
        if (['0', '12', '23', '34', '45'].indexOf(data.block) >= 0 &&
            e.keyCode != 32) {return;};
        // Always return early in testFeedback block (freeze program)
        if (data.block == '6') {return;};

        // pressed left key
        if (e.keyCode == 69){   // keycode for e
            RT = getRT();
            correct = (data.answer == 'left') ? 'true':'false';
            resp_feedback('right');
            
        // pressed right key
        } else if (e.keyCode == 73) {
            RT = getRT();
            correct = (data.answer == 'right') ? 'true':'false';
            resp_feedback('left');
        } 
        // Pressed space
        else if (e.keyCode == 32) {
            RT = -1;
            correct = 'false'
            document.getElementById("content-text").innerHTML = 'Get Ready';
            if (data.block == '0') {
                mario.play();
                //pause(5000);
            }
        } else { window.alert("Bug in document.onkeydown"); };
        
        // Clean up if Correct
        if (correct == 'true') setTimeout(cleanStim, 100);
        
        // Print RT on browser for feed back (remove later)
        document.getElementById("rt").innerHTML = 'RT: ' + RT + 'sec';
        
        // send data to server
        if (e.keyCode == 32) {setTimeout(sendData, 2400);}  // pressed space: wait for 2.4 sec
        else {setTimeout(sendData, 900);}  // pressed e or i: wait for 0.9 sec
    }
}

// Send data
function sendData() {
    sending = {'correct': correct, 'rt': RT};
    websocket.send(JSON.stringify(sending));
    detect_key = false;
}


/*
block: 3
type: text 
content: 真誠
answer: left
*/
websocket.onmessage = function (event) {
    data = JSON.parse(event.data);

    // Clean up previous stimulus
    cleanStim();

    switch (data.block) {
        // Testing Blocks
        case '3':
            process_block3(); break;
        case '5':
            process_block5(); break;
        // Pairing Blocks
        case '1':
            process_block1(); break;
        case '2':
            process_block2(); break;
        case '4':
            process_block4(); break;
        // Interval Instructions
        case '0':
            process_block0(); break;
        case '12':
            process_block12(); break;
        case '23':
            process_block23(); break;
        case '34':
            process_block34(); break;
        case '45':
            process_block45(); break;
        // Test Feedback
        case '6':
            test_feedback(); break;
        default:
            window.alert("Undefined block"); // error handling
    }
    
    // start timer
    start = new Date().getTime();
    detect_key = true
};

// Helper Functions //

// block 0 processing
function process_block0() {
    // present button layouts: pos & DPP on left
    document.getElementById("left-cue1").innerHTML = '';
    document.getElementById("left-cue2").innerHTML = '民進黨';
    document.getElementById("right-cue1").innerHTML = '';
    document.getElementById("right-cue2").innerHTML = '國民黨';
    
    // present stimulus
    write_stim()
}

// block 1 processing
function process_block1() {
    // present button layouts: pos & DPP on left
    document.getElementById("left-cue1").innerHTML = '';
    document.getElementById("left-cue2").innerHTML = '民進黨';
    document.getElementById("right-cue1").innerHTML = '';
    document.getElementById("right-cue2").innerHTML = '國民黨';
    
    // present stimulus
    write_stim()
}

// block 2 processing
function process_block2() {
    // present button layouts: pos & DPP on left
    document.getElementById("left-cue1").innerHTML = '正向';
    document.getElementById("left-cue2").innerHTML = '';
    document.getElementById("right-cue1").innerHTML = '負向';
    document.getElementById("right-cue2").innerHTML = '';
    
    // present stimulus
    write_stim()
}

// block 3 processing
function process_block3() {
    // present button layouts: pos & DPP on left
    document.getElementById("left-cue1").innerHTML = '正向';
    document.getElementById("left-cue2").innerHTML = '民進黨';
    document.getElementById("right-cue1").innerHTML = '負向';
    document.getElementById("right-cue2").innerHTML = '國民黨';
    
    // present stimulus
    write_stim()
}

// block 4 processing
function process_block4() {
    // present button layouts: pos & DPP on left
    document.getElementById("left-cue1").innerHTML = '';
    document.getElementById("left-cue2").innerHTML = '國民黨';
    document.getElementById("right-cue1").innerHTML = '';
    document.getElementById("right-cue2").innerHTML = '民進黨';
    
    // present stimulus
    write_stim()
}

// block 5 processing
function process_block5() {
    // present button layouts: pos & DPP on left
    document.getElementById("left-cue1").innerHTML = '正向';
    document.getElementById("left-cue2").innerHTML = '國民黨';
    document.getElementById("right-cue1").innerHTML = '負向';
    document.getElementById("right-cue2").innerHTML = '民進黨';
    
    // present stimulus
    write_stim()
}

// Test feedback
function test_feedback() {
    if (data.content == 'KMT') {}
    else {};

    // Clear all cues
    document.getElementById("left-cue1").innerHTML = '';
    document.getElementById("left-cue2").innerHTML = '';
    document.getElementById("right-cue1").innerHTML = '';
    document.getElementById("right-cue2").innerHTML = '';
    
    // Write Political party preference
    //document.getElementById("stimulus").innerHTML = data.content;
    document.getElementById("stimulus").innerHTML = `
    <p id='test-feedback'>結束囉～</p>
    `;
    
}

// Present stimulus
function write_stim() {
    if (data.type == 'text') {
        document.getElementById("content-text").innerHTML = data.content;
        if (data.cnpt_attr == 'a') {
            document.getElementById("content-text").style = 'color:green;';
        } 
    } else if (data.type == 'img') {
        document.getElementById("content-img").src = data.content;
        document.getElementById("content-img").style = 'width:200px;height: 200px;';
    } else {
        window.alert('data.type not text nor img')
    }
}

// Response feedback: Play different sound for correct or wrong answer
function resp_feedback(wrongAnswer) {
    if (data.answer == wrongAnswer) {
        cleanStim();
        document.getElementById("content-text").innerHTML = 'WRONG';
        document.getElementById("content-text").style = 'color:red;font-weight:bold;font-size:1.3em';
        wrong.play();
    } else beep.play();
}

// Clean up previous stimulus
function cleanStim() {
    document.getElementById("content-text").innerHTML = '';
    document.getElementById("content-text").style = '';
    document.getElementById("content-img").src = '';
    document.getElementById("content-img").style = '';
}

function getRT() {
    var end = new Date().getTime();
    var timeTaken = (end - start) / 1000;
    return timeTaken
}
