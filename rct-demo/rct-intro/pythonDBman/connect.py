import psycopg2 as pypg


def connect_cern_db():
    host = 'localhost'
    user = 'rct-user'
    password = 'rct-passwd'
    dbname = 'rct-db'

    return pypg.connect(host=host, user=user, password=password, dbname=dbname)
