import psycopg2

import sys
from recordsGenerators import *
from execScripts import exec_scripts

def clear_rct_db(host, user, password, dbname):
    print('clearing rct_db')
    connection = connect_rct_db(host, user, password, dbname)
    cur = connection.cursor()

    cur.execute('DELETE FROM periods;')  # cascade deleting each row from each table;
    connection.commit()
    cur.execute('SELECT tablename from pg_tables;')
    tablesNames = cur.fetchall()
    tablesNames = [e[0] for e in tablesNames]
    tablesNames = [t for t in tablesNames if t[:3] != 'pg_' and t[:4] != 'sql_']

    for tn in tablesNames:
        seqName = tn + "_id_seq"
        cur.execute(f'ALTER SEQUENCE \"{seqName}\" RESTART WITH 1;')

    connection.commit()
    cur.close()
    connection.close()


def insert(tableName, genF, cur):
    print('inserting to: ' + tableName)

    recs = genF()
    rs = [
        '(' + r[0] + ', ' + ", ".join(f"\'{str(el)}\'" for el in r[1:]) + ')' for r in recs
    ]

    # print(rs)

    for r in rs:
        try:
            cur.execute(f'INSERT INTO {tableName} VALUES {r};')
        except psycopg2.IntegrityError as e:
            print(e)
        except psycopg2.InternalError as e:
            print(e)


def gen_rct_db_data(host, user, password, dbname):
    connection = connect_rct_db(host, user, password, dbname)
    cur = connection.cursor()
    insert('periods', lambda: gen_periods_records(200), cur)
    insert('b_fields', lambda: gen_b_field(host, user, password, dbname), cur)
    insert('runs', lambda: gen_runs(host, user, password, dbname, repeat=False), cur)
    insert('mc', lambda: gen_monte_carlo(host, user, password, dbname), cur)
    insert('flags', lambda: gen_flags(host, user, password, dbname), cur)

    print('done')
    connection.commit()
    cur.close()
    connection.close()


if __name__ == '__main__':
    host = 'localhost'
    user = 'rct-user'
    password = 'rct-passwd'
    dbname = 'rct-db'

    if len(sys.argv) > 1:
        user = sys.argv[1]
        password = sys.argv[2]
        dbname = sys.argv[3]


    scriptsPathPrefix = sys.path[0] + "/postgresql_scripts/"
    scriptsNames = [
        'periods.sql',
        'runs.sql',
        'b-fields.sql',
        'mc.sql',
        'flags.sql'
    ]
    exec_scripts(host, user, password, dbname, scriptsPathPrefix, scriptsNames)
    gen_rct_db_data(host, user, password, dbname)
