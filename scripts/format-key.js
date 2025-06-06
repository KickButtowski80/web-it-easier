// This script formats a private key for use in Vercel environment variables
// Run with: node scripts/format-key.js

// Replace this with your actual private key
const rawKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCuJgK6aluUqdk9
Kd5PnaW5Jou4YpvbQdNfcZjnZ6uggX7rkH5EXY0+jTQ4sR+PH09mJHcCHaHEHlK7
Sq/hPpk7cr/IhktzAFFxCCSwuIOot656t+7/l93SEkSp8L5Y3eBGPSE9Wy3924iv
dcAQMTXyNEkKQYGWB9kUuoxF7tvAAKOLGSB2NB9yjA0qQdM/gDZVSp+poJtwGQ51
ldR6+pg/APm5PiK8zynxcP4l+LR96a5w/SFwBGdGpwT8CAA2tCVrvES+bfo00kgU
KxhVWQTeg/+4U3dY5MCsXZqi1Ck8y0LVEAaqxvxoOFYuAC4/4Ke3eUY+7P1baGvA
s6L1w/+lAgMBAAECggEAJ1e3gJFUIL0Rcq+xhWeOX8qNQKnoX4uauuKBQnAJlkCD
Iak6WWwQI4xHerJLOKyAZclBqJT0rYeTNbRNETQw7n0BRkZOp8uv2nsWPOVmexiK
HrfMkuomhxWw9PqKKi3wA7Y+OuwNMx9kXQ1bR10yvIXi5WIAqloaCQSO+aKZeyHZ
68Sxm3WAo9M3O/qFaiR9W3wiZgGWZAwLPKXRqBn+f6oPvEuD4Q06MhoeNlcDk2XC
hTi18UoqUwxaxs72aRzVzfqrkvGsIg3v1tnBd5RzXNT22J1YjGMJx2W3scxU9zQI
VVzxWHSwBB90/rxtXBT8bLu8oPP7ZUsuOk/TpYZaAQKBgQDpsYRCoxFyRXNrjsLp
AxYt9wjtrPFKSRWMOnCiSot9lIiM/7gqiJ9O7dlquSmxwtjtVG+VsmLYz2RTyDja
Wx3HxPQPywDqXd+Hq+dmsBkVuuXmcOLWBywpoJr7CPUsZqDa4CgjLbzWYceSqbYj
/fGP/tTwVFC/vhWA23NZFPzGAQKBgQC+xXdcvlz91vYcD2y371NnVTNpMy4/ubm0
CrjZF5s/5f8bafXwuXppnMXGc0RfNxot20xwjj10feE05Ky5DjSi9sgcXs8puD9j
vN6yz6bov+xPQkaAzxShFZBmv9Yc7n5Xsll/QbcQPyMCofcsXg0VQx+r9JXG0Jok
M3FIO9JhpQKBgB9NAZQTV2Dg4IbFhmHDYhMiBXYgNelnRJWVtkRmi6x0Wp3YGojH
596giQB8cJM4r+mJ57A7RnYXwS5foQ3OKnz5al87J5I8pJX9dm8Qoyt/7w8gi6Fz
MH0a3+dD2eLqlBz87SNZGvP0ANEqHhVQDCznSwotoOstwJ+TxS1nXDwBAoGAJ1OB
pabAeLuFhIdRfCFj6htQO9GHKS/aLlk/fdE1+dgp3LbdMkCqEXd19dDxOUecp/Nb
MKDB3m/MqyCw0n0xMJ765Y5N2mXW+3KF3gqcd8KIrlYVPpxxvjs5x1SoiNJJTT7A
4FDlsf2x8+r7jzPcMpPhxYroDVIXVHseUSuz1NkCgYEAl+u1SIUtr0t092KzCNOg
nujLPSdszxQTH0NloOO+irmgYDFvOYmSQjXs+nr4NquJ2e7kYxRF1OZs+mSvgfjv
szXAHOfqhbVnNG02ASVvhSTGwQXdlJIbmeL7O6Y+PGOermyUNe5JScXyS4bEIgYr
hhlHHaHyDZxL8NCWCAnGSFQ=
-----END PRIVATE KEY-----`;

// Format the key for Vercel by:
// 1. Removing all newlines
// 2. Adding literal \n where newlines should be
const formattedKey = rawKey
  .split('\n')
  .join('\\n');

console.log('=== FORMATTED KEY FOR VERCEL ===');
console.log(formattedKey);
console.log('\n=== END OF KEY ===');
console.log('\nCopy the above key (without the === markers) and paste it in your Vercel environment variables.');
