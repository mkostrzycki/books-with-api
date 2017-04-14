$(document).ready(function () {

    // div z listą książek
    var booksListContainer = $('.books-list');

    // Przy pierwszym wywołaniu stworzy nam wiersze dla wszystkich książek z DB.
    updateBooksList();


    /*
     * Ładowanie opisu z DB
     * Po kliknięciu w tytuł książki, czyli div o klasie "name", pobieramy z bazy
     * opis książki, wstawiamy do diva o klasie "description" i rozwijamy
     * tegoż diva.
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
     * Dodawanie książki I
     * Po kliknięciu w ikonkę +, rozwijamy formularz dodawania nowej książki. 
     */
    
    var showAddBookFormIcon = $('#show_add_book');
    
    showAddBookFormIcon.click(function () {
        $('#add_book .form-wrapper').slideToggle();
    });


    /*
     * Dodawanie książki II
     * Po kliknięciu w button Add w formularzu, wysyłamy request POST z danymi
     * nowej książki i wywołujemy funkcję, która stworzy nam wiersz z danymi 
     * nowej książki na liście książek.
     */

    var addBookSubmitBtn = $('#add_book_btn');

    addBookSubmitBtn.click(function (event) {

        event.preventDefault();

        // zczytujemy dane z inputów
        var addBookForm = $('#add_book');
        var values = addBookForm.serialize();

        $.ajax({
            url: "api/books.php",
            data: values,
            type: 'POST',

            success: function (data, textStatus, jqXHR) {

                //Czyścimy zawartość inputów.
                addBookForm.trigger('reset');

                // Doda nam te wiersze, które są w bazie a nie ma w DOMie.
                updateBooksList();
            }

            /* @ToDo: Dodać zachowanie w przypadku błędu. */
        });

    });


    /*
     * Dodawanie książki III
     * Po kliknięciu w button Cancel w formularzu, czyścimy i chowamy formularz.
     */

    var cancelAddBookBtn = $('#cancel_add_book_btn');

    cancelAddBookBtn.click(function (event) {

        event.stopPropagation();
        event.preventDefault();

        var addBookForm = $('#add_book');

        //wyczyścić formularz
        addBookForm.trigger('reset');

        addBookForm.find('.form-wrapper').slideUp();
    });
    

    /*
     * Usuwanie książki
     * Po kliknięciu w link o klasie "remove", wysyłamy request DELETE na
     * odpowiedni end point i usuwamy wiersz z usuniętą książką z listy
     * książek.
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


    /*
     * Edycja książki I
     * Po kliknięciu w link o klasie "modify",
     * pojawia się formularz z danymi danej książki (dane pobrane z DB).
     */

    booksListContainer.on('click', 'a.modify', function (event) {

        event.stopPropagation();
        event.preventDefault();

        var modifyBookForm = $('#modify_book');

        var bookID = $(this).parent().parent().data('id');

        // pobieramy dane z DB
        $.ajax({
            url: 'api/books.php?id=' + bookID,
            type: 'GET',
            dataType: 'json',

            success: function (data, textStatus, jqXHR) {

                //wyczyścić formularz
                modifyBookForm.trigger('reset');

                /* @ToDo: Pobrać dane z DB i wpisać w inputy. */
                modifyBookForm.find('#modify_id').attr('value', bookID);
                modifyBookForm.find('#modify_name').attr('value', data[bookID]['name']);
                modifyBookForm.find('#modify_author').attr('value', data[bookID]['author']);
                modifyBookForm.find('#modify_book_desc').text(data[bookID]['book_desc']);
            }

            /* @ToDo: Dodać zachowanie w przypadku błędu. */
        });

        modifyBookForm.slideDown();

    });


    /*
     * Edycja książki II
     * Po kliknięciu w button Modify w formularzu, dane z inputów przesyłamy do
     * api i aktualizujemy wyświetlanie zmodyfikowanej książki.
     */

    var modifyBookSubmitBtn = $('#modify_book_btn');

    modifyBookSubmitBtn.click(function (event) {

        event.preventDefault();

        // zczytujemy dane z inputów
        var modifyBookForm = $('#modify_book');
        var values = modifyBookForm.serialize();

        $.ajax({
            url: "api/books.php",
            data: values,
            type: 'PUT',

            success: function (data, textStatus, jqXHR) {

                var bookID = modifyBookForm.find('#modify_id').attr('value');

                updateBookRow(bookID);

                modifyBookForm.slideUp();

            }

            /* @ToDo: Dodać zachowanie w przypadku błędu. */
        });

    });


    /*
     * Edycja książki III
     * Po kliknięciu w button Cancel w formularzu, czyścimy i chowamy formularz.
     */

    var cancelBookModifyBtn = $('#cancel_modify_book_btn');

    cancelBookModifyBtn.click(function (event) {

        event.stopPropagation();
        event.preventDefault();

        var modifyBookForm = $('#modify_book');

        //wyczyścić formularz
        modifyBookForm.trigger('reset');

        modifyBookForm.slideUp();
    });

});

