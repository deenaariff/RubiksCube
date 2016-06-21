<snippet>

# RUBIK's CUBE
## Installation
`git clone https://github.com/deenaarifff/RubiksCube`

Ensure mongo is installed and run daemon

`mongod`

Navigate to ./Server directory

Ensure Pymongo is installed
`pip install pymongo`

Run start script
`python start.py`
## Usage
A browser window should open. If not navigate to localhost:3000/.
`open -a "Google Chrome" localhost:3000`
The rubik's cube can be rotated with the arrow keys. Click on a square to select
it and enable a row or column movement. Create a user to Record Results
## Process
Stack: MEAN Stack + socket.io decided upon because of Full Javascript
functionality and ability to create a session for each user. Socket.io allowed
for asychronous  calls.

Front-End: AngularJs used with JQuery for cube rotation. Cube is a JSON document,
with 6 keys and a 3x3 array corresponding to them. The document is updated on
each update on the client side.

Backend: Node.js to host Socket.io and communicate with DB

Database: MongoDB for easy storage of JSON documents

Security: Not Implemented, Insufficient Time

DB Scaling: Not Implemented, Insufficient Time


</snippet>
