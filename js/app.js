$(document).ready(function () {

    console.log('Welcome :)');

    $.ajax({
        url: "api/books.php",
        type: 'GET',
        dataType: 'JSON',

        success: function (data, textStatus, jqXHR) {

            var booksListContainer = $('.books-list');

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

                // tworzymy div z klasą row i ustawiamy data-id = id z DB
                var id = data[index]['id'];
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

        },
        error: function (jqXHR, textStatus, errorThrown) {

        },
        complete: function (jqXHR, textStatus) {

        }
    });

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
            dataType: 'JSON',

            success: function (data, textStatus, jqXHR) {

                var description = data[bookID]['book_desc'];

                // Wrzucam opis do diva
                divDesc.text(description);
                // Rozwijamy/zwijamy div
                divDesc.slideToggle();

            }
        });
    });

});