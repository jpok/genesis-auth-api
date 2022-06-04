// MERKLE TREE
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256');

require('dotenv').config(); 

const express = require('express')
const cors = require('cors')
const app = express()
const path = require('path')

app.use(express.static(path.join(__dirname + "/build")))

// app.use(cors({
//   origin: 'http://localhost:3001'
// }));

const port = process.env.PORT || 3000;

const allowListAddresses = [  
  '0x6D94bE6864947a89B1997eEF3Dd2d7dEa108CfcD',
  '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
  '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  '0xAA9fb8Bb49640610FFFB6f4284ED373eE3F3029B'
];

const wlNodes = allowListAddresses.map(a => keccak256(a));

const wlTree = new MerkleTree(
    wlNodes, 
    keccak256, 
    {
      duplicateOdd: false,
      hashLeaves: false,
      isBitcoinTree: false,
      sortLeaves: false,
      sortPairs: true,
      sort: false,
    });
    
  
app.get('/login/:address', function (req, res) {
  const address = req.params.address;  
  res.send(getHashToken(address));       
})

app.listen(port, () => {
  console.log(`whitelist auth app listening on port ${port}`);
  console.log(wlTree.getHexRoot()); 
})

function getHashToken(address) {  
  const nodeOfAddress = keccak256(address);
  return wlTree.getHexProof(nodeOfAddress);  
}
