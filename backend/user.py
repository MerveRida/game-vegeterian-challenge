import db
import json
from bottle import response, request

class User:

    def __init__(self, username, password, highest_score):
        '''Constructor'''
        self.username =  username
        self.password = password
        self.highest_score = highest_score

    def updatePassword(username, password):
        '''Writes back instance values into database'''
        with db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE Users SET password = ? WHERE username = ?",
                               (password, username))
            conn.commit()
           
    @staticmethod
    def updateScore(username, data):
        score = data['score']
        '''Writes back instance values into database'''
        with db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE Users SET highest_score = ? WHERE username = ? AND highest_score>?",
                               (score, username, score))
            conn.commit()
        return 
        
    def updateFromJSON(self, user_data):
        '''Unpack JSON representation to update instance variables and then
           calls update to write back into database'''
        
        self.username = user_data['username']
        self.password = user_data['password']
        self.highest_score = user_data['highest_score']
        
    def delete(self):
        '''Deletes instance from database, any object representations of the
           instance are now invalid and shouldn't be used including this one'''
        with db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM Users WHERE username = ?", (self.username, ))

    
    def jsonable(self):
        '''Returns a dict appropriate for creating JSON representation
           of the instance'''
        
        return {'username': self.username, 'password': self.password, 'highest_score': self.highest_score}

    @staticmethod
    def createFromJSON(user_data):
        '''Creates new instance object using dict created from JSON representation
           using create'''
        
        # Unpack the instance data from JSON
        # Should validate information here and throw exception
        # if something is not right.
        username = user_data['username']
        password = user_data['password']
        
        with db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM USers U WHERE U.username = ?",
                               (username, ))
        row = cursor.fetchone()

        if row is not None:
            raise Exception(f'User already exists')

        with db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO Users (username, password, highest_score) VALUES (?, ?, ?)",
                               (username, password, 0))
            conn.commit()
        return User.findByID(cursor.lastrowid)
    
    @staticmethod
    def findByID(id):
        '''If row with specified id exists, creates and returns corresponding ORM
           instance. Otherwise Exception raised.'''
        
        with db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM Users U WHERE U.userID = ?", (id,))
            row = cursor.fetchone()

        if row is None:
            raise Exception(f'No such User with username: {username}')
        else:
            return User(row['username'], row['password'], row['highest_score'])

    
    @staticmethod
    def find(username):
        '''If row with specified id exists, creates and returns corresponding ORM
           instance. Otherwise Exception raised.'''
        
        with db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM Users U WHERE U.username = ?", (username,))
            row = cursor.fetchone()

        if row is None:
            raise Exception(f'No such User with username: {username}')
        else:
            return User(row['username'], row['password'], row['highest_score'])

        
    @staticmethod
    def getScoreboard():
        '''If row with specified id exists, creates and returns corresponding ORM
           instance. Otherwise Exception raised.'''
        
        with db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT U.username, U.highest_score FROM Users U ORDER BY U.highest_score")

        return [{'username': row['username'], 'highest_score': row['highest_score']} for row in cursor]
        
        
        
    @staticmethod
    def setupBottleRoutes(app):

        @app.get('/scoreboard')
        def getUsersIndex():
            ALLOWED_METHODS = 'PUT, GET, POST, DELETE, OPTIONS'
            ALLOWED_HEADERS = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
            response.headers['Access-Control-Allow-Origin'] = 'https://onceuponacode.app'
            response.headers['Access-Control-Allow-Methods'] = ALLOWED_METHODS
            response.headers['Access-Control-Allow-Headers'] = ALLOWED_HEADERS

            return json.dumps(User.getScoreboard())
            
        # probably not needed
        @app.get('/users/<username>')
        def getUser(username):
            try:
                user = User.find(username)
            except Exception:
                response.status = 404
                return f"USer {username} not found"
            ALLOWED_METHODS = 'PUT, GET, POST, DELETE, OPTIONS'
            ALLOWED_HEADERS = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
            response.headers['Access-Control-Allow-Origin'] = 'https://onceuponacode.app'
            response.headers['Access-Control-Allow-Methods'] = ALLOWED_METHODS
            response.headers['Access-Control-Allow-Headers'] = ALLOWED_HEADERS
            return user.jsonable()
        
        # Create a new user
        @app.post('/users')
        def postMCOption():
            try:
                user = User.createFromJSON(request.json)
            except Exception:
                response.status = 400
                return f"USer {username} already exists"
            ALLOWED_METHODS = 'PUT, GET, POST, DELETE, OPTIONS'
            ALLOWED_HEADERS = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
            response.headers['Access-Control-Allow-Origin'] = 'https://onceuponacode.app'
            response.headers['Access-Control-Allow-Methods'] = ALLOWED_METHODS
            response.headers['Access-Control-Allow-Headers'] = ALLOWED_HEADERS
            response.content_type = 'text/plain'
            return user.jsonable()

        @app.hook('after_request')
        def enableCORSAfterRequestHook():
            print ('After request hook.')
            response.headers['Access-Control-Allow-Origin'] = '*'
            

        @app.route('/score', method=['GET', 'OPTIONS'])
        def getRoot():
            print ('Route handler')
            return {'foo' : 'bar'}

        # update score of given user
        @app.put('/score/<username>')
        def updateScore(username):
            '''Implements instance updating'''
    
            try:
                user = User.find(username)
            except Exception:
                response.status = 404
                return f"User {username} to update not found"

            ALLOWED_METHODS = 'PUT, GET, POST, DELETE, OPTIONS'
            ALLOWED_HEADERS = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
            response.headers['Access-Control-Allow-Origin'] = 'https://onceuponacode.app'
            response.headers['Access-Control-Allow-Methods'] = ALLOWED_METHODS
            response.headers['Access-Control-Allow-Headers'] = ALLOWED_HEADERS
            response.content_type = 'text/plain'
            User.updateScore(username, request.json)
            user = User.find(username)
            return user.jsonable()
        
        # update password of given user
        #@app.put('/password/<username>')
        #def updatePassword(username):
            '''Implements instance updating'''
    
         #   try:
          #      user = User.find(username)
           # except Exception:
            #    response.status = 404
             #   return f"User {username} to update not found"

       #     ALLOWED_METHODS = 'PUT, GET, POST, DELETE, OPTIONS'
        #    ALLOWED_HEADERS = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
         #   response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        #    response.headers['Access-Control-Allow-Methods'] = ALLOWED_METHODS
         #   response.headers['Access-Control-Allow-Headers'] = ALLOWED_HEADERS
        #    user.updatePassword(username, request.json['password'])
         #   response.content_type = 'text/plain'
          #  return user.jsonable()


        # delete given user => probably not needed
        @app.delete('/user/<username>')
        def deleteMCOption(username):
            '''Implements instance deletion'''
    
            try:
                user = User.find(username)
            except Exception:
                response.status = 404
                return f"User {username} to delete not found"

            user.delete()
    
            ALLOWED_METHODS = 'PUT, GET, POST, DELETE, OPTIONS'
            ALLOWED_HEADERS = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
            response.headers['Access-Control-Allow-Origin'] = 'https://onceuponacode.app'
            response.headers['Access-Control-Allow-Methods'] = ALLOWED_METHODS
            response.headers['Access-Control-Allow-Headers'] = ALLOWED_HEADERS
            response.content_type = 'text/plain'
            return json.dumps(True)

