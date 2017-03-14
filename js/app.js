$(document).ready(function () {

    console.log('Welcome :)');

    // Za pierwszym razem doda nam wszystkie znalezione w DB książki.
    updateBooksList();

    // kliknięcie w tytuł
    var booksListContainer = $('.books-list');

    // Zaczepiam event na czyś co na pewno istnieje, czyli na div, który jest
    // wrapperem listy książek. Deleguję event do divów o klasie name. Teraz
    // mogę sledzić kliknięcia na divach z tytułem książki, chociaż są generowane
    // dynamicznie :)
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
        });
    });

    // wysłanie formularza
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
                console.log('Hurra!');
                // wyczyść inputy

                // Doda nam te wiersze, które są w bazie a nie ma w DOMie.
                updateBooksList();
            }
        });

    });

});

///////////////////////////////////////////////////////////////
/* 
 * Collect data from DB. Create and append rows
 * only if they don't already exist.
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

//                console.log(data[index]);

                //////////////////////////////////////
                // struktura
                //
                // div row
                //   - div col name // najpierw 4 potem 12
                //   - div col author // najpierw 4 potem 12
                //   - div col description // najpierw 8 potem 12
                //

                var id = data[index]['id'];
                
                // Sprawdzam , czy wiersz z ID pobranym z bazy już istnieje
                // jeżeli nie, to go dodaję.
                if ($.inArray(parseInt(id), existingRowsIDs) === -1) { // inArray zwraca index lub -1

                    // tworzymy div z klasą row i ustawiamy data-id = id z DB
                    var row = $('<div class="row" data-id="' + id + '">');

                    // tworzymy div col name
                    var divColName = $('<div>').addClass('name').addClass('col-sm-4');
                    divColName.text(data[index]['name']);

                    // tworzymy div col author
                    var divColAuthor = $('<div>').addClass('author').addClass('col-sm-4');
                    divColAuthor.text(data[index]['author']);

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