// ham reset lai cac o chua thanh phan cua khoa:
function resetKeyComponets(){
    p.value = "";
    q.value = "";
    h.value = '';
    x.value = '';
    pubResElem.value = '';
    privResElem.value = '';
}

/**Cac ham de tao ngau nhien tham so q:  */

// ham tao so nhi phan ngau nhien voi so bit cho truoc
function randomBinary(boundLeft, boundRight, mod = 1){
    let bits;
    while(true){
        bits = Math.floor(Math.random()*(boundRight - boundLeft + 1) + boundLeft);
        if(bits%mod === 0) break;
    }
    let res = "1";
    for(let i = 0; i < bits; i++){
        res += (Math.floor(Math.random()*2)).toString();
    }
    return res;
}

//ham chuyen doi mot chuoi nhi phan sang so nguyen:
function binaryToBigInt(binaryStr) {
    return BigInt('0b' + binaryStr);
}

//phep thu fermat
function fermatTest(n, k = 5) {
    if (n <= 1n) return false;
    if (n <= 3n) return true;
    for (let i = 0; i < k; i++) {
        const a = 2n + BigInt(Math.floor(Math.random() * (Number(n - 3n) + 1)));
        if (modExp(a, n - 1n, n) !== 1n) return false;
    }
    return true;
}

//tinh mod cua mot so mu:
function modExp(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) result = (result * base) % mod;
        exp = exp >> 1n;
        base = (base * base) % mod;
    }
    return result;
}

// Phep thu Miller-Rabin
function millerRabinTest(n, k = 5) {
    if (n <= 1n) return false;
    if (n <= 3n) return true;
    if (n % 2n === 0n) return false;
    
    let r = 0n;
    let d = n - 1n;
    while (d % 2n === 0n) {
        d /= 2n;
        r += 1n;
    }
    
    for (let i = 0; i < k; i++) {
        const a = 2n + BigInt(Math.floor(Math.random() * (Number(n - 4n) + 1)));
        let x = modExp(a, d, n);
        if (x === 1n || x === n - 1n) continue;
        
        let isComposite = true;
        for (let j = 0; j < r - 1n; j++) {
            x = (x * x) % n;
            if (x === n - 1n) {
                isComposite = false;
                break;
            }
        }
        
        if (isComposite) return false;
    }
    
    return true;
}

// Kiem tra so nguyen to su dung 2 phep thu fermat va miller-rabin
function isPrime(n, k = 5) {
    if (!fermatTest(n, k)) return false;
    return millerRabinTest(n, k);
}

//tim so nguyen to gan nhat:
function findNearestPrime(binStr) {
    let n = binaryToBigInt(binStr);
    let direction =  Math.floor(Math.random()*2);
    const step = direction === 1 ? 1n : -1n;
    while (true) {
        if (isPrime(n)) return n;
        n += step;
    }
}

//tao h random thoa man dieu kien
function randomH(pBinary, p, q){
    p -=1n;
    let h;
    do{
        let randHBinary = randomBinary(1, pBinary.length);
        h = binaryToBigInt(randHBinary);
        g = (p/q);
    }while( h <= 1n && h >= p  || g < 1n);
    return h;
}

//random x
function randomX(q, qBinary){
    let x;
    do{
        let randXBinary = randomBinary(1, 160);
        x = binaryToBigInt(randXBinary);
    }while(x <= 0n || x >= q);
    return x;
}

//Thuat toan binh phuong va nhan
function powerMod(base, exponent, modulus) {
    if (exponent === 0n) {
      return 1n;
    }
  
    let result = 1n;
    let square = base;
  
    while (exponent > 0n) {
      if (exponent % 2n === 1n) {
        result = (result * square) % modulus;
      }
  
      square = (square * square) % modulus;
      exponent = exponent/2n;
      console.log("2");
    }
  
    return result;
  }

  //cac ham tinh modulo nghich dao
  function modInverse(a, m) {
    if (gcdBigInt(a, m) !== 1n) {
      throw new Error('Modulo inverse does not exist');
    }
  
    let [x, y, _] = extendedGcdBigInt(a, m);
    return (x + m) % m;
  }
  
  function gcdBigInt(a, b) {
    while (b !== 0n) {
      let temp = a;
      a = b;
      b = temp % b;
    }
    return a;
  }
  
  function extendedGcdBigInt(a, b) {
    if (b === 0n) {
      return [1n, 0n, a];
    }
  
    let [x1, y1, d1] = extendedGcdBigInt(b, a % b);
    return [y1, x1 - (a / b) * y1, d1];
  }

  // Hàm chuyển đổi từ chuỗi hex sang bigInt
  function hexToBigInt(hexString) {
    if (!/^[0-9a-fA-F]+$/.test(hexString)) {
      throw new Error('Invalid hex string');
    }
    return BigInt('0x' + hexString);
  }