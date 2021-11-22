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
    tables_names = cur.fetchall()
    tables_names = [e[0] for e in tables_names]
    tables_names = [t for t in tables_names if t[:3] != 'pg_' and t[:4] != 'sql_']

    for tn in tables_names:
        seq_name = tn + "_id_seq"
        cur.execute(f'ALTER SEQUENCE \"{seq_name}\" RESTART WITH 1;')

    connection.commit()
    cur.close()
    connection.close()


def insert(table_name, genF, host, user, password, dbname):
    connection = connect_rct_db(host, user, password, dbname)
    cur = connection.cursor()
    print('inserting to: ' + table_name)

    recs = genF()
    rs = [
        '(' + r[0] + ', ' + ", ".join(f"\'{str(el)}\'" for el in r[1:]) + ')' for r in recs
    ]

    # print(rs)

    for r in rs:
        try:
            cur.execute(f'INSERT INTO {table_name} VALUES {r};')
        except psycopg2.IntegrityError as e:
            print(e)
        except psycopg2.InternalError as e:
            print(e)

    connection.commit()
    cur.close()
    connection.close()


def gen_rct_db_data(host, user, password, dbname):
    insert('periods', lambda: gen_periods_records(200), host, user, password, dbname)
    insert('b_fields', lambda: gen_b_field(host, user, password, dbname), host, user, password, dbname)
    insert('runs', lambda: gen_runs(host, user, password, dbname, repeat=False), host, user, password, dbname)
    insert('mc', lambda: gen_monte_carlo(host, user, password, dbname), host, user, password, dbname)
    insert('flags', lambda: gen_flags(host, user, password, dbname), host, user, password, dbname)

    print('done')


if __name__ == '__main__':
    host = 'localhost'
    user = 'rct-user'
    password = 'rct-passwd'
    dbname = 'rct-db'

    if len(sys.argv) > 1:
        user = sys.argv[1]
        password = sys.argv[2]
        dbname = sys.argv[3]

    scripts_path_prefix = sys.path[0] + "/postgresql_scripts/"
    scriptsNames = [
        # 'delete-tables.sql',
        'periods.sql',
        'runs.sql',
        'b-fields.sql',
        'mc.sql',
        'flags.sql'
    ]
    exec_scripts(host, user, password, dbname, scripts_path_prefix, scriptsNames)
    gen_rct_db_data(host, user, password, dbname)
