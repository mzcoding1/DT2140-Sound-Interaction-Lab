//==========================================================================================
// AUDIO SETUP
//------------------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------------------
// Edit just where you're asked to!
//------------------------------------------------------------------------------------------
//
//==========================================================================================
let dspNode = null;
let dspNodeParams = null;
let jsonParams = null;

// Change here to ("tuono") depending on your wasm file name
const dspName = "laser";
const instance = new FaustWasm2ScriptProcessor(dspName);

// output to window or npm package module
if (typeof module === "undefined") {
    window[dspName] = instance;
} else {
    const exp = {};
    exp[dspName] = instance;
    module.exports = exp;
}

// The name should be the same as the WASM file, so change tuono with brass if you use brass.wasm
laser.createDSP(audioContext, 1024)
    .then(node => {
        dspNode = node;
        dspNode.connect(audioContext.destination);
        console.log('params: ', dspNode.getParams());
        const jsonString = dspNode.getJSON();
        jsonParams = JSON.parse(jsonString)["ui"][0]["items"];
        dspNodeParams = jsonParams
        // const exampleMinMaxParam = findByAddress(dspNodeParams, "/thunder/rumble");
        // // ALWAYS PAY ATTENTION TO MIN AND MAX, ELSE YOU MAY GET REALLY HIGH VOLUMES FROM YOUR SPEAKERS
        // const [exampleMinValue, exampleMaxValue] = getParamMinMax(exampleMinMaxParam);
        // console.log('Min value:', exampleMinValue, 'Max value:', exampleMaxValue);
    });


//==========================================================================================
// INTERACTIONS
//------------------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------------------
// Edit the next functions to create interactions
// Decide which parameters you're using and then use playAudio to play the Audio
//------------------------------------------------------------------------------------------
//
//==========================================================================================
// x 0
// y just around 90 or -90
// z around 0


let lastBellTime = 0;       
const bellCooldownMs = 500;


function accelerationChange(accx, accy, accz) {
    // acc only along Y axis, on itself basically, rotating
    isAcceleratingUpandBack = (accx < -5 && accy < -5)
    return isAcceleratingUpandBack
}

function rotationChange(rotx, roty, rotz) {
    // check first if we are flat, or roughly flat
    isPointingFlat =
        rotx > -8 && rotx < 8 &&
        roty > -80 && roty < -90 &&
        roty > 80 && roty < 90 &&
        rotz > -10 && rotz < 10;

    if (!isPointingFlat) return;

    // check if we are rotating
    accDetected = accelerationChange(accelerationX, accelerationY, accelerationZ);

    if (accDetected && isPointingFlat) {

        isPointingFlat =
        rotx > -8 && rotx < 8 &&
        roty > -80 && roty < -90 &&
        roty > 80 && roty < 90 &&
        rotz > -10 && rotz < 10;
        if (isPointingFlat) {
            playAudio();
        }
        
    }
}

function mousePressed() {
    playAudio()
    // Use this for debugging from the desktop!
}

function deviceMoved() {
    movetimer = millis();
    statusLabels[2].style("color", "pink");
}

function deviceTurned() {
    threshVals[1] = turnAxis;
}
function deviceShaken() {
    shaketimer = millis();
    statusLabels[0].style("color", "pink");
    playAudio();
}

function getMinMaxParam(address) {
    const exampleMinMaxParam = findByAddress(dspNodeParams, address);
    // ALWAYS PAY ATTENTION TO MIN AND MAX, ELSE YOU MAY GET REALLY HIGH VOLUMES FROM YOUR SPEAKERS
    const [exampleMinValue, exampleMaxValue] = getParamMinMax(exampleMinMaxParam);
    console.log('Min value:', exampleMinValue, 'Max value:', exampleMaxValue);
    return [exampleMinValue, exampleMaxValue]
}

//==========================================================================================
// AUDIO INTERACTION
//------------------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------------------
// Edit here to define your audio controls 
//------------------------------------------------------------------------------------------
//
//==========================================================================================

function playAudio() {
    if (!dspNode) {
        return;
    }
    if (audioContext.state === 'suspended') {
        return;
    }
    
    console.log('audio should play');
    dspNode.setParamValue("/laser/trigger", 1);  
    setTimeout(() => {
        dspNode.setParamValue("/laser/trigger", 0); 
    }, 10);
    // 
}

//==========================================================================================
// END
//==========================================================================================