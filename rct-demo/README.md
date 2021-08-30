# RCT-demo
bardzo wstępne wyobrażenie o docelowej aplikacji

# Wprowadzenie
W folderze [rct-intro](https://github.com/xsalonx/cern-rct-demo/tree/master/rct-demo/rct-intro) znajduje się opis przygotowania lokalnego środowiska do uruchomienia aplikacji. Zakłada utworzenie bazy danych ([Postgres](https://www.postgresql.org)), z którą będzie komunikować się aplikacja.

# Przegląd możliwości aplikacji
1. specyfikacja parametrów połączenia do bazy banych (logowanie)
2. użytkownik _zalogowany_ (istniejące połączenie z bazą danych):
    - nawigacja po głównych widokach (tabelach bazy danych)
    - wyświetlanie pobranych z bazy danych w formie listy podzielonej na strony, z możliwością nawigacji po nich
    - filtrowanie danych 
    - otwieranie nowych widoków szczegółowych, zapamiętywanie ich jako osobne karty
        - możliwość zamknięcia lub skopiowania adresu URL karty
