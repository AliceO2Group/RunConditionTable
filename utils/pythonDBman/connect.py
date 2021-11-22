import psycopg2 as pypg


def connect_rct_db(host, user, password, dbname):
    return pypg.connect(host=host, user=user, password=password, dbname=dbname)
