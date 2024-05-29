
//ham bam mot chuoi chi phan thanh mot chuoi hexa
function sha1Hex(str) {
    return CryptoJS.SHA1(str).toString(CryptoJS.enc.Hex);
}

// ham bam mot chuoi nhi phan sang một số nguyên lớn
function sha1Binary(str) {
    return bigInt(CryptoJS.SHA1(str).toString(CryptoJS.enc.Hex), 16);
}

//ham tao p va q;
//L = 1024 bits : số bit của p
//N = 160 bits : số bit của q
function generatePQ(L, N) {
    const g = N;
    const n = Math.floor((L - 1) / g);
    const b = (L - 1) % g;
    let s;
    while (true) {
        let q
        while (true) {
            s = bigInt.randBetween(1, bigInt(2).pow(g)); // tạo một số ngẫu nhiên từ 1 đến 2**(g-1);
            const a = sha1Binary(s.toString());
            const zz = sha1Binary(s.plus(1).toString());
            const U = a.xor(zz);
            const mask = bigInt(2).pow(N - 1).plus(1);
            q = U.or(mask);
            if (q.isProbablePrime(20)) break;
        }

        let i = 0;
        let j = 2;
        while (i < 4096) {
            const V = [];
            for (let k = 0; k <= n; k++) {
                const arg = s.plus(j).plus(k).mod(bigInt(2).pow(g));
                V.push(sha1Binary(arg.toString()));
            }

            let W = bigInt(0);
            for (let qq = 0; qq < n; qq++) {
                W = W.plus(V[qq].multiply(bigInt(2).pow(160 * qq)));
            }
            W = W.plus(V[n].mod(bigInt(2).pow(b)).multiply(bigInt(2).pow(160 * n)));
            const X = W.plus(bigInt(2).pow(L - 1));
            const c = X.mod(bigInt(2).multiply(q));
            const p = X.minus(c).plus(1);

            if (p.geq(bigInt(2).pow(L - 1)) && p.isProbablePrime(10)) {
                return { p, q };
            }
            i++;
            j += n + 1;
        }
    }
}

//ham tao g va h;
function generateGH(p, q) {
    while (true) {
        const h = bigInt.randBetween(2, p.minus(1));
        const exp = p.minus(1).divide(q);
        const g = h.modPow(exp, p);
        if (g.gt(1)) {
            return {g, h};
        }
    }
}

//ham tao hai khoa x va y:
function generateKeys(g, p, q,x = bigInt.randBetween(2, q)) {
    const y = g.modPow(x, p);
    return { x, y };
}

//ham tao ra cac thanh phan khoa cong khai: {p, q, g}
function generateParams(L, N) {
    const { p, q } = generatePQ(L, N);
    const g = generateGH(p, q).g;
    return { p, q, g };
}

//ham tao chu ki voi M la chuoi dau vao
function sign(M, p, q, g, x) {

    while (true) {
        const k = bigInt.randBetween(2, q); // so ngau nhien k
        const r = g.modPow(k, p).mod(q); // r = (g**k mod p) mod q
        const m = bigInt(sha1Hex(M), 16); // chuyển đổi thông điệp M thành giá trị băm va chuyen ve so nguyen
        try {
            const s = k.modInv(q).multiply(m.add(x.multiply(r))).mod(q); // s = cong thuc da cho;
            return { r, s };
        } catch (e) {
            // Loop to try again if invert fails
        }
    }
}

//ham xac nhan chu ky
function verify(M, r, s, p, q, g, y) {
        let w = s.modInv(q);
        let m = bigInt(sha1Hex(M), 16);
        let u1 = m.multiply(w).mod(q);
        let u2 = r.multiply(w).mod(q);
        let v = g.modPow(u1, p).multiply(y.modPow(u2, p)).mod(p).mod(q);
        console.log(M,m);
        return v.equals(r);
}

//ham kiem tra tinh hop le cua p, q va g
function validateParams(p, q, g) {
    return p.isProbablePrime() && q.isProbablePrime() && g.modPow(q, p).equals(1) && g.gt(1) && p.minus(1).mod(q).equals(0);
}

//ham kiem tra tinh hop le cua r, s, q
function validateSign(r, s, q) {
    return r.gt(0) && r.lt(q) && s.gt(0) && s.lt(q);
}

// const N = 160;
// const L = 1024;
// const { p, q, g } = generateParams(L, N);
// const { x, y } = generateKeys(g, p, q);

// const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
// const encoder = new TextEncoder();
// const M = encoder.encode(text);
// console.log(M, text);
// const { r, s } = sign(M, p, q, g, x);
// const test = "hayha";
// const te = encoder.encode(test);
// if (verify(te, r, s, p, q, g, y)) {
//     console.log('All ok');
// }

// console.log(r.toString(), s.toString());