import psycopg2 as pypg


from connect import connect_rct_db

def get_script(path):
    scriptcode = ""
    with open(path) as f:
        scriptcode = f.read()
    return scriptcode


def exec_scripts(host, user, password, dbname, scriptsPathPrefix, scriptsNames):
    connection = connect_rct_db(host, user, password, dbname)
    cur = connection.cursor()

    for sn in scriptsNames:
        path = scriptsPathPrefix + sn
        scriptCode = get_script(path)
        if scriptCode == "":
            print("error: could not read script from: " + path)
            exit(1)
        print(f"{sn}:\n{scriptCode}\n\n")
        cur.execute(scriptCode)

    connection.commit()
    cur.close()
    connection.close()


