// MERKLE TREE
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256');

require('dotenv').config(); 

const express = require('express')
const cors = require('cors')
const app = express()
const path = require('path')

app.use(express.static(path.join(__dirname + "/build")))

app.use(cors({
}));

const port = process.env.PORT || 3000;

const allowListAddresses = [];

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
