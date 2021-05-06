import sqlite3


def connect():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def resetDB():

    with connect() as db:
        
        db.execute("DROP TABLE IF EXISTS Users")
        db.execute("""
                   CREATE TABLE Users (
                     userID INTEGER PRIMARY KEY,
                     username TEXT,
                     password TEXT,
                     highest_score INTEGER DEFAULT 0
                   )
        """)

if __name__ == "__main__":
    print("Resetting database")
    resetDB()

        
