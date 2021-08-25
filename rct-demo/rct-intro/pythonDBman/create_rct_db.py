import psycopg2 as pypg


def connect_postgres():
    host = 'localhost'
    user = 'rct-user'
    password = 'rct-passwd'
    dbname = 'rct-db'

    return pypg.connect(host=host, user=user, password=password, dbname=dbname)


def get_script(path):
    scriptcode = ""
    with open(path) as f:
        scriptcode = f.read()
    return scriptcode


def main():
    connection = connect_postgres()
    cur = connection.cursor()

    scriptsPathPrefix = "./postgressql_scripts/"
    scriptsNames = [
        'delete-tables.sql',
        # 'create-user.sql',
        # 'alter-database.sql',
        'periods.sql',
        'runs.sql',
        'b-fields.sql',
        'mc.sql',
        'flags.sql'
    ]

    for sn in scriptsNames:
        path = scriptsPathPrefix + sn
        scriptCode = get_script(path)
        print(f"{sn}:\n{scriptCode}\n\n")
        cur.execute(scriptCode)
        connection.commit()
    cur.close()
    connection.close()

if __name__ == '__main__':
    main()



