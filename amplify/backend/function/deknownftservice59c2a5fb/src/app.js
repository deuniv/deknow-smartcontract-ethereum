/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


const { ethers } = require('ethers');

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

/**********************
 * Example get method *
 **********************/
 app.get('/scholar/opensea/:scholarId', function(req, res) {
  //  Infura
  const infura_provider = new ethers.providers.InfuraProvider(
    'rinkeby', // or 'ropsten', 'rinkeby', 'kovan', 'goerli'
    'bc5e010d21174c11b0542e349b57908e'
  )
  const owner_signer = new ethers.Wallet('f50c5c30648b4e0351f8e6c2bfa105a27cfc5d5ff2ccc5f875e62cf994dcec7a', infura_provider)

  const DEKNOW_SCHOLAR_V1_ABI = [
    "function getName(uint256 scholarId) public view returns (string memory)",
  ];
  const deknowScholar = new ethers.Contract('0x3590Da3A6539d5f5F856104D81d34E3e1B7ccd43', DEKNOW_SCHOLAR_V1_ABI, owner_signer);
  deknowScholar.getName(req.params.scholarId).then((name) => {
    res.json({
      "attributes": [
        {
          "trait_type": "Name",
          "value": name
        },
        {
          "trait_type": "Eyes",
          "value": "sleepy"
        },
        {
          "trait_type": "Mouth",
          "value": "cute"
        },
        {
          "trait_type": "Level",
          "value": req.params.scholarId
        },
        {
          "trait_type": "Stamina",
          "value": 90.2
        },
        {
          "trait_type": "Personality",
          "value": "Boring"
        },
        {
          "display_type": "boost_number",
          "trait_type": "Aqua Power",
          "value": 10
        },
        {
          "display_type": "boost_percentage",
          "trait_type": "Stamina Increase",
          "value": 5
        },
        {
          "display_type": "number",
          "trait_type": "Generation",
          "value": 1
        }
      ],
      "description": `${name}`,
      "external_url": `https://7l0593rc6k.execute-api.us-east-1.amazonaws.com/details?url=${req.params.scholarId}`,
      "image": 'https://deknow-public.s3.amazonaws.com/D_Scholar_icon2.jpeg',
      "name": `DeKnow Scholar - ${name}`,
      "papers": [
          {
              "authors": "K Eykholt, I Evtimov, E Fernandes, B Li, A Rahmati, C Xiao, A Prakash, ...",
              "link": "https://scholar.google.com//citations?view_op=view_citation&hl=en&oe=ASCII&user=K8vJkTcAAAAJ&citation_for_view=K8vJkTcAAAAJ:KEHW5XCvxlQC",
              "publication_date": "2018",
              "publication_id": "11191316420978156845",
              "source": "Proceedings of the IEEE Conference on Computer Vision and Pattern …, 2018",
              "title": "Robust physical-world attacks on deep learning visual classification"
          },
          {
              "authors": "X Chen, C Liu, B Li, K Lu, D Song",
              "link": "https://scholar.google.com//citations?view_op=view_citation&hl=en&oe=ASCII&user=K8vJkTcAAAAJ&citation_for_view=K8vJkTcAAAAJ:MagRZZew-58C",
              "publication_date": "2017",
              "publication_id": "10754564719271014682",
              "source": "arXiv preprint arXiv:1712.05526, 2017",
              "title": "Targeted backdoor attacks on deep learning systems using data poisoning"
          },
          {
              "authors": "C Xiao, B Li, JY Zhu, W He, M Liu, D Song",
              "link": "https://scholar.google.com//citations?view_op=view_citation&hl=en&oe=ASCII&user=K8vJkTcAAAAJ&citation_for_view=K8vJkTcAAAAJ:n35PH7pn8T4C",
              "publication_date": "2018",
              "publication_id": "12845583525649303247",
              "source": "arXiv preprint arXiv:1801.02610, 2018",
              "title": "Generating adversarial examples with adversarial networks"
          },
          {
              "authors": "I Evtimov, K Eykholt, E Fernandes, T Kohno, B Li, A Prakash, A Rahmati, ...",
              "link": "https://scholar.google.com//citations?view_op=view_citation&hl=en&oe=ASCII&user=K8vJkTcAAAAJ&citation_for_view=K8vJkTcAAAAJ:VcGLcUShYXsC",
              "publication_date": "2017",
              "publication_id": "1012625801062934896",
              "source": "arXiv preprint arXiv:1707.08945 2 (3), 4, 2017",
              "title": "Robust physical-world attacks on machine learning models"
          },
          {
              "authors": "M Jagielski, A Oprea, B Biggio, C Liu, C Nita-Rotaru, B Li",
              "link": "https://scholar.google.com//citations?view_op=view_citation&hl=en&oe=ASCII&user=K8vJkTcAAAAJ&citation_for_view=K8vJkTcAAAAJ:lLDkS9sB7dAC",
              "publication_date": "2018",
              "publication_id": "8427189551292568466",
              "source": "2018 IEEE Symposium on Security and Privacy (SP), 19-35, 2018",
              "title": "Manipulating machine learning: Poisoning attacks and countermeasures for regression learning"
          }
      ]
    });
  })
});

app.get('/', function(req, res) {
  // Add your code here
  console.log('get call at root');
  res.json({success: 'get call succeed!', url: req.url});
});

app.get('//*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

/****************************
* Example post method *
****************************/

app.post('/', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.post('//*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
* Example put method *
****************************/

app.put('/', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('//*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('//*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(6000, function() {
    console.log("App started on port 6000")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
