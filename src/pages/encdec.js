const key = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z','!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-','0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~', ' '];

const cyrb53 = function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value>>>amount) | (value<<(32 - amount));
    };
    
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j;
    var result = ''

    var words = [];
    var asciiBitLength = ascii[lengthProperty]*8;
    
    var hash = sha256.h = sha256.h || [];
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];

    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
            k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
        }
    }
    
    ascii += '\x80'
    while (ascii[lengthProperty]%64 - 56) ascii += '\x00' 
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j>>8) return; // ASCII check: only accept characters in range 0-255
        words[i>>2] |= j << ((3 - i)%4)*8;
    }
    words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
    words[words[lengthProperty]] = (asciiBitLength)
    
    // process each chunk
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
        var oldHash = hash;
        // This is now the undefinedworking hash", often labelled as variables a...g
        // (we have to truncate as well, otherwise extra entries at the end accumulate
        hash = hash.slice(0, 8);
        
        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            var w15 = w[i - 15], w2 = w[i - 2];
            var a = hash[0], e = hash[4];
            var temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
                + ((e&hash[5])^((~e)&hash[6])) // ch
                + k[i]
                + (w[i] = (i < 16) ? w[i] : (
                        w[i - 16]
                        + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
                        + w[i - 7]
                        + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
                    )|0
                );
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
                + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2]));
            
            hash = [(temp1 + temp2)|0].concat(hash);
            hash[4] = (hash[4] + temp1)|0;
        }
        
        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i])|0;
        }
    }
    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            var b = (hash[i]>>(j*8))&255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
};

const getencrypt = (stringtoencrypt, countnum)=>{
	stringtoencrypt = Array.from(stringtoencrypt);
    var tom = [1,2,0,6,2,0];
    var encryptedstring = "";
   	var cou = 0;
    var lengthofstring = stringtoencrypt.length;
    while(cou<lengthofstring){
        var counter = 0;
        var ch = false;
        var i = key.indexOf(stringtoencrypt[cou]);
        while(true){
            while(i<key.length){
                if(countnum  === counter){
                		var copy="";
                    if (i <= key.length - 7){
                        copy=key[i]+key[i+tom[0]]+key[i+tom[1]]+key[i+tom[2]]+key[i+tom[3]]+key[i+tom[4]]+key[i+tom[5]];
                    }else if(i <= key.length - 6){
                        copy=key[i]+key[i+tom[0]]+key[i+tom[1]]+key[i+tom[2]]+key[0]+key[i+tom[4]]+key[i+tom[5]];
                    }else if(i <= key.length - 5){
                        copy=key[i]+key[i+tom[0]]+key[i+tom[1]]+key[i+tom[2]]+key[1]+key[i+tom[4]]+key[i+tom[5]];
                    }else if(i <= key.length - 4){
                        copy=key[i]+key[i+tom[0]]+key[i+tom[1]]+key[i+tom[2]]+key[2]+key[i+tom[4]]+key[i+tom[5]];
                    }else if(i <= key.length - 3){
                        copy=key[i]+key[i+tom[0]]+key[i+tom[1]]+key[i+tom[2]]+key[3]+key[i+tom[4]]+key[i+tom[5]];
                    }else if(i <= key.length - 2){
                        copy=key[i]+key[i+tom[0]]+key[0]+key[i+tom[2]]+key[4]+key[0]+key[i+tom[5]];
                    }else if(i <= key.length - 1){
                        copy=key[i]+key[i+tom[5]]+key[1]+key[i+tom[2]]+key[5]+key[1]+key[i+tom[5]];
                    }
                    encryptedstring+=copy;
                    ch = true;
                    break;
                 }
                counter+=1;
                i+=1;
            }
            i=0;
            if(ch){
                break;
            }
        }
        cou+=1;
     }   
    return encryptedstring;
}
const encrypt = (stringtoencrypt, passw, identifier) =>{
    if(stringtoencrypt === null){
        return null;
    }
		passw = Array.from(passw);
    var ans = 0;
    var count = 0;
    while(count<passw.length){
        ans += key.indexOf(passw[count]);
        count+=1;
    }
    ans +=passw.length;
    var encryptedstring = "";
    var countnum = ans * (identifier + key.length);
    encryptedstring = getencrypt(stringtoencrypt, countnum);
    return encryptedstring;
}

const decrypt = (encrypted, passw, identifier) => {
    if(encrypt === null){
        return null;
    }
    var array = [];
    for(var i = 0; i<encrypted.length; i+=7){
    var vluepl7 = ""+encrypted.charAt(i)+encrypted.charAt(i+1)+encrypted.charAt(i+2)+encrypted.charAt(i+3)+encrypted.charAt(i+4)+encrypted.charAt(i+5)+encrypted.charAt(i+6);
        array.push(vluepl7);
     }
		passw = Array.from(passw);
 		var ans = 0;
    var count = 0;
    while(count<passw.length){
        ans += key.indexOf(passw[count]);
        count+=1;
    }
    ans += passw.length;
    var countnum =  ans * (identifier + key.length);
    var decryptedstring = "";
    var lengthofstring = array.length;
    var check = [];
    var u = 0;
    while(u<key.length){
        var x = getencrypt(key[u], countnum);
        check.push(x);
        u+=1;
     }
     //alert(array);
    for(var count3r=0; count3r<lengthofstring; count3r++){
        for(var i2=0; i2 < check.length; i2++){
            if(check[i2] === array[count3r]){
                decryptedstring += key[i2];
            }
        }
    }
    return decryptedstring;
}

export { encrypt, decrypt, cyrb53}