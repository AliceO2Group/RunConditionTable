-- To reademe można usunąć

Aby stworzyć bazę testową:
1. jako postgres wykonać skrypty:
   1. **create-user.sql**
   2. **create-database.sql**
   
    Utworzona zostanie baza **"rct-db"** oraz użytkowanik **"rct-user"** z hasłem **"rct-passwd"**.
    Można stworzyć bazę i użytkownika używając własnych nazw i hasła.
<br><br>
2. wykonać skrypt ***main.py*** w ***/rct-demo/rct-intro/pythonDBman/*** <br>
    1. Jeśli w kroku pierwszym utworzono bazę i użytkowanika używając własnych nazw i hasła, należy je podać jako argumenty skryptu **_main.py_** w kolejności \<nazwa użytkowanika\>, \<hasło\>, \<nazwa bazy danych\>.
       <br><br>*uwaga: do komunikacji z bazą z poziomu pyton-a potrzebna jest biblioteka [psycopg2](https://www.psycopg.org/docs/install.html)*
