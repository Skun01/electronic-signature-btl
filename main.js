

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

//lay lua chon hash function:
const hashMapElem = document.querySelector('#hashmap');


//chuyen khoa xuong
sendKeysElem.addEventListener('click', e=>{
    pPub.value = pPrime;
    qPub.value = qPrime;
    gPub.value = g;
    yPub.value = y;
})

//// NGUOI DUNG NHAP MODE: