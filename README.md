# Plan mieszkania

Udostępniona wersja planu, pomiarów i zmian w projekcie.

Strona główna otwiera `plan.html#zmiany`. Widok biura jest dostępny przez `biuro.html`.

## Zapis

Publikowany stan oznaczeń znajduje się w plikach JSON. Edycje odbiorców zapisują się wyłącznie w localStorage ich przeglądarki. Zapisz JSON / Wczytaj JSON służą do przekazywania zmian. Nie ma wspólnego serwera zapisu ani synchronizacji między urządzeniami.

## Publikacja

GitHub Pages: gałąź `main`, katalog główny. Push aktualizuje stronę. Repo zawiera wyłącznie pliki publikowanej strony, bez lokalnej historii zapisów i dokumentów źródłowych.

Lokalny podgląd: `npx --yes http-server . -p 4193`.
