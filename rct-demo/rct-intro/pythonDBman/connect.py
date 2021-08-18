import psycopg2 as pypg


def connect_cern_db():
    host = 'localhost'
    user = 'xsalon'
    password = 'passwordpg'
    dbname = 'cern_db'

    return pypg.connect(host=host, user=user, password=password, dbname=dbname)


