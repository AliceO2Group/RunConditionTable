import psycopg2 as pypg

from connect import connect_rct_db


def get_script(path):
    with open(path) as f:
        script_code = f.read()
    return script_code


def exec_scripts(host, user, password, dbname, scripts_path_prefix, scripts_names):
    connection = connect_rct_db(host, user, password, dbname)
    cur = connection.cursor()

    for sn in scripts_names:
        path = scripts_path_prefix + sn
        script_code = get_script(path)
        if script_code == "":
            print("error: could not read script from: " + path)
            exit(1)
        print(f"{sn}:\n{script_code}\n\n")
        cur.execute(script_code)

    connection.commit()
    cur.close()
    connection.close()
