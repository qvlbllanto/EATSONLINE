const key = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~', ' '];


function getencrypt(stringtoencrypt, countnum){
		stringtoencrypt = stringtoencrypt.split("");
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
                if(countnum  == counter){
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
function encrypt(stringtoencrypt, passw, identifier){
		passw = passw.split("");
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

function decrypt(encrypted, passw, identifier){

    var array = [];
    for(var i = 0; i<encrypted.length; i+=7){
    var vluepl7 = ""+encrypted.charAt(i)+encrypted.charAt(i+1)+encrypted.charAt(i+2)+encrypted.charAt(i+3)+encrypted.charAt(i+4)+encrypted.charAt(i+5)+encrypted.charAt(i+6);
        array.push(vluepl7);
     }
		passw = passw.split("");
 		var ans = 0;
    var count = 0;
    while(count<passw.length){
        ans += key.indexOf(passw[count]);
        count+=1;
    }
    ans += passw.length;
    var count2 = 0;
    var countnum =  ans * (identifier + key.length);
    var decryptedstring = "";
    var cou = 0;
    var lengthofstring = array.length;
    var check = [];
    var i = 0;
    while(i<key.length){
        var x = getencrypt(key[i], countnum);
        check.push(x);
        i+=1;
     }
     //alert(array);
    var count3r = 0
    for(var count3r=0; count3r<lengthofstring; count3r++){
        for(var i2=0; i2 < check.length; i2++){
            if(check[i2] == array[count3r]){
                decryptedstring += key[i2];
            }
        }
    }
    return decryptedstring;
}