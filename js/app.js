$(document).ready(function () {
       
       console.log('Welcome :)');
       
       $.ajax({
           url: "api/books.php",
           type: 'GET',
           dataType: 'JSON',
           
           success: function (data, textStatus, jqXHR) {
               
               var booksTable = $('table.books tbody');
               
               for (var index in data ) {
                   
                   // tworzymy <tr><td><td><tr>
                   var rowNameAuthor = $('<tr><td>' 
                            + data[index]['name'] + '</td><td>' 
                            + data[index]['author'] + '</td></tr>');
                   
                   // tworzymy <tr class="description"><td colspan="2"></td></tr>
                   var rowDescription = $('<tr class="description"><td colspan="2">' 
                           + data[index]['book_desc'] + '</td></tr>');
                   
                   booksTable.append(rowNameAuthor);
                   booksTable.append(rowDescription);

               }
            
           },
           error: function (jqXHR, textStatus, errorThrown) {
            
           },
           complete: function (jqXHR, textStatus) {
            
           }
       });
       
});