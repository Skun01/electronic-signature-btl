

//THUAT TOAN TAO KHOA

//Lay lua chon cua nguoi dung:
const customWay = document.querySelector("#custom-way");
const randomWay = document.querySelector('#random-way');

//lay cac thanh phan tao khoa:
const p = document.querySelector('#prime-p');
const q = document.querySelector('#q');
const h = document.querySelector('#h');
const x = document.querySelector('#x');

//lay hai nut kich hoat viec tao khoa va reset lai cac gia tri
const createKeyBtn = document.querySelector('.create-keys');
const resetBtn = document.querySelector('.reset-btn');

//lay cac gia tri se hien thi khoa
const privResElem = document.querySelector('#priv-res');
const pubResElem = document.querySelector('#pub-res');
const pubResGElem = document.querySelector('#pub-g-res');

//lay nut se chuyen khoa xuong phia duoi
const sendKeysElem = document.querySelector('.send-res');


//// XU LY KHI CHON MOT TRONG HAI LUA CHON TAO KHOA:

//LUA CHON TU NHAP
let makeRandomKey = false;

customWay.addEventListener('click', e=>{
    resetKeyComponets();
    makeRandomKey = false;
});

//Tao p, q, h, x ngau nhien
let pPrime, qPrime, hRandom, xRandom;
randomWay.addEventListener('click', e=>{
    makeRandomKey = true;
    //Tao p
    let randPBinary = randomBinary(512, 1024, 64);
    pPrime = findNearestPrime(randPBinary);
    p.value = pPrime;

    //Tao q
    let randQBinary = randomBinary(160, 160);
    qPrime = findNearestPrime(randQBinary);
    q.value = qPrime;

    //Tao h:
    hRandom = randomH(randPBinary, pPrime, qPrime);
    h.value = hRandom;
    //Tao x:
    xRandom = randomX(q, randQBinary);
    x.value = xRandom;
});
// tao khoa cong khai y:
let g, y;
createKeyBtn.addEventListener('click', e=>{  
    if(makeRandomKey === true){
        // tinh g
        g = powerMod(hRandom,(pPrime-1n)/qPrime,pPrime);
        // tinh y
        y = powerMod(g, xRandom, pPrime);
        // hien thi ket qua
        pubResElem.value = y;
        privResElem.value = xRandom; 
        pubResGElem.value = g;
    }
    
});

//reset moiThu
resetBtn.addEventListener('click', e=>{
    resetKeyComponets();
    makeRandomKey = false;
    customWay.checked = true;
});


/**TAO VA KIEM TRA CHU KI SECTION */


//lay cac elemnt khoa cong khai:
const pPub = document.querySelector('#p-pub');
const qPub = document.querySelector('#q-pub');
const gPub = document.querySelector('#g-pub');
const yPub = document.querySelector('#y-pub');

//lay khoa bi mat x:
const xPriv = document.querySelector('#private-key');

//lay lua chon hash function:
const hashMapElem = document.querySelector('#hashmap');

//chuyen khoa xuong
sendKeysElem.addEventListener('click', e=>{
    pPub.value = pPrime;
    qPub.value = qPrime;
    gPub.value = g;
    yPub.value = y;
    xPriv.value = xRandom;
})

/**TAO CHU KY SECTION */

// lay K element
const randKElem = document.querySelector('#rand-k-num');

// lay ket qua chu ky
const sigResult = document.querySelector('#sig-result');

//lay random k button
let k;
const randKBtn = document.querySelector('.rand-k-btn');
randKBtn.addEventListener('click', e=>{
        let randKBinary;
        do{
            randKBinary = randomBinary(1, 160);
            k = binaryToBigInt(randKBinary);
        }while(k >= q);
        randKElem.value = k;
});

//lay ban ro thong qua file
const fileText = document.querySelector('#text-file');

//lay hop textBox hien thi text
const rawText = document.querySelector('#raw-text');

//xu ly de lay thong tin duoc nhap tu file
fileText.addEventListener('change', e=>{
    // lay file
    const file = fileText.files[0];

    // xac dinh dinh dang file
    const fileType = file.type;
    let fileCategory;
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        fileCategory = 'DOCX file';
    } else if (fileType === 'text/plain') {
        fileCategory = 'TXT file';
    }

    // xu ly dinh dang file
    if(fileCategory === 'TXT file'){
        const fr = new FileReader();
        fr.readAsText(file);
        console.log(file);
        fr.addEventListener('load', e=>{
            rawText.value = fr.result;
        });
    }else{
        const reader = new FileReader();
        reader.onload = function(e) {
            const arrayBuffer = e.target.result;
            mammoth.extractRawText({ arrayBuffer: arrayBuffer })
                .then(function(result) {
                    rawText.value = result.value;
                })
                .catch(function(err) {
                    console.error(err);
                });
        };
        reader.readAsArrayBuffer(file);
    }
});

