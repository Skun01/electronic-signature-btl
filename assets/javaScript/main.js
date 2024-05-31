

//THUAT TOAN TAO KHOA

//Lay lua chon cua nguoi dung:
const customWay = document.querySelector("#custom-way");
const randomWay = document.querySelector('#random-way');

//lay cac thanh phan tao khoa:
const pElem = document.querySelector('#prime-p');
const qElem = document.querySelector('#q');
const hElem = document.querySelector('#h');
const xElem = document.querySelector('#x');

//lay hai nut kich hoat viec tao khoa va reset lai cac gia tri
const createKeyBtn = document.querySelector('.create-keys');
const resetBtn = document.querySelector('.reset-btn');

//lay cac gia tri se hien thi khoa
const pubYRes = document.querySelector('#pub-y-res');
const pubGRes = document.querySelector('#pub-g-res');
const privXRes = document.querySelector('#priv-x-res');

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
let pqValue;
let ghValue;
let xRandom;
randomWay.addEventListener('click', e=>{
    makeRandomKey = true;
    //tao p va q
    //--p : 1024 bits
    //-q: 160 bits;
    pqValue = generatePQ(1024, 160);
    pElem.value = pqValue.p;
    qElem.value = pqValue.q;

    //tao h va g;
    ghValue = generateGH(pqValue.p, pqValue.q);
    hElem.value = ghValue.h;
    
    //tao x:
    xRandom = bigInt.randBetween(2, pqValue.q);
    xElem.value = xRandom;
});

// tao khoa cong khai y:
let xyValue;
createKeyBtn.addEventListener('click', e=>{  
    if(makeRandomKey === true){
        // tinh y
        xyValue = generateKeys(ghValue.g, pqValue.p, pqValue.q, xRandom);
        // hien thi ket qua
        pubYRes.value = xyValue.y;
        privXRes.value = xyValue.x; 
        pubGRes.value = ghValue.g;
    }
});

//reset moiThu
resetBtn.addEventListener('click', e=>{
    resetKeyComponets();
    makeRandomKey = false;
    customWay.checked = true;
});

function resetKeyComponets(){
    pElem.value = '';
    qElem.value = '';
    xElem.value = '';
    hElem.value = '';
    pubGRes.value = '';
    pubYRes.value = '';
    privXRes.value ='';
    makeRandomKey = false;
    customWay.checked = true;
}

//Chuyen tiep gia tri cua cac khoa

//lay cac elemnt khoa cong khai:
const pPub = document.querySelector('#p-pub');
const qPub = document.querySelector('#q-pub');
const gPub = document.querySelector('#g-pub');
const yPub = document.querySelector('#y-pub');
const privateKeyX = document.querySelector('#private-key');

//lay lua chon hash function:

//chuyen khoa
sendKeysElem.addEventListener('click', e=>{
    pPub.value = pqValue.p;
    qPub.value = pqValue.q;
    gPub.value = ghValue.g;
    yPub.value = xyValue.y;
    privateKeyX.value = xyValue.x;
    alert("chuyển khóa thành công");
});

// Lay nut chuyen cua so
const displayPubKey = document.querySelector('.display-pub-key');

// lấy cửa sổ tạo khóa
const createKeysSec = document.querySelector('.create-keys-sec');

displayPubKey.addEventListener('click', ()=>{
    createKeysSec.style.display = "none";
});

// Lay nut chuyen sang cua so tao khoa
const displayCreateKeys = document.querySelector('.display-create-keys');

displayCreateKeys.addEventListener('click', ()=>{
    createKeysSec.style.display = "block";
});

// TẠO CHỮ KÝ

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
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
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
    } else if (fileType === 'text/plain') {
        const fr = new FileReader();
        fr.readAsText(file);
        console.log(file);
        fr.addEventListener('load', e=>{
            rawText.value = fr.result;
        });
    }
});

//Lay gia tri cua khoa bi mat x

//lấy sự kiện click vào nút tạo chữ ký:
const signBtn = document.querySelector('#making-sig');

//lấy ô textbox hiển thị kết quả ký
const sigResult = document.querySelector('#sig-result');

//hash map ans
const hashMapElem = document.querySelector('#hashmap');

signBtn.addEventListener('click', e=>{
    //chuyển văn bản
    const M = rawText.value;
    
    //Tạo cặp chữ kí r và s
    const rsObj = sign(M, bigInt(pPub.value), bigInt(qPub.value), bigInt(gPub.value), bigInt(privateKeyX.value));

    //hiển thị cặp chữ kí r và s vào ô kết quả ký
    sigResult.value = rsObj.r.toString() + "/" + rsObj.s.toString();
    hashMapElem.value = rsObj.hashMapText;
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

/**KIỂM TRA CHỮ KÝ */

//lấy bản rõ
const textCheckElem = document.querySelector('#text-check');
//lay nut input file ban ro
const textCheckFile = document.querySelector('#text-check-file');




//xử lý để lấy bản rõ được nhập từ file
textCheckFile.addEventListener('change', e=>{
    // lay file
    const file = textCheckFile.files[0];
    // xac dinh dinh dang file
    const fileType = file.type;
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
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
    } else if (fileType === 'text/plain') {
        const fr = new FileReader();
        fr.readAsText(file);
        console.log(file);
        fr.addEventListener('load', e=>{
            textCheckElem.value = fr.result;
        });
    }
});

//Lấy chữ ký:
const sigCheckElem = document.querySelector('#sig-check');

//lay nut input file sig
const sigCheckFile = document.querySelector('#sig-check-file');

//xử lý file chữ ký để hiển thị
sigCheckFile.addEventListener('change', e=>{
    const fr = new FileReader();
    fr.readAsText(sigCheckFile.files[0]);
    fr.onload = function(){
        sigCheckElem.value = fr.result;
        
    }
});

//lấy nút kiểm tra:
const checkingBtnElem = document.querySelector('.checking-btn');

// lấy element kết quả kiểm tra:
const checkingResult = document.querySelector('#checking-res');

//Thực hiện kiểm tra:
checkingBtnElem.addEventListener('click', e=>{
    //lấy 2 giá trị r và s thông qua bản ký:
    const rsArray = sigCheckElem.value.split('/');
    const r = bigInt(rsArray[0]);
    const s = bigInt(rsArray[1]);
    //Lấy bản rõ:
    let M = textCheckElem.value;
    // let checkAnswer = verify(M, r, s, bigInt(pPub.value), bigInt(qPub.value), bigInt(gPub.value), bigInt(yPub.value));
    //hiển thị kết quả lên màn hình
    checkingResult.value = checkAnswer ? "Tất cả điều đáng tin cậy!" : "Tất cả KHÔNG đáng tin cậy!";
});


const sendText = document.querySelector('.send-text');
sendText.addEventListener('click', e=>{
    textCheckElem.value = rawText.value;
    sigCheckElem.value = sigResult.value;
});



