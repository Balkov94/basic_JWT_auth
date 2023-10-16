# basic_JWT_auth
very basic  BE Authorization - node.js / JWT / bcrypt  / no database and FE

how to run:
1.NPM install
2.View package.json for script/start commands


bcrypt - hash user password imput - not to store it in raw format
dotenv - store secrets for JWT token hash and decode
JWT - use secret from .env and stored object to create tokens for access specific urls and request

Authorization by headers:
ex. 
GET http://localhost:3000/posts
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.dXNlcjE.8DtTM07SJnzZV2xz4r0215yqvqnVw6ulZFu7QoZLdGY
                      <JWT token>

Can review request by POSTMAN or REST Client extension (request.rest file)
