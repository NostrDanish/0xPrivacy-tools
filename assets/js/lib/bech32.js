// Self-contained Bech32 / Bech32m (BIP173 / BIP350). Used for Nostr npub/nsec + generic bech32.
const CHARSET='qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const CHARSET_REV={}; for(let i=0;i<CHARSET.length;i++) CHARSET_REV[CHARSET[i]]=i;
const GENERATOR=[0x3b6a57b2,0x26508e6d,0x1ea119fa,0x3d4233dd,0x2a1462b3];
function polymod(values){
  let chk=1;
  for(const v of values){ const top=chk>>25; chk=((chk&0x1ffffff)<<5)^v;
    for(let i=0;i<5;i++){ chk^=((top>>i)&1)?GENERATOR[i]:0; } }
  return chk;
}
function hrpExpand(hrp){ const ret=[]; for(let i=0;i<hrp.length;i++) ret.push(hrp.charCodeAt(i)>>5);
  ret.push(0); for(let i=0;i<hrp.length;i++) ret.push(hrp.charCodeAt(i)&31); return ret; }
function verifyChecksum(hrp,data,constant){ return polymod(hrpExpand(hrp).concat(data))===constant; }
function createChecksum(hrp,data,constant){ const vals=hrpExpand(hrp).concat(data); const mod=polymod(vals.concat([0,0,0,0,0,0])) ^ constant;
  const ret=[]; for(let i=0;i<6;i++) ret.push((mod>>(5*(5-i)))&31); return ret; }
function bech32PolymodConstant(variant){ return variant==='bech32m'?0x2bc830a3:1; }
const B32=new Uint8Array(32);
function toWords(bytes,pad){ let acc=0,bits=0; const out=[]; for(const b of bytes){ acc=(acc<<8)|b; bits+=8;
  while(bits>=5){ bits-=5; out.push((acc>>bits)&31); } } if(bits>0){ out.push((acc<<(5-bits))&31); } return out; }
function fromWords(words){ let acc=0,bits=0; const bytes=[]; for(const w of words){ acc=(acc<<5)|w; bits+=5;
  if(bits>=8){ bits-=8; bytes.push((acc>>bits)&0xff); } } return Uint8Array.from(bytes); }

export function encode(hrp, data, variant='bech32'){
  const c=bech32PolymodConstant(variant);
  const combined = data.concat(createChecksum(hrp,data,c));
  let s=hrp+'1'; for(const d of combined) s+=CHARSET[d]; return s;
}
export function decode(str){
  const lowered=str.toLowerCase();
  const pos=lowered.lastIndexOf('1'); if(pos<1||pos+7>lowered.length) throw new Error('invalid bech32');
  const hrp=lowered.slice(0,pos);
  const data=[]; for(let i=pos+1;i<lowered.length;i++){ const v=CHARSET_REV[lowered[i]]; if(v===undefined) throw new Error('bad char '+lowered[i]); data.push(v); }
  // try bech32 then bech32m
  if(verifyChecksum(hrp,data,1)) return { hrp, data:data.slice(0,-6), variant:'bech32' };
  if(verifyChecksum(hrp,data,0x2bc830a3)) return { hrp, data:data.slice(0,-6), variant:'bech32m' };
  throw new Error('checksum mismatch');
}
export function wordsToHex(words){ const b=fromWords(words); return Array.from(b).map(x=>x.toString(16).padStart(2,'0')).join(''); }
export function hexToWords(hex){ const clean=hex.startsWith('0x')?hex.slice(2):hex; const b=[]; for(let i=0;i<clean.length;i+=2) b.push(parseInt(clean.substr(i,2),16));
  return toWords(Uint8Array.from(b)); }
