<?php

/*
 * Config
 */

include_once(__DIR__ . '/config/config.php');
include_once(__DIR__ . '/src/Book.php');

/*
 * End point
 * View all books
 */
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    
    if (isset($_GET['id'])) {
        $book = new Book();
        $book->loadFromDB($_GET['id']);
        $books[$book->getId()] = $book;
        
        echo json_encode($books);
        
    } else {
        $res = Book::getBooksIds();
        $books = [];

        foreach ($res as $key => $value) {
            $book = new Book();
            $book->loadFromDB($res[$key]->getId());
            $books[$book->getId()] = $book;
        }
        
        echo json_encode($books);
    }
}


/*
 * End point
 * Add book
 */
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (!(strlen(trim($_POST['name'])) == 0)) {

        $name = ($_POST['name']);
        
    } else {

        $name = "Nie podano nazwy książki";
    }

    $author = ($_POST['author']);
    $desc = ($_POST['book_desc']);

    $book = new Book();
    $book->create($name, $author, $desc);
}

/*
 * End point
 * Remove book
 */
if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {

    /** @ToDo: Sprawdzić, dlaczego nie działa pobieranie zmiennych z użyciem "php://input". */
    // parse_str(file_get_contents("php://input"), $del_vars);
    // $id = $del_vars['id'];

    $id = $_GET['id'];

    $book = new Book();
    $book->loadFromDB($id);
    $book->deleteFromDB();
}


/*
 * End point
 * Edit book
 */
if ($_SERVER['REQUEST_METHOD'] == 'PUT') {

    parse_str(file_get_contents("php://input"), $put_vars);
    $id = $put_vars['id'];

    $book = new Book();
    $book->loadFromDB($id);

    if (!(strlen(trim($put_vars['name'])) == 0)) {

        $name = $put_vars['name'];
        
    } else {

        $name = $book->getName();
    }

    if (!(strlen(trim($put_vars['author'])) == 0)) {

        $author = $put_vars['author'];
        
    } else {

        $author = $book->getAuthor();
    }

    if (!(strlen(trim($put_vars['book_desc'])) == 0)) {

        $desc = $put_vars['book_desc'];
        
    } else {

        $desc = $book->getBook_desc();
    }

    $book->update($name, $author, $desc);
}
?>

