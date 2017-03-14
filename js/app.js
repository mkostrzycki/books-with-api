$(document).ready(function () {

    // div z listą książek
    var booksListContainer = $('.books-list');

    // Za pierwszym razem doda nam wszystkie znalezione w DB książki.
    updateBooksList();


    /*
     * Ładowanie z DB opisu
     * po kliknięciu w tytuł książki, czyli div o klasie "name".
     */

    booksListContainer.on('click', 'div.name', function (event) {

        var bookID = $(this).parent().data('id');
        var divDesc = $(this).next().next();

        $.ajax({
            url: "api/books.php?id=" + bookID,
            type: 'GET',
            dataType: 'json',

            success: function (data, textStatus, jqXHR) {

                var description = data[bookID]['book_desc'];

                // Wrzucam opis do diva
                divDesc.text(description);
                // Rozwijamy/zwijamy div
                divDesc.slideToggle();

            }

            /* @ToDo: Dodać zachowanie w przypadku błędu. */
        });
    });


    /*
     * Dodawanie książki
     * po kliknięciu w button Add w formularzu.
     */

    var addBookSubmitBtn = $('#add_book_btn');

    addBookSubmitBtn.click(function (event) {

        event.preventDefault();

        // zczytujemy dane z inputów
        var form = $('#add_book');
        var values = form.serialize();

        $.ajax({
            url: "api/books.php",
            data: values,
            type: 'POST',

            success: function (data, textStatus, jqXHR) {

                /* @ToDo: Wyczyścić zawartość inputów. */

                // Doda nam te wiersze, które są w bazie a nie ma w DOMie.
                updateBooksList();
            }

            /* @ToDo: Dodać zachowanie w przypadku błędu. */
        });

    });


    /*
     * Usuwanie książki
     * po kliknięciu w link o klasie "remove".
     */

    booksListContainer.on('click', 'a.remove', function (event) {

        event.stopPropagation();
        event.preventDefault();

        var bookID = $(this).parent().parent().data('id');

        $.ajax({
            url: 'api/books.php?id=' + bookID,
            type: 'DELETE',

            success: function (result) {
                // usuwamy wiersz
                var rowToDelete = $('.row[data-id=' + bookID + ']');
                // Dla lepszego efektu, najpierw "znikamy" element :)
                rowToDelete.fadeTo('slow', 0, function () {
                    rowToDelete.remove();
                });
            }

            /* @ToDo: Dodać zachowanie w przypadku błędu. */
        });

    });

});

///////////////////////////////////////////////////////////////
/** 
 * Collect data from DB. Create and append rows
 * only if they don't already exist.
 * 
 * @returns {undefined}
 */
function updateBooksList() {

    $.ajax({
        url: "api/books.php",
        type: 'GET',
        dataType: 'json',

        success: function (data, textStatus, jqXHR) {

            var booksListContainer = $('.books-list');

            // lista wierszy z id
            var existingRows = booksListContainer.find('.row[data-id]');
            // tablica z numerami id
            var existingRowsIDs = [];
            existingRows.each(function (index, element) {
                existingRowsIDs.push($(this).data('id'));
            });

            for (var index in data) {

                //////////////////////////////////////
                // struktura
                //
                // div row
                //   - div col name // najpierw 4 potem 12
                //   - div col author // najpierw 4 potem 12
                //   - div col description // najpierw 8 potem 12
                //

                var id = data[index]['id'];

                // Sprawdzam , czy wiersz z ID pobranym z bazy już istnieje.
                // Jeżeli nie, to go dodaję.
                if ($.inArray(parseInt(id), existingRowsIDs) === -1) { // inArray zwraca index lub -1

                    // tworzymy div z klasą row i ustawiamy data-id = id z DB
                    var row = $('<div class="row" data-id="' + id + '">');

                    // tworzymy div col name
                    var divColName = $('<div>').addClass('name').addClass('col-sm-4');
                    divColName.text(data[index]['name']);

                    // tworzymy div col author
                    var divColAuthor = $('<div>').addClass('author').addClass('col-sm-4');
                    divColAuthor.text(data[index]['author']);

                    // dodajemy link do usuwania książki
                    var removeBookLink = $('<a>').addClass('remove').html('remove book');
                    divColAuthor.append(removeBookLink);

                    // tworzymy div col description
                    var divColDescription = $('<div>').addClass('description').addClass('col-lg-8');

                    row.append(divColName);
                    row.append(divColAuthor);
                    row.append(divColDescription);

                    booksListContainer.append(row);
                }

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {

        },
        complete: function (jqXHR, textStatus) {

        }
    });

}
