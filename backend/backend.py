from bottle import Bottle, run, response, request
import json
import db
from user import User

app = Bottle()

User.setupBottleRoutes(app)

# Start the backend
run(app, host='10.142.0.2', port=80, debug=True)
