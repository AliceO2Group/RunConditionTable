import psycopg2

from recordsGenerator import *


def clear_cern_db():
    print('clearing cern_db')
    connection = connect_cern_db()
    cur = connection.cursor()

    cur.execute('DELETE FROM periods;')  # cascade deleting each row from each table;
    connection.commit()
    cur.execute('SELECT tablename from pg_tables;')
    tablesnames = cur.fetchall()
    tablesnames = [e[0] for e in tablesnames]
    tablesnames = [t for t in tablesnames if t[:3] != 'pg_' and t[:4] != 'sql_']

    for tn in tablesnames:
        seqname = tn + "_id_seq"
        cur.execute(f'ALTER SEQUENCE \"{seqname}\" RESTART WITH 1;')
        connection.commit()
    cur.close()
    connection.close()


def insert(tableName, genF, connection=None):
    print('inserting to: ' + tableName)
    disc = False
    if connection is not None:
        disc = True
    if connection is None:
        connection = connect_cern_db()

    recs = genF()
    rs = [
        '(' + r[0] + ', ' + ", ".join(f"\'{str(el)}\'" for el in r[1:]) + ')' for r in recs
    ]

    # print(rs)

    cur = connection.cursor()
    for r in rs:
        try:
            cur.execute(f'INSERT INTO {tableName} VALUES {r};')
            connection.commit()
        except psycopg2.IntegrityError as e:
            print(e)
        except psycopg2.InternalError as e:
            print(e)
    cur.close()

    if disc:
        connection.close()


def gen_cern_db_data():
    insert('periods', lambda: gen_periods_records(200))
    insert('\"B field\"', gen_b_field)
    insert('runs', lambda: gen_runs(repeat=False))
    insert('\"monte carlo\"', gen_monte_carlo)
    insert('flags', gen_flags)


if __name__ == '__main__':
    clear_cern_db()
    gen_cern_db_data()
