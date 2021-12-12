const { BloomFilter } = require('bloom-filters')
// create a Bloom Filter with a size of 10 and 4 hash functions
let filter = new BloomFilter(10, 4)
// insert data
//filter.add('iftach')
//filter.add('roi')
const arr=['iftach','roi']
filter.add(arr)

// lookup for some data
console.log(filter.has('roi')) // output: true
console.log(filter.has('beni')) // output: false