///////////////////////////////////////////////////////////////
/**
 * Funkcja pobiera z bazy danych tytuł i autora książki o wskazanym ID,
 * chowa wiersz z książką, wstawia nowe dane i z powrotem odkrywa wiersz
 * z książką.
 * 
 * @param {integer} bookID ID książki, której wyświetlane dane chcemy zaktualizować
 * @returns {undefined}
 */
function updateBookRow(bookID) {

    $.ajax({
        url: "api/books.php?id=" + bookID,
        type: 'GET',
        dataType: 'json',

        success: function (data, textStatus, jqXHR) {

            var booksListContainer = $('.books-list');
            var rowToUpdate = $('.row[data-id=' + bookID + ']');
            
            rowToUpdate.hide();
            
            // Chowamy opis książki. Jeżeli byłby rozwinięty, to modyfikacje
            // byłyby widoczne dopiero po kliknięciu w tytuł.
            rowToUpdate.find('.description').hide();

            rowToUpdate.find('.name').text(data[bookID]['name']);

            // dodajemy link do modyfikacji książki
            var modifyBookLink = $('<a>').addClass('modify').html('modify');
            // dodajemy link do usuwania książki
            var removeBookLink = $('<a>').addClass('remove').html('remove');

            rowToUpdate.find('.author').text(data[bookID]['author']).append(modifyBookLink).append(removeBookLink);
            
            rowToUpdate.fadeIn('slow');
        }
        
        /* @ToDo: Dodać zachowanie w przypadku błędu. */

    });
}

/** 
 * Funkcja pobiera wszystkie książki z bazy danych. Następnie po kolei sprawdza,
 * czy książka o danym ID jest już wyświetlana na liście książek i jeżeli nie
 * to tworzy dla niej wiersz.
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
                //   - div col name
                //   - div col author
                //   - div col description
                //

                var id = data[index]['id'];

                // Sprawdzam , czy wiersz z ID pobranym z bazy już istnieje.
                // Jeżeli nie, to go dodaję.
                if ($.inArray(parseInt(id), existingRowsIDs) === -1) { // inArray zwraca index lub -1

                    // tworzymy div z klasą row i ustawiamy data-id = id z DB
                    var row = $('<div class="row" data-id="' + id + '">');

                    // tworzymy div col name
                    var divColName = $('<div>').addClass('name').addClass('col-sm-6');
                    divColName.text(data[index]['name']);

                    // tworzymy div col author
                    var divColAuthor = $('<div>').addClass('author').addClass('col-sm-6');
                    divColAuthor.text(data[index]['author']);

                    // dodajemy link do modyfikacji książki
                    var modifyBookLink = $('<a>').addClass('modify').html('modify');
                    divColAuthor.append(modifyBookLink);

                    // dodajemy link do usuwania książki
                    var removeBookLink = $('<a>').addClass('remove').html('remove');
                    divColAuthor.append(removeBookLink);

                    // tworzymy div col description
                    /** @ToDo: Poprawić wyświetlanie dla tabletów */
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