//lay nut tao
const makeSigBtn = document.querySelector('#making-sig');

//tao r va s khi bam nui;

makeSigBtn.addEventListener('click', function (){
    let r, s;
    //tao r
    r = powerMod(g, k, pPrime)%qPrime;
    //tao s:
    
    //ma hoa text su dung ham bam da chon;
    let hashText;
    if(hashMapElem.value == "SHA-1") hashText = SHA1(rawText.value);
    else hashText = SHA256(rawText.value);
    console.log(hashText);
    const bigIntText = hexToBigInt(hashText);
    s = (modInverse(k, qPrime)*(bigIntText + xRandom*r))%qPrime;

    //hien thi chu ki
    sigResult.value = r.toString(16) + s.toString(16);
});

// lưu chữ kí:
const saveSigBtn = document.querySelector('.save-sig');
saveSigBtn.addEventListener('click', function() {
    const text = sigResult.value;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signature.txt';
    a.click();
});


//kiem tra chu ki

//lay ban ro:
const textCheckElem = document.querySelector('#text-check');
//lay nut input file ban ro
const textCheckFile = document.querySelector('#text-check-file');

textCheckFile.addEventListener('change', e=>{
    // lay file
    const file = textCheckFile.files[0];

    // xac dinh dinh dang file
    const fileType = file.type;
    let fileCategory;
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        fileCategory = 'DOCX file';
    } else if (fileType === 'text/plain') {
        fileCategory = 'TXT file';
    }

    // xu ly dinh dang file
    if(fileCategory === 'TXT file'){
        const fr = new FileReader();
        fr.readAsText(file);
        console.log(file);
        fr.addEventListener('load', e=>{
            textCheckElem.value = fr.result;
        });
    }else{
        const reader = new FileReader();
        reader.onload = function(e) {
            const arrayBuffer = e.target.result;
            mammoth.extractRawText({ arrayBuffer: arrayBuffer })
                .then(function(result) {
                    textCheckElem.value = result.value;
                })
                .catch(function(err) {
                    console.error(err);
                });
        };
        reader.readAsArrayBuffer(file);
    }
});
//lay r va s thong qua chu ki:
const sigCheckElem = document.querySelector('#sig-check');
//lay nut input file sig
const sigCheckFile = document.querySelector('#sig-check-file');

sigCheckFile.addEventListener('change', e=>{
    const fr = new FileReader();
    fr.readAsText(sigCheckFile.files[0]);
    fr.onload = function(){
        sigCheckElem.value = fr.result;
        
    }
});

//lay nut kiem tra
const checkingBtnElem = document.querySelector('.checking-btn');
checkingBtnElem.addEventListener('click', e=>{
    //lay r va s;
    let r = '', s = '';
    const sigStr = sigCheckElem.value;
    for(let i = 0; i < sigStr.length; i++){
        if(i < sigStr.length/2) r += sigStr[i];
        else s += sigStr[i];
    }
    let rSig = hexToBigInt(r);
    let sSig = hexToBigInt(s);
    let qBigInt = BigInt(qPub.value);
    let pBigInt = BigInt(pPub.value);
    let gBigInt = BigInt(gPub.value);
    let yBigInt = BigInt(yPub.value);

    // thuat toan kiem tra

    //lay ban ro va ma hoa no
    let hashTextCheck;
    if(hashMapElem.value == "SHA-1") hashTextCheck = SHA1(textCheckElem.value);
    else hashTextCheck = SHA256(textCheckElem.value);
    let hashBigInt = BigInt('0x' + hashTextCheck);
    const w = modInverse(sSig, qBigInt);
    const u1 = (w*hashBigInt)%qBigInt;
    const u2 = (rSig*w)%qBigInt;
    const v = ((powerMod(gBigInt, u1, pBigInt)*powerMod(yBigInt, u2, pBigInt))%pBigInt)%qBigInt;
    
    //lay o ket qua:
    const checkingResult = document.querySelector('#checking-res');
    checkingResult.value = v === rSig ? "Chữ kí có hiệu lực!": "Văn bản đã bị sửa đổi!";
});

