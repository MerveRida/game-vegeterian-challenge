from bottle import Bottle, run, response, request
import json
import db
from user import User

app = Bottle()

User.setupBottleRoutes(app)

# Start the backend
run(app, host='localhost', port=8080, debug=True)
