# Plan mieszkania

Udostępniona wersja planu, pomiarów i zmian w projekcie.

Strona główna otwiera `plan.html#zmiany`. Widok biura jest dostępny przez `biuro.html`.

## Zapis

Publikowany stan oznaczeń znajduje się w plikach JSON. Edycje odbiorców zapisują się wyłącznie w localStorage ich przeglądarki. Zapisz JSON / Wczytaj JSON służą do przekazywania zmian. Nie ma wspólnego serwera zapisu ani synchronizacji między urządzeniami.

## Publikacja

GitHub Pages: gałąź `main`, katalog główny. Push aktualizuje stronę. Repo zawiera wyłącznie pliki publikowanej strony, bez lokalnej historii zapisów i dokumentów źródłowych.

Lokalny podgląd: `npx --yes http-server . -p 4193`.

## Linki, aktualizacje i PDF

Każdy punkt zmian ma stały identyfikator `change-<pomieszczenie>-<temat>`. Przycisk „Kopiuj link” kopiuje adres konkretnego punktu; gdy schowek jest niedostępny, pokazuje zaznaczony adres do ręcznego skopiowania. Zachowuj istniejące identyfikatory przy następnych aktualizacjach dokumentu.

Etykiety „Nowy punkt” i „Zaktualizowano” oraz filtr odnoszą się do aktualizacji dokumentu z 20.10.2026 względem poprzedniej publikacji. Oznaczono 14 z 42 punktów na podstawie zmian tekstów i ilustracji. Przy kolejnym imporcie zaktualizuj datę, `data-update` i etykiety; nie oznaczaj zmian samego interfejsu jako zmian projektu mieszkania.

„Drukuj / zapisz PDF” przygotowuje pełne zdjęcia i otwiera systemowy wydruk. Zakres obejmuje całe mieszkanie lub wybrane pomieszczenie, niezależnie od filtra ostatnich zmian. W oknie drukowania wybierz zapis do PDF. Style wydruku usuwają nawigację i przyciski, zachowując numerację i ilustracje.
